export const jaAnalysis: Record<string, any> = {
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
  },
};

export const deAnalysis: Record<string, any> = {
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
};

export const URI_ANALYZER_NAME = 'uri_analyzer';
export const uriAnalysis: Record<string, any> = {
  analyzer: {
    uri_analyzer: {
      filter: 'lowercase',
      tokenizer: 'uri_tokenizer',
      type: 'custom',
    },
  },
  tokenizer: {
    uri_tokenizer: {
      type: 'char_group',
      tokenize_on_chars: ['whitespace', '.', '/', '?', '&', '='],
    },
  },
};
