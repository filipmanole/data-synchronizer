import { cli } from "./cli";
import { verifyAndCreateDir } from "./handlers";
import { getSocket } from "./ws";

const main = async () => {
  await verifyAndCreateDir();
  const socket = getSocket();
  cli(socket);
};

main();