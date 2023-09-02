import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda/trigger/api-gateway-proxy";
import { ScanCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import sendMessage from "@common/sendMessage";

const dynamoClient = new DynamoDBClient({});

// { "route": "storage/list"}
const list: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.requestContext.connectionId;

    const scanResult = await dynamoClient.send(new ScanCommand({
      TableName: process.env.FILES_TABLE,
    }));

    const files = scanResult.Items.map(item => ({
      path: item.path.S,
      hash: item.hash?.S,
    }));

    await sendMessage(id, JSON.stringify(files));

    return {
      statusCode: 200,
      body: JSON.stringify({
        msg: 'Files listed',
      })
    };
  } catch (error) {
    console.log(`Getting files failed: ${error}`);
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      msg: 'Error trying to get files',
    })
  };
};

export default list;
