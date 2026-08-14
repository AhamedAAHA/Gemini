// Cost circuit-breaker Lambda. Runs on the Node 20 runtime (AWS SDK v2 is
// pre-installed there, so this deploys without a build step).
const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();

const TABLE = process.env.CONFIG_TABLE ?? "billscope_config";

exports.handler = async () => {
  await ddb
    .put({
      TableName: TABLE,
      Item: {
        key: "ai:concierge",
        scope: "global",
        value: "off",
        reason: "cost-circuit-breaker",
        updatedAt: new Date().toISOString(),
      },
    })
    .promise();
  return { statusCode: 200, body: "breaker flipped ai:concierge=off" };
};
