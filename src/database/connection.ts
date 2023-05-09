import { set, connect } from "mongoose";

export const establishConnection = async ({ uri, dbName }: { uri: string; dbName: string }) => {
  set("strictQuery", true);

  return connect(uri, { dbName }).then(() =>
    // eslint-disable-next-line no-console
    console.log("🗒️ Connected to mongoDB successfully")
  );
};
