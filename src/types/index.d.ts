import type {
  IndexResponse,
  SearchResponse,
  SearchRequest,
} from '@elastic/elasticsearch/api/types';
import type { AlertColor } from '@mui/material';

export type ReadabilityArticle = {
  /** article title */
  title: string;
  /** author metadata */
  byline: string;
  /** content direction */
  dir: string;
  /** HTML of processed article content */
  content: T;
  /** text content of the article (all HTML removed) */
  textContent: string;
  /** length of an article, in characters */
  length: number;
  /** article description, or short excerpt from the content */
  excerpt: string;
  siteName: string;
} | null;

export type Bookmark = {
  url: string;
  site: string;
  title: string;
  excerpt: string;
  content: string;
  html: string;
  bookmarkedAt: string; // ISOString
  note?: string;
  tags?: string[];
  stars?: number;
  isReadLater?: boolean;
  screenshot?: string;
  ogImage?: string;
};

export type BookmarkResponse = {
  url: string;
  site: string;
  language: string;
  title: string;
  excerpt: string;
  content?: string;
  html?: string;
  note: string;
  tags: string[];
  stars: number;
  isReadLater: boolean;
  screenshot: string;
  ogImage: string;
  bookmarkedAt: string; // ISOString
  indexedAt: string;
};

export type BookmarkResponseDoc = {
  id: string;
  index: string;
  bookmarkResponse: BookmarkResponse;
};

export type BookmarkIndexResponse = IndexResponse & {
  url?: string;
  bookmarkedAt?: string;
  stars?: number;
};

export type BookmarkSearchResponse = SearchResponse<BookmarkResponse>;

export type ExportBookmarkResponse = SearchResponse<
  Pick<BookmarkResponse, 'title' | 'url'>
>;

export type URLSearchRequest = {
  url: string;
} & SearchRequest;

export type ListViewType = 'headline' | 'column' | 'simple' | 'imageHeadline';

export type BrowserBookmarksType = {
  checked?: boolean;
} & browser.Bookmarks.BookmarkTreeNode;

export type ImportResult = {
  url: string;
  status: AlertColor;
  message: string;
};

export type UrlAndTitle = {
  url: string;
  title: string;
};

export type ElasticSearchDoc =
  | {
      id: string;
      index: string;
      bookmarkedAt: string;
      stars?: number;
      isReadLater?: boolean;
    }
  | undefined;

export type EmbeddableType = {
  isEmbeddable: boolean;
  provider?: 'youtube';
  identifier?: string;
};

export type SearchMode = {
  keywords?: string;
  isReadLater?: boolean;
  stars?: number;
  sites?: string[];
};

export type Lang = 'ja' | 'en' | 'de' | 'ko' | 'zh' | 'unknown';

export type Index = {
  lang: Lang;
  analyzerName: string;
  aliasName: string;
};

export type Config = {
  version: string;
};
