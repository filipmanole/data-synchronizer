import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda/trigger/api-gateway-proxy";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import broadcastMessageExcept from '@common/broadcastMessageExcept';
import computeHash from "@common/computeHash";

const dynamoClient = new DynamoDBClient({});

// { "route": "storage/upsert", "body": { "path": "test", "content": "Hello" } }
const upsert: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.requestContext.connectionId;
    const { path, content } = JSON.parse(event.body).body;

    const sum = computeHash(path, content);

    await dynamoClient.send(new UpdateItemCommand({
      TableName: process.env.FILES_TABLE,
      Key: { path : { S: path } },
      ExpressionAttributeNames: { "#c": "content", "#s": "sum" },
      ExpressionAttributeValues: { ":c": { "S": content }, ":s": { "S": sum} },
      UpdateExpression: "SET #c = :c, #s = :s"
    }));

    await broadcastMessageExcept(id, event.body);

    return {
      statusCode: 200,
      body: JSON.stringify({
        msg: 'Upserted file',
      })
    };
  } catch (error) {
    console.log(`Upserting file failed: ${error}`);
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      msg: 'Error trying to upsert file',
    })
  };
};

export default upsert;
