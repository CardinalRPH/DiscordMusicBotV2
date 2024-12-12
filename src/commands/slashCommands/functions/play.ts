import type { GuildMember, TextChannel } from "discord.js";
import { type CommandInteraction, SlashCommandBuilder } from "discord.js";
import {
  extractVideoId,
  fetchPlaylist,
  fetchSearchVideo,
  fetchVideoDetail,
} from "../../../utils/ytResourceFinder";
import type { QueueItem } from "../../../AudioFunction/queueManager";
import {
  addToQueue,
  players,
  playNextSong,
} from "../../../AudioFunction/queueManager";
import dcConfig from "../../../configs/config";
import type { DiscordGatewayAdapterCreator } from "@discordjs/voice";
import {
  AudioPlayerStatus,
  getVoiceConnection,
  joinVoiceChannel,
} from "@discordjs/voice";
import { yt_validate } from "play-dl";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Play Music")
  .addStringOption((option) =>
    option
      .setName("query-music")
      .setDescription(
        "Input Video Or Playlist Youtube URL | Search Youtube Video"
      )
      .setRequired(true)
  );

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

  const query = interaction.options.get("query-music")?.value as string;

  try {
    if (query.startsWith("https") && yt_validate(query) === "playlist") {
      const playlistList = await fetchPlaylist(query as string);
      const videosDetail = await fetchVideoDetail(
        playlistList.map((val) => val.id),
        true
      );
      const combined: QueueItem[] = playlistList.map((playVal) => {
        const matchItem = videosDetail.find(
          (matchVal) => matchVal.videoId === playVal.id
        );
        return {
          url: `${dcConfig.YOUTUBE_VIDEO_BASE_URL}${playVal.id}`,
          singer: playVal.singer,
          title: playVal.title,
          duration: matchItem?.duration || "00:00:00",
          embedImg: playVal.embedImg,
          requestBy: interaction.member?.user.id || null,
          singerId: playVal.singerId,
        };
      });

      combined.forEach((value) => {
        addToQueue(interaction.guildId as string, { ...value }, textChannel);
      });

      const playerData = players.get(interaction.guildId as string);
      const voiceConnection = getVoiceConnection(interaction.guildId as string);
      if (voiceConnection && playerData?.player) {
        if (playerData?.player.state.status === AudioPlayerStatus.Playing) {
          return interaction.reply({
            content: `Added ${combined.length} songs`,
          });
        }
        if (playerData?.player.state.status === AudioPlayerStatus.Idle) {
          await playNextSong(interaction.guildId as string);
          return interaction.reply({
            content: `Queue is idle. Added ${combined.length} songs and will play next.`,
          });
        }
      }
      const voiceConn = joinVoiceChannel({
        channelId: voiceChannel,
        guildId: interaction.guildId as string,
        adapterCreator: interaction.guild
          ?.voiceAdapterCreator as DiscordGatewayAdapterCreator,
      });

      const playerData2 = players.get(interaction.guildId as string);
      if (!playerData2?.currentResource && playerData2?.player) {
        voiceConn.subscribe(playerData2?.player);
        await playNextSong(interaction.guildId as string);
      }
      if (playerData2?.queue[0]) {
        return interaction.reply({
          content: `Added ${combined.length} Songs`,
        });
      }
      return interaction.reply("Bad Status Multiple");
    } else if (query.startsWith("https") && yt_validate(query) === "playlist") {
      //do single track
      const videoId = extractVideoId(query as string);
      if (!videoId) {
        return interaction.reply("Video Not Found");
      }
      const videosDetail = await fetchVideoDetail([videoId], false);
      if (videosDetail.length <= 0) {
        return interaction.reply({
          content: `No Queues To Play`,
        });
      }
      addToQueue(
        interaction.guildId as string,
        {
          ...videosDetail[0],
          url: `${dcConfig.YOUTUBE_VIDEO_BASE_URL}${videosDetail[0].videoId}`,
          requestBy: interaction.user.id || null,
        },
        textChannel
      );
      const playerData = players.get(interaction.guildId as string);
      const voiceConnection = getVoiceConnection(interaction.guildId as string);
      if (voiceConnection && playerData?.player) {
        if (playerData?.player.state.status === AudioPlayerStatus.Playing) {
          return interaction.reply({
            content: `Added 1 songs | ${videosDetail[0].singer} - ${videosDetail[0].title}`,
          });
        }
        if (playerData?.player.state.status === AudioPlayerStatus.Idle) {
          await playNextSong(interaction.guildId as string);
          return interaction.reply({
            content: `Queue is idle. Added 1 songs and will play next.`,
          });
        }
      }
      const voiceConn = joinVoiceChannel({
        channelId: voiceChannel,
        guildId: interaction.guildId as string,
        adapterCreator: interaction.guild
          ?.voiceAdapterCreator as DiscordGatewayAdapterCreator,
      });

      if (!playerData?.currentResource && playerData?.player) {
        // console.log("============================");
        playerData.subscription = voiceConn.subscribe(playerData?.player);
        await playNextSong(interaction.guildId as string);

        return interaction.reply({
          content: `Added 1 Song to queue`,
        });
      }

      return interaction.reply("Bad Status Single");
    } else {
      // do search music
      const searchResult = await fetchSearchVideo(query as string);
      const videosDetail = await fetchVideoDetail([searchResult.id], false);
      addToQueue(
        interaction.guildId as string,
        {
          ...videosDetail[0],
          url: `${dcConfig.YOUTUBE_VIDEO_BASE_URL}${videosDetail[0].videoId}`,
          requestBy: interaction.user.id || null,
        },
        textChannel
      );
      const playerData = players.get(interaction.guildId as string);
      const voiceConnection = getVoiceConnection(interaction.guildId as string);
      if (voiceConnection && playerData?.player) {
        if (playerData?.player.state.status === AudioPlayerStatus.Playing) {
          return interaction.reply({
            content: `Added 1 songs | ${videosDetail[0].singer} - ${videosDetail[0].title}`,
          });
        }
        if (playerData?.player.state.status === AudioPlayerStatus.Idle) {
          await playNextSong(interaction.guildId as string);
          return interaction.reply({
            content: `Queue is idle. Added 1 songs and will play next.`,
          });
        }
      }
      const voiceConn = joinVoiceChannel({
        channelId: voiceChannel,
        guildId: interaction.guildId as string,
        adapterCreator: interaction.guild
          ?.voiceAdapterCreator as DiscordGatewayAdapterCreator,
      });

      if (!playerData?.currentResource && playerData?.player) {
        // console.log("============================");
        playerData.subscription = voiceConn.subscribe(playerData?.player);
        await playNextSong(interaction.guildId as string);

        return interaction.reply({
          content: `Added 1 Song to queue`,
        });
      }

      return interaction.reply("Bad Status Search Video");
    }
  } catch (error) {
    interaction.reply("Something went Wrong");
    console.error(error);
  }
};
