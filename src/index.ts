import { ShardingManager } from "discord.js";
import dcConfig from "./configs/config";

const manager = new ShardingManager("./src/bot.ts", {
  totalShards: "auto",
  token: dcConfig.DISCORD_TOKEN,
  execArgv: ["-r", "ts-node/register"] 
});

manager.on("shardCreate", (shard) => {
  console.log(`[SHARDS]: Launched shard ${shard.id}`);
});

manager.spawn();
