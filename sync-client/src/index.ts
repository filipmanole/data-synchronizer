import { cli } from "./cli";
import { getSocket } from "./ws";

const main = async () => {
  const socket = getSocket();
  cli(socket);
};

main();
