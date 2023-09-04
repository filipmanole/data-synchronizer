import fs from 'fs/promises';
import crypto from "crypto";
import { ROOT_DIR } from './constants';

const append = (filepath: string) => ROOT_DIR + "/" + filepath;

export const computeHash = (key: string, content: string) => {
  return crypto
    .createHmac("sha256", Buffer.from(key, "utf8"))
    .update(content, "utf8")
    .digest("base64");
};

export const getFilesWithHashes = async (dir: string) => {
  const files = await fs.readdir(dir);

  const listPromises = files.map(async (file) => ({
    path: file,
    sum: computeHash(file, (await fs.readFile(ROOT_DIR + "/" + file)).toString()),
  }));

  return Promise.all(listPromises);
};
