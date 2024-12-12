import type { ButtonInteraction, GuildMember } from "discord.js";
import { players } from "../../AudioFunction/queueManager";
import buttonHandlers from ".";

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

  const customId = interaction.customId;
  const handler = buttonHandlers[customId];

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
