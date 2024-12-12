type Meta = {
  status: number;
};

type ReleaseDateComponents = {
  year: number;
  month: number;
  day: number;
};

type Stats = {
  unreviewed_annotations: number;
  hot: boolean;
};

type PrimaryArtist = {
  api_path: string;
  header_image_url: string;
  id: number;
  image_url: string;
  is_meme_verified: boolean;
  is_verified: boolean;
  name: string;
  url: string;
};

type Result = {
  annotation_count: number;
  api_path: string;
  artist_names: string;
  full_title: string;
  header_image_thumbnail_url: string;
  header_image_url: string;
  id: number;
  lyrics_owner_id: number;
  lyrics_state: string;
  path: string;
  primary_artist_names: string;
  pyongs_count: number | null;
  relationships_index_url: string;
  release_date_components: ReleaseDateComponents;
  release_date_for_display: string;
  release_date_with_abbreviated_month_for_display: string;
  song_art_image_thumbnail_url: string;
  song_art_image_url: string;
  stats: Stats;
  title: string;
  title_with_featured: string;
  url: string;
  featured_artists: PrimaryArtist[];
  primary_artist: PrimaryArtist;
  primary_artists: PrimaryArtist[];
};

type Hit = {
  highlights: any[];
  index: string;
  type: string;
  result: Result;
};

type Response = {
  hits: Hit[];
};

export type GeniusApiResponse = {
  meta: Meta;
  response: Response;
};
