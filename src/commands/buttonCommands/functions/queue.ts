import getDataPaging from "../../../utils/dataPaging";
import { combinedEmbed } from "../../../utils/embedBuilder";
import rowButtonBuilder from "../../../utils/rowButtonBuilder";
import type { ButtonActionHandler } from "../types";

const queueBtn: ButtonActionHandler = async (interaction, playerData) => {
  const btnData: { action: string; toPage: number } = JSON.parse(
    interaction.customId
  );

  const currentSong = playerData.queue[0];
  const { nextPage, optimizeData, prevPage, totalPage, totalRow, currentPage } =
    getDataPaging(playerData.queue, btnData.toPage);

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

  return interaction.deferUpdate();
};

export default queueBtn;
