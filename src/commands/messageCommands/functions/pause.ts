import { AudioPlayerStatus, getVoiceConnection } from "@discordjs/voice";
import { type Message } from "discord.js";
import { players } from "../../../AudioFunction/queueManager";

export const data = {
  name: "pause",
  description: "Pause Current Play",
  shortCut: null,
};

export const execute = (message: Message) => {
  const voiceChannel = message.member?.voice.channelId;

  if (!voiceChannel) {
    return message.reply("You Must Be In A Voice Channel To Use This Command.")
  }

  try {
    const playerData = players.get(message.guildId as string);
    const voiceConnection = getVoiceConnection(message.guildId as string);

    if (voiceConnection && playerData?.player) {
      if (playerData.player.state.status === AudioPlayerStatus.Playing) {
        playerData.player.pause();
        return message.reply({
          content: "Paused",
        });
      }
      if (playerData.player.state.status === AudioPlayerStatus.Paused) {
        return message.reply({
          content: "Already Paused",
        });
      }
      if (playerData.player.state.status === AudioPlayerStatus.Idle) {
        return message.reply({
          content: "No Playing Song",
        });
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
