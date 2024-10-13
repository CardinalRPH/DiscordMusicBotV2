import { EmbedBuilder } from "discord.js";
import { QueueItem } from "../AudioFunction/queueManager";
import dcConfig from "../configs/config";

export const musicEmbed = ({
  url,
  title,
  singer,
  duration,
  embedImg,
  requestBy,
  singerId,
}: QueueItem, authorName: string = "Now Playing") => {
  
  const embeder = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(title)
    .setURL(url)
    .setAuthor({
      name: authorName,
      iconURL:
        "https://i.scdn.co/image/ab67616d0000b273eda9478c39a21e1cdc6609ca",
    })
  .setDescription(`[${singer}](${dcConfig.YOUTUBE_CHANNEL_BASE_URL}${singerId?singerId:""})\n${duration}\nRequest By:\n<@${requestBy}>`)
    .setThumbnail(embedImg);

  return embeder;
};
