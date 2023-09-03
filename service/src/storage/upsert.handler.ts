import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda/trigger/api-gateway-proxy";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import broadcastMessageExcept from '@common/broadcastMessageExcept';
import computeHash from "@common/computeHash";

// const s3Client = new S3Client({});
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

    // /* save file on s3 */
    // await s3Client.send(new PutObjectCommand({
    //   Bucket: process.env.SHARED_STORAGE_BUCKET,
    //   Key: path,
    //   Body: content,
    // }));

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
