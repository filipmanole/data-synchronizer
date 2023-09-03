import WebSocket from 'ws';
import fs from 'fs/promises';
import { ROOT_DIR, ROUTES } from './constants';

const append = (filepath: string) => ROOT_DIR + '/' + filepath;

export const verifyAndCreateDir = async () => {
  try {
    await fs.access(ROOT_DIR);
  } catch (err) {
    await fs.mkdir(ROOT_DIR);
  }
}

export const create = async (filepath: string, socket?: WebSocket) => {
  if (!filepath) return void console.log('incorrect arguments...');

  await fs.writeFile(append(filepath), '');

  if (!socket) return;
  
  socket.send(JSON.stringify({
    route: ROUTES.create,
    body: { path: filepath },
  }));
}

export const remove = async (filepath: string, socket?: WebSocket) => {
  if (!filepath) return void console.log('incorrect arguments...');

  await fs.unlink(append(filepath));

  if(!socket) return;
  
  socket.send(JSON.stringify({
    route: ROUTES.remove,
    body: { path: filepath },
  }));
}

export const upsert = async (filepath: string, content?: string, socket?: WebSocket) => {
  if (!filepath) return void console.log('incorrect arguments...');

  await fs.writeFile(append(filepath), content ?? '');

  if(!socket) return;
  
  socket.send(JSON.stringify({
    route: ROUTES.upsert,
    body: { path: filepath, content: content ?? '' },
  }));
}
