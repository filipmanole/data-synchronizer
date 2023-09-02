import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";

const apiClient = new ApiGatewayManagementApiClient({
  apiVersion: "2018-11-29",
  endpoint: process.env.APIG_ENDPOINT,
});

const sendMessage = async (connectionId: string, data: string) => {
  await apiClient.send(new PostToConnectionCommand({
    ConnectionId: connectionId,
    Data: data,
  }));
}

export default sendMessage;