import { type Message } from "discord.js";
import { players } from "../../../AudioFunction/queueManager";
import { combinedEmbed, queueEmbed } from "../../../utils/embedBuilder";
import getDataPaging from "../../../utils/dataPaging";
import rowButtonBuilder from "../../../utils/rowButtonBuilder";

export const data = {
  name: "queue",
  description: "Show Queue on Player",
  shortCut: "q",
};

export const execute = async (message: Message) => {
  const voiceChannel = message.member?.voice.channelId;

  if (!voiceChannel) {
    return message.reply("You Must Be In A Voice Channel To Use This Command.");
  }

  const playerData = players.get(message.guildId as string);

  if (playerData?.player && playerData?.subscription) {
    if (playerData.queue.length <= 0) {
      return message.reply("No Queue");
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
          }),
        ],
      })) as Message<true>);
    }
    return message.reply({
      embeds: [queueEmbed(optimizeData, totalRow, currentPage, totalPage)],
      components: [
        rowButtonBuilder({
          next: { toPage: nextPage, disabled: nextPage ? false : true },
          prev: { toPage: prevPage, disabled: prevPage ? false : true },
        }),
      ],
    });
  } else {
    return message.reply({ content: "No Player Found" });
  }
};
