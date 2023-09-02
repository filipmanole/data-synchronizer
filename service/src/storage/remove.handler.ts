import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda/trigger/api-gateway-proxy";
import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import broadcastMessageExcept from '@common/broadcastMessageExcept';

const dynamoClient = new DynamoDBClient({});

// { "route": "storage/remove", "body": { "path": "test" } }
const remove: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.requestContext.connectionId;
    const { path } = JSON.parse(event.body).body;

    await dynamoClient.send(new DeleteItemCommand({
      TableName: process.env.FILES_TABLE,
      Key: { path : { S: path } },
    }));

    await broadcastMessageExcept(id, event.body);

    return {
      statusCode: 200,
      body: JSON.stringify({
        msg: 'Removed file',
      })
    };
  } catch (error) {
    console.log(`Removing file failed: ${error}`);
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      msg: 'Error trying to remove file',
    })
  };
};

export default remove;
