import WebSocket from 'ws';
import readline from 'node:readline/promises';
import { create, remove, upsert } from './handlers';
import { COMMANDS } from './constants';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const processCommand = async (socket: WebSocket, cmd: string) => {
  const tokens: string[] = cmd.split(' ');

  switch (tokens[0]) {
    case COMMANDS.create:
      await create(tokens[1], socket);
      break;

    case COMMANDS.remove:
      await remove(tokens[1], socket);
      break;

    case COMMANDS.upsert:
      await upsert(tokens[1], tokens[2], socket);
      break;

    case COMMANDS.exit:
      rl.close();
      process.exit();

    default:
      console.log('not supported command...');
  }
};

export const cli = async (socket: WebSocket): Promise<void> => {
  try {
    const cmd = await rl.question('> ');
    processCommand(socket, cmd);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    return cli(socket);
  }
};
