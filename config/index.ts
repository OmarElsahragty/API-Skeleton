import { config } from "dotenv";
import { EnvironmentsEnum } from "../src/types";
config();

export default Object.freeze({
  environment: process.env.NODE_ENV as EnvironmentsEnum,

  cors: process.env.CORS || "*",

  port: parseInt(process.env.PORT || "5000"),

  mongoURI: process.env.MONGO_URI || "",

  jwt: {
    secret: process.env.JWT_SECRET || "",
    lifeTime: process.env.JWT_LIFE_TIME || "1y",
  },
});
