import { Client, IntentsBitField } from "discord.js";
import slashCommands from "./commands/slashCommands";
import dcConfig from "./configs/config";
import deployCommands from "./commands/slashCommands/deployCommands";
import messageCommands from "./commands/messageCommands";
import {
  createGuild,
  deleteGuild,
  getAllID,
  getPrefix,
} from "./data/CRUDFunction";
import defaultPrefix from "./global/prefix";
import { players } from "./AudioFunction/queueManager";
import deployBtnCommands from "./commands/buttonCommands/deployBtnCommands";
import { getVoiceConnection } from "@discordjs/voice";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
});

const disconnectTimers = new Map<string, NodeJS.Timeout>();

client.once("ready", async () => {
  const guildId = getAllID();
  guildId.forEach(async (value) => {
    await deployCommands({ guildId: value });
  });
  console.log(`[DEBUG] Discord Bot is ready!`);
});

client.on("guildCreate", async (guild) => {
  createGuild(guild.id, defaultPrefix);
  await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    await deployBtnCommands(interaction);
  }

  if (interaction.isCommand()) {
    const { commandName } = interaction;
    if (slashCommands[commandName as keyof typeof slashCommands]) {
      slashCommands[commandName as keyof typeof slashCommands].execute(
        interaction
      );
    }
  }
});

client.on("messageCreate", (message) => {
  if (message.author.bot) {
    return;
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [commandInput, ...args] = message.content.slice(1).split(" ");
  const prefix = getPrefix(message.guild?.id);
  if (!prefix) {
    return;
  }
  if (!message.content.startsWith(prefix)) {
    return;
  }
  let command = Array.from(messageCommands.values()).find(
    (cmd) => cmd.shortCut === commandInput.toLowerCase()
  );
  if (!command) {
    const messageIndex = Array.from(messageCommands.keys()).findIndex(
      (val) => commandInput == val
    );
    if (messageIndex !== -1) {
      command = Array.from(messageCommands.values())[messageIndex];
    }
  }
  if (command) {
    command.execute(message);
  }
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  const guildId = oldState.guild.id;
  if (oldState.channelId && !newState.channelId && oldState.member?.user.bot) {
    const playerData = players.get(guildId);
    if (playerData) {
      playerData?.player.stop();
      playerData.queue = [];
      playerData.subscription?.unsubscribe();
      await playerData.currentMessage?.delete();
      playerData.currentResource = null;
      playerData.currentMessage = null;
      playerData.subscription = null;
    }
    return;
  }
  const voiceChannel = oldState.channel || newState.channel;
  if (voiceChannel?.members.filter((member) => !member.user.bot).size === 0) {
    if (!disconnectTimers.has(guildId)) {
      const timer = setTimeout(async () => {
        const playerData = players.get(guildId);
        if (playerData) {
          const voiceConnection = getVoiceConnection(guildId);
          playerData.player.stop();
          playerData.queue = [];
          playerData.subscription?.unsubscribe();
          await playerData.currentMessage?.delete();
          playerData.currentResource = null;
          playerData.currentMessage = null;
          playerData.subscription = null;
          if (voiceConnection) {
            voiceConnection.destroy();
          }
        }
        disconnectTimers.delete(guildId);
      }, 60000);

      disconnectTimers.set(guildId, timer);
    }
  } else {
    const timer = disconnectTimers.get(guildId);
    if (timer) {
      clearTimeout(timer);
      disconnectTimers.delete(guildId);
    }
  }
});

client.on("guildDelete", (guild) => {
  try {
    deleteGuild(guild.id);
  } catch (error) {
    console.error(error);
  }
});

client.login(dcConfig.DISCORD_TOKEN);
