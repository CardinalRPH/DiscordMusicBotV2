import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

type rowButtonType = {
  prev: {
    toPage: number | null;
    disabled: boolean;
  };
  next: {
    toPage: number | null;
    disabled: boolean;
  };
  skip: {
    disabled: boolean;
  };
  shuffle: {
    disabled: boolean;
  };
};

const rowButtonBuilder = (data: rowButtonType) => {
  const rowButton = new ActionRowBuilder<ButtonBuilder>();
  rowButton.addComponents(
    new ButtonBuilder()
      .setLabel("<")
      .setStyle(ButtonStyle.Primary)
      .setCustomId(
        JSON.stringify({ action: "prev-btn", toPage: data.prev.toPage })
      )
      .setDisabled(data.prev.disabled),
    new ButtonBuilder()
      .setLabel(">")
      .setStyle(ButtonStyle.Primary)
      .setCustomId(
        JSON.stringify({ action: "next-btn", toPage: data.next.toPage })
      )
      .setDisabled(data.next.disabled),
    new ButtonBuilder()
      .setLabel("Skip")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("skip-btn")
      .setDisabled(data.skip.disabled),
    new ButtonBuilder()
      .setLabel("Shuffle")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("shuffle-btn")
      .setDisabled(data.shuffle.disabled)
  );
  return rowButton;
};

export default rowButtonBuilder;
