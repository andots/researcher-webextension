import type { IngestPipeline } from '@elastic/elasticsearch/api/types';

import { APP_NAME } from 'src/constants';

export const RESEARCHER_PIPELINE_BODY: IngestPipeline = {
  version: 1,
  description: `pipeline for ${APP_NAME}`,
  processors: [
    {
      inference: {
        model_id: 'lang_ident_model_1',
        // inference_config: {
        //   classification: {
        //     num_top_classes: 3,
        //   },
        // },
        field_map: {
          content: 'text',
        },
        target_field: '_ml.lang_ident',
      },
    },
    {
      rename: {
        field: '_ml.lang_ident.predicted_value',
        target_field: 'language',
        ignore_failure: true,
      },
    },
    {
      set: {
        if: "['de', 'en', 'ja', 'ko', 'zh'].contains(ctx.language)",
        field: '_index',
        value: '{{_index}}_{{language}}',
        override: true,
      },
    },
    {
      set: {
        field: 'indexedAt',
        value: '{{_ingest.timestamp}}',
      },
    },
    {
      set: {
        if: 'ctx.stars == null',
        field: 'stars',
        value: 0,
      },
    },
    {
      set: {
        if: 'ctx.isReadLater == null',
        field: 'isReadLater',
        value: false,
      },
    },
    {
      remove: {
        field: '_ml',
      },
    },
    {
      urldecode: {
        field: 'url.fulltext',
        ignore_failure: true,
        ignore_missing: true,
      },
    },
    {
      urldecode: {
        field: 'site.fulltext',
        ignore_failure: true,
        ignore_missing: true,
      },
    },
  ],
};
