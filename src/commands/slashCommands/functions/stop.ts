import {
    type CommandInteraction,
    GuildMember,
    SlashCommandBuilder,
  } from "discord.js";
  import { players } from "../../../AudioFunction/queueManager";
  export const data = new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop Current Song");
  
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
        playerData.player.stop()
        return interaction.reply({ content: "Song Stop"});
    } else {
      return interaction.reply({ content: "No Player Found" });
    }
  };
  