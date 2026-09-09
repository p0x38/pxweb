import { ChatClient } from "./client.ts";
import type { ServerMessage } from "../../shared/protocol.ts";

const chat = new ChatClient(window.location.origin);

const inputElement = document.querySelector<HTMLInputElement>("#message");
const formElement = document.querySelector<HTMLFormElement>("#chat-form");
const messagesElement = document.querySelector<HTMLDivElement>("#messages");

if (!inputElement || !formElement || !messagesElement) {
  throw new Error("Chat UI elements not found");
}

const input = inputElement;
const form = formElement;
const messages = messagesElement;

chat.onMessage((message: ServerMessage) => {
  const element = document.createElement("div");

  switch (message.type) {
    case "chat":
      element.textContent = `${message.username}: ${message.content}`;
      break;
    case "system":
      element.textContent = `[system] ${message.message}`;
      break;
    case "user_join":
      element.textContent = `${message.username} joined`;
      break;
    case "user_leave":
      element.textContent = `${message.username} left`;
      break;
    case "error":
      element.textContent = `[error] ${message.message}`;
      break;
  }

  messages.appendChild(element);
});

function sendMessage(): void {
  const content = input.value.trim();

  if (!content) {
    return;
  }

  chat.sendMessage(content);
  input.value = "";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage();
});
