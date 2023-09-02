import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda/trigger/api-gateway-proxy";
import { PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient({});

const connect: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.requestContext.connectionId;

    await dynamoClient.send(new PutItemCommand({
      TableName: process.env.CONNECTION_TABLE,
      Item: { 
        id : { S: id },
      }
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        msg: `Connected ${id}`,
      })
    };
  } catch (error) {
    console.log(`Could not connect: ${error}`);
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      msg: `Failed to connect`,
    })
  };
};

export default connect;
