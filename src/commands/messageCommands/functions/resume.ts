import { AudioPlayerStatus, getVoiceConnection } from "@discordjs/voice";
import { type Message } from "discord.js";
import { players, playNextSong } from "../../../AudioFunction/queueManager";

export const data = {
  name: "resume",
  description: "Resume Current Play",
  shortCut: null,
};

export const execute = async (message: Message) => {
  const voiceChannel = message.member?.voice.channelId;

  if (!voiceChannel) {
    return message.reply("You Must Be In A Voice Channel To Use This Command.");
  }

  try {
    const playerData = players.get(message.guildId as string);
    const voiceConnection = getVoiceConnection(message.guildId as string);

    if (voiceConnection && playerData?.player) {
      if (playerData.player.state.status === AudioPlayerStatus.Playing) {
        return message.reply({
          content: "Already Play",
        });
      }
      if (playerData.player.state.status === AudioPlayerStatus.Paused) {
        playerData.player.unpause();
        return message.reply({
          content: "Playing",
        });
      }
      if (playerData.player.state.status === AudioPlayerStatus.Idle) {
        if (playerData.queue.length > 0) {
          playNextSong(message.guildId as string);
          return message.reply({
            content: "Song Played",
          });
        } else {
          return message.reply({
            content: "No Playing Song",
          });
        }
      }
    } else {
      return message.reply({
        content: "Bot Not Connect To The Voice",
      });
    }
  } catch (error) {
    message.reply("Something went Wrong");
    console.error(error);
  }
};
