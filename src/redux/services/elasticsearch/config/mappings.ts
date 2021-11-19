import type { IndicesCreateRequest } from '@elastic/elasticsearch/api/types';
import deepmerge from 'deepmerge';

import { INDEX_NAME, INDICES, RESEARCHER_PIPELINE_NAME } from 'src/constants';
import {
  deAnalysis,
  jaAnalysis,
  uriAnalysis,
  URI_ANALYZER_NAME,
} from 'src/redux/services/elasticsearch/config/analysis';
import type { Lang } from 'src/types';

const getPipelineName = (lang: Lang) => {
  return lang === 'unknown' ? RESEARCHER_PIPELINE_NAME : undefined;
};

const getLangAnalysis = (lang: Lang) => {
  if (lang === 'ja') {
    return jaAnalysis;
  } else if (lang === 'de') {
    return deAnalysis;
  }
  return {};
};

const getLangAnalyzerName = (lang: Lang) => {
  const index = INDICES.find((a) => a.lang === lang);
  if (index) {
    return index.analyzerName;
  }
  return 'default';
};

export const getAliasName = (lang: Lang): string => {
  const index = INDICES.find((a) => a.lang === lang);
  if (index) {
    return index.aliasName;
  }
  return `${INDEX_NAME}_${lang}`;
};

export const getIndexName = (lang: Lang, version: string): string => {
  if (lang === 'unknown') {
    return `d_${INDEX_NAME}-${version}`;
  }
  return `d_${INDEX_NAME}_${lang}-${version}`;
};

export const createMapping = (lang: Lang): IndicesCreateRequest['body'] => {
  const pipelineName = getPipelineName(lang);
  const langAnalysis = getLangAnalysis(lang);
  const langAnalyzerName = getLangAnalyzerName(lang);

  const body: IndicesCreateRequest['body'] = {
    settings: {
      index: {
        number_of_shards: 1,
        number_of_replicas: 0,
        default_pipeline: pipelineName,
      },
      analysis: deepmerge(langAnalysis, uriAnalysis),
    },
    mappings: {
      dynamic: 'strict',
      properties: {
        language: {
          type: 'keyword',
        },
        url: {
          type: 'keyword',
          fields: {
            fulltext: {
              type: 'text',
              analyzer: URI_ANALYZER_NAME,
            },
          },
        },
        site: {
          type: 'keyword',
          fields: {
            fulltext: {
              type: 'text',
              analyzer: URI_ANALYZER_NAME,
            },
          },
        },
        title: {
          type: 'text',
          analyzer: langAnalyzerName,
        },
        excerpt: {
          type: 'text',
          analyzer: langAnalyzerName,
        },
        content: {
          type: 'text',
          analyzer: langAnalyzerName,
          index_options: 'offsets',
          term_vector: 'yes',
        },
        html: {
          type: 'keyword',
          index: false,
          ignore_above: 100,
        },
        stars: {
          type: 'integer',
          null_value: 0,
        },
        note: {
          type: 'text',
          analyzer: 'default',
        },
        tags: {
          type: 'keyword',
        },
        ogImage: {
          type: 'keyword',
          index: false,
        },
        screenshot: {
          type: 'binary',
        },
        isReadLater: {
          type: 'boolean',
          null_value: false,
        },
        indexedAt: {
          type: 'date',
        },
        bookmarkedAt: {
          type: 'date',
        },
      },
    },
  };

  return body;
};

export const createConfigMapping = (): IndicesCreateRequest['body'] => {
  const body: IndicesCreateRequest['body'] = {
    settings: {
      index: {
        number_of_shards: 1,
        number_of_replicas: 0,
        hidden: true,
      },
    },
    mappings: {
      dynamic: 'strict',
      properties: {
        version: {
          type: 'keyword',
          index: false,
        },
      },
    },
  };

  return body;
};
