import {
  CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { players, playNextSong } from "../../../AudioFunction/queueManager";
import { AudioPlayerStatus, getVoiceConnection } from "@discordjs/voice";

export const data = new SlashCommandBuilder()
  .setName("resume")
  .setDescription("Resume Current Play");

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
        return interaction.reply({
          content: "Already Play",
        });
      }
      if (playerData.player.state.status === AudioPlayerStatus.Paused) {
        playerData.player.unpause();
        return interaction.reply({
          content: "Playing",
        });
      }
      if (playerData.player.state.status === AudioPlayerStatus.Idle) {
        if (playerData.queue.length > 0) {
          playNextSong(interaction.guildId as string)
          // const textChannel = interaction.channel as TextChannel
          // const msg = await textChannel.send({
          //   embeds: [musicEmbed({ ...playerData.queue[0] })],
          // });
          // playerData.currentMessage = msg as Message<true>
          return interaction.reply({
            content: "Song Played",
          });
        } else {
          return interaction.reply({
            content: "No Playing Song",
          });
        }
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
