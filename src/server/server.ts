import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { Server as SocketIOServer } from "socket.io";
import { join } from "node:path";

import { ClientMessageSchema } from "../../shared/protocol.ts";
import { Chat } from "./chat.ts";

const app = Fastify({
  logger: true,
});

await app.register(fastifyStatic, {
  root: join(import.meta.dirname, "../../dist"),
});

const chat = new Chat();
const io = new SocketIOServer(app.server, {
  cors: {
    origin: true,
  },
});

io.on("connection", (socket) => {
  chat.add(socket);

  socket.on("message", (raw: unknown) => {
    const result = ClientMessageSchema.safeParse(raw);

    if (!result.success) {
      socket.emit("message", {
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
        socket.emit("message", {
          type: "system",
          message: `Username set to ${result.data.username}`,
        });
        break;

      case "typing":
        socket.broadcast.emit("message", {
          type: "system",
          message: result.data.typing ? "Someone is typing" : "Someone stopped typing",
        });
        break;
    }
  });

  socket.on("disconnect", () => {
    chat.remove(socket);
  });
});

await app.listen({
  host: "0.0.0.0",
  port: 5230,
});
