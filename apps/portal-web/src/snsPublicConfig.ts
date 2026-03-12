export type SnsPublicPersistenceMode = "browser-local-storage" | "memory";

export type SnsPublicServiceMode = "simulated-route" | "http";

export type SnsPublicConfig = {
  timelineEndpoint: string;
  postsEndpoint: string;
  writeSurfaceEnabled: boolean;
  persistenceMode: SnsPublicPersistenceMode;
  serviceMode: SnsPublicServiceMode;
  serviceBaseUrl: string;
};

function readPublicEnvValue(key: string): string | undefined {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return env?.[key];
}

function parseBooleanFlag(value: string | undefined, defaultValue: boolean): boolean {
  if (typeof value !== "string") {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();

  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  return defaultValue;
}

function parsePersistenceMode(value: string | undefined): SnsPublicPersistenceMode {
  return value === "memory" ? "memory" : "browser-local-storage";
}

function parseServiceMode(value: string | undefined): SnsPublicServiceMode {
  return value === "http" ? "http" : "simulated-route";
}

export function getSnsPublicConfig(): SnsPublicConfig {
  return {
    timelineEndpoint: readPublicEnvValue("VITE_PUBLIC_SNS_TIMELINE_ENDPOINT") ?? "/api/sns/timeline",
    postsEndpoint: readPublicEnvValue("VITE_PUBLIC_SNS_POSTS_ENDPOINT") ?? "/api/sns/posts",
    writeSurfaceEnabled: parseBooleanFlag(readPublicEnvValue("VITE_PUBLIC_SNS_WRITE_SURFACE_ENABLED"), true),
    persistenceMode: parsePersistenceMode(readPublicEnvValue("VITE_PUBLIC_SNS_PERSISTENCE_MODE")),
    serviceMode: parseServiceMode(readPublicEnvValue("VITE_PUBLIC_SNS_SERVICE_MODE")),
    serviceBaseUrl: readPublicEnvValue("VITE_PUBLIC_SNS_SERVICE_BASE_URL") ?? ""
  };
}