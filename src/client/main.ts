import { ChatClient } from "./client.js";

const chat = new ChatClient("ws://localhost:3000/ws");

const input = document.querySelector<HTMLInputElement>("#message");
const button = document.querySelector<HTMLButtonElement>("#send");
const messages = document.querySelector<HTMLDivElement>("#messages");

if (!input || !button || !messages) {
  throw new Error("Chat UI elements not found");
}

chat.onMessage((message) => {
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