import { spawn } from "node:child_process";

const previewPort = Number(process.env.SNS_AUTH_PREVIEW_PORT ?? "4174");
const previewHost = process.env.SNS_AUTH_PREVIEW_HOST ?? "127.0.0.1";
const previewUrl = `http://${previewHost}:${previewPort}/`;

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForPreview(url, timeoutMs) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: "manual" });

      if (response.ok || [301, 302, 304].includes(response.status)) {
        return;
      }
    } catch {
      // The preview server is still starting.
    }

    await delay(500);
  }

  throw new Error(`Preview server did not become reachable within ${timeoutMs}ms: ${url}`);
}

const previewProcess = spawn(
  "npm",
  ["run", "preview", "--", "--host", previewHost, "--port", String(previewPort)],
  {
    stdio: "inherit",
    env: process.env
  }
);

const cleanup = () => {
  if (!previewProcess.killed) {
    previewProcess.kill("SIGTERM");
  }
};

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
  await waitForPreview(previewUrl, 30000);

  const targets = [
    {
      name: "local-sns-auth-flow",
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