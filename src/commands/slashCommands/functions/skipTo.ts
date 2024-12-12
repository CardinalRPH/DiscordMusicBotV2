import type { GuildMember } from "discord.js";
import { type CommandInteraction, SlashCommandBuilder } from "discord.js";
import { players } from "../../../AudioFunction/queueManager";
export const data = new SlashCommandBuilder()
  .setName("skip-to")
  .setDescription("Skip to number song")
  .addNumberOption((option) =>
    option
      .setName("number-music")
      .setDescription("Number of music to skip")
      .setRequired(true)
  );

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
  const query = interaction.options.get("number-music")?.value as number;

  if (playerData?.player && playerData?.subscription) {
    if (playerData?.queue.length > 0) {
      const firstQueue = playerData.queue[0];
      if (query > playerData.queue.length) {
        return interaction.reply({ content: "Cant Skip More Than Queues" });
      }
      const skipedQueue = playerData.queue.slice(query - 1);
      playerData.queue = [firstQueue, ...skipedQueue];
      playerData.player.stop(true);
      return interaction.reply({ content: "Song Skipped" });
    } else {
      return interaction.reply({ content: "No Songs In Queue" });
    }
  } else {
    return interaction.reply({ content: "No Player Found" });
  }
};
