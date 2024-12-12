import type { ButtonInteraction, GuildMember } from "discord.js";
import { players } from "../../AudioFunction/queueManager";
import buttonHandlers from ".";
import type { ButtonActionHandler } from "./types";

export const deployBtnCommands = async (interaction: ButtonInteraction) => {
  const validateVoiceChannel = async (interaction: ButtonInteraction) => {
    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel?.id;
    if (!voiceChannel) {
      await interaction.reply({
        content: "You Must Be In A Voice Channel To Use This Command.",
        ephemeral: true,
      });
      return false;
    }
    return true;
  };

  const isValid = await validateVoiceChannel(interaction);
  if (!isValid) return;

  const playerData = players.get(interaction.guildId as string);
  if (!playerData?.player || !playerData.subscription) {
    return interaction.reply({ content: "No Player Found" });
  }
  let handler: ButtonActionHandler | null = null;
  try {
    const customId: { action: string } = JSON.parse(interaction.customId);
    handler = buttonHandlers[customId.action];
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "An error occurred while processing the button.",
      ephemeral: true,
    });
  }

  if (handler) {
    try {
      await handler(interaction, playerData);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "An error occurred while processing the button.",
        ephemeral: true,
      });
    }
  } else {
    await interaction.reply({
      content: "Unknown button action.",
      ephemeral: true,
    });
  }
};

export default deployBtnCommands;
