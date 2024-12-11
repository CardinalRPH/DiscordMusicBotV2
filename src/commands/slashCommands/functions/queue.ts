import {
  type CommandInteraction,
  GuildMember,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import { players } from "../../../AudioFunction/queueManager";
import { combinedEmbed, queueEmbed } from "../../../utils/embedBuilder";
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
          }),
        ],
      })) as unknown as Message<true>);
    }
    return interaction.reply({
      embeds: [queueEmbed(optimizeData, totalRow, 1, totalPage)],
      components: [
        rowButtonBuilder({
          next: { toPage: nextPage, disabled: nextPage ? false : true },
          prev: { toPage: prevPage, disabled: prevPage ? false : true },
        }),
      ],
    });
  } else {
    return interaction.reply({ content: "No Player Found" });
  }
};
