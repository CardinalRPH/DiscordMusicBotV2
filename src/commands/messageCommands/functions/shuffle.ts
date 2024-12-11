import { TextChannel, type Message } from "discord.js";
import { players, type QueueItem } from "../../../AudioFunction/queueManager";

export const data = {
  name: "shuffle",
  description: "Shuffle Current Queues",
  shortCut: "sf",
};

export const execute = async (message: Message) => {
  const voiceChannel = message.member?.voice.channelId;

  if (!voiceChannel) {
    return message.reply("You Must Be In A Voice Channel To Use This Command.");
  }

  const playerData = players.get(message.guildId as string);

  if (playerData?.player && playerData?.subscription) {
    if (playerData.queue.length <= 0) {
      return message.reply("No Queue");
    }
    const shuffleArr = (quues: QueueItem[]): QueueItem[] => {
      for (let i = quues.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quues[i], quues[j]] = [quues[j], quues[i]];
      }
      return quues;
    };
    const oneQueue = playerData.queue[0];
    const newQueue = [
      { ...oneQueue },
      ...shuffleArr(playerData.queue.splice(1)),
    ];
    playerData.queue = newQueue;
    const textChannel = message.channel as TextChannel;
    message.reply("Songs Shuffled");
    return await textChannel.send({
      content: "Shuffled ✅",
    });
  } else {
    return message.reply({ content: "No Player Found" });
  }
};
