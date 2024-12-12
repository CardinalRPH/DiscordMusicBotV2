import type { ButtonActionHandler } from "../types";

const skipBtn: ButtonActionHandler = async (interaction, playerData) => {
  if (playerData.queue.length <= 0) {
    return interaction.reply("No Queue");
  }
  playerData.player.stop(true);
  return interaction.deferUpdate().then(() => {});
};

export default skipBtn;
