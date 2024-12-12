import getDataPaging from "../../../utils/dataPaging";
import { combinedEmbed } from "../../../utils/embedBuilder";
import rowButtonBuilder from "../../../utils/rowButtonBuilder";
import type { ButtonActionHandler } from "../types";

const queueBtn: ButtonActionHandler = async (interaction, playerData) => {
  try {
    const btnData: { action: string; toPage: number } = JSON.parse(
      interaction.customId
    );

    if (!btnData.action || btnData.toPage == null) {
      throw new Error("Invalid button action or missing toPage.");
    }

    const currentSong = playerData.queue[0];
    const {
      nextPage,
      optimizeData,
      prevPage,
      totalPage,
      totalRow,
      currentPage,
    } = getDataPaging(playerData.queue, btnData.toPage);

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

    return interaction.deferUpdate().then(() => {});
  } catch (error) {
    console.error("Error in queueBtn:", error);
    await interaction.reply({
      content: "Invalid button action format.",
      ephemeral: true,
    });
  }
};

export default queueBtn;
