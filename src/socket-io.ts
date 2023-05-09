import { Server as httpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { SocketEventsEnum } from "./types";
import config from "../config";

class SocketIO {
  private socket!: SocketIOServer;

  setup(server: httpServer) {
    this.socket = new SocketIOServer(server, {
      cors: { origin: config.environment === "PRODUCTION" ? config.cors : "*" },
    });
    this.socket.on("connection", socket => socket.on("join", (room: string) => socket.join(room)));
  }

  emit(event: SocketEventsEnum, data: any, rooms: string[] = []) {
    if (!rooms.length) return this.socket.emit(event, data);
    rooms.forEach(room => this.socket.sockets.to(room).emit(event, data));
  }

  on(event: SocketEventsEnum, callBack: (...args: any[]) => void) {
    return this.socket.on(event, callBack);
  }

  off(event: SocketEventsEnum, callBack: (...args: any[]) => void) {
    this.socket.off(event, callBack);
  }
}

export default new SocketIO();
