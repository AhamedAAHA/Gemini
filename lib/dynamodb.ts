import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
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

export async function listRecentAnalyses(limit = 20): Promise<AnalysisResult[]> {
  const client = getClient();
  if (!client || !TABLE) return memory.slice(-limit).reverse();
  try {
    const res = await client.send(
      new ScanCommand({
        TableName: TABLE,
        IndexName: "GSI1",
        Limit: limit,
      })
    );
    return (res.Items as unknown as AnalysisResult[]) ?? [];
  } catch {
    return memory.slice(-limit).reverse();
  }
}

export const storageMode = (): "dynamodb" | "memory" => (getClient() ? "dynamodb" : "memory");
