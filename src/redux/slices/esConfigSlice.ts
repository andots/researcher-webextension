import type {
  ClusterHealthResponse,
  IndicesUpdateAliasesRequest,
} from '@elastic/elasticsearch/api/types';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  CONFIG_INDEX_NAME,
  CURRENT_VERSION,
  RESEARCHER_PIPELINE_NAME,
  INDICES,
  ELASTICSEARCH_VERSION,
} from 'src/constants';
import { getSearchTotalHits } from 'src/libs/elasticsearch';
import { limit1 } from 'src/libs/plimit';
import { ElasticSearchApi } from 'src/redux/services/elasticsearch/api';
import {
  createConfigMapping,
  createMapping,
  getAliasName,
  getIndexName,
} from 'src/redux/services/elasticsearch/config/mappings';
import { RESEARCHER_PIPELINE_BODY } from 'src/redux/services/elasticsearch/config/pipeline';
import type { AppThunk } from 'src/redux/store';
import type { Config, ElasticSearchDoc } from 'src/types';

type State = {
  isRequiredSetup: boolean;
  isRequiredMigration: boolean;
  isReady: boolean;
  clusterHealth: ClusterHealthResponse | undefined;
  mappingVersion: string | undefined;
  isUpgrading: boolean;
};

const initialState: State = {
  isRequiredSetup: false,
  isRequiredMigration: false,
  isReady: false,
  clusterHealth: undefined,
  mappingVersion: undefined,
  isUpgrading: false,
};

const esConfigSlice = createSlice({
  name: 'esconfig',
  initialState,
  reducers: {
    setIsReady(state, action: PayloadAction<boolean>) {
      state.isReady = action.payload;
    },
    setIsRequiredSetup(state, action: PayloadAction<boolean>) {
      state.isRequiredSetup = action.payload;
    },
    setIsRequiredMigration(state, action: PayloadAction<boolean>) {
      state.isRequiredMigration = action.payload;
    },
    setClusterHealth(state, action: PayloadAction<ClusterHealthResponse>) {
      state.clusterHealth = action.payload;
    },
    setMappingVersion(state, action: PayloadAction<string>) {
      state.mappingVersion = action.payload;
    },
    setIsUpgrading(state, action: PayloadAction<boolean>) {
      state.isUpgrading = action.payload;
    },
  },
});

export default esConfigSlice.reducer;

export const {
  setIsReady,
  setIsRequiredSetup,
  setIsRequiredMigration,
  setClusterHealth,
  setMappingVersion,
  setIsUpgrading,
} = esConfigSlice.actions;

export const validateElasticsearch = createAsyncThunk<void>(
  'validateElasticsearch',
  async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const esVersion = await dispatch(getElasticsearchVersion()).unwrap();
    if (esVersion === ELASTICSEARCH_VERSION) {
      const config = await dispatch(loadConfig()).unwrap();
      const exists = await dispatch(existsIndices()).unwrap();
      if (config && exists) {
        dispatch(setMappingVersion(config.version));
        if (config.version === CURRENT_VERSION) {
          dispatch(setIsReady(true));
        } else {
          // ! mapping version is old, so migration is required
          dispatch(setIsReady(false));
          dispatch(setIsRequiredMigration(true));
        }
      } else {
        // ! not all indices existed or can't get config, so setup is required
        dispatch(setIsReady(false));
        dispatch(setIsRequiredSetup(true));
      }
    } else {
      // ! es version check failed
      dispatch(setIsReady(false));
      dispatch(setIsRequiredSetup(true));
    }
  },
);

export const getElasticsearchVersion = createAsyncThunk<string | undefined>(
  'getElasticsearchVersion',
  async (_, thunkAPI) => {
    try {
      const { dispatch } = thunkAPI;
      const result = await dispatch(
        ElasticSearchApi.endpoints.info.initiate({}),
      ).unwrap();
      return result.version.number;
    } catch {
      return undefined;
    }
  },
);

export const loadConfig = createAsyncThunk<Config | undefined>(
  'loadConfig',
  async (_, thunkAPI) => {
    try {
      const result = await thunkAPI
        .dispatch(ElasticSearchApi.endpoints.getConfig.initiate({}))
        .unwrap();
      if (result._source) {
        return result._source;
      }
      return undefined;
    } catch {
      return undefined;
    }
  },
);

