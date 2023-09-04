import { ScanCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import sendMessage from "@common/sendMessage";

const dynamoClient = new DynamoDBClient({});

const broadcastMessage = async (msg: string) => {
  const scanResult = await dynamoClient.send(new ScanCommand({
    TableName: process.env.CONNECTION_TABLE,
  }));

  await Promise.all(scanResult.Items.map(async item => sendMessage(item.id.S, msg)));
}

export default broadcastMessage;
