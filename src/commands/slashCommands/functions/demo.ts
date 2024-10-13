import {
  type CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import {
  DiscordGatewayAdapterCreator,
  getVoiceConnection,
  joinVoiceChannel,
} from "@discordjs/voice";
import {
  addToQueue,
  players,
  playNextSong,
} from "../../../AudioFunction/queueManager";
import { musicEmbed } from "../../../utils/embedBuilder";
export const data = new SlashCommandBuilder()
  .setName("demo")
  .setDescription("Play Demo Song To Voice");

export const execute = async (interaction: CommandInteraction) => {
  const member = interaction.member as GuildMember;
  const voiceChannel = member.voice.channel?.id;
  const textChannel = interaction.channel as TextChannel;
  if (!voiceChannel) {
    return interaction.reply({
      content: "You Must Be In A Voice Channel To Use This Command.",
      ephemeral: true,
    });
  }

  const voiceConnection = getVoiceConnection(interaction.guildId as string);
  if (voiceConnection) {
    addToQueue(
      interaction.guildId as string,
      {
        url: "./src/demo/iris.mp3",
        title: "iris",
        singer: "Goo Goo Dolls",
        duration: "00:04:50",
        requestBy: interaction.member
          ? member.user.id
          : "System",
        embedImg:
          "https://i.scdn.co/image/ab67616d0000b273eda9478c39a21e1cdc6609ca",
        singerId: null,
      },
      textChannel
    );
    await playNextSong(interaction.guildId as string);
    return interaction.reply({
      embeds: [
        musicEmbed(
          {
            url: "https://www.youtube.com/watch?v=NdYWuo9OFAw",
            title: "iris",
            singer: "Goo Goo Dolls",
            duration: "00:04:50",
            requestBy: member.user.id,
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
    guildId: interaction.guildId as string,
    adapterCreator: interaction.guild
      ?.voiceAdapterCreator as DiscordGatewayAdapterCreator,
  });

  addToQueue(
    interaction.guildId as string,
    {
      url: "./src/demo/iris.mp3",
      title: "iris",
      singer: "Goo Goo Dolls",
      duration: "00:04:50",
      requestBy: interaction.member
        ? member.user.id
        : "System",
      embedImg:
        "https://i.scdn.co/image/ab67616d0000b273eda9478c39a21e1cdc6609ca",
      singerId: null,
    },
    textChannel
  );

  const playerData = players.get(interaction.guildId as string);
  if (!playerData?.currentResource && playerData?.player) {
    voiceConn.subscribe(playerData?.player);
    await playNextSong(interaction.guildId as string);
  }

  return interaction.reply({
    embeds: [
      musicEmbed(
        {
          url: "https://www.youtube.com/watch?v=NdYWuo9OFAw",
          title: "iris",
          singer: "Goo Goo Dolls",
          duration: "00:04:50",
          requestBy: member.user.id,
          embedImg:
            "https://i.scdn.co/image/ab67616d0000b273eda9478c39a21e1cdc6609ca",
          singerId: null,
        },
        "Demo Music"
      ),
    ],
  });
};
