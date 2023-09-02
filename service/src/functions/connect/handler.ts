import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda/trigger/api-gateway-proxy";
import { PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import dayjs from 'dayjs';

const dynamoClient = new DynamoDBClient({});

export const main: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.requestContext.connectionId;
    console.log('event CONNECT: ', id);

    await dynamoClient.send(new PutItemCommand({
      TableName: process.env.CONNECTION_TABLE,
      Item: { 
        id : { S: id },
        // ttl: { N: dayjs().add(30, "minutes").unix().toString() },
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
