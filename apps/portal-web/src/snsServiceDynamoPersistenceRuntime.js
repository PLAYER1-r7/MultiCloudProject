import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

import { createInMemorySnsRouteHandlerDependencies } from "./snsServiceRouteHandlerRuntime.js";

const TIMELINE_ITEM_KEY = "current";

function normalizeTimelineItems(items) {
  return [...items].sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
}

async function readPersistedTimeline(client, tableName) {
  const response = await client.send(
    new GetCommand({
      TableName: tableName,
      Key: { timeline_key: TIMELINE_ITEM_KEY },
      ConsistentRead: true
    })
  );

  return normalizeTimelineItems(Array.isArray(response.Item?.items) ? response.Item.items : []);
}

async function writePersistedTimeline(client, tableName, items) {
  await client.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        timeline_key: TIMELINE_ITEM_KEY,
        items: normalizeTimelineItems(items),
        updated_at: new Date().toISOString()
      }
    })
  );
}

export function createDynamoBackedSnsRouteHandlerDependencies(options) {
  const client = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
    marshallOptions: {
      removeUndefinedValues: true
    }
  });
  const { tableName } = options;
  let writeChain = Promise.resolve();

  return {
    async listTimeline() {
      await writeChain;
      return readPersistedTimeline(client, tableName);
    },

    async createPost(payload) {
      const operation = writeChain.then(async () => {
        const existingItems = await readPersistedTimeline(client, tableName);
        const inMemoryDependencies = createInMemorySnsRouteHandlerDependencies({
          initialItems: existingItems
        });
        const createdItem = await inMemoryDependencies.createPost(payload);
        const nextItems = await inMemoryDependencies.listTimeline();
        await writePersistedTimeline(client, tableName, nextItems);
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