export enum ROUTES {
  get = "storage/get",
  remove = "storage/remove",
  upsert = "storage/upsert",
  sync = "storage/sync",
}

export enum COMMANDS {
  create = "create",
  remove = "remove",
  upsert = "upsert",
  exit = "exit",
}

export const ROOT_DIR = process.env.ROOT_DIR ?? "shared_data_default";
export const WS_ENDPOINT =
  process.env.WS_ENDPOINT ??
  "wss://o1gb5aeep6.execute-api.us-east-1.amazonaws.com/dev/";
