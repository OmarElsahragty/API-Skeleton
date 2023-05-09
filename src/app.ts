import { establishConnection } from "./database";
import http from "./server";
import config from "../config";

export default async () => {
  try {
    await establishConnection(config.mongoDB);
    new http(config.port, config.environment).start();
  } catch (err) {
    console.error(err);
    return process.exit(1);
  }
};
