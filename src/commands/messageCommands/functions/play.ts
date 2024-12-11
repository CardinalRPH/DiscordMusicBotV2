import {
  AudioPlayerStatus,
  DiscordGatewayAdapterCreator,
  getVoiceConnection,
  joinVoiceChannel,
} from "@discordjs/voice";
import { TextChannel, type Message } from "discord.js";
import {
  extractVideoId,
  fetchPlaylist,
  fetchSearchVideo,
  fetchVideoDetail,
} from "../../../utils/ytResourceFinder";
import {
  addToQueue,
  players,
  playNextSong,
  QueueItem,
} from "../../../AudioFunction/queueManager";
import dcConfig from "../../../configs/config";
import { yt_validate } from "play-dl";

export const data = {
  name: "play",
  description: "Playing Music",
  shortCut: "p",
};

export const execute = async (message: Message) => {
  const voiceChannel = message.member?.voice.channelId;
  const textChannel = message.channel as TextChannel;
  if (!voiceChannel) {
    return message.reply({
      content: "You Must Be In A Voice Channel To Use This Command.",
    });
  }

  const filterQ = message.content.split(" ").slice(1).join(" ");
  const query = filterQ;

  try {
    // if (uriValidator(query as string, ytPlaylistPattern)) {
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
          requestBy: message.member?.user.id || null,
          singerId: playVal.singerId,
        };
      });

      combined.forEach((value) => {
        addToQueue(message.guildId as string, { ...value }, textChannel);
      });

      const playerData = players.get(message.guildId as string);
      const voiceConnection = getVoiceConnection(message.guildId as string);
      if (voiceConnection && playerData?.player) {
        if (playerData?.player.state.status === AudioPlayerStatus.Playing) {
          return message.reply({
            content: `Added ${combined.length} songs`,
          });
        }
        if (playerData?.player.state.status === AudioPlayerStatus.Idle) {
          await playNextSong(message.guildId as string);
          return message.reply({
            content: `Queue is idle. Added ${combined.length} songs and will play next.`,
          });
        }
      }
      const voiceConn = joinVoiceChannel({
        channelId: voiceChannel,
        guildId: message.guildId as string,
        adapterCreator: message.guild
          ?.voiceAdapterCreator as DiscordGatewayAdapterCreator,
      });

      const playerData2 = players.get(message.guildId as string);
      if (!playerData2?.currentResource && playerData2?.player) {
        playerData2.subscription = voiceConn.subscribe(playerData2?.player);
        await playNextSong(message.guildId as string);
      }
      if (playerData2?.queue[0]) {
        return message.reply({
          content: `Added ${combined.length} Songs`,
        });
      }
      return message.reply("Bad Status Multiple");
    } else if (query.startsWith("https") && yt_validate(query) === "video") {
      //do single track
      const videoId = extractVideoId(query as string);
      if (!videoId) {
        return message.reply("Video Not Found");
      }
      const videosDetail = await fetchVideoDetail([videoId], false);
      if (videosDetail.length <= 0) {
        return message.reply({
          content: `No Queues To Play`,
        });
      }
      addToQueue(
        message.guildId as string,
        {
          ...videosDetail[0],
          url: `${dcConfig.YOUTUBE_VIDEO_BASE_URL}${videosDetail[0].videoId}`,
          requestBy: message.member.user.id || null,
        },
        textChannel
      );
      const playerData = players.get(message.guildId as string);
      const voiceConnection = getVoiceConnection(message.guildId as string);
      if (voiceConnection && playerData?.player) {
        if (playerData?.player.state.status === AudioPlayerStatus.Playing) {
          return message.reply({
            content: `Added 1 songs | ${videosDetail[0].singer} - ${videosDetail[0].title}`,
          });
        }
        if (playerData?.player.state.status === AudioPlayerStatus.Idle) {
          await playNextSong(message.guildId as string);
          return message.reply({
            content: `Queue is idle. Added 1 songs and will play next.`,
          });
        }
      }
      const voiceConn = joinVoiceChannel({
        channelId: voiceChannel,
        guildId: message.guildId as string,
        adapterCreator: message.guild
          ?.voiceAdapterCreator as DiscordGatewayAdapterCreator,
      });

      if (!playerData?.currentResource && playerData?.player) {
        console.log("============================");
        playerData.subscription = voiceConn.subscribe(playerData?.player);
        await playNextSong(message.guildId as string);

        return message.reply({
          content: `Added 1 Song to queue`,
        });
      }

      return message.reply("Bad Status Single");
    } else {
      // do search music
      const searchResult = await fetchSearchVideo(query as string);
      const videosDetail = await fetchVideoDetail([searchResult.id], false);
      addToQueue(
        message.guildId as string,
        {
          ...videosDetail[0],
          url: `${dcConfig.YOUTUBE_VIDEO_BASE_URL}${videosDetail[0].videoId}`,
          requestBy: message.member.user.id || null,
        },
        textChannel
      );
      const playerData = players.get(message.guildId as string);
      const voiceConnection = getVoiceConnection(message.guildId as string);
      if (voiceConnection && playerData?.player) {
        if (playerData?.player.state.status === AudioPlayerStatus.Playing) {
          return message.reply({
            content: `Added 1 songs | ${videosDetail[0].singer} - ${videosDetail[0].title}`,
          });
        }
        if (playerData?.player.state.status === AudioPlayerStatus.Idle) {
          await playNextSong(message.guildId as string);
          return message.reply({
            content: `Queue is idle. Added 1 songs and will play next.`,
          });
        }
      }
      const voiceConn = joinVoiceChannel({
        channelId: voiceChannel,
        guildId: message.guildId as string,
        adapterCreator: message.guild
          ?.voiceAdapterCreator as DiscordGatewayAdapterCreator,
      });

      if (!playerData?.currentResource && playerData?.player) {
        console.log("============================");
        playerData.subscription = voiceConn.subscribe(playerData?.player);
        await playNextSong(message.guildId as string);

        return message.reply({
          content: `Added 1 Song to queue`,
        });
      }

      return message.reply("Bad Status Search Video");
    }
  } catch (error) {
    message.reply("Failed to play audio: " + error);
    console.error("Error streaming audio:", error);
  }
};
