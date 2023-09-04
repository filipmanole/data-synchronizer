import {
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import sendMessage from "@common/sendMessage";

const dynamoClient = new DynamoDBClient({});

// { "route": "storage/get", "body": { "path": "test" } }
const get: APIGatewayProxyHandler = async (
  event
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.requestContext.connectionId;
    const { path } = JSON.parse(event.body).body;

    const result = await dynamoClient.send(
      new GetItemCommand({
        TableName: process.env.FILES_TABLE,
        Key: { path: { S: path } },
      })
    );

    if (!result.Item)
      return {
        statusCode: 200,
        body: JSON.stringify({ msg: "No existing file" }),
      };

    await sendMessage(
      id,
      JSON.stringify({
        route: "storage/get",
        body: {
          path: path,
          content: result.Item.content?.S,
        },
      })
    );

    return { statusCode: 200, body: JSON.stringify({ msg: "Existing file" }) };
  } catch (error) {
    console.log(`Getting file failed: ${error}`);
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      msg: "Error trying to get file",
    }),
  };
};

export default get;
