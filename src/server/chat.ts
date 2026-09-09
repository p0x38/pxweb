import type { Server as SocketIOServer, Socket } from "socket.io";
import type { ServerMessage } from "../../shared/protocol.ts";

export class Chat {
  constructor(private readonly io: SocketIOServer) {}

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
