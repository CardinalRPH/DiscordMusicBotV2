import { type CommandInteraction, SlashCommandBuilder } from "discord.js";
import { updatePrefix } from "../../../data/CRUDFunction";

export const data = new SlashCommandBuilder()
  .setName("set-prefix")
  .setDescription("Set The Prefix For Bot Command")
  .addStringOption((option) =>
    option
      .setName("new-prefix")
      .setDescription("The New Prefix")
      .setRequired(true)
  );

export const execute = (interaction: CommandInteraction) => {
  const newPrefix = interaction.options.get("new-prefix")?.value as string;
  updatePrefix(interaction.guildId as string, newPrefix);

  return interaction.reply(`New Prefix Update To ${newPrefix}`);
};
