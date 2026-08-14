import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import type { AnalysisResult } from "./types";

const TABLE = process.env.BILLSCOPE_ANALYSES_TABLE;

let docClient: DynamoDBDocumentClient | null = null;
const memory: AnalysisResult[] = [];

function getClient(): DynamoDBDocumentClient | null {
  if (docClient) return docClient;
  if (!TABLE) return null;
  try {
    const client = new DynamoDBClient({ region: process.env.AWS_REGION ?? "us-east-1" });
    docClient = DynamoDBDocumentClient.from(client, {
      marshallOptions: { removeUndefinedValues: true },
    });
    return docClient;
  } catch {
    return null;
  }
}

export async function saveAnalysis(result: AnalysisResult): Promise<"dynamodb" | "memory"> {
  const client = getClient();
  if (!client || !TABLE) {
    memory.push(result);
    return "memory";
  }
  try {
    await client.send(
      new PutCommand({
        TableName: TABLE,
        Item: {
          pk: `analysis#${result.bill.id}`,
          sk: "latest",
          gsi1pk: "analysis#recent",
          createdAt: Date.now(),
          ...result,
        },
      })
    );
    return "dynamodb";
  } catch {
    memory.push(result);
    return "memory";
  }
}
