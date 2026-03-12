import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import {
  createInMemorySnsRouteHandlerDependencies,
  type SnsPostPayload,
  type SnsRouteHandlerDependencies,
  type SnsTimelineItem
} from "./snsServiceRouteHandler.ts";

type PersistedTimelinePayload = {
  items?: SnsTimelineItem[];
};

type FileBackedSnsPersistenceOptions = {
  filePath: string;
};

function normalizeTimelineItems(items: SnsTimelineItem[]): SnsTimelineItem[] {
  return [...items].sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
}

async function ensureParentDirectory(filePath: string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
}

async function readPersistedTimeline(filePath: string): Promise<SnsTimelineItem[]> {
  try {
    const serializedPayload = await readFile(filePath, "utf8");
    const payload = JSON.parse(serializedPayload) as PersistedTimelinePayload;
    return normalizeTimelineItems(Array.isArray(payload.items) ? payload.items : []);
  } catch (error) {
    const errorCode = typeof error === "object" && error && "code" in error ? String(error.code) : "unknown";

    if (errorCode === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function writePersistedTimeline(filePath: string, items: SnsTimelineItem[]): Promise<void> {
  await ensureParentDirectory(filePath);
  await writeFile(
    filePath,
    JSON.stringify(
      {
        items: normalizeTimelineItems(items)
      } satisfies PersistedTimelinePayload,
      null,
      2
    ),
    "utf8"
  );
}

export function createFileBackedSnsRouteHandlerDependencies(
  options: FileBackedSnsPersistenceOptions
): SnsRouteHandlerDependencies {
  const { filePath } = options;
  let writeChain = Promise.resolve();

  return {
    async listTimeline(): Promise<SnsTimelineItem[]> {
      await writeChain;
      return readPersistedTimeline(filePath);
    },

    async createPost(payload: SnsPostPayload): Promise<SnsTimelineItem> {
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