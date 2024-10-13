import { type Message } from "discord.js";

export const data = {
  name: "ping",
  description: "Replies With Pong!",
  shortCut: null,
};

export const execute = (message: Message) => {
  const latency = message.client.ws.ping
  return message.reply(`Ponga! ${Math.round(latency)}ms`);
};
