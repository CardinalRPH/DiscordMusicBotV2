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
        return message.reply("Cant Remove More Than Queues");
      }
      if (query === 1) {
        return message.reply({
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
      return (playerData.currentMessage = (await message.reply({
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
      })) as Message<true>);
    } else {
      return message.reply({ content: "No Songs In Queue" });
    }
  } else {
    return message.reply({ content: "No Player Found" });
  }
};
