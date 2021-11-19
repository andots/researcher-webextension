import type { Index } from 'src/types';

export const APP_NAME = 'RE:SEARCHER';

// ! Theme Variables
export const NAVBAR_HEIGHT = '70px';
export const LEFT_DRAWER_WIDTH = '200px';
export const LEFT_DRAWER_SECONDARY_WIDTH = '74px';
export const APP_BORDER_RADIUS = '2px';

// ! Custom breakpoints
// https://mui.com/customization/breakpoints/
export const BREAKPOINT_X_SMALL = 0;
export const BREAKPOINT_SMALL = 600;
export const BREAKPOINT_MEDIUM = 900;
export const BREAKPOINT_LARGE = 1200;
export const BREAKPOINT_X_LARGE = 1536;
// export const BREAKPOINT_MEDIUM = 768;
// export const BREAKPOINT_LARGE = 1080;
// export const BREAKPOINT_X_LARGE = 1600;

// ! Message key
export const GET_READABILITY_ARTICLE = 'get_readability_article';

// ! Route
export const ROUTE_HOME = '/';
export const ROUTE_SETTINGS = '/settings';
export const ROUTE_SEARCH = '/search';
export const ROUTE_IMPORT = '/import';

// ! ElasticSearch
export const ELASTICSEARCH_VERSION = '7.10.1';
export const INDEX_NAME = 'researcher';
export const RESEARCHER_PIPELINE_NAME = 'researcher_pipeline';
export const CONFIG_INDEX_NAME = 'd_researcher_config';
export const CURRENT_VERSION = 'v4';
export const INDICES: Index[] = [
  { lang: 'unknown', analyzerName: 'default', aliasName: `${INDEX_NAME}` },
  { lang: 'en', analyzerName: 'english', aliasName: `${INDEX_NAME}_en` },
  { lang: 'ja', analyzerName: 'sudachi_analyzer', aliasName: `${INDEX_NAME}_ja` },
  { lang: 'de', analyzerName: 'german_custom', aliasName: `${INDEX_NAME}_de` },
  { lang: 'ko', analyzerName: 'nori', aliasName: `${INDEX_NAME}_ko` },
  { lang: 'zh', analyzerName: 'smartcn', aliasName: `${INDEX_NAME}_zh` },
];

export const VIDEO_SITES = ['www.youtube.com', 'youtu.be'];
