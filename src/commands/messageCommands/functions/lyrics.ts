import { getVoiceConnection } from "@discordjs/voice";
import { type Message } from "discord.js";
import { players } from "../../../AudioFunction/queueManager";
import getSongLyric from "../../../utils/geniusLyricsFinder";
import { lyricEmbed } from "../../../utils/embedBuilder";

export const data = {
  name: "lyrics",
  description: "Get Lyrics For Current Song",
  shortCut: "lrc",
};

export const execute = async (message: Message) => {
  const voiceChannel = message.member?.voice.channelId;

  if (!voiceChannel) {
    return message.reply("You Must Be In A Voice Channel To Use This Command.");
  }

  try {
    const playerData = players.get(message.guildId as string);
    const voiceConnection = getVoiceConnection(message.guildId as string);

    if (!voiceConnection) {
      return message.reply({
        content: "Bot Not Connect To The Voice",
      });
    }
    if (playerData?.player && playerData?.subscription) {
      const currentSongTitle = playerData.queue[0].title;
      const lyrics = await getSongLyric(currentSongTitle);
      if (!lyrics || !lyrics.title || !lyrics.lyrics) {
        return message.reply({
          embeds: [lyricEmbed("Unknown", "No Lyrics")],
        });
      }
      return message.reply({
        embeds: [lyricEmbed(lyrics?.title, lyrics.lyrics)],
      });
    } else {
      return message.reply({
        content: "No Player Found",
      });
    }
  } catch (error) {
    message.reply("Something went Wrong");
    console.error(error);
  }
};
