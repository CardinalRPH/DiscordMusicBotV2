import { REST, Routes } from "discord.js";
import slashCommands from ".";
import dcConfig from "../../configs/config";

const commandData = Object.values(slashCommands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(dcConfig.DISCORD_TOKEN);

type DeployCommandProps = {
  guildId: string;
};

const deployCommands = async ({ guildId }: DeployCommandProps) => {
  try {
    console.log("[DEBUG] Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(dcConfig.DISCORD_CLIENT_ID, guildId),
      {
        body: commandData,
      }
    );
    console.log("[DEBUG] Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};

export default deployCommands;
