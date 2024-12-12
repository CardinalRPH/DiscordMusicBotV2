import type { AudioResource } from "@discordjs/voice";
import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioResource,
  type VoiceConnection,
} from "@discordjs/voice";
import { validateYouTubeUrl } from "../utils/ytResourceFinder";
import ytdl from "@distube/ytdl-core";
// import play from "play-dl";
import { type Message, type TextChannel } from "discord.js";
import { combinedEmbed } from "../utils/embedBuilder";
import getDataPaging from "../utils/dataPaging";
import rowButtonBuilder from "../utils/rowButtonBuilder";

export type QueueItem = {
  url: string;
  title: string;
  singer: string;
  duration: string;
  embedImg: string;
  requestBy: string | null;
  singerId: string | null;
};

type PlayerData = {
  player: AudioPlayer;
  queue: QueueItem[];
  currentResource: AudioResource | null;
  currentMessage: Message<true> | null;
  subscription: ReturnType<VoiceConnection["subscribe"]> | null;
};

export const players = new Map<string, PlayerData>();
// const rawCookie = dcConfig.YOUTUBE_COOKIE;
// const cleanCookie = rawCookie.replace(/\\r\\n/g, "").replace(/\\"/g, '"');
// const parsedCookie = JSON.parse(cleanCookie);
//this use for ytdl
// const rawCookie = dcConfig.YOUTUBE_COOKIE;
// const cleanCookie = rawCookie.replace(/\\r\\n/g, "").replace(/\\"/g, '"');
// const agent = ytdl.createProxyAgent(
//   { uri: "18.139.110.14:8080" },
//   JSON.parse(cleanCookie)
// );
//end

//auth play dl
// play.setToken({
//   youtube: {
//     cookie: cleanCookie,
//   },
// });
export const addToQueue = (
  guildId: string,
  song: QueueItem,
  textChannel: TextChannel
) => {
  const playerData = players.get(guildId);
  if (playerData) {
    playerData.queue.push(song);
    // console.log(`Added ${song.title} to the queue`);
  } else {
    // Create a new player and queue if it doesn't exist
    const newPlayer: PlayerData = {
      player: new AudioPlayer(),
      queue: [song],
      currentResource: null,
      currentMessage: null,
      subscription: null,
    };
    playerEvent(newPlayer, guildId, textChannel);
    players.set(guildId, newPlayer);
    // console.log(`Created new queue and added ${song.title}`);
  }
};

export const playNextSong = async (guildId: string) => {
  const playerData = players.get(guildId);
  try {
    if (playerData && playerData.queue.length > 0) {
      const nextSong = playerData.queue[0]; // Ambil lagu pertama dari queue
      let resource: AudioResource;
      // console.log(nextSong?.url);

      if (validateYouTubeUrl(nextSong?.url as string)) {
        //use for play-dl
        // const stream = await play.stream(nextSong?.url as string, {
        //   discordPlayerCompatibility: true,
        // });

        // resource = createAudioResource(stream.stream, {
        //   inlineVolume: true,
        //   inputType: stream.type,
        // });
        //   use for ytdl
        const stream = ytdl(nextSong?.url as string, {
          filter: "audioonly",
          highWaterMark: 1 << 25,
        });

        resource = createAudioResource(stream, {
          inlineVolume: true,
        });
      } else {
        resource = createAudioResource(nextSong?.url as string); // Path file audio
      }

      playerData.player.play(resource); // Mainkan lagu
      playerData.currentResource = resource;

      // console.log(`Playing next song: ${nextSong!.title}`);
    } else {
      console.log(`No more songs in the queue for guild ${guildId}`);
    }
  } catch (error) {
    console.log("AH shet Error");

    console.error(error);
  }
};

const playerEvent = (
  player: PlayerData,
  guildId: string,
  textChannel: TextChannel
) => {
  player.player.on(AudioPlayerStatus.Playing, async () => {
    const currentSong = player.queue[0];
    // console.log("Music queue is now playing.");
    if (currentSong) {
      const {
        nextPage,
        optimizeData,
        prevPage,
        totalPage,
        totalRow,
        currentPage,
      } = getDataPaging(player.queue, 1);
      return (player.currentMessage = await textChannel.send({
        embeds: [
          combinedEmbed(
            { ...currentSong },
            optimizeData,
            totalRow,
            currentPage,
            totalPage
          ),
        ],
        components: [
          rowButtonBuilder({
            next: { toPage: nextPage, disabled: nextPage ? false : true },
            prev: { toPage: prevPage, disabled: prevPage ? false : true },
            shuffle: { disabled: player.queue.length > 2 ? false : true },
            skip: { disabled: player.queue.length > 1 ? false : true },
          }),
        ],
      }));
      // player.currentMessage = msg as Message<true>;
    }
  });
  player.player.on(AudioPlayerStatus.Idle, async () => {
    // console.log("Music stopped, player is idle.");
    const currentMessage = player?.currentMessage;
    if (currentMessage) {
      try {
        await currentMessage.delete();
        // console.log("Previous message deleted.");
      } catch (err) {
        console.error("Failed to delete message:", err);
      }
    }
    player.queue.shift();
    await playNextSong(guildId);
  });
};
