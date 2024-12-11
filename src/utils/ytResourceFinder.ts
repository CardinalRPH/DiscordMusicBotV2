import axios from "axios";
import dcConfig from "../configs/config";
import play from "play-dl";

interface videoApiResponse {
  kind: string;
  etag: string;
  items: {
    kind: string;
    etag: string;
    id: string;
    snippet: {
      publishedAt: Date;
      channelId: string;
      title: string;
      description: string;
      thumbnails: {
        default: {
          url: string;
          width: number;
          height: number;
        };
        medium: {
          url: string;
          width: number;
          height: number;
        };
        high: {
          url: string;
          width: number;
          height: number;
        };
        standard: {
          url: string;
          width: number;
          height: number;
        };
        maxres: {
          url: string;
          width: number;
          height: number;
        };
      };
      channelTitle: string;
      tags: string[];
      categoryId: string;
      liveBroadcastContent: string;
      localized: {
        title: string;
        description: string;
      };
    };
    contentDetails: {
      duration: string;
      dimension: string;
      definition: string;
      caption: string;
      licensedContent: boolean;
      regionRestriction: {
        blocked?: string[];
        allowed?: string[];
      };
      contentRating: any;

      projection: string;
    };
  }[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export const extractVideoId = (url: string) => {
  const videoIdRegex =
    /(?:\?v=|\/embed\/|\/watch\?v=|\/v\/|youtu.be\/|\/watch\?.*&v=)([a-zA-Z0-9_-]{11})/;
  const matches = url.match(videoIdRegex);
  return matches ? matches[1] : null;
};

export const validateYouTubeUrl = (url: string): boolean => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  return youtubeRegex.test(url);
};

const parseISO8601Duration = (isoDuration: string) => {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = isoDuration.match(regex);
  const hours = parseInt(matches?.[1] || "0", 10);
  const minutes = parseInt(matches?.[2] || "0", 10);
  const seconds = parseInt(matches?.[3] || "0", 10);

  // Menggunakan padStart untuk memastikan format HH:MM:SS
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

export const fetchPlaylist = async (playlistURL: string) => {
  try {
    const playlistInfo = await play.playlist_info(playlistURL, {
      incomplete: true,
    });
    const playlistVideos = await playlistInfo.all_videos();
    const optimizeData = playlistVideos.map((val) => ({
      id: val.id || "Unknown",
      embedImg: val.thumbnails[0].url || "Unknown",
      title: val.title || "Unknown",
      singer: val.channel?.name || "Unknown",
      singerId: val.channel?.id || "Unknown",
    }));
    return optimizeData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw "Video Unavailable Or Deleted E01";
  }
  // return playlistItem;
};
type fetchVideoType = {
  videoId: string;
  duration: string;
  embedImg: string;
  title: string;
  singer: string;
  singerId: string;
};
export const fetchVideoDetail = async (
  videoIds: string[],
  isBatch: boolean
) => {
  if (isBatch) {
    try {
      const batchSize = 50;
      const videoBatches = [];

      for (let i = 0; i < videoIds.length; i += batchSize) {
        videoBatches.push(videoIds.slice(i, i + batchSize));
      }

      const fetchPromise = videoBatches.map((batch) => {
        return axios<videoApiResponse>({
          method: "GET",
          url: dcConfig.YOUTUBE_VIDEO_API_URL,
          params: {
            key: dcConfig.YOUTUBE_API_KEY,
            part: "contentDetails,snippet",
            id: batch.join(","),
          },
        });
      });

      const results = await Promise.all(fetchPromise);

      const durations: fetchVideoType[] = results.flatMap((res) =>
        res.data.items
          .map((item) => ({
            videoId: item.id,
            duration: parseISO8601Duration(item.contentDetails.duration),
            embedImg: item.snippet.thumbnails.default.url,
            title: item.snippet.title,
            singer: item.snippet.channelTitle,
            singerId: item.snippet.channelId,
            isBlocked:
              item.contentDetails.regionRestriction?.blocked &&
              item.contentDetails.regionRestriction.blocked.length > 0
                ? true
                : false,
          }))
          .filter((val) => val.isBlocked === false)
      );
      return durations;
    } catch (error) {
      console.error(error);
      throw "Video Unavailable Or Deleted E02";
    }
  } else {
    try {
      const res = await axios<videoApiResponse>({
        method: "GET",
        url: dcConfig.YOUTUBE_VIDEO_API_URL,
        params: {
          key: dcConfig.YOUTUBE_API_KEY,
          part: "contentDetails,snippet",
          id: videoIds.join(","),
        },
      });
      const duration: fetchVideoType[] = res.data.items
        .map((item: any) => ({
          videoId: item.id,
          duration: parseISO8601Duration(item.contentDetails.duration),
          embedImg: item.snippet.thumbnails.default.url,
          title: item.snippet.title,
          singer: item.snippet.channelTitle,
          singerId: item.snippet.channelId,
          isBlocked:
            item.contentDetails.regionRestriction?.blocked &&
            item.contentDetails.regionRestriction.blocked.length > 0
              ? true
              : false,
        }))
        .filter((val) => val.isBlocked === false);

      return duration;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw "Video Unavailable Or Deleted E03";
    }
  }
};

export const fetchSearchVideo = async (q: string) => {
  try {
    const playSrc = await play.search(q, {
      limit: 1,
    });
    return {
      id: playSrc[0].id as string,
      embedImg: playSrc[0].thumbnails[0].url,
      title: playSrc[0].title,
      singer: playSrc[0].channel?.name,
      singerId: playSrc[0].channel?.id,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw "Video Unavailable Or Deleted E04";
  }
};
