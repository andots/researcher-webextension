import type { SearchRequest } from '@elastic/elasticsearch/api/types';

import type { SearchMode } from 'src/types';

type SearchBody = SearchRequest['body'];

export const urlTermQuery = (str: string): SearchBody => {
  return {
    query: {
      term: {
        url: str,
      },
    },
    _source: ['stars', 'bookmarkedAt', 'isReadLater'],
  };
};

export const getReadLaterQueryBody = (): SearchBody => {
  return {
    query: {
      term: {
        isReadLater: true,
      },
    },
    sort: [{ bookmarkedAt: 'desc' }],
    _source: ['title', 'url', 'site'],
  };
};

export const getSearchBody = (mode: SearchMode): SearchBody => {
  // ! common body
  let body: SearchBody = {
    _source: {
      excludes: ['html', 'content'],
    },
    highlight: {
      pre_tags: ['<b>'],
      post_tags: ['</b>'],
      fields: {
        content: {
          number_of_fragments: 1,
          fragment_size: 350,
          no_match_size: 250,
          // order: 'score',
        },
      },
    },
  };

  if (mode.isReadLater != null) {
    body = {
      ...body,
      ...filterIsReadLaterQuery(),
    };
  }

  if (mode.stars != null) {
    body = {
      ...body,
      ...filterByStarsQuery(mode.stars),
    };
  }

  if (mode.sites != null && mode.sites.length > 0) {
    body = {
      ...body,
      ...filterBySites(mode.sites),
    };
  }

  if (mode.keywords != null) {
    body = {
      ...body,
      ...keywordSearchQuery(mode.keywords),
    };
  }

  return body;
};

const keywordSearchQuery = (keywords: string): SearchBody => {
  if (keywords === '') {
    return recentQuery();
  }

  const body: SearchBody = {
    query: {
      function_score: {
        query: {
          query_string: {
            fields: ['title^5', 'site.fulltext^3', 'url.fulltext', 'excerpt', 'content'],
            type: 'most_fields',
            query: keywords,
          },
        },
        functions: [
          {
            script_score: {
              script: "doc['stars'].value + 1",
            },
          },
          {
            exp: {
              bookmarkedAt: {
                scale: '10d',
                offset: '3d',
                decay: 0.8,
              },
            },
          },
        ],
        boost_mode: 'multiply',
        boost: 1,
      },
    },
  };

  return body;
};

const recentQuery = (): SearchBody => {
  const body: SearchBody = {
    query: { match_all: {} },
    sort: [{ bookmarkedAt: 'desc' }],
  };
  return body;
};

const filterByStarsQuery = (stars: number): SearchBody => {
  return {
    query: {
      term: {
        stars,
      },
    },
    sort: [{ bookmarkedAt: 'desc' }],
  };
};

const filterIsReadLaterQuery = (): SearchBody => {
  return {
    query: {
      term: {
        isReadLater: true,
      },
    },
    sort: [{ bookmarkedAt: 'desc' }],
  };
};

const filterBySites = (sites: string[]): SearchBody => {
  return {
    query: {
      terms: {
        site: sites,
      },
    },
    sort: [{ bookmarkedAt: 'desc' }],
  };
};
