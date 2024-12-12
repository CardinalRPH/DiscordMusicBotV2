import type { GuildMember, Message } from "discord.js";
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
        return interaction.reply({ content: "Cant Remove More Than Queues" });
      }
      if (query === 1) {
        return interaction.reply({
          content: "Cant Remove To Current Song",
        });
      }
      playerData.queue.splice(query - 1, 1);
      const removedQueue = playerData.queue.slice(1);
      playerData.queue = [firstQueue, ...removedQueue];
      const {
        nextPage,
        optimizeData,
        prevPage,
        totalPage,
        totalRow,
        currentPage,
      } = getDataPaging(playerData.queue, 1);
      const currentSong = playerData.queue[0];
      if (playerData.currentMessage) {
        await playerData.currentMessage.delete();
      }
      return (playerData.currentMessage = (await interaction.reply({
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
            shuffle: { disabled: playerData.queue.length > 2 ? false : true },
            skip: { disabled: playerData.queue.length > 1 ? false : true },
          }),
        ],
      })) as unknown as Message<true>);
    } else {
      return interaction.reply({ content: "No Songs In Queue" });
    }
  } else {
    return interaction.reply({ content: "No Player Found" });
  }
};
