import { SNS_POSTS_ENDPOINT, SNS_TIMELINE_ENDPOINT } from "./snsServiceRouteHandlerRuntime.js";

export function readEnvValue(key) {
  const value = process.env[key];
  return typeof value === "string" ? value.trim() : undefined;
}

export function parseBooleanFlag(value, defaultValue) {
  if (!value) {
    return defaultValue;
  }

  const normalized = value.toLowerCase();

  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  return defaultValue;
}

export function normalizeActorRole(value) {
  return value === "member" || value === "operator" ? value : "guest";
}

export function createBaseServiceConfig(defaults = {}) {
  return {
    persistenceBackend: readEnvValue("SNS_SERVICE_PERSISTENCE_BACKEND") ?? defaults.persistenceBackend ?? "file",
    storageFilePath: readEnvValue("SNS_SERVICE_DATA_FILE") ?? defaults.storageFilePath ?? "/tmp/sns-service-timeline.json",
    dynamoTableName: readEnvValue("SNS_SERVICE_DYNAMODB_TABLE_NAME") ?? "",
    timelineEndpoint: readEnvValue("SNS_SERVICE_TIMELINE_ENDPOINT") ?? SNS_TIMELINE_ENDPOINT,
    postsEndpoint: readEnvValue("SNS_SERVICE_POSTS_ENDPOINT") ?? SNS_POSTS_ENDPOINT,
    allowGuestTimelineRead: parseBooleanFlag(readEnvValue("SNS_SERVICE_ALLOW_GUEST_TIMELINE_READ"), true),
    writesEnabled: parseBooleanFlag(readEnvValue("SNS_SERVICE_WRITES_ENABLED"), true),
    requireActorContext: parseBooleanFlag(readEnvValue("SNS_SERVICE_REQUIRE_ACTOR_CONTEXT"), true),
    allowOrigin: readEnvValue("SNS_SERVICE_ALLOW_ORIGIN") ?? "*"
  };
}

export function createCorsHeaders(config, options = {}) {
  const allowMethods = options.allowMethods ?? "GET,POST,OPTIONS,HEAD";

  return {
    "access-control-allow-origin": config.allowOrigin,
    "access-control-allow-methods": allowMethods,
    "access-control-allow-headers": "content-type,x-sns-demo-actor-role,x-sns-demo-actor-id,x-sns-demo-simulate-write-failure",
    vary: "origin"
  };
}
