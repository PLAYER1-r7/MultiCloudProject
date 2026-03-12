import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { createServer } from "node:net";

const previewHost = process.env.SNS_HTTP_AUTH_PREVIEW_HOST ?? "127.0.0.1";
const serviceHost = process.env.SNS_HTTP_AUTH_SERVICE_HOST ?? "127.0.0.1";

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function getAvailablePort(host) {
  return new Promise((resolve, reject) => {
    const server = createServer();

    server.on("error", reject);
    server.listen(0, host, () => {
      const address = server.address();

      if (!address || typeof address === "string") {
        server.close(() => {
          reject(new Error(`Unable to determine available port for host: ${host}`));
        });
        return;
      }

      const { port } = address;
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(port);
      });
    });
  });
}

async function waitForUrl(url, timeoutMs) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: "manual" });

      if (response.ok || [200, 204, 301, 302, 304, 400, 403].includes(response.status)) {
        return;
      }
    } catch {
      // Service or preview is still starting.
    }

    await delay(500);
  }

  throw new Error(`Endpoint did not become reachable within ${timeoutMs}ms: ${url}`);
}

async function writeRuntimeConfigFile(filePath, runtimeConfig) {
  const serializedConfig = JSON.stringify(runtimeConfig, null, 2);
  await writeFile(
    filePath,
    `globalThis.__PORTAL_RUNTIME_CONFIG__ = Object.assign({}, globalThis.__PORTAL_RUNTIME_CONFIG__ ?? {}, ${serializedConfig});\n`,
    "utf8"
  );
}

const tempDirectory = await mkdtemp(join(tmpdir(), "portal-web-sns-http-auth-"));
const storageFilePath = join(tempDirectory, "sns-service-timeline.json");
const previewPort = Number(process.env.SNS_HTTP_AUTH_PREVIEW_PORT ?? (await getAvailablePort(previewHost)));
const servicePort = Number(process.env.SNS_HTTP_AUTH_SERVICE_PORT ?? (await getAvailablePort(serviceHost)));
const previewUrl = `http://${previewHost}:${previewPort}/`;
const serviceBaseUrl = `http://${serviceHost}:${servicePort}`;

await writeRuntimeConfigFile(join(process.cwd(), "dist", "runtime-config.js"), {
  VITE_PUBLIC_SNS_SERVICE_MODE: "http",
  VITE_PUBLIC_SNS_SERVICE_BASE_URL: serviceBaseUrl,
  VITE_PUBLIC_SNS_PERSISTENCE_MODE: "memory"
});

const serviceProcess = spawn("npm", ["run", "sns:http-service"], {
  stdio: "inherit",
  env: {
    ...process.env,
    SNS_SERVICE_HOST: serviceHost,
    SNS_SERVICE_PORT: String(servicePort),
    SNS_SERVICE_DATA_FILE: storageFilePath,
    SNS_SERVICE_ALLOW_ORIGIN: "*"
  }
});

const previewProcess = spawn(
  "npm",
  ["run", "preview", "--", "--host", previewHost, "--port", String(previewPort)],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      VITE_PUBLIC_SNS_SERVICE_MODE: "http",
      VITE_PUBLIC_SNS_SERVICE_BASE_URL: serviceBaseUrl,
      VITE_PUBLIC_SNS_PERSISTENCE_MODE: "memory"
    }
  }
);

function cleanup() {
  if (!previewProcess.killed) {
    previewProcess.kill("SIGTERM");
  }

  if (!serviceProcess.killed) {
    serviceProcess.kill("SIGTERM");
  }
}

process.on("exit", cleanup);
process.on("SIGINT", () => {
  cleanup();
  process.exit(130);
});
process.on("SIGTERM", () => {
  cleanup();
  process.exit(143);
});

try {
  await waitForUrl(`${serviceBaseUrl}/api/sns/timeline`, 30000);
  await waitForUrl(previewUrl, 30000);

  const targets = [
    {
      name: "local-sns-http-auth-flow",
      url: previewUrl,
      expectedEntryHref: "/status#sns-request-response-surface",
      expectedSurfaceSelector: '[data-sns-surface="request-response"]'
    }
  ];

  const verificationProcess = spawn("node", ["./scripts/verify-sns-auth-post-readback.mjs"], {
    stdio: "inherit",
    env: {
      ...process.env,
      SNS_AUTH_FLOW_TARGETS_JSON: JSON.stringify(targets)
    }
  });

  const exitCode = await new Promise((resolve, reject) => {
    verificationProcess.on("error", reject);
    verificationProcess.on("exit", (code) => resolve(code ?? 1));
  });

  if (exitCode !== 0) {
    process.exit(exitCode);
  }
} finally {
  cleanup();
}