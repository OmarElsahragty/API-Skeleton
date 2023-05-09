import { establishConnection, seeder } from "../src/database";
import config from "../config";

const run = async () => {
  await establishConnection(config.mongoDB);
  if (config.environment === "SEEDING") return seeder();
};

run()
  .then(() => process.exit())
  .catch(err => {
    console.error(err);
    return process.exit(1);
  });
