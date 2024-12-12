export type videoApiResponse = {
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
};

export type fetchVideoType = {
  videoId: string;
  duration: string;
  embedImg: string;
  title: string;
  singer: string;
  singerId: string;
};
