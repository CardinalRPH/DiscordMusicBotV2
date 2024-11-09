import axios from "axios";
import dcConfig from "../configs/config";
import play from "play-dl";
interface playlistApiResponse {
  items: any[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  kind: string;
  etag: string;
}

interface videoApiResponse {
  kind: string;
  etag: string;
  items: any[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

interface searchApiResponse {
  kind: string;
  etag: string;
  items: any[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

const extractPlaylistId = (url: string) => {
  const playlistIdRegex = /(?:\/playlist\?list=)([a-zA-Z0-9_-]+)/;
  const matches = url.match(playlistIdRegex);
  return matches ? matches[1] : null;
};

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

type playlistType = {
  id: string;
  embedImg: string;
  title: string;
  singer: string;
  singerId: string;
};

export const fetchPlaylist = async (playlistURL: string) => {
  let playlistItem: playlistType[] = [];
  const playlistID = extractPlaylistId(playlistURL);
  let nextPageToken: string | undefined = undefined;
  const mainURL = dcConfig.YOUTUBE_PLAYLIST_API_URL;
  let url = dcConfig.YOUTUBE_PLAYLIST_API_URL;
  do {
    try {
      const res = await axios<playlistApiResponse>({
        method: "GET",
        url: url,
        params: {
          part: "snippet",
          maxResults: "50",
          key: dcConfig.YOUTUBE_API_KEY,
          playlistId: playlistID,
        },
      });
      res.data.items.forEach((value) =>
        playlistItem.push({
          id: value?.snippet.resourceId?.videoId,
          embedImg: value?.snippet.thumbnails.default?.url,
          title: value?.snippet?.title,
          singer: value?.snippet?.videoOwnerChannelTitle,
          singerId: value?.snippet?.videoOwnerChannelId,
        })
      );
      if (res.data.nextPageToken) {
        nextPageToken = res.data.nextPageToken as string;
        url = `${mainURL}?pageToken=${nextPageToken}`;
      } else {
        nextPageToken = undefined;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  } while (nextPageToken);
  return playlistItem;
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
        res.data.items.map((item: any) => ({
          videoId: item.id,
          duration: parseISO8601Duration(item.contentDetails.duration),
          embedImg: item.snippet.thumbnails.default.url,
          title: item.snippet.title,
          singer: item.snippet.channelTitle,
          singerId: item.snippet.channelId,
        }))
      );
      return durations;
    } catch (error) {
      throw error;
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
      const duration: fetchVideoType[] = res.data.items.map((item: any) => ({
        videoId: item.id,
        duration: parseISO8601Duration(item.contentDetails.duration),
        embedImg: item.snippet.thumbnails.default.url,
        title: item.snippet.title,
        singer: item.snippet.channelTitle,
        singerId: item.snippet.channelId,
      }));

      return duration;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
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
    // const res = await axios<searchApiResponse>({
    //   method: "GET",
    //   url: dcConfig.YOUTUBE_SEARCH_API_URL,
    //   params: {
    //     key: dcConfig.YOUTUBE_API_KEY,
    //     q: q,
    //     type: "video",
    //     maxResults: 1,
    //     part: "snippet",
    //   },
    // });
    // return {
    //   id: res.data.items[0].id.videoId,
    //   embedImg: res.data.items[0].snippet.thumbnails.default.url,
    //   title: res.data.items[0].snippet.title,
    //   singer: res.data.items[0].snippet.channelTitle,
    //   singerId: res.data.items[0].snippet.channelId,
    // }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
