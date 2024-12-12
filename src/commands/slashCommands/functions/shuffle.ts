import type { GuildMember } from "discord.js";
import {
  type CommandInteraction,
  SlashCommandBuilder,
  type TextChannel,
} from "discord.js";
import type { QueueItem } from "../../../AudioFunction/queueManager";
import { players } from "../../../AudioFunction/queueManager";
export const data = new SlashCommandBuilder()
  .setName("shuffle")
  .setDescription("Shuffle Current Queues");

export const execute = async (interaction: CommandInteraction) => {
  const member = interaction.member as GuildMember;
  const voiceChannel = member.voice.channel?.id;
  if (!voiceChannel) {
    return interaction.reply({
      content: "You Must Be In A Voice Channel To Use This Command.",
      ephemeral: true,
    });
  }
  const playerData = players.get(interaction.guildId as string);

  if (playerData?.player && playerData?.subscription) {
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
    const oneQueue = playerData.queue[0];
    const newQueue = [
      { ...oneQueue },
      ...shuffleArr(playerData.queue.splice(1)),
    ];
    playerData.queue = newQueue;
    const textChannel = interaction.channel as TextChannel;
    interaction.reply("Songs Shuffled");
    return await textChannel.send({
      content: "Shuffled ✅",
    });
  } else {
    return interaction.reply({ content: "No Player Found" });
  }
};
