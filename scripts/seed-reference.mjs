// Seeds the billscope_reference DynamoDB table from lib/reference-data.ts.
// Usage: node --experimental-strip-types scripts/seed-reference.mjs
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { REFERENCE_PRICES } from "../lib/reference-data.ts";

const TABLE = process.env.BILLSCOPE_REFERENCE_TABLE ?? "billscope_reference";
const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

for (const [code, entry] of Object.entries(REFERENCE_PRICES)) {
  await client.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        code,
        payer: "medicare-fs",
        description: entry.description,
        allowable: entry.allowable,
        category: entry.category,
        severity: entry.severity ?? null,
      },
    })
  );
  console.log(`seeded ${code} (${entry.description})`);
}
console.log(`Done. Seeded ${Object.keys(REFERENCE_PRICES).length} reference codes.`);
