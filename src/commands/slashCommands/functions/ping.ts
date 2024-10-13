import { type CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies With Pong!");

export const execute = (interaction: CommandInteraction) => {
  const latency = interaction.client.ws.ping;
  return interaction.reply(`Pong! ${Math.round(latency)}ms`);
};
