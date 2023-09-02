import { ScanCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import sendMessage from "@common/sendMessage";

const dynamoClient = new DynamoDBClient({});

const broadcastMessageExcept = async (connectionId: string, msg: string) => {
  const scanResult = await dynamoClient.send(new ScanCommand({
    TableName: process.env.CONNECTION_TABLE,
  }));

  await Promise.all(scanResult.Items.map(async item => {
    if (item.id.S === connectionId) return;
    await sendMessage(item.id.S, msg);
  }));
}

export default broadcastMessageExcept;
