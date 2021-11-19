/* eslint-disable jest/no-commented-out-tests */
import deepmerge from 'deepmerge';

import {
  jaAnalysis,
  uriAnalysis,
  URI_ANALYZER_NAME,
} from 'src/redux/services/elasticsearch/config/analysis';
import { createMapping } from 'src/redux/services/elasticsearch/config/mappings';

describe('Mappings', () => {
  test('analysis', () => {
    const analysis = deepmerge(jaAnalysis, uriAnalysis);
    expect(analysis).toMatchObject({
      filter: {
        extended: {
          type: 'sudachi_split',
          mode: 'extended',
        },
        search: {
          type: 'sudachi_split',
          mode: 'search',
        },
        synonym: {
          type: 'synonym',
          synonyms: ['関西国際空港,関空', '関西 => 近畿'],
        },
        romaji_readingform: {
          type: 'sudachi_readingform',
          use_romaji: true,
        },
        katakana_readingform: {
          type: 'sudachi_readingform',
          use_romaji: false,
        },
      },
      analyzer: {
        sudachi_analyzer: {
          filter: ['search', 'lowercase'],
          type: 'custom',
          tokenizer: 'sudachi_tokenizer',
        },
        sudachi_extended_analyzer: {
          filter: ['extended', 'lowercase'],
          type: 'custom',
          tokenizer: 'sudachi_tokenizer',
        },
        sudachi_baseform_analyzer: {
          filter: ['sudachi_baseform'],
          type: 'custom',
          tokenizer: 'sudachi_tokenizer',
        },
        sudachi_normalizedform_analyzer: {
          filter: ['sudachi_normalizedform'],
          type: 'custom',
          tokenizer: 'sudachi_tokenizer',
        },
        sudachi_readingform_analyzer: {
          filter: ['katakana_readingform'],
          type: 'custom',
          tokenizer: 'sudachi_tokenizer',
        },
        sudachi_romaji_analyzer: {
          filter: ['romaji_readingform'],
          type: 'custom',
          tokenizer: 'sudachi_tokenizer',
        },
        sudachi_synonym_analyzer: {
          filter: ['synonym', 'search'],
          type: 'custom',
          tokenizer: 'sudachi_tokenizer',
        },
        sudachi_a_analyzer: {
          filter: [],
          type: 'custom',
          tokenizer: 'sudachi_a_tokenizer',
        },
        sudachi_search_analyzer: {
          filter: ['search'],
          type: 'custom',
          tokenizer: 'sudachi_tokenizer',
        },
        uri_analyzer: {
          filter: 'lowercase',
          tokenizer: 'uri_tokenizer',
          type: 'custom',
        },
      },
      tokenizer: {
        sudachi_tokenizer: {
          type: 'sudachi_tokenizer',
          split_mode: 'C',
          discard_punctuation: true,
          resources_path: 'sudachi',
          settings_path: 'sudachi/sudachi.json',
        },
        sudachi_c_tokenizer: {
          type: 'sudachi_tokenizer',
          split_mode: 'C',
          discard_punctuation: true,
          resources_path: 'sudachi',
          settings_path: 'sudachi/sudachi.json',
        },
        sudachi_a_tokenizer: {
          type: 'sudachi_tokenizer',
          split_mode: 'A',
          discard_punctuation: true,
          resources_path: 'sudachi',
          settings_path: 'sudachi/sudachi.json',
        },
        uri_tokenizer: {
          type: 'char_group',
          tokenize_on_chars: ['whitespace', '.', '/', '?', '&', '='],
        },
      },
    });
  });

  test('createMapping("default")', () => {
    const mapping = createMapping('unknown');
    expect(mapping).toMatchObject({
      settings: {
        index: {
          number_of_shards: 1,
          number_of_replicas: 0,
          default_pipeline: 'researcher_pipeline',
        },
        analysis: {
          ...uriAnalysis,
        },
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
            analyzer: 'default',
          },
          excerpt: {
            type: 'text',
            analyzer: 'default',
          },
          content: {
            type: 'text',
            analyzer: 'default',
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
    });
  });

  test('createMapping("en")', () => {
    const mapping = createMapping('en');
    expect(mapping).toMatchObject({
      settings: {
        index: {
          number_of_shards: 1,
          number_of_replicas: 0,
        },
        analysis: {
          ...uriAnalysis,
        },
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
            analyzer: 'english',
          },
          excerpt: {
            type: 'text',
            analyzer: 'english',
          },
          content: {
            type: 'text',
            analyzer: 'english',
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
    });
  });

  test('createMapping("ja")', () => {
    const mapping = createMapping('ja');
    expect(mapping).toMatchObject({
      settings: {
        index: {
          number_of_shards: 1,
          number_of_replicas: 0,
        },
        analysis: deepmerge(jaAnalysis, uriAnalysis),
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
            analyzer: 'sudachi_analyzer',
          },
          excerpt: {
            type: 'text',
            analyzer: 'sudachi_analyzer',
          },
          content: {
            type: 'text',
            analyzer: 'sudachi_analyzer',
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
    });
  });

  test('createMapping("de")', () => {
    const mapping = createMapping('de');
    expect(mapping).toMatchObject({
      settings: {
        index: {
          number_of_shards: 1,
          number_of_replicas: 0,
        },
        analysis: {
          tokenizer: {
            uri_tokenizer: {
              type: 'char_group',
              tokenize_on_chars: ['whitespace', '.', '/', '?', '&', '='],
            },
          },
          filter: {
            german_decompounder: {
              type: 'hyphenation_decompounder',
              word_list_path: 'analysis/de/dictionary-de.txt',
              hyphenation_patterns_path: 'analysis/de/de_DR.xml',
              only_longest_match: true,
              min_subword_size: 4,
            },
            german_stemmer: {
              type: 'stemmer',
              language: 'light_german',
            },
            german_stop: {
              type: 'stop',
              stopwords: '_german_',
            },
          },
          analyzer: {
            uri_analyzer: {
              filter: 'lowercase',
              tokenizer: 'uri_tokenizer',
              type: 'custom',
            },
            german_custom: {
              type: 'custom',
              tokenizer: 'standard',
              filter: [
                'lowercase',
                'german_decompounder',
                'german_normalization',
                'german_stemmer',
                'german_stop',
              ],
            },
          },
        },
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
            analyzer: 'german_custom',
          },
          excerpt: {
            type: 'text',
            analyzer: 'german_custom',
          },
          content: {
            type: 'text',
            analyzer: 'german_custom',
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
    });
  });
});
