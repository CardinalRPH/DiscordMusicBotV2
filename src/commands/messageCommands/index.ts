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

const messageCommands = new Map<
  string,
  { execute: (message: Message) => void; shortCut: string | null }
>();

const commands = [ping, demo, connect, play, pause, resume, queue, skip, shuffle];
commands.forEach((command) => {
  messageCommands.set(command.data.name, {
    execute: command.execute,
    shortCut: command.data.shortCut,
  });
});

export default messageCommands;
