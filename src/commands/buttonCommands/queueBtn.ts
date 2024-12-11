import { ButtonInteraction, GuildMember } from "discord.js";
import { players } from "../../AudioFunction/queueManager";
import getDataPaging from "../../utils/dataPaging";
import { combinedEmbed } from "../../utils/embedBuilder";
import rowButtonBuilder from "../../utils/rowButtonBuilder";

type QueueBtnType = {
  action: "prev-btn" | "next-btn";
  toPage: number;
};

const queueBtnExecute = async (interaction: ButtonInteraction) => {
  const member = interaction.member as GuildMember;
  const voiceChannel = member.voice.channel?.id;
  if (!voiceChannel) {
    return interaction.reply({
      content: "You Must Be In A Voice Channel To Use This Command.",
      ephemeral: true,
    });
  }
  const playerData = players.get(interaction.guildId as string);

  try {
    if (playerData?.player && playerData?.subscription) {
      if (playerData.queue.length <= 0) {
        return interaction.reply("No Queue");
      }
      const btnData: QueueBtnType = JSON.parse(interaction.customId);
      const currentSong = playerData.queue[0];

      if (btnData.action === "next-btn") {
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
        });
        return await interaction.deferUpdate();
      }
      if (btnData.action === "prev-btn") {
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
        });
        return await interaction.deferUpdate();
      }
      return await interaction.reply({
        content: "No Interaction",
      });
    } else {
      return await interaction.reply({ content: "No Player Found" });
    }
  } catch (error) {
    console.error(error);
    return await interaction.reply({
      content: "Queue Button Error",
    });
  }
};

export default queueBtnExecute;
