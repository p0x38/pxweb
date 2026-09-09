import type { WebSocket } from "ws";

export interface ChatMessage {
  type: "chat";
  message: string;
}

export interface ServerMessage {
  type: "chat" | "system" | "error";
  message: string;
}

export class Chat {
  private readonly clients = new Set<WebSocket>();

  add(socket: WebSocket): void {
    this.clients.add(socket);

    this.broadcast({
      type: "system",
      message: "Someone joined the chat",
    });
  }

  remove(socket: WebSocket): void {
    this.clients.delete(socket);

    this.broadcast({
      type: "system",
      message: "Someone left the chat",
    });
  }

  broadcast(data: ServerMessage): void {
    const message = JSON.stringify(data);

    for (const client of this.clients) {
      if (client.readyState === 1) {
        client.send(message);
      }
    }
  }

  send(socket: WebSocket, data: ServerMessage): void {
    if (socket.readyState === 1) {
      socket.send(JSON.stringify(data));
    }
  }

  get clientCount(): number {
    return this.clients.size;
  }
}