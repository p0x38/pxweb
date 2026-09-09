export interface ChatMessage {
  type: "chat";
  message: string;
}

export interface SystemMessage {
  type: "system";
  message: string;
}

export interface ErrorMessage {
  type: "error";
  message: string;
}

export type ServerMessage =
  | ChatMessage
  | SystemMessage
  | ErrorMessage;

export class ChatClient {
  private socket: WebSocket;

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
      this.handleMessage(event.data);
    });
  }

  private handleMessage(raw: string): void {
    let message: ServerMessage;

    try {
      message = JSON.parse(raw) as ServerMessage;
    } catch {
      console.error("Received invalid JSON:", raw);
      return;
    }

    switch (message.type) {
      case "chat":
        console.log(`CHAT: ${message.message}`);
        break;

      case "system":
        console.log(`SYSTEM: ${message.message}`);
        break;

      case "error":
        console.error(`ERROR: ${message.message}`);
        break;
    }
  }

  sendMessage(message: string): void {
    if (this.socket.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket isn't connected");
      return;
    }

    const data: ChatMessage = {
      type: "chat",
      message,
    };

    this.socket.send(JSON.stringify(data));
  }

  close(): void {
    this.socket.close();
  }
}