import Fastify from "fastify";
import websocket from "@fastify/websocket";
import type { WebSocket } from "ws";

import { Chat } from "./chat.js";
import type {
  ClientMessage,
  ServerMessage,
} from "../../shared/protocol.js";

const app = Fastify({
  logger: true,
});

await app.register(websocket);

const chat = new Chat();

app.get("/ws", { websocket: true }, (socket: WebSocket) => {
  chat.add(socket);

  socket.on("message", (raw) => {
    let data: ClientMessage;

    try {
      data = JSON.parse(raw.toString()) as ClientMessage;
    } catch {
      chat.send(socket, {
        type: "error",
        message: "Invalid JSON",
      });

      return;
    }

    switch (data.type) {
      case "chat":
        chat.broadcast({
          type: "chat",
          id: crypto.randomUUID(),
          username: "Anonymous",
          content: data.content,
          timestamp: Date.now(),
        });

        break;

      case "set_username":
        // TODO: implement username handling
        break;

      case "typing":
        // TODO: implement typing indicators
        break;

      default:
        chat.send(socket, {
          type: "error",
          message: "Unknown message type",
        });
    }
  });

  socket.on("close", () => {
    chat.remove(socket);
  });

  socket.on("error", (error) => {
    app.log.error(error);
    chat.remove(socket);
  });
});

await app.listen({
  host: "0.0.0.0",
  port: 5230,
});