import http from "http";
import cors from "cors";
import helmet from "helmet";
import express, { Express } from "express";
import socketIO from "./socket-io";
import routes from "./routes";
import { EnvironmentsEnum } from "./types";

export default class HTTP {
  private port: number;
  private express: Express;
  private server: http.Server;

  constructor(port: number, environment: EnvironmentsEnum) {
    this.port = port;
    this.express = express().use(express.json()).use(cors());

    if (environment === "PRODUCTION") this.express.use(helmet());

    this.express.use("/api", routes);

    this.server = http.createServer(this.express);
    socketIO.setup(this.server);
  }

  start() {
    // eslint-disable-next-line no-console
    this.server.listen(this.port, () => console.log(`🚀 Server is running on port: ${this.port}`));
  }
}
