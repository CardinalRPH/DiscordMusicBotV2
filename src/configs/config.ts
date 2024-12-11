import { config } from "dotenv";

config();

const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

const dcConfig = {
  DISCORD_TOKEN: getEnvVar("DISCORD_TOKEN"),
  DISCORD_CLIENT_ID: getEnvVar("DISCORD_CLIENT_ID"),
  YOUTUBE_API_KEY: getEnvVar("YOUTUBE_API_KEY"),
  YOUTUBE_PLAYLIST_API_URL: getEnvVar("YOUTUBE_PLAYLIST_API_URL"),
  YOUTUBE_VIDEO_API_URL: getEnvVar("YOUTUBE_VIDEO_API_URL"),
  YOUTUBE_VIDEO_BASE_URL: getEnvVar("YOUTUBE_VIDEO_BASE_URL"),
  BASE_BOT_NAME: getEnvVar("BASE_BOT_NAME"),
  YOUTUBE_CHANNEL_BASE_URL: getEnvVar("YOUTUBE_CHANNEL_BASE_URL"),
  YOUTUBE_SEARCH_API_URL: getEnvVar("YOUTUBE_SEARCH_API_URL"),
  GENIUS_SEARCH_URL: getEnvVar("GENIUS_SEARCH_URL"),
  GENIUS_AUTH: getEnvVar("GENIUS_AUTH"),
  YOUTUBE_COOKIE: getEnvVar("YOUTUBE_COOKIE"),
  YOUTUBE_USER_AGENT: getEnvVar("YOUTUBE_USER_AGENT"),
};

export default dcConfig;
