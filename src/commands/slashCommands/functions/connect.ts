import {
  type CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import {
  DiscordGatewayAdapterCreator,
  getVoiceConnection,
  joinVoiceChannel,
} from "@discordjs/voice";
export const data = new SlashCommandBuilder()
  .setName("connect")
  .setDescription("Connect To A Voice Channel");

export const execute = (interaction: CommandInteraction) => {
  const member = interaction.member as GuildMember;
  const voiceChannel = member.voice.channel?.id;
  if (!voiceChannel) {
    return interaction.reply({
      content: "You Must Be In A Voice Channel To Use This Command.",
      ephemeral: true,
    });
  }

  const voiceConnection = getVoiceConnection(interaction.guildId as string);
  if (voiceConnection) {
    return interaction.reply({
      content: "The Bot Is Already In A Voice Channel.",
      ephemeral: true,
    });
  }
  joinVoiceChannel({
    channelId: voiceChannel,
    guildId: interaction.guildId as string,
    adapterCreator: interaction.guild
      ?.voiceAdapterCreator as DiscordGatewayAdapterCreator,
  });
  return interaction.reply(
    `Joined To Voice Channel ${member.voice.channel.name}`
  );
};
