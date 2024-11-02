import * as ping from "./functions/ping";
import * as setPrefix from "./functions/setPrefix";
import * as connect from "./functions/connect";
import * as demo from "./functions/demo";
import * as play from "./functions/play";
import * as skip from "./functions/skip";
import * as queue from "./functions/queue";
import * as pause from "./functions/pause"
import * as resume from "./functions/resume"
import * as shuffle from "./functions/shuffle"
// import * as stop from "./functions/stop"
const slashCommands = {
  ping: ping,
  "set-prefix": setPrefix,
  connect: connect,
  demo: demo,
  play: play,
  skip: skip,
  queue: queue,
  pause: pause,
  resume: resume,
  shuffle: shuffle
  // stop: stop

};

export default slashCommands;
