// dynamoClient.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const REGION = import.meta.env.VITE_AWS_REGION || "us-east-1";

export const ddbClient = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || "",
  },
});