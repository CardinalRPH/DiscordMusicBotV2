import * as ping from "./functions/ping";
import * as setPrefix from "./functions/setPrefix";
import * as connect from "./functions/connect";
import * as demo from "./functions/demo";
import * as play from "./functions/play";
const slashCommands = {
  ping: ping,
  "set-prefix": setPrefix,
  connect: connect,
  demo: demo,
  play: play,
};

export default slashCommands;
