import type { Server as SocketIOServer, Socket } from "socket.io";
import type { ServerMessage } from "../../shared/protocol.ts";

export class Chat {
  private readonly io: SocketIOServer;

  constructor(io: SocketIOServer) {
    this.io = io;
  }

  add(socket: Socket): void {
    this.broadcast({
      type: "system",
      message: "Someone joined the chat",
    });
  }

  remove(socket: Socket): void {
    this.broadcast({
      type: "system",
      message: "Someone left the chat",
    });
  }

  broadcast(message: ServerMessage): void {
    this.io.emit("message", message);
  }

  send(socket: Socket, message: ServerMessage): void {
    socket.emit("message", message);
  }

  get clientCount(): number {
    return this.io.sockets.sockets.size;
  }
}
