import { type Message } from "discord.js";
import { players } from "../../../AudioFunction/queueManager";
import getDataPaging from "../../../utils/dataPaging";
import { combinedEmbed } from "../../../utils/embedBuilder";
import rowButtonBuilder from "../../../utils/rowButtonBuilder";

export const data = {
  name: "remove",
  description: "Remove Some Song",
  shortCut: "rm",
};

export const execute = async (message: Message) => {
  const voiceChannel = message.member?.voice.channelId;

  if (!voiceChannel) {
    return message.reply("You Must Be In A Voice Channel To Use This Command.");
  }

  const playerData = players.get(message.guildId as string);
  const filterQ = message.content.split(" ").slice(1).join(" ");
  const query = parseInt(filterQ);

  if (isNaN(query)) {
    return message.reply("Input is Not a Number");
  }

  if (playerData?.player && playerData?.subscription) {
    if (playerData?.queue.length > 0) {
      const firstQueue = playerData.queue[0];
      if (query > playerData.queue.length || playerData.queue.length === 1) {
        return message.reply("Cant Skip More Than Queues");
      }
      if (query === 1) {
        return message.reply({
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
    } else {
      return message.reply({ content: "No Songs In Queue" });
    }
  } else {
    return message.reply({ content: "No Player Found" });
  }
};
