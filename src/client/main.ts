import { ChatClient } from "./client.js";
import type { ServerMessage } from "../../shared/protocol.js";

const chat = new ChatClient("ws://localhost:5230/ws");

const inputElement = document.querySelector<HTMLInputElement>("#message");
const buttonElement = document.querySelector<HTMLButtonElement>("#send");
const messagesElement = document.querySelector<HTMLDivElement>("#messages");

if (!inputElement || !buttonElement || !messagesElement) {
  throw new Error("Chat UI elements not found");
}

const input = inputElement;
const button = buttonElement;
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

button.addEventListener("click", sendMessage);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});
