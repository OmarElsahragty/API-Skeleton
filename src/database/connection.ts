import { set, connect } from "mongoose";

export const establishConnection = async (uri: string) => {
  set("strictQuery", true);

  return connect(uri).then(() =>
    // eslint-disable-next-line no-console
    console.log("🗒️ Connected to mongoDB successfully")
  );
};
