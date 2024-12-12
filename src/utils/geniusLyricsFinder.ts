import axios from "axios";
import * as cheerio from "cheerio";
import dcConfig from "../configs/config";
import type { GeniusApiResponse } from "./geniusLyricsFinderTypes";

const extractLyric = async (url: string) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    let lyrics = $('div[class="lyrics"]').text().trim();
    if (!lyrics) {
      lyrics = "";
      $('div[class^="Lyrics__Container"]').each((i, elem) => {
        const snippetHtml = $(elem).html();
        if (snippetHtml) {
          let snippet = snippetHtml
            .replace(/<br>/g, "\n")
            .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "");
          lyrics += $("<textarea/>").html(snippet).text().trim() + "\n\n";
        }
      });
      if (!lyrics) {
        return null;
      }
      return lyrics.trim();
    }
  } catch (error) {
    throw error;
  }
};

const searchSongLyric = async (q: string) => {
  try {
    const { data } = await axios<GeniusApiResponse>(
      dcConfig.GENIUS_SEARCH_URL,
      {
        params: {
          q: q,
        },
        headers: {
          Authorization: `Bearer ${dcConfig.GENIUS_AUTH}`,
        },
      }
    );
    if (data.response.hits.length <= 0) {
      return null;
    }
    const result = data.response.hits.map((val) => {
      const { full_title, song_art_image_url, id, url } = val.result;
      return { id, title: full_title, albumArt: song_art_image_url, url };
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const getSongLyric = async (q: string) => {
  try {
    const cleanQuery = q
      .replace(
        /\b(official|video|lyrics|music|hd|hq|4k|remastered|remaster)\b/gi,
        ""
      )
      .replace(/[()\[\]]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    const results = await searchSongLyric(cleanQuery);
    if (!results) {
      return null;
    }
    const lyrics = await extractLyric(results[0].url);
    return {
      id: results[0].id,
      title: results[0].title,
      url: results[0].url,
      albumArt: results[0].albumArt,
      lyrics,
    };
  } catch (error) {
    throw error;
  }
};

export default getSongLyric;
