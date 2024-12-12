import type { GuildMember, Message } from "discord.js";
import { type CommandInteraction, SlashCommandBuilder } from "discord.js";
import { players } from "../../../AudioFunction/queueManager";
import { combinedEmbed } from "../../../utils/embedBuilder";
import getDataPaging from "../../../utils/dataPaging";
import rowButtonBuilder from "../../../utils/rowButtonBuilder";
export const data = new SlashCommandBuilder()
  .setName("queue")
  .setDescription("Show Queue on Player");

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
    if (interaction.isButton()) {
      interaction;
    }
    if (playerData.queue.length <= 0) {
      return interaction.reply("No Queue");
    }
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
    return interaction.reply({ content: "No Player Found" });
  }
};
