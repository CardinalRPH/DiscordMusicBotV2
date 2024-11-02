import {
  type CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { players } from "../../../AudioFunction/queueManager";
import { queueEmbed } from "../../../utils/embedBuilder";
export const data = new SlashCommandBuilder()
  .setName("queue")
  .setDescription("Show Queue on Player");

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
      return interaction.reply("No Queue")
    }
    return interaction.reply({
      embeds:[queueEmbed(playerData.queue)]
    })
  } else {
    return interaction.reply({ content: "No Player Found" });
  }
};
