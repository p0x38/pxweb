import type {
  ClientMessage,
  ServerMessage,
} from "../../shared/protocol.js";

export class ChatClient {
  private readonly socket: WebSocket;
  private messageHandler?: (message: ServerMessage) => void;

  constructor(url: string) {
    this.socket = new WebSocket(url);

    this.socket.addEventListener("open", () => {
      console.log("Connected to chat server");
    });

    this.socket.addEventListener("close", () => {
      console.log("Disconnected from chat server");
    });

    this.socket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });

    this.socket.addEventListener("message", (event) => {
      if (typeof event.data !== "string") {
        console.error("Received non-text WebSocket message");
        return;
      }

      let message: ServerMessage;

      try {
        message = JSON.parse(event.data) as ServerMessage;
      } catch {
        console.error("Received invalid JSON:", event.data);
        return;
      }

      this.messageHandler?.(message);
    });
  }

  onMessage(handler: (message: ServerMessage) => void): void {
    this.messageHandler = handler;
  }

  sendMessage(content: string): void {
    if (this.socket.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket isn't connected");
      return;
    }

    const message: ClientMessage = {
      type: "chat",
      content,
    };

    this.socket.send(JSON.stringify(message));
  }

  close(): void {
    this.socket.close();
  }
}
