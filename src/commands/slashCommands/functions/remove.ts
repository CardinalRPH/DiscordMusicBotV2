import type { GuildMember } from "discord.js";
import { type CommandInteraction, SlashCommandBuilder } from "discord.js";
import { players } from "../../../AudioFunction/queueManager";
import getDataPaging from "../../../utils/dataPaging";
import { combinedEmbed } from "../../../utils/embedBuilder";
import rowButtonBuilder from "../../../utils/rowButtonBuilder";
export const data = new SlashCommandBuilder()
  .setName("remove")
  .setDescription("Remove Some Song")
  .addNumberOption((option) =>
    option
      .setName("number-music")
      .setDescription("Number of music to remove")
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
      if (query > playerData.queue.length || playerData.queue.length === 1) {
        return interaction.reply({ content: "Cant Skip More Than Queues" });
      }
      if (query === 1) {
        return interaction.reply({
          content: "Cant Skip To Current Song Again",
        });
      }
      const skipedQueue = playerData.queue.splice(query - 1, 1);
      playerData.queue = [firstQueue, ...skipedQueue];
      const {
        nextPage,
        optimizeData,
        prevPage,
        totalPage,
        totalRow,
        currentPage,
      } = getDataPaging(playerData.queue, 1);
      const currentSong = playerData.queue[0];
      await playerData.currentMessage?.edit({
        embeds: [
          combinedEmbed(
            currentSong,
            optimizeData,
            totalRow,
            currentPage,
            totalPage
          ),
        ],
        components: [
          rowButtonBuilder({
            next: { toPage: nextPage, disabled: !nextPage },
            prev: { toPage: prevPage, disabled: !prevPage },
            shuffle: { disabled: playerData.queue.length <= 2 },
            skip: { disabled: playerData.queue.length <= 1 },
          }),
        ],
      });
      return interaction.reply({ content: "Song Skipped" });
    } else {
      return interaction.reply({ content: "No Songs In Queue" });
    }
  } else {
    return interaction.reply({ content: "No Player Found" });
  }
};
