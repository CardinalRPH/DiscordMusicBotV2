import type { DiscordGatewayAdapterCreator } from "@discordjs/voice";
import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import { type Message } from "discord.js";

export const data = {
  name: "connect",
  description: "Connect To A Voice Channel",
  shortCut: null,
};

export const execute = (message: Message) => {
  const voiceChannel = message.member?.voice.channelId;

  if (!voiceChannel) {
    return message.reply("You Must Be In A Voice Channel To Use This Command.");
  }

  const voiceConnection = getVoiceConnection(message.guildId as string);
  if (voiceConnection) {
    return message.reply("The Bot Is Already In A Voice Channel.");
  }

  joinVoiceChannel({
    channelId: voiceChannel,
    guildId: message.guildId as string,
    adapterCreator: message.guild
      ?.voiceAdapterCreator as DiscordGatewayAdapterCreator,
  });

  return message.reply(
    `Joined To Voice Channel ${message.member.voice.channel?.name}`
  );
};
