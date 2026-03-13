import {
  handleSnsRouteRequest,
} from "./snsServiceRouteHandlerRuntime.js";
import {
  createBaseServiceConfig,
  createCorsHeaders,
  normalizeActorRole
} from "./snsServiceConfigRuntime.js";
import { createDynamoBackedSnsRouteHandlerDependencies } from "./snsServiceDynamoPersistenceRuntime.js";
import { createFileBackedSnsRouteHandlerDependencies } from "./snsServicePersistenceRuntime.js";

function createServiceConfig() {
  return createBaseServiceConfig({
    storageFilePath: "/tmp/sns-service-timeline.json"
  });
}

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
function normalizeHeaders(headers) {
  return Object.fromEntries(Object.entries(headers ?? {}).map(([key, value]) => [key.toLowerCase(), String(value)]));
}

export async function handler(event) {
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