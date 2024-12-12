import { type Message } from "discord.js";
import { players } from "../../../AudioFunction/queueManager";

export const data = {
  name: "skipto",
  description: "Skip to the next song",
  shortCut: "fs",
};

export const execute = async (message: Message) => {
  const voiceChannel = message.member?.voice.channelId;

  if (!voiceChannel) {
    return message.reply("You Must Be In A Voice Channel To Use This Command.");
  }

  const playerData = players.get(message.guildId as string);
  const filterQ = message.content.split(" ").slice(1).join(" ");
  const query = parseInt(filterQ);

  if (playerData?.player && playerData?.subscription) {
    if (playerData?.queue.length > 0) {
      const firstQueue = playerData.queue[0];
      if (query > playerData.queue.length || playerData.queue.length === 1) {
        return message.reply("Cant Skip More Than Queues");
      }
      const skipedQueue = playerData.queue.slice(query - 1);
      playerData.queue = [firstQueue, ...skipedQueue];
      playerData.player.stop(true);
      return message.reply({ content: "Song Skipped" });
    } else {
      return message.reply({ content: "No Songs In Queue" });
    }
  } else {
    return message.reply({ content: "No Player Found" });
  }
};
