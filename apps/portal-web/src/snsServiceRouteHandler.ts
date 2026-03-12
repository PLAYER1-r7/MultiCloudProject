export const SNS_TIMELINE_ENDPOINT = "/api/sns/timeline";
export const SNS_POSTS_ENDPOINT = "/api/sns/posts";
export const SNS_MAX_MESSAGE_LENGTH = 280;

export type SnsActorRole = "guest" | "member" | "operator";

export type SnsPostPayload = {
  authorId: string;
  message: string;
  replyToPostId?: string;
};

export type SnsTimelineItem = {
  id: string;
  authorId: string;
  message: string;
  createdAt: string;
  replyToPostId?: string;
};

export type SnsErrorResponse = {
  errorCode: string;
  message: string;
  retryable: boolean;
};

export type SnsRouteRequestContext = {
  actorRole: SnsActorRole;
  actorId?: string;
  simulateWriteFailure?: boolean;
};

export type SnsRouteHandlerPolicy = {
  timelineEndpoint: string;
  postsEndpoint: string;
  allowGuestTimelineRead: boolean;
  writesEnabled: boolean;
  requireActorContext: boolean;
};

export type SnsRouteHandlerDependencies = {
  listTimeline(): Promise<SnsTimelineItem[]>;
  createPost(payload: SnsPostPayload): Promise<SnsTimelineItem>;
};

type SnsStoredTimelineItem = SnsTimelineItem & { createdAtMs: number };

type InMemorySnsRouteHandlerOptions = {
  initialItems?: SnsTimelineItem[];
  now?: () => string;
  createId?: () => string;
};

const defaultSnsRouteHandlerPolicy: SnsRouteHandlerPolicy = {
  timelineEndpoint: SNS_TIMELINE_ENDPOINT,
  postsEndpoint: SNS_POSTS_ENDPOINT,
  allowGuestTimelineRead: true,
  writesEnabled: true,
  requireActorContext: true
};

function buildJsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json"
    }
  });
}

function buildErrorResponse(errorCode: string, message: string, retryable: boolean, status: number): Response {
  return buildJsonResponse(
    {
      errorCode,
      message,
      retryable
    } satisfies SnsErrorResponse,
    status
  );
}

function getPathname(url: string): string {
  return new URL(url, "http://localhost").pathname;
}

function normalizeStoredItem(item: SnsTimelineItem): SnsStoredTimelineItem {
  const createdAtMs = Date.parse(item.createdAt);

  return {
    ...item,
    createdAtMs: Number.isNaN(createdAtMs) ? 0 : createdAtMs
  };
}

function sortStoredItems(items: SnsStoredTimelineItem[]): SnsStoredTimelineItem[] {
  return [...items].sort((left, right) => right.createdAtMs - left.createdAtMs);
}

function toTimelineItem(item: SnsStoredTimelineItem): SnsTimelineItem {
  const { createdAtMs: _createdAtMs, ...timelineItem } = item;
  return timelineItem;
}

