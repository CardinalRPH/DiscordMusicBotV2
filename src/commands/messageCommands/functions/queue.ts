import { type Message } from "discord.js";
import { players } from "../../../AudioFunction/queueManager";
import { queueEmbed } from "../../../utils/embedBuilder";

export const data = {
  name: "queue",
  description: "Show Queue on Player",
  shortCut: "q",
};

export const execute = async (message: Message) => {
  const voiceChannel = message.member?.voice.channelId;

  if (!voiceChannel) {
    return message.reply("You Must Be In A Voice Channel To Use This Command.")
  }

  const playerData = players.get(message.guildId as string);

  if (playerData?.player && playerData?.subscription) {
    if (playerData.queue.length <= 0) {
      return message.reply("No Queue")
    }
    return message.reply({
      embeds:[queueEmbed(playerData.queue)]
    })
  } else {
    return message.reply({ content: "No Player Found" });
  }
};
  

