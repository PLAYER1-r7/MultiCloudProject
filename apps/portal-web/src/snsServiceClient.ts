import {
  type SnsErrorResponse,
  handleSnsRouteRequest,
  createInMemorySnsRouteHandlerDependencies,
  type SnsPostPayload,
  type SnsRouteHandlerDependencies,
  type SnsRouteHandlerPolicy,
  type SnsRouteRequestContext
} from "./snsServiceRouteHandler.ts";
import {
  canUseBrowserSnsPersistence,
  clearStoredSnsTimeline,
  createBrowserSnsRouteHandlerDependencies
} from "./snsMessageStore.ts";
import type { SnsPublicConfig, SnsPublicPersistenceMode, SnsPublicServiceMode } from "./snsPublicConfig.ts";

export type SnsServiceClientPersistenceMode = SnsPublicPersistenceMode | "service-managed";

export type SnsServiceClientRuntimeStatus = {
  transportMode: SnsPublicServiceMode;
  persistenceMode: SnsServiceClientPersistenceMode;
  fallbackActive: boolean;
  completionEligible: boolean;
  nextSliceReady: boolean;
  statusMessage: string;
  serviceBaseUrl: string;
};

export type SnsServiceClient = {
  listTimeline(context: SnsRouteRequestContext, policy: SnsRouteHandlerPolicy): Promise<Response>;
  createPost(payload: SnsPostPayload, context: SnsRouteRequestContext, policy: SnsRouteHandlerPolicy): Promise<Response>;
};

export type SnsServiceClientBundle = {
  client: SnsServiceClient;
  runtimeStatus: SnsServiceClientRuntimeStatus;
  resetRuntimeState(): void;
};

type CreateSnsServiceClientBundleOptions = {
  publicConfig: SnsPublicConfig;
  browserRuntimeAvailable: boolean;
  storage?: Storage;
};

function buildJsonHeaders(context: SnsRouteRequestContext): Record<string, string> {
  return {
    "content-type": "application/json",
    "x-sns-demo-actor-role": context.actorRole,
    ...(context.actorId ? { "x-sns-demo-actor-id": context.actorId } : {}),
    ...(context.simulateWriteFailure ? { "x-sns-demo-simulate-write-failure": "true" } : {})
  };
}

function createRequestUrl(serviceBaseUrl: string, endpoint: string): string {
  return new URL(endpoint, serviceBaseUrl.endsWith("/") ? serviceBaseUrl : `${serviceBaseUrl}/`).toString();
}

function createSimulatedRouteClient(dependencies: SnsRouteHandlerDependencies): SnsServiceClient {
  return {
    async listTimeline(context: SnsRouteRequestContext, policy: SnsRouteHandlerPolicy): Promise<Response> {
      return handleSnsRouteRequest(
        new Request(policy.timelineEndpoint, { method: "GET" }),
        context,
        dependencies,
        policy
      );
    },

    async createPost(
      payload: SnsPostPayload,
      context: SnsRouteRequestContext,
      policy: SnsRouteHandlerPolicy
    ): Promise<Response> {
      return handleSnsRouteRequest(
        new Request(policy.postsEndpoint, {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify(payload)
        }),
        context,
        dependencies,
        policy
      );
    }
  };
}

function createHttpServiceClient(serviceBaseUrl: string): SnsServiceClient {
  return {
    async listTimeline(context: SnsRouteRequestContext, policy: SnsRouteHandlerPolicy): Promise<Response> {
      return fetch(createRequestUrl(serviceBaseUrl, policy.timelineEndpoint), {
        method: "GET",
        headers: buildJsonHeaders(context)
      });
    },

    async createPost(
      payload: SnsPostPayload,
      context: SnsRouteRequestContext,
      policy: SnsRouteHandlerPolicy
    ): Promise<Response> {
      return fetch(createRequestUrl(serviceBaseUrl, policy.postsEndpoint), {
        method: "POST",
        headers: buildJsonHeaders(context),
        body: JSON.stringify(payload)
      });
    }
  };
}

