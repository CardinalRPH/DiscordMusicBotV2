import {
  type CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { players } from "../../../AudioFunction/queueManager";
export const data = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skip to the next song");

export const execute = async (interaction: CommandInteraction) => {
  const member = interaction.member as GuildMember;
  const voiceChannel = member.voice.channel?.id;
  if (!voiceChannel) {
    return interaction.reply({
      content: "You Must Be In A Voice Channel To Use This Command.",
      ephemeral: true,
    });
  }
  const playerData = players.get(interaction.guildId as string);

  if (playerData?.player && playerData?.subscription) {
    if (playerData?.queue.length > 0) {
      playerData.player.stop(true);
      return interaction.reply({ content: "Song Skipped" });
    } else {
      return interaction.reply({ content: "No Songs In Queue" });
    }
  } else {
    return interaction.reply({ content: "No Player Found" });
  }
};
