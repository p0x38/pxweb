export interface ChatMessage {
  type: "chat";
  id: string;
  username: string;
  content: string;
  timestamp: number;
}

export type ClientMessage =
  | {
      type: "chat";
      content: string;
    }
  | {
      type: "set_username";
      username: string;
    }
  | {
      type: "typing";
      typing: boolean;
    };

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