function createBrowserLocalBundle(options: {
  publicConfig: SnsPublicConfig;
  storage: Storage;
}): SnsServiceClientBundle {
  const { publicConfig, storage } = options;

  return {
    client: createSimulatedRouteClient(
      createBrowserSnsRouteHandlerDependencies({
        storage
      })
    ),
    runtimeStatus: {
      transportMode: "simulated-route",
      persistenceMode: "browser-local-storage",
      fallbackActive: false,
      completionEligible: publicConfig.writeSurfaceEnabled,
      nextSliceReady: false,
      statusMessage: publicConfig.writeSurfaceEnabled
        ? "Service contract path is using browser-backed persistence for the completed first slice. Real service persistence is not active yet."
        : "SNS write surface is disabled by public config.",
      serviceBaseUrl: "local-simulated-route"
    },
    resetRuntimeState(): void {
      clearStoredSnsTimeline(storage);
    }
  };
}

function createMemoryBundle(options: {
  publicConfig: SnsPublicConfig;
  statusMessage: string;
}): SnsServiceClientBundle {
  const { statusMessage } = options;

  return {
    client: createSimulatedRouteClient(createInMemorySnsRouteHandlerDependencies()),
    runtimeStatus: {
      transportMode: "simulated-route",
      persistenceMode: "memory",
      fallbackActive: true,
      completionEligible: false,
      nextSliceReady: false,
      statusMessage,
      serviceBaseUrl: "local-memory-fallback"
    },
    resetRuntimeState(): void {
      // Memory fallback keeps state per runtime instance, so recreating the bundle is enough.
    }
  };
}

function createHttpBundle(options: {
  publicConfig: SnsPublicConfig;
  serviceBaseUrl: string;
}): SnsServiceClientBundle {
  const { publicConfig, serviceBaseUrl } = options;

  return {
    client: createHttpServiceClient(serviceBaseUrl),
    runtimeStatus: {
      transportMode: "http",
      persistenceMode: "service-managed",
      fallbackActive: false,
      completionEligible: publicConfig.writeSurfaceEnabled,
      nextSliceReady: publicConfig.writeSurfaceEnabled,
      statusMessage: publicConfig.writeSurfaceEnabled
        ? `HTTP service mode is configured against ${serviceBaseUrl}. Treat this as the next-slice candidate only after service-owned readback is verified.`
        : "SNS write surface is disabled by public config.",
      serviceBaseUrl
    },
    resetRuntimeState(): void {
      // Service-owned persistence is reset out-of-band from the browser bundle.
    }
  };
}

function normalizeServiceBaseUrl(serviceBaseUrl: string): string {
  return serviceBaseUrl.trim().replace(/\/$/, "");
}

export function createSnsServiceClientBundle(
  options: CreateSnsServiceClientBundleOptions
): SnsServiceClientBundle {
  const { publicConfig, browserRuntimeAvailable, storage } = options;

  if (publicConfig.serviceMode === "http") {
    const normalizedBaseUrl = normalizeServiceBaseUrl(publicConfig.serviceBaseUrl);

    if (normalizedBaseUrl.length > 0) {
      return createHttpBundle({
        publicConfig,
        serviceBaseUrl: normalizedBaseUrl
      });
    }

    return createMemoryBundle({
      publicConfig,
      statusMessage:
        "HTTP service mode was requested, but no public service base URL was configured. The surface fell back to memory and is not next-slice complete."
    });
  }

  if (browserRuntimeAvailable && storage && publicConfig.persistenceMode === "browser-local-storage" && canUseBrowserSnsPersistence(storage)) {
    return createBrowserLocalBundle({
      publicConfig,
      storage
    });
  }

  const memoryStatusMessage = browserRuntimeAvailable && publicConfig.persistenceMode === "browser-local-storage"
    ? "Browser persistence was unavailable, so the surface fell back to memory. Do not treat this as the completed path."
    : "Surface is using memory persistence for the current environment. Do not treat this as the completed browser path.";

  return createMemoryBundle({
    publicConfig,
    statusMessage: memoryStatusMessage
  });
}

export async function readSnsErrorResponse(response: Response): Promise<Partial<SnsErrorResponse>> {
  try {
    return (await response.json()) as Partial<SnsErrorResponse>;
  } catch {
    return {};
  }
}