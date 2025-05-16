// attendanceService.ts
import { ddbClient } from "./dynamoClient";
import { PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";

const TABLE_NAME = "AttendanceTracker";

// Add or update attendance record
export async function addAttendanceRecord(record: {
  employeeId: string;
  date: string;
  status: string;
  points?: number;
  reason?: string;
}) {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      employeeId: { S: record.employeeId },
      date: { S: record.date },
      status: { S: record.status },
      points: { N: (record.points ?? 0).toString() },
      reason: { S: record.reason ?? "" },
    },
  };

  try {
    await ddbClient.send(new PutItemCommand(params));
  } catch (err) {
    console.error("Error adding record:", err);
    throw err;
  }
}

// Get all attendance records for one employee
export async function getAttendanceRecordsByEmployee(employeeId: string) {
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "employeeId = :eid",
    ExpressionAttributeValues: {
      ":eid": { S: employeeId },
    },
  };

  try {
    const data = await ddbClient.send(new QueryCommand(params));
    return data.Items || [];
  } catch (err) {
    console.error("Error getting records:", err);
    return [];
  }
}