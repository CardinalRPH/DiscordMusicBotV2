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

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
});

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

client.on("interactionCreate", (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  const { commandName } = interaction;
  if (slashCommands[commandName as keyof typeof slashCommands]) {
    slashCommands[commandName as keyof typeof slashCommands].execute(
      interaction
    );
  }
});

client.on("messageCreate", (message) => {
  if (message.author.bot) {
    return;
  }

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
  if (oldState.channelId && !newState.channelId && oldState.member?.user.bot) {
    const playerData = players.get(oldState.guild.id);
    if (playerData) {
      playerData?.player.stop();
      playerData.queue = [];
      playerData.subscription?.unsubscribe()
      await playerData.currentMessage?.delete()
      playerData.currentResource = null
      playerData.currentMessage = null
      playerData.subscription = null
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
