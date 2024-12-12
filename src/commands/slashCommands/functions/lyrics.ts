import type { CommandInteraction, GuildMember } from "discord.js";
import { SlashCommandBuilder } from "discord.js";
import { players } from "../../../AudioFunction/queueManager";
import { getVoiceConnection } from "@discordjs/voice";
import getSongLyric from "../../../utils/geniusLyricsFinder";
import { lyricEmbed } from "../../../utils/embedBuilder";

export const data = new SlashCommandBuilder()
  .setName("lyric")
  .setDescription("Get Lyrics For Current Song");

export const execute = async (interaction: CommandInteraction) => {
  const member = interaction.member as GuildMember;
  const voiceChannel = member.voice.channel?.id;

  if (!voiceChannel) {
    return interaction.reply({
      content: "You Must Be In A Voice Channel To Use This Command.",
      ephemeral: true,
    });
  }

  try {
    const playerData = players.get(interaction.guildId as string);
    const voiceConnection = getVoiceConnection(interaction.guildId as string);

    if (!voiceConnection) {
      return interaction.reply({
        content: "Bot Not Connect To The Voice",
      });
    }

    if (playerData?.player && playerData?.subscription) {
      const currentSongTitle = playerData.queue[0].title;
      const lyrics = await getSongLyric(currentSongTitle);
      if (!lyrics || !lyrics.title || !lyrics.lyrics) {
        return interaction.reply({
          embeds: [lyricEmbed("Unknown", "No Lyrics")],
        });
      }
      return interaction.reply({
        embeds: [lyricEmbed(lyrics?.title, lyrics.lyrics)],
      });
    } else {
      return interaction.reply({ content: "No Player Found" });
    }
  } catch (error) {
    interaction.reply("Something went Wrong");
    console.error(error);
  }
};
