import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda/trigger/api-gateway-proxy";
import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient({});

export const main: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.requestContext.connectionId;
    console.log('event DISCONNECT: ', id);

    await dynamoClient.send(new DeleteItemCommand({
      TableName: process.env.CONNECTION_TABLE,
      Key: { id: { S: id } },
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        msg: `Disconnected ${id}`,
      })
    };
  } catch (error) {
    console.log(`Could not disconnect: ${error}`);
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      msg: `Failed to disconnect`,
    })
  };
};

