import type { DiscordGatewayAdapterCreator } from "@discordjs/voice";
import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import type { TextChannel } from "discord.js";
import { type Message } from "discord.js";
import {
  addToQueue,
  players,
  playNextSong,
} from "../../../AudioFunction/queueManager";
import { musicEmbed } from "../../../utils/embedBuilder";

export const data = {
  name: "demo",
  description: "Play Demo Song To Voice",
  shortCut: null,
};

export const execute = async (message: Message) => {
  const voiceChannel = message.member?.voice.channelId;
  const textChannel = message.channel as TextChannel;

  if (!voiceChannel) {
    return message.reply("You Must Be In A Voice Channel To Use This Command.");
  }

  const voiceConnection = getVoiceConnection(message.guildId as string);

  if (voiceConnection) {
    addToQueue(
      message.guildId as string,
      {
        url: "./src/demo/iris.mp3",
        title: "iris",
        singer: "Goo Goo Dolls",
        duration: "00:04:50",
        requestBy: message.member.user.id,
        embedImg:
          "https://i.scdn.co/image/ab67616d0000b273eda9478c39a21e1cdc6609ca",
        singerId: null,
      },
      textChannel
    );
    await playNextSong(message.guildId as string);
    return message.reply({
      embeds: [
        musicEmbed(
          {
            url: "https://www.youtube.com/watch?v=NdYWuo9OFAw",
            title: "iris",
            singer: "Goo Goo Dolls",
            duration: "00:04:50",
            requestBy: message.member.user.id,
            embedImg:
              "https://i.scdn.co/image/ab67616d0000b273eda9478c39a21e1cdc6609ca",
            singerId: null,
          },
          "Demo Music"
        ),
      ],
    });
  }

  const voiceConn = joinVoiceChannel({
    channelId: voiceChannel,
    guildId: message.guildId as string,
    adapterCreator: message.guild
      ?.voiceAdapterCreator as DiscordGatewayAdapterCreator,
  });

  addToQueue(
    message.guildId as string,
    {
      url: "./src/demo/iris.mp3",
      title: "iris",
      singer: "Goo Goo Dolls",
      duration: "PT4M50S",
      requestBy: message.member.user.username,
      embedImg:
        "https://i.scdn.co/image/ab67616d0000b273eda9478c39a21e1cdc6609ca",
      singerId: null,
    },
    textChannel
  );

  const playerData = players.get(message.guildId as string);
  if (!playerData?.currentResource && playerData?.player) {
    voiceConn.subscribe(playerData?.player);
    await playNextSong(message.guildId as string);
  }

  return message.reply({
    embeds: [
      musicEmbed(
        {
          url: "https://www.youtube.com/watch?v=NdYWuo9OFAw",
          title: "Iris",
          singer: "Goo Goo Dolls",
          duration: "00:04:50",
          requestBy: message.member.user.id,
          embedImg:
            "https://i.scdn.co/image/ab67616d0000b273eda9478c39a21e1cdc6609ca",
          singerId: null,
        },
        "Demo Music"
      ),
    ],
  });
};
