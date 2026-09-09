import { io, type Socket } from "socket.io-client";
import type {
  ClientMessage,
  ServerMessage,
} from "../../shared/protocol.ts";

export class ChatClient {
  private readonly socket: Socket;
  private messageHandler?: (message: ServerMessage) => void;

  constructor(url?: string) {
    this.socket = io(url ?? window.location.origin);

    this.socket.on("connect", () => {
      console.log("Connected to chat server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from chat server");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });

    this.socket.on("message", (message: unknown) => {
      this.messageHandler?.(message as ServerMessage);
    });
  }

  onMessage(handler: (message: ServerMessage) => void): void {
    this.messageHandler = handler;
  }

  sendMessage(content: string): void {
    const message: ClientMessage = {
      type: "chat",
      content,
    };

    this.socket.emit("message", message);
  }

  close(): void {
    this.socket.disconnect();
  }
}
