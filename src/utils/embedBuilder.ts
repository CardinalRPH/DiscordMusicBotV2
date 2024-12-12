import { EmbedBuilder } from "discord.js";
import type { QueueItem } from "../AudioFunction/queueManager";
import dcConfig from "../configs/config";
import { MAX_QUEUE_OUTPUT } from "./constant";

export const musicEmbed = (
  { url, title, singer, duration, embedImg, requestBy, singerId }: QueueItem,
  authorName: string = "Now Playing"
) => {
  const embeder = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(title)
    .setURL(url)
    .setAuthor({
      name: authorName,
      iconURL:
        "https://i.scdn.co/image/ab67616d0000b273eda9478c39a21e1cdc6609ca",
    })
    .setDescription(
      `[${singer}](${dcConfig.YOUTUBE_CHANNEL_BASE_URL}${
        singerId ? singerId : ""
      })\n${duration}\nRequest By:\n<@${requestBy}>`
    )
    .setThumbnail(embedImg);

  return embeder;
};

export const queueEmbed = (
  queue: QueueItem[],
  totalRow: number,
  page: number,
  totalPage: number
) => {
  const convQueue = queue
    .map((value, index) => {
      return `${
        page > 1
          ? index + 1 + (MAX_QUEUE_OUTPUT * page - MAX_QUEUE_OUTPUT)
          : index + 1
      }. ${value.title} : ${value.duration}`;
    })
    .join("\n");
  const embeder = new EmbedBuilder()
    .setColor(0x0099ff)
    .setAuthor({
      name: "Queue",
      iconURL:
        "https://i.scdn.co/image/ab67616d0000b273eda9478c39a21e1cdc6609ca",
    })
    .setDescription(
      `${convQueue} \n Total Queue: ${totalRow}  \n Page: ${page}/${totalPage}`
    );

  return embeder;
};

export const lyricEmbed = (title: string, lyric: string) => {
  const embeder = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(title)
    .setAuthor({
      name: "Queue",
      iconURL:
        "https://i.scdn.co/image/ab67616d0000b273eda9478c39a21e1cdc6609ca",
    })
    .setDescription(lyric);

  return embeder;
};

export const combinedEmbed = (
  { url, title, singer, duration, embedImg, requestBy, singerId }: QueueItem,
  queue: QueueItem[],
  totalRow: number,
  page: number,
  totalPage: number
) => {
  const convQueue = queue
    .map((value, index) => {
      return `${
        page > 1
          ? index + 1 + (MAX_QUEUE_OUTPUT * page - MAX_QUEUE_OUTPUT)
          : index + 1
      }. ${value.title} : ${value.duration}`;
    })
    .join("\n");
  const embeder = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(title)
    .setURL(url)
    .setAuthor({
      name: "Now Playing",
      iconURL:
        "https://i.scdn.co/image/ab67616d0000b273eda9478c39a21e1cdc6609ca",
    })
    .setThumbnail(embedImg)
    .setDescription(
      `[${singer}](${dcConfig.YOUTUBE_CHANNEL_BASE_URL}${
        singerId ? singerId : ""
      })\n${duration}\nRequest By:\n<@${requestBy}> \n
    ===============================
    Queues
    ===============================
    ${convQueue} \n Total Queue: ${totalRow}  \n Page: ${page}/${totalPage}
    `
    );

  return embeder;
};
