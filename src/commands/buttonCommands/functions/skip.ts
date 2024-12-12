import getDataPaging from "../../../utils/dataPaging";
import { combinedEmbed } from "../../../utils/embedBuilder";
import rowButtonBuilder from "../../../utils/rowButtonBuilder";
import type { ButtonActionHandler } from "../types";

const skipBtn: ButtonActionHandler = async (interaction, playerData) => {
  if (playerData.queue.length <= 0) {
    return interaction.reply("No Queue");
  }

  playerData.player.stop(true);
  const currentSong = playerData.queue[0];
  const { nextPage, optimizeData, prevPage, totalPage, totalRow, currentPage } =
    getDataPaging(playerData.queue, 1);

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

export default skipBtn;
