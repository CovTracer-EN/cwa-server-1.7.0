import {WSPORT} from "./Config";
import {Server} from "ws";
import {logger} from "./Logger";
import WebSocket = require("ws");

class SocketsUtil {
  private connections: Array<{ email: string, userId: number, socket: WebSocket }> = [];

  private _socketServer: Server;

  get socketServer() {
    return this._socketServer;
  }

  start() {
    this._socketServer = new Server({
      port: WSPORT
    });
    this._socketServer.on("connection", (socket) => {

      socket.on("close", () => {
        while (this.connections.find((x) => x.socket === socket)) {
          this.connections.splice(this.connections.findIndex((x) => x.socket === socket), 1);
        }
      });

      socket.on("error", (err) => {
        logger.error(err.message);
        while (this.connections.find((x) => x.socket === socket)) {
          this.connections.splice(this.connections.findIndex((x) => x.socket === socket), 1);
        }
      });

      socket.on("message", () => {
        try {

        } catch (err) {

        }
      });
    });
  }
}

export const socketsUtil = new SocketsUtil();
