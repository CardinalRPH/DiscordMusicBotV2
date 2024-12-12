import { type Message } from "discord.js";
import { players } from "../../../AudioFunction/queueManager";

export const data = {
  name: "stop",
  description: "Stop Current Song",
  shortCut: null,
};

export const execute = (message: Message) => {
  const voiceChannel = message.member?.voice.channelId;
  if (!voiceChannel) {
    return message.reply({
      content: "You Must Be In A Voice Channel To Use This Command.",
    });
  }
  const playerData = players.get(message.guildId as string);

  if (playerData?.player && playerData?.subscription) {
    playerData.player.stop();
    return message.reply({ content: "Song Stop" });
  } else {
    return message.reply({ content: "No Player Found" });
  }
};
