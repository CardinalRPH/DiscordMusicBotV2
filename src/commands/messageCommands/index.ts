import { type Message } from "discord.js";
import * as ping from "./functions/ping";
import * as demo from "./functions/demo";
import * as connect from "./functions/connect";
import * as play from "./functions/play";
import * as pause from "./functions/pause";
import * as resume from "./functions/resume";
import * as queue from "./functions/queue";
import * as skip from "./functions/skip";
import * as shuffle from "./functions/shuffle";
import * as lyrics from "./functions/lyrics";
import * as skipTo from "./functions/skipTo";
import * as remove from "./functions/remove";
// import * as stop from "./functions/stop";

const messageCommands = new Map<
  string,
  { execute: (message: Message) => void; shortCut: string | null }
>();

const commands = [
  ping,
  demo,
  connect,
  play,
  pause,
  resume,
  queue,
  skip,
  shuffle,
  lyrics,
  skipTo,
  remove,
  // stop
];
commands.forEach((command) => {
  messageCommands.set(command.data.name, {
    execute: command.execute,
    shortCut: command.data.shortCut,
  });
});

export default messageCommands;
