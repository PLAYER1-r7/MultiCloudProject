import {
  createInMemorySnsRouteHandlerDependencies,
  type SnsRouteHandlerDependencies,
  type SnsTimelineItem
} from "./snsServiceRouteHandler.ts";

export const SNS_TIMELINE_STORAGE_KEY = "portal-web:sns-timeline";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

type BrowserSnsStoreOptions = {
  storage: StorageLike;
  storageKey?: string;
};

type StoredTimelinePayload = {
  items: SnsTimelineItem[];
};

function normalizeCreatedAtValue(createdAt: string): number {
  const timestamp = Date.parse(createdAt);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function sortTimelineItems(items: SnsTimelineItem[]): SnsTimelineItem[] {
  return [...items].sort((left, right) => normalizeCreatedAtValue(right.createdAt) - normalizeCreatedAtValue(left.createdAt));
}

function readStoredTimeline(storage: StorageLike, storageKey: string): SnsTimelineItem[] {
  const rawValue = storage.getItem(storageKey);

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<StoredTimelinePayload>;

    if (!Array.isArray(parsed.items)) {
      return [];
    }

    return sortTimelineItems(
      parsed.items.filter(
        (item): item is SnsTimelineItem =>
          Boolean(item) &&
          typeof item.id === "string" &&
          typeof item.authorId === "string" &&
          typeof item.message === "string" &&
          typeof item.createdAt === "string"
      )
    );
  } catch {
    return [];
  }
}

function writeStoredTimeline(storage: StorageLike, storageKey: string, items: SnsTimelineItem[]): void {
  storage.setItem(
    storageKey,
    JSON.stringify({
      items: sortTimelineItems(items)
    } satisfies StoredTimelinePayload)
  );
}

export function canUseBrowserSnsPersistence(storage: StorageLike): boolean {
  try {
    const probeKey = `${SNS_TIMELINE_STORAGE_KEY}:probe`;
    storage.setItem(probeKey, "ok");
    storage.removeItem(probeKey);
    return true;
  } catch {
    return false;
  }
}

export function clearStoredSnsTimeline(storage: StorageLike, storageKey = SNS_TIMELINE_STORAGE_KEY): void {
  storage.removeItem(storageKey);
}

export function createBrowserSnsRouteHandlerDependencies(
  options: BrowserSnsStoreOptions
): SnsRouteHandlerDependencies {
  const { storage, storageKey = SNS_TIMELINE_STORAGE_KEY } = options;

  return {
    async listTimeline(): Promise<SnsTimelineItem[]> {
      return readStoredTimeline(storage, storageKey);
    },

    async createPost(payload): Promise<SnsTimelineItem> {
      const inMemoryDependencies = createInMemorySnsRouteHandlerDependencies({
        initialItems: readStoredTimeline(storage, storageKey)
      });
      const createdItem = await inMemoryDependencies.createPost(payload);
      const items = await inMemoryDependencies.listTimeline();
      writeStoredTimeline(storage, storageKey, items);
      return createdItem;
    }
  };
}