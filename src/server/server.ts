import Fastify from "fastify";
import websocket from "@fastify/websocket";
import fastifyStatic from "@fastify/static";
import { join } from "node:path";

import { ClientMessageSchema } from "../../shared/protocol.ts";
import { Chat } from "./chat.ts";

const app = Fastify({
  logger: true,
});

await app.register(websocket);

await app.register(fastifyStatic, {
  root: join(import.meta.dirname, "../../dist"),
});

const chat = new Chat();

app.get("/ws", { websocket: true }, (socket) => {
  chat.add(socket);

  socket.on("message", (raw: { toString(): string }) => {
    let parsed: unknown;

    try {
      parsed = JSON.parse(raw.toString());
    } catch {
      chat.send(socket, {
        type: "error",
        message: "Invalid JSON",
      });
      return;
    }

    const result = ClientMessageSchema.safeParse(parsed);

    if (!result.success) {
      chat.send(socket, {
        type: "error",
        message: "Invalid message",
      });
      return;
    }

    switch (result.data.type) {
      case "chat":
        chat.broadcast({
          type: "chat",
          id: crypto.randomUUID(),
          username: "Anonymous",
          content: result.data.content,
          timestamp: Date.now(),
        });
        break;

      case "set_username":
        chat.send(socket, {
          type: "system",
          message: `Username set to ${result.data.username}`,
        });
        break;

      case "typing":
        break;
    }
  });

  socket.on("close", () => {
    chat.remove(socket);
  });

  socket.on("error", (error: Error) => {
    app.log.error(error);
    chat.remove(socket);
  });
});

await app.listen({
  host: "0.0.0.0",
  port: 5230,
});
