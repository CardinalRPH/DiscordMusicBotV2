import { ShardingManager } from "discord.js";
import dcConfig from "./configs/config";

const manager = new ShardingManager("./src/bot.ts", {
  totalShards: "auto",
  token: dcConfig.DISCORD_TOKEN,
  execArgv: ["-r", "ts-node/register"],
  respawn: true
});

manager.on("shardCreate", (shard) => {
  shard.on("reconnecting", () => {
    console.log(`[INFO]: Reconnecting shard [${shard.id}]`);
  });
  shard.on("spawn", () => {
    console.log(`[INFO]: Spawned shard [${shard.id}]`);
  });
  shard.on("ready", () => {
    console.log(`[INFO]: Shard [${shard.id}] is ready!`);
  });
  shard.on("death", () => {
    console.log(`[INFO]: Shard [${shard.id}] died`);
  });
  shard.on("error", (err) => {
    console.log(`[INFO]: Error in [${shard.id}]\n[ERR]: ${err}`);
    shard.respawn();
  });
});

manager.spawn({ amount: 'auto', delay: 15500, timeout: 120000 }).catch(e => console.log(e))
