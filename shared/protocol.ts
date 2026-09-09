import { z } from "zod";

export const ClientMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("chat"),
    content: z.string().min(1).max(2000),
  }),
  z.object({
    type: z.literal("set_username"),
    username: z.string().min(1).max(32),
  }),
  z.object({
    type: z.literal("typing"),
    typing: z.boolean(),
  }),
]);

export type ClientMessage = z.infer<typeof ClientMessageSchema>;

export interface ChatMessage {
  type: "chat";
  id: string;
  username: string;
  content: string;
  timestamp: number;
}

export type ServerMessage =
  | ChatMessage
  | {
      type: "system";
      message: string;
    }
  | {
      type: "user_join";
      username: string;
    }
  | {
      type: "user_leave";
      username: string;
    }
  | {
      type: "error";
      message: string;
    };
