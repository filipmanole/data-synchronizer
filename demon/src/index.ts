import readline from 'node:readline/promises';
import fs from 'fs/promises';
import WebSocket from 'ws';
import editor from './textEditor';
// import http from 'http';
// import { htmlTextEditor } from './textArea';

// @ts-ignore
// const server = http.createServer((request, response) => {
//   response.write(htmlTextEditor('fileeeee'));  
//   response.end();  
// }).listen(8080);

// server.close();

const ROOT_DIR = process.env.ROOT_DIR;

const openedFiles: Record<string, string> = {};

const socket = new WebSocket('wss://o1gb5aeep6.execute-api.us-east-1.amazonaws.com/dev/');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

socket.on('open', () => {
  // TODO: synch
});

socket.on('message', (data) => {
  const { route, body } = JSON.parse(data.toString());
  switch (route) {
    case 'storage/create':
      create(body.path);
      break;
    case 'storage/remove':
      remove(body.path);
      break;
    case 'storage/upsert':
      // TODO: set text
      break;
    default:
      break;
  }
});

socket.on('close', (code, reason) => {
  // TODO: close
});

socket.on('error', (error) => {
  // TODO: handle

});

const create = async (filepath: string, send = false) => {
  if (!filepath) {
    console.log('incorrect arguments...');
    return;
  }

  await fs.writeFile(ROOT_DIR + '/' + filepath, '');

  if(send) {
    socket.send(JSON.stringify({
      route: 'storage/create',
      body: { path: filepath },
    }));
  }
}

const remove = async (filepath: string, send = false) => {
  if (!filepath) {
    console.log('incorrect arguments...');
    return;
  }

  await fs.unlink(ROOT_DIR + '/' + filepath);

  if(send) {
    socket.send(JSON.stringify({
      route: 'storage/remove',
      body: { path: filepath },
    }));
  }
}

const edit = async (filepath: string, send = false) => {
  if (!filepath) {
    console.log('incorrect arguments...');
    return;
  }

  const str = await fs.readFile(ROOT_DIR + '/' + filepath);
  openedFiles[filepath] = str.toString();

  return new Promise(async (resolve, reject) => {
    editor(str.toString())
    .on('data', async (text: any) => {
      if(!text?.value) return;
      if(send) {
        socket.send(JSON.stringify({
          route: 'storage/upsert',
          body: { 
            path: filepath,
            content: text,
          },
        }));
      }

      // fs.writeFileSync("programming.txt", text.value);
    })
    .on('abort', async (text: any) => {
      if(!text?.value) return;
      delete openedFiles[filepath];
      reject(new Error('aborted'));
    })
    .on('submit', async (text: any) => {
      if(!text?.value) return;
      delete openedFiles[filepath];
      resolve(undefined);
    })
  });
}

const exit = () => {
  console.log('Exiting');
  rl.close();
  process.exit();
}

const processCommand = async (cmd: string) => {
  const tokens: string[] = cmd.split(' ');

  switch (tokens[0]) {
    case 'echo':
      socket.send("echo");
    break;

    case 'create':
      await create(tokens[1], true);
      break;

    case 'edit':      
      await edit(tokens[1], true);
      break;

    case 'remove':
      await remove(tokens[1], true);
      break;

    case 'exit':
      exit();

    default:
      console.log('not supported command...');
  }
};

const cli = async (): Promise<void> => {
  try {
    const cmd = await rl.question('> ');
    processCommand(cmd);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    return cli();
  }
}

cli();
