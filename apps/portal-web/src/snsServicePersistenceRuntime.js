import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { createInMemorySnsRouteHandlerDependencies } from "./snsServiceRouteHandlerRuntime.js";

function normalizeTimelineItems(items) {
  return [...items].sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
}

async function ensureParentDirectory(filePath) {
  await mkdir(dirname(filePath), { recursive: true });
}

async function readPersistedTimeline(filePath) {
  try {
    const serializedPayload = await readFile(filePath, "utf8");
    const payload = JSON.parse(serializedPayload);
    return normalizeTimelineItems(Array.isArray(payload.items) ? payload.items : []);
  } catch (error) {
    const errorCode = typeof error === "object" && error && "code" in error ? String(error.code) : "unknown";

    if (errorCode === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function writePersistedTimeline(filePath, items) {
  await ensureParentDirectory(filePath);
  await writeFile(
    filePath,
    JSON.stringify(
      {
        items: normalizeTimelineItems(items)
      },
      null,
      2
    ),
    "utf8"
  );
}

export function createFileBackedSnsRouteHandlerDependencies(options) {
  const { filePath } = options;
  let writeChain = Promise.resolve();

  return {
    async listTimeline() {
      await writeChain;
      return readPersistedTimeline(filePath);
    },

    async createPost(payload) {
      const operation = writeChain.then(async () => {
        const existingItems = await readPersistedTimeline(filePath);
        const inMemoryDependencies = createInMemorySnsRouteHandlerDependencies({
          initialItems: existingItems
        });
        const createdItem = await inMemoryDependencies.createPost(payload);
        const nextItems = await inMemoryDependencies.listTimeline();
        await writePersistedTimeline(filePath, nextItems);
        return createdItem;
      });

      writeChain = operation.then(
        () => undefined,
        () => undefined
      );

      return operation;
    }
  };
}