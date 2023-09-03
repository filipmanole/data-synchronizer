import WebSocket from 'ws';
import { create, remove, upsert, verifyAndCreateDir } from './handlers';
import { ROUTES, WS_ENDPOINT } from './constants';

const socket = new WebSocket(WS_ENDPOINT);

export const getSocket = () => socket;

socket.on('message', async (data) => {
  const { route, body } = JSON.parse(data.toString());
  switch (route) {
    case ROUTES.create:
      await create(body.path);
      break;
    case ROUTES.remove:
      await remove(body.path);
      break;
    case ROUTES.upsert:
      await upsert(body.path, body.content);
      break;
    case ROUTES.sync:
      
      break;
    default:
      break;
  }
});

socket.on('open', () => {});
socket.on('close', (code, reason) => {});
socket.on('error', (error) => {});
