import WebSocket from "ws";
import fs from "fs/promises";
import { ROOT_DIR, ROUTES } from "./constants";
import { getFilesWithHashes } from "./helpers";

const append = (filepath: string) => ROOT_DIR + "/" + filepath;

export const verifyAndCreateDir = async () => {
  try {
    await fs.access(ROOT_DIR);
  } catch (err) {
    await fs.mkdir(ROOT_DIR);
  }
};

export const create = async (filepath?: string, socket?: WebSocket) => {
  if (!filepath) return void console.log("incorrect arguments...");

  await fs.writeFile(append(filepath), "");

  if (!socket) return;

  socket.send(
    JSON.stringify({
      route: ROUTES.upsert,
      body: { path: filepath, content: '' },
    })
  );
};

export const remove = async (filepath?: string, socket?: WebSocket) => {
  if (!filepath) return void console.log("incorrect arguments...");

  await fs.unlink(append(filepath));

  if (!socket) return;

  socket.send(
    JSON.stringify({
      route: ROUTES.remove,
      body: { path: filepath },
    })
  );
};

export const upsert = async (
  filepath?: string,
  content?: string,
  socket?: WebSocket
) => {
  if (!filepath) return void console.log("incorrect arguments...");

  await fs.writeFile(append(filepath), content ?? "");

  if (!socket) return;

  socket.send(
    JSON.stringify({
      route: ROUTES.upsert,
      body: { path: filepath, content: content ?? "" },
    })
  );
};

type FileItem = { path: string; sum: string };

export const sync = async (remoteList: FileItem[], socket: WebSocket) => {
  await verifyAndCreateDir();
  const localList = await getFilesWithHashes(ROOT_DIR);

  // add remote files
  remoteList
    .filter((rItem) =>
      localList.some(
        (lItem) => lItem.path === rItem.path && lItem.sum !== rItem.sum
      )
    )
    .map(async (item) =>
      socket.send(
        JSON.stringify({
          route: ROUTES.get,
          body: { path: item.path },
        })
      )
    );

  // to add in local
  remoteList
    .filter((rItem) => !localList.some((lItem) => lItem.path === rItem.path))
    .map((item) =>
      socket.send(
        JSON.stringify({
          route: ROUTES.get,
          body: { path: item.path },
        })
      )
    );

  // to remove from local
  await Promise.all(
    localList
      .filter((lItem) => !remoteList.some((rItem) => rItem.path === lItem.path))
      .map(async (item) => fs.unlink(append(item.path)))
  );
};
