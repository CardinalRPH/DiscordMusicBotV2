import queueBtn from "./functions/queue";
import shuffleBtn from "./functions/shuffle";
import skipBtn from "./functions/skip";
import { type ButtonActionHandler } from "./types";

const buttonHandlers: Record<string, ButtonActionHandler> = {
  "skip-btn": skipBtn,
  "next-btn": queueBtn,
  "prev-btn": queueBtn,
  "shuffle-btn": shuffleBtn,
};

export default buttonHandlers;
