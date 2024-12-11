import { type Message } from "discord.js";
import { players } from "../../../AudioFunction/queueManager";

export const data = {
  name: "skip",
  description: "Skip to the next song",
  shortCut: "fs",
};

export const execute = async (message: Message) => {
  const voiceChannel = message.member?.voice.channelId;

  if (!voiceChannel) {
    return message.reply("You Must Be In A Voice Channel To Use This Command.");
  }

  const playerData = players.get(message.guildId as string);

  if (playerData?.player && playerData?.subscription) {
    if (playerData?.queue.length > 0) {
      playerData.player.stop(true);
      return message.reply({ content: "Song Skipped" });
    } else {
      return message.reply({ content: "No Songs In Queue" });
    }
  } else {
    return message.reply({ content: "No Player Found" });
  }
};
