import { createServer } from "node:http";

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
    host: readEnvValue("SNS_SERVICE_HOST") ?? "127.0.0.1",
    port: Number(readEnvValue("SNS_SERVICE_PORT") ?? "4180"),
    persistenceBackend: readEnvValue("SNS_SERVICE_PERSISTENCE_BACKEND") ?? "file",
    storageFilePath: readEnvValue("SNS_SERVICE_DATA_FILE") ?? ".tmp/sns-service-timeline.json",
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

function createRouteRequestContext(request) {
  const actorRole = normalizeActorRole(
    Array.isArray(request.headers["x-sns-demo-actor-role"])
      ? request.headers["x-sns-demo-actor-role"][0]
      : request.headers["x-sns-demo-actor-role"]
  );
  const actorIdHeader = Array.isArray(request.headers["x-sns-demo-actor-id"])
    ? request.headers["x-sns-demo-actor-id"][0]
    : request.headers["x-sns-demo-actor-id"];
  const simulateFailureHeader = Array.isArray(request.headers["x-sns-demo-simulate-write-failure"])
    ? request.headers["x-sns-demo-simulate-write-failure"][0]
    : request.headers["x-sns-demo-simulate-write-failure"];

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

async function readRequestBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

async function writeFetchResponseToNodeResponse(response, nodeResponse, config) {
  const responseBody = nodeResponse.req?.method === "HEAD" ? Buffer.alloc(0) : Buffer.from(await response.arrayBuffer());
  const responseHeaders = createCorsHeaders(config);

  response.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  responseHeaders["content-length"] = String(responseBody.byteLength);
  nodeResponse.writeHead(response.status, responseHeaders);
  nodeResponse.end(responseBody);
}

const serviceConfig = createServiceConfig();
const policy = {
  timelineEndpoint: serviceConfig.timelineEndpoint,
  postsEndpoint: serviceConfig.postsEndpoint,
  allowGuestTimelineRead: serviceConfig.allowGuestTimelineRead,
  writesEnabled: serviceConfig.writesEnabled,
  requireActorContext: serviceConfig.requireActorContext
};
const dependencies =
  serviceConfig.persistenceBackend === "dynamodb"
    ? createDynamoBackedSnsRouteHandlerDependencies({
        tableName: serviceConfig.dynamoTableName
      })
    : createFileBackedSnsRouteHandlerDependencies({
        filePath: serviceConfig.storageFilePath
      });

const server = createServer(async (request, response) => {
  try {
    if (!request.url) {
      response.writeHead(400, createCorsHeaders(serviceConfig));
      response.end(JSON.stringify({ errorCode: "SNS_INVALID_REQUEST", message: "Request URL was missing.", retryable: false }));
      return;
    }

    if (request.method === "OPTIONS") {
      response.writeHead(204, createCorsHeaders(serviceConfig));
      response.end();
      return;
    }

    const requestBody = request.method === "GET" || request.method === "HEAD" ? undefined : await readRequestBody(request);
    const fetchRequest = new Request(`http://${serviceConfig.host}:${serviceConfig.port}${request.url}`, {
      method: request.method,
      headers: request.headers,
      body: requestBody && requestBody.byteLength > 0 ? requestBody : undefined,
      duplex: requestBody && requestBody.byteLength > 0 ? "half" : undefined
    });

    const fetchResponse = await handleSnsRouteRequest(
      fetchRequest,
      createRouteRequestContext(request),
      dependencies,
      policy
    );

    await writeFetchResponseToNodeResponse(fetchResponse, response, serviceConfig);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown SNS service failure.";
    const body = Buffer.from(
      JSON.stringify({
        errorCode: "SNS_SERVICE_RUNTIME_FAILED",
        message,
        retryable: true
      })
    );

    response.writeHead(500, {
      ...createCorsHeaders(serviceConfig),
      "content-type": "application/json",
      "content-length": String(body.byteLength)
    });
    response.end(body);
  }
});

server.listen(serviceConfig.port, serviceConfig.host, () => {
  console.log(
    JSON.stringify({
      message: "sns-http-service-ready",
      host: serviceConfig.host,
      port: serviceConfig.port,
      storageFilePath: serviceConfig.storageFilePath,
      timelineEndpoint: serviceConfig.timelineEndpoint,
      postsEndpoint: serviceConfig.postsEndpoint
    })
  );
});

function shutdown(exitCode) {
  server.close(() => {
    process.exit(exitCode);
  });
}

process.on("SIGINT", () => shutdown(130));
process.on("SIGTERM", () => shutdown(143));