function isValidReplyToPostId(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validatePostPayload(payload: unknown): SnsPostPayload | SnsErrorResponse {
  if (!payload || typeof payload !== "object") {
    return {
      errorCode: "INVALID_POST_PAYLOAD",
      message: "SNS post payload must be a JSON object.",
      retryable: false
    };
  }

  const candidate = payload as Partial<SnsPostPayload>;
  const authorId = typeof candidate.authorId === "string" ? candidate.authorId.trim() : "";
  const message = typeof candidate.message === "string" ? candidate.message.trim() : "";

  if (!authorId) {
    return {
      errorCode: "INVALID_POST_PAYLOAD",
      message: "authorId is required for SNS post submission.",
      retryable: false
    };
  }

  if (!message) {
    return {
      errorCode: "INVALID_POST_PAYLOAD",
      message: "A draft body is required before the SNS demo can submit.",
      retryable: false
    };
  }

  if (message.length > SNS_MAX_MESSAGE_LENGTH) {
    return {
      errorCode: "INVALID_POST_PAYLOAD",
      message: `SNS post message must stay within ${SNS_MAX_MESSAGE_LENGTH} characters.`,
      retryable: false
    };
  }

  return {
    authorId,
    message,
    ...(isValidReplyToPostId(candidate.replyToPostId) ? { replyToPostId: candidate.replyToPostId.trim() } : {})
  };
}

async function parseRequestJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function createInMemorySnsRouteHandlerDependencies(
  options: InMemorySnsRouteHandlerOptions = {}
): SnsRouteHandlerDependencies {
  const now = options.now ?? (() => new Date().toISOString());
  const createId = options.createId ?? (() => `sns-post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  let items = sortStoredItems((options.initialItems ?? []).map(normalizeStoredItem));

  return {
    async listTimeline(): Promise<SnsTimelineItem[]> {
      return sortStoredItems(items).map(toTimelineItem);
    },

    async createPost(payload: SnsPostPayload): Promise<SnsTimelineItem> {
      const createdAt = now();
      const storedItem = normalizeStoredItem({
        id: createId(),
        authorId: payload.authorId,
        message: payload.message,
        createdAt,
        ...(payload.replyToPostId ? { replyToPostId: payload.replyToPostId } : {})
      });

      items = sortStoredItems([storedItem, ...items]);
      return toTimelineItem(storedItem);
    }
  };
}

export async function handleSnsRouteRequest(
  request: Request,
  context: SnsRouteRequestContext,
  dependencies: SnsRouteHandlerDependencies,
  policy: SnsRouteHandlerPolicy = defaultSnsRouteHandlerPolicy
): Promise<Response> {
  const pathname = getPathname(request.url);

  if (pathname === policy.timelineEndpoint) {
    if (request.method !== "GET") {
      return buildErrorResponse("SNS_METHOD_NOT_ALLOWED", "Timeline route accepts GET only.", false, 405);
    }

    if (context.actorRole === "guest" && !policy.allowGuestTimelineRead) {
      return buildErrorResponse("SNS_TIMELINE_FORBIDDEN", "Guest timeline read is disabled on the service boundary.", false, 403);
    }

    const items = await dependencies.listTimeline();
    return buildJsonResponse({ items }, 200);
  }

  if (pathname === policy.postsEndpoint) {
    if (request.method !== "POST") {
      return buildErrorResponse("SNS_METHOD_NOT_ALLOWED", "Post route accepts POST only.", false, 405);
    }

    if (!policy.writesEnabled) {
      return buildErrorResponse("SNS_WRITE_DISABLED", "SNS write surface is disabled on the service boundary.", false, 503);
    }

    if (context.actorRole === "guest") {
      return buildErrorResponse(
        "SNS_POST_FORBIDDEN",
        "Signed-out users remain blocked from posting to the SNS demo surface.",
        false,
        403
      );
    }

    if (policy.requireActorContext && !context.actorId?.trim()) {
      return buildErrorResponse(
        "SNS_AUTH_CONTEXT_MISSING",
        "Authenticated SNS writes require a provider-neutral actor context.",
        false,
        401
      );
    }

    const payload = validatePostPayload(await parseRequestJson(request));

    if ("errorCode" in payload) {
      return buildJsonResponse(payload, 400);
    }

    if (context.actorId && payload.authorId !== context.actorId) {
      return buildErrorResponse(
        "SNS_ACTOR_MISMATCH",
        "SNS post payload author did not match the authenticated actor context.",
        false,
        403
      );
    }

    if (context.simulateWriteFailure) {
      return buildErrorResponse(
        "SNS_POST_WRITE_FAILED",
        "Simulated write failure remained visible. No new readback entry was added.",
        true,
        500
      );
    }

    try {
      const item = await dependencies.createPost({
        ...payload,
        authorId: context.actorId ?? payload.authorId
      });
      return buildJsonResponse({ item }, 201);
    } catch {
      return buildErrorResponse(
        "SNS_POST_WRITE_FAILED",
        "SNS post write failed before readback could refresh.",
        true,
        500
      );
    }
  }

  return buildErrorResponse("SNS_ROUTE_NOT_FOUND", "SNS route was not found on the service boundary.", false, 404);
}