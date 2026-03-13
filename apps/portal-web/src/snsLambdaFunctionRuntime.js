import {
  handleSnsRouteRequest,
  SNS_POSTS_ENDPOINT,
  SNS_TIMELINE_ENDPOINT
} from "./snsServiceRouteHandlerRuntime.js";
import { createDynamoBackedSnsRouteHandlerDependencies } from "./snsServiceDynamoPersistenceRuntime.js";
import { createFileBackedSnsRouteHandlerDependencies } from "./snsServicePersistenceRuntime.js";

function readEnvValue(key) {
  const value = process.env[key];
  return typeof value === "string" ? value.trim() : undefined;
}

function parseBooleanFlag(value, defaultValue) {
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

function createServiceConfig() {
  return {
    persistenceBackend: readEnvValue("SNS_SERVICE_PERSISTENCE_BACKEND") ?? "file",
    storageFilePath: readEnvValue("SNS_SERVICE_DATA_FILE") ?? "/tmp/sns-service-timeline.json",
    dynamoTableName: readEnvValue("SNS_SERVICE_DYNAMODB_TABLE_NAME") ?? "",
    timelineEndpoint: readEnvValue("SNS_SERVICE_TIMELINE_ENDPOINT") ?? SNS_TIMELINE_ENDPOINT,
    postsEndpoint: readEnvValue("SNS_SERVICE_POSTS_ENDPOINT") ?? SNS_POSTS_ENDPOINT,
    allowGuestTimelineRead: parseBooleanFlag(readEnvValue("SNS_SERVICE_ALLOW_GUEST_TIMELINE_READ"), true),
    writesEnabled: parseBooleanFlag(readEnvValue("SNS_SERVICE_WRITES_ENABLED"), true),
    requireActorContext: parseBooleanFlag(readEnvValue("SNS_SERVICE_REQUIRE_ACTOR_CONTEXT"), true),
    allowOrigin: readEnvValue("SNS_SERVICE_ALLOW_ORIGIN") ?? "*"
  };
}

function normalizeActorRole(value) {
  return value === "member" || value === "operator" ? value : "guest";
}

function createRouteRequestContext(headers) {
  const actorRole = normalizeActorRole(headers["x-sns-demo-actor-role"]);
  const actorIdHeader = headers["x-sns-demo-actor-id"];
  const simulateFailureHeader = headers["x-sns-demo-simulate-write-failure"];

  return {
    actorRole,
    actorId: typeof actorIdHeader === "string" && actorIdHeader.trim().length > 0 ? actorIdHeader.trim() : undefined,
    simulateWriteFailure: simulateFailureHeader === "true"
  };
}

function createCorsHeaders(config) {
  return {
    "access-control-allow-origin": config.allowOrigin,
    "access-control-allow-methods": "GET,POST,OPTIONS,HEAD",
    "access-control-allow-headers": "content-type,x-sns-demo-actor-role,x-sns-demo-actor-id,x-sns-demo-simulate-write-failure",
    vary: "origin"
  };
}

function normalizeHeaders(headers) {
  return Object.fromEntries(Object.entries(headers ?? {}).map(([key, value]) => [key.toLowerCase(), String(value)]));
}

export async function handler(event) {
  const serviceConfig = createServiceConfig();
  const dependencies =
    serviceConfig.persistenceBackend === "dynamodb"
      ? createDynamoBackedSnsRouteHandlerDependencies({
          tableName: serviceConfig.dynamoTableName
        })
      : createFileBackedSnsRouteHandlerDependencies({
          filePath: serviceConfig.storageFilePath
        });
  const policy = {
    timelineEndpoint: serviceConfig.timelineEndpoint,
    postsEndpoint: serviceConfig.postsEndpoint,
    allowGuestTimelineRead: serviceConfig.allowGuestTimelineRead,
    writesEnabled: serviceConfig.writesEnabled,
    requireActorContext: serviceConfig.requireActorContext
  };
  const headers = normalizeHeaders(event.headers);
  const method = event.requestContext?.http?.method ?? event.httpMethod ?? "GET";
  const path = event.rawPath ?? event.path ?? "/";
  const queryString = event.rawQueryString ? `?${event.rawQueryString}` : "";

  if (method === "OPTIONS") {
    return {
      statusCode: 204,
      headers: createCorsHeaders(serviceConfig),
      body: ""
    };
  }

  const request = new Request(`https://lambda.internal${path}${queryString}`, {
    method,
    headers,
    body:
      method === "GET" || method === "HEAD"
        ? undefined
        : event.body
          ? event.isBase64Encoded
            ? Buffer.from(event.body, "base64")
            : event.body
          : undefined,
    duplex: method === "GET" || method === "HEAD" ? undefined : "half"
  });

  const response = await handleSnsRouteRequest(
    request,
    createRouteRequestContext(headers),
    dependencies,
    policy
  );
  const responseHeaders = createCorsHeaders(serviceConfig);

  response.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  const responseBody = method === "HEAD" ? "" : Buffer.from(await response.arrayBuffer()).toString("utf8");

  return {
    statusCode: response.status,
    headers: responseHeaders,
    body: responseBody,
    isBase64Encoded: false
  };
}