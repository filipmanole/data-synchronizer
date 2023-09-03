import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda/trigger/api-gateway-proxy";
import { PutItemCommand, DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import sendMessage from "@common/sendMessage";

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

    const scanResult = await dynamoClient.send(new ScanCommand({
      TableName: process.env.FILES_TABLE,
      ExpressionAttributeNames: { "#p": "path", "#s": "sum" },
      ProjectionExpression: '#p, #s',
    }));

    const sync = {
      route: 'storage/sync',
      body: {
        list: scanResult.Items?.map(item => ({
          path: item.path.S,
          sum: item.sum?.S,
        }))
      }
    }

    sendMessage(id, JSON.stringify(sync));

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