export const createConfigIndex = createAsyncThunk<void>(
  'createConfig',
  async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    await dispatch(
      ElasticSearchApi.endpoints.createIndex.initiate({
        index: CONFIG_INDEX_NAME,
        body: createConfigMapping(),
      }),
    );
    await dispatch(
      ElasticSearchApi.endpoints.createConfig.initiate({
        body: { version: CURRENT_VERSION },
      }),
    );
  },
);

export const updateConfig = createAsyncThunk<void, { version: string }>(
  'updateConfig',
  async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { version } = arg;
    await dispatch(
      ElasticSearchApi.endpoints.updateConfig.initiate({
        body: { doc: { version } },
      }),
    );
  },
);

export const existsIndices = createAsyncThunk<boolean>(
  'existsIndices',
  async (_, thunkAPI) => {
    try {
      const result = await thunkAPI.dispatch(
        ElasticSearchApi.endpoints.exists.initiate({
          index: INDICES.map((i) => i.aliasName).join(','),
        }),
      );
      if ('data' in result) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
);

export const createIndices = createAsyncThunk<void, { version: string }>(
  'createIndices',
  async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const { version } = arg;
    await dispatch(
      ElasticSearchApi.endpoints.putPipeline.initiate({
        id: RESEARCHER_PIPELINE_NAME,
        body: RESEARCHER_PIPELINE_BODY,
      }),
    );
    const promises = INDICES.map((a) => {
      return limit1(async () => {
        const index = getIndexName(a.lang, version);
        await dispatch(
          ElasticSearchApi.endpoints.createIndex.initiate({
            index,
            body: createMapping(a.lang),
          }),
        );
      });
    });
    await Promise.all(promises);
  },
);

export const deleteIndices = createAsyncThunk<void, { version: string }>(
  'deleteIndices',
  async (arg, thunkAPI) => {
    try {
      const { dispatch } = thunkAPI;
      const { version } = arg;
      const promises = INDICES.map((a) => {
        return limit1(async () => {
          const index = getIndexName(a.lang, version);
          await dispatch(ElasticSearchApi.endpoints.deleteIndex.initiate({ index }));
        });
      });
      Promise.all(promises);
    } catch {
      //
    }
  },
);

export const createAliases = createAsyncThunk<boolean, { version: string }>(
  'createAliases',
  async (arg, thunkAPI) => {
    try {
      const { dispatch } = thunkAPI;
      const { version } = arg;

      const aliasBody: IndicesUpdateAliasesRequest['body'] = {
        actions: INDICES.map((a) => {
          return {
            add: {
              index: getIndexName(a.lang, version),
              alias: getAliasName(a.lang),
              is_write_index: true,
            },
          };
        }),
      };
      const result = await dispatch(
        ElasticSearchApi.endpoints.aliases.initiate({ body: aliasBody }),
      ).unwrap();
      return result.acknowledged;
    } catch {
      return false;
    }
  },
);

export const removeAliases = createAsyncThunk<boolean, { version: string }>(
  'removeAliases',
  async (arg, thunkAPI) => {
    try {
      const { dispatch } = thunkAPI;
      const { version } = arg;

      const aliasBody: IndicesUpdateAliasesRequest['body'] = {
        actions: INDICES.map((a) => {
          const index = getIndexName(a.lang, version);
          return {
            remove: {
              index,
              alias: getAliasName(a.lang),
            },
          };
        }),
      };
      const result = await dispatch(
        ElasticSearchApi.endpoints.aliases.initiate({ body: aliasBody }),
      ).unwrap();
      return result.acknowledged;
    } catch {
      return false;
    }
  },
);

export const fetchIsBookmarked = createAsyncThunk<boolean, { url: string }>(
  'fetchIsBookmarked',
  async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const result = await dispatch(
      ElasticSearchApi.endpoints.findByUrl.initiate({ url: arg.url }),
    ).unwrap();
    const totalHits = getSearchTotalHits(result.hits.total);
    if (totalHits > 0) {
      return true;
    }
    return false;
  },
);

