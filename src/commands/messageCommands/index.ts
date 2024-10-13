import { type Message } from "discord.js";
import * as ping from "./functions/ping";
import * as demo from "./functions/demo";
import * as connect from "./functions/connect";
import * as play from "./functions/play";

const messageCommands = new Map<
  string,
  { execute: (message: Message) => void; shortCut: string | null }
>();

messageCommands.set(ping.data.name, {
  execute: ping.execute,
  shortCut: ping.data.shortCut,
});
messageCommands.set(demo.data.name, {
  execute: demo.execute,
  shortCut: demo.data.shortCut,
});
messageCommands.set(connect.data.name, {
  execute: connect.execute,
  shortCut: connect.data.shortCut,
});
messageCommands.set(play.data.name, {
  execute: play.execute,
  shortCut: play.data.shortCut,
});
export default messageCommands;
