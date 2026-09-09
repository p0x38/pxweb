import type { ServerMessage } from "../../shared/protocol.js";

export interface ChatSocket {
  readonly readyState: number;
  readonly OPEN: number;
  send(data: string): void;
}

export class Chat {
  private readonly clients = new Set<ChatSocket>();

  add(socket: ChatSocket): void {
    this.clients.add(socket);

    this.broadcast({
      type: "system",
      message: "Someone joined the chat",
    });
  }

  remove(socket: ChatSocket): void {
    this.clients.delete(socket);

    this.broadcast({
      type: "system",
      message: "Someone left the chat",
    });
  }

  broadcast(message: ServerMessage): void {
    const data = JSON.stringify(message);

    for (const client of this.clients) {
      if (client.readyState === client.OPEN) {
        client.send(data);
      }
    }
  }

  send(socket: ChatSocket, message: ServerMessage): void {
    if (socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }

  get clientCount(): number {
    return this.clients.size;
  }
}
