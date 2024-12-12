import type { ButtonInteraction, InteractionResponse } from "discord.js";

export type ButtonActionHandler = (
  interaction: ButtonInteraction,
  playerData: any
) => Promise<InteractionResponse<boolean>>;