export const getDocByUrl = createAsyncThunk<ElasticSearchDoc, { url: string }>(
  'getDocByUrl',
  async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const result = await dispatch(
      ElasticSearchApi.endpoints.findByUrl.initiate({ url: arg.url }),
    ).unwrap();
    const totalHits = getSearchTotalHits(result.hits.total);
    if (totalHits > 0) {
      const { _id, _index, _source } = result.hits.hits[0];
      if (_source) {
        return {
          id: _id,
          index: _index,
          bookmarkedAt: _source.bookmarkedAt,
          stars: _source.stars ? _source.stars : 0,
          isReadLater: _source.isReadLater,
        };
      }
    }
    return undefined;
  },
);

export const migrateV1ToV2 = (): AppThunk => async (dispatch) => {
  dispatch(setIsUpgrading(true));
  const config = await dispatch(loadConfig()).unwrap();
  if (config) {
    const oldVersion = config.version;
    const newVersion = CURRENT_VERSION;
    await dispatch(createIndices({ version: newVersion }));
    const promises = INDICES.map((a) => {
      return limit1(async () => {
        await dispatch(
          ElasticSearchApi.endpoints.reindex.initiate({
            body: {
              source: {
                index: getIndexName(a.lang, oldVersion),
                size: 1,
              },
              dest: {
                index: getIndexName(a.lang, newVersion),
              },
              script: {
                source: 'ctx._source.site = ctx._source.remove("domain")',
              },
            },
            refresh: true,
          }),
        );
      });
    });
    await Promise.all(promises);
    await dispatch(removeAliases({ version: oldVersion }));
    await dispatch(createAliases({ version: newVersion }));
    await dispatch(updateConfig({ version: newVersion }));
    await dispatch(deleteIndices({ version: oldVersion }));
    await dispatch(validateElasticsearch());
  }
  dispatch(setIsUpgrading(false));
};

export const reindex = (): AppThunk => async (dispatch) => {
  dispatch(setIsUpgrading(true));
  const config = await dispatch(loadConfig()).unwrap();
  if (config) {
    const oldVersion = config.version;
    const newVersion = CURRENT_VERSION;
    await dispatch(createIndices({ version: newVersion }));
    const promises = INDICES.map((a) => {
      return limit1(async () => {
        await dispatch(
          ElasticSearchApi.endpoints.reindex.initiate({
            body: {
              source: {
                index: getIndexName(a.lang, oldVersion),
                size: 1,
              },
              dest: {
                index: getIndexName(a.lang, newVersion),
              },
            },
            refresh: true,
          }),
        );
      });
    });
    await Promise.all(promises);
    await dispatch(removeAliases({ version: oldVersion }));
    await dispatch(createAliases({ version: newVersion }));
    await dispatch(updateConfig({ version: newVersion }));
    await dispatch(deleteIndices({ version: oldVersion }));
    await dispatch(validateElasticsearch());
  }
  dispatch(setIsUpgrading(false));
};

export const reindexV3ToV4 = (): AppThunk => async (dispatch) => {
  dispatch(setIsUpgrading(true));
  const config = await dispatch(loadConfig()).unwrap();
  if (config) {
    const oldVersion = config.version;
    const newVersion = CURRENT_VERSION;
    await dispatch(createIndices({ version: newVersion }));
    const pipelineId = 'decodeuri';
    await dispatch(
      ElasticSearchApi.endpoints.putPipeline.initiate({
        id: pipelineId,
        body: {
          processors: [
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
        },
      }),
    );
    const promises = INDICES.map((a) => {
      return limit1(async () => {
        await dispatch(
          ElasticSearchApi.endpoints.reindex.initiate({
            body: {
              source: {
                index: getIndexName(a.lang, oldVersion),
                size: 1,
              },
              dest: {
                index: getIndexName(a.lang, newVersion),
                pipeline: pipelineId,
              },
            },
            refresh: true,
          }),
        );
      });
    });
    await Promise.all(promises);
    await dispatch(removeAliases({ version: oldVersion }));
    await dispatch(createAliases({ version: newVersion }));
    await dispatch(updateConfig({ version: newVersion }));
    await dispatch(deleteIndices({ version: oldVersion }));
    await dispatch(
      ElasticSearchApi.endpoints.deletePipeline.initiate({ id: pipelineId }),
    );
    await dispatch(validateElasticsearch());
  }
  dispatch(setIsUpgrading(false));
};

export const getClusterHealth = (): AppThunk => async (dispatch) => {
  const result = await dispatch(ElasticSearchApi.endpoints.getHealthCheck.initiate({}));
  if (result.data) {
    dispatch(setClusterHealth(result.data));
  }
};
