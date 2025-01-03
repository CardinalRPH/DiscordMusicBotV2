import type { CommandInteraction, GuildMember } from "discord.js";
import { SlashCommandBuilder } from "discord.js";
import { players } from "../../../AudioFunction/queueManager";
import { AudioPlayerStatus, getVoiceConnection } from "@discordjs/voice";

export const data = new SlashCommandBuilder()
  .setName("pause")
  .setDescription("Pause Current Play");

export const execute = async (interaction: CommandInteraction) => {
  const member = interaction.member as GuildMember;
  const voiceChannel = member.voice.channel?.id;

  if (!voiceChannel) {
    return interaction.reply({
      content: "You Must Be In A Voice Channel To Use This Command.",
      ephemeral: true,
    });
  }

  try {
    const playerData = players.get(interaction.guildId as string);
    const voiceConnection = getVoiceConnection(interaction.guildId as string);

    if (voiceConnection && playerData?.player) {
      if (playerData.player.state.status === AudioPlayerStatus.Playing) {
        playerData.player.pause();
        return interaction.reply({
          content: "Paused",
        });
      }
      if (playerData.player.state.status === AudioPlayerStatus.Paused) {
        return interaction.reply({
          content: "Already Paused",
        });
      }
      if (playerData.player.state.status === AudioPlayerStatus.Idle) {
        return interaction.reply({
          content: "No Playing Song",
        });
      }
    } else {
      return interaction.reply({
        content: "Bot Not Connect To The Voice",
      });
    }
  } catch (error) {
    interaction.reply("Something went Wrong");
    console.error(error);
  }
};
