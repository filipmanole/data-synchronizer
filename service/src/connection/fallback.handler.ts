import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda/trigger/api-gateway-proxy";
import { ScanCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import sendMessage from "@common/sendMessage";

const dynamoClient = new DynamoDBClient({});

export const fallback: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const scanResult = await dynamoClient.send(new ScanCommand({
      TableName: process.env.CONNECTION_TABLE,
    }));

    await Promise.all(scanResult.Items.map(async item => {
      await sendMessage(item.id.S, event.body);
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        msg: 'Default route',
      })
    };
  } catch (error) {
    console.log(`Fallback failed: ${error}`);
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      msg: 'Error trying to broadcast message',
    })
  };
}

export default fallback;
