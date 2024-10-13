const uriValidator = (s: string, pattern: RegExp): boolean => {
  const isUrl = s.startsWith("http://") || s.startsWith("https://");
  return isUrl && pattern.test(s);
};

export const ytPlaylistPattern =
  /^https?:\/\/www\.youtube\.com\/playlist\?list=[\w-]+$/;
export const ytVideoPattern =
  /^https?:\/\/www\.youtube\.com\/watch\?.*v=[\w-]+/;

export default uriValidator;
