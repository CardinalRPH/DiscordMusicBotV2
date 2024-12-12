import type { QueueItem } from "../../../AudioFunction/queueManager";
import getDataPaging from "../../../utils/dataPaging";
import { combinedEmbed } from "../../../utils/embedBuilder";
import rowButtonBuilder from "../../../utils/rowButtonBuilder";
import type { ButtonActionHandler } from "../types";

const shuffleBtn: ButtonActionHandler = async (interaction, playerData) => {
  if (playerData.queue.length <= 0) {
    return interaction.reply("No Queue");
  }

  const shuffleArr = (quues: QueueItem[]): QueueItem[] => {
    for (let i = quues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [quues[i], quues[j]] = [quues[j], quues[i]];
    }
    return quues;
  };
  const currentSong = playerData.queue[0];
  const newQueue = [
    { ...currentSong },
    ...shuffleArr(playerData.queue.splice(1)),
  ];
  playerData.queue = newQueue;
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

export default shuffleBtn;
