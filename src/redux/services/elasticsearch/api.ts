import type {
  ClusterHealthResponse,
  ClusterHealthRequest,
  OpenPointInTimeResponse,
  OpenPointInTimeRequest,
  ClosePointInTimeResponse,
  ClosePointInTimeRequest,
  DeleteResponse,
  DeleteRequest,
  IndexResponse,
  UpdateRequest,
  SearchRequest,
  IngestPutPipelineResponse,
  IngestPutPipelineRequest,
  IndicesCreateResponse,
  IndicesCreateRequest,
  IndicesDeleteResponse,
  IndicesDeleteRequest,
  IndicesGetResponse,
  IndicesGetRequest,
  IndicesUpdateAliasesResponse,
  IndicesUpdateAliasesRequest,
  IndicesPutAliasResponse,
  IndicesPutAliasRequest,
  IndicesDeleteAliasResponse,
  IndicesDeleteAliasRequest,
  ReindexResponse,
  ReindexRequest,
  IndexRequest,
  GetResponse,
  GetRequest,
  IndicesExistsRequest,
  IndicesExistsResponse,
  InfoResponse,
  InfoRequest,
  IngestDeletePipelineResponse,
  IngestDeletePipelineRequest,
} from '@elastic/elasticsearch/api/types';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { CONFIG_INDEX_NAME, INDEX_NAME } from 'src/constants';
import type { RootState } from 'src/redux/rootReducer';
import { urlTermQuery } from 'src/redux/services/elasticsearch/config/queries';
import type {
  Bookmark,
  BookmarkIndexResponse,
  ExportBookmarkResponse,
  BookmarkSearchResponse,
  URLSearchRequest,
  Config,
  BookmarkResponse,
} from 'src/types';

const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  Record<string, unknown>,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  const baseUrl = (api.getState() as RootState).settings.elasticsearchUrl;
  const rawBaseQuery = fetchBaseQuery({ baseUrl });
  return rawBaseQuery(args, api, extraOptions);
};

// ! create empty base api, then we'll use this with injectEndpoints for each endpoints
export const ElasticSearchApi = createApi({
  reducerPath: 'elasticsearch',
  baseQuery: dynamicBaseQuery,
  tagTypes: ['Search'],
  endpoints: (builder) => ({
    info: builder.mutation<InfoResponse, InfoRequest>({
      query: (params) => {
        return {
          url: '/',
          method: 'GET',
          params,
        };
      },
    }),
    exists: builder.mutation<IndicesExistsResponse, IndicesExistsRequest>({
      query: (arg) => {
        const { index, ...params } = arg;
        return {
          url: `${index}`,
          method: 'HEAD',
          params,
        };
      },
    }),
    getHealthCheck: builder.query<ClusterHealthResponse, ClusterHealthRequest>({
      query: (arg) => {
        return {
          url: '_cluster/health',
          params: arg,
        };
      },
    }),
    openPit: builder.mutation<OpenPointInTimeResponse, OpenPointInTimeRequest>({
      query: (arg) => {
        const { index, ...restArgs } = arg;
        return {
          method: 'POST',
          url: `${index}/_pit`,
          params: restArgs,
        };
      },
    }),
    closePit: builder.mutation<ClosePointInTimeResponse, ClosePointInTimeRequest>({
      query: (arg) => {
        const { body, ...restArgs } = arg;
        return {
          method: 'DELETE',
          url: `_pit`,
          body,
          params: restArgs,
        };
      },
    }),
    search: builder.query<BookmarkSearchResponse, SearchRequest>({
      query: (arg) => {
        const { body, ...rest } = arg;
        return {
          // ! actually GET but must use POST method for body issue on FetchAPI
          // https://stackoverflow.com/questions/45291983/sending-requests-to-elasticsearch-with-axios
          method: 'POST',
          url: `${INDEX_NAME}*/_search`,
          body,
          params: rest,
        };
      },
      providesTags: ['Search'],
    }),
    export: builder.mutation<ExportBookmarkResponse, SearchRequest>({
      query: (arg) => {
        const { body, ...restArgs } = arg;
        const exportBody: SearchRequest['body'] = {
          ...body,
          query: {
            match_all: {},
          },
          sort: [{ bookmarkedAt: 'desc' }],
          _source: ['title', 'url'], // ! extract only title and url from _source
        };
        return {
          method: 'POST',
          url: `_search`,
          body: exportBody,
          params: restArgs,
        };
      },
    }),
    findByUrl: builder.mutation<BookmarkSearchResponse, URLSearchRequest>({
      query: (arg) => {
        const { url, ...rest } = arg;
        return {
          method: 'POST',
          url: `${INDEX_NAME}*/_search`,
          body: urlTermQuery(url),
          params: rest,
        };
      },
    }),
    // ! get
    getBookmark: builder.query<GetResponse<BookmarkResponse>, GetRequest>({
      query: (arg) => {
        const { id, index, ...params } = arg;
        return {
          url: `${index}/_doc/${id}`,
          method: 'GET',
          params,
        };
      },
    }),
    // ! create
    createBookmark: builder.mutation<BookmarkIndexResponse, IndexRequest<Bookmark>>({
      query: (arg) => {
        const { index, body, ...rest } = arg;
        return {
          url: `${index}/_doc`,
          method: 'POST',
          body,
          params: rest,
        };
      },
      invalidatesTags: ['Search'],
      // ! If we need created data, call getDocByUrl
      // transformResponse: async (response: BookmarkIndexResponse, meta) => {
      //   if (meta) {
      //     const body = (await meta.request.json()) as Bookmark;
      //     response.url = body.url;
      //     response.bookmarkedAt = body.bookmarkedAt;
      //     response.stars = body.stars;
      //   }
      //   return response;
      // },
    }),
    // ! update
    updateBookmark: builder.mutation<
      IndexResponse,
      UpdateRequest<Bookmark, Partial<Bookmark>>
    >({
      query: (arg) => {
        const { index, id, body, ...rest } = arg;
        const params: Omit<UpdateRequest, 'id' | 'index'> = {
          ...rest,
          refresh: true,
        };
        return {
          url: `${index}/_update/${id}`,
          method: 'POST',
          body,
          params,
        };
      },
      invalidatesTags: ['Search'],
    }),
    // ! delete
    deleteBookmark: builder.mutation<DeleteResponse, DeleteRequest>({
      query: (arg) => {
        const { index, id, ...rest } = arg;
        const params: Omit<DeleteRequest, 'id' | 'index'> = {
          ...rest,
          refresh: true,
        };
        return {
          url: `${index}/_doc/${id}`,
          method: 'DELETE',
          params,
        };
      },
      invalidatesTags: ['Search'],
    }),
    putPipeline: builder.mutation<IngestPutPipelineResponse, IngestPutPipelineRequest>({
      query: (arg) => {
        const { id, body, ...params } = arg;
        return {
          url: `_ingest/pipeline/${id}`,
          method: 'PUT',
          body,
          params,
        };
      },
    }),
    deletePipeline: builder.mutation<
      IngestDeletePipelineResponse,
      IngestDeletePipelineRequest
    >({
      query: (arg) => {
        const { id, ...params } = arg;
        return {
          url: `_ingest/pipeline/${id}`,
          method: 'DELETE',
          params,
        };
      },
    }),
    getIndex: builder.mutation<IndicesGetResponse, IndicesGetRequest>({
      query: (arg) => {
        const { index, ...params } = arg;
        return {
          url: `${index}`,
          method: 'GET',
          params,
        };
      },
    }),
    createIndex: builder.mutation<IndicesCreateResponse, IndicesCreateRequest>({
      query: (arg) => {
        const { index, body, ...params } = arg;
        return {
          url: `${index}`,
          method: 'PUT',
          body,
          params,
        };
      },
    }),
    deleteIndex: builder.mutation<IndicesDeleteResponse, IndicesDeleteRequest>({
      query: (arg) => {
        const { index, ...params } = arg;
        return {
          url: `${index}`,
          method: 'DELETE',
          params,
        };
      },
    }),
    aliases: builder.mutation<IndicesUpdateAliasesResponse, IndicesUpdateAliasesRequest>({
      query: (arg) => {
        const { body, ...params } = arg;
        return {
          url: `_aliases`,
          method: 'POST',
          body,
          params,
        };
      },
    }),
    createAlias: builder.mutation<IndicesPutAliasResponse, IndicesPutAliasRequest>({
      query: (arg) => {
        const { index, name, body, ...params } = arg;
        return {
          url: `${index}/_alias/${name}`,
          method: 'PUT',
          body,
          params,
        };
      },
    }),
    deleteAlias: builder.mutation<IndicesDeleteAliasResponse, IndicesDeleteAliasRequest>({
      query: (arg) => {
        const { index, name, ...params } = arg;
        return {
          url: `${index}/_alias/${name}`,
          method: 'DELETE',
          params,
        };
      },
    }),
    reindex: builder.mutation<ReindexResponse, ReindexRequest>({
      query: (arg) => {
        const { body, ...params } = arg;
        return {
          url: '_reindex',
          method: 'POST',
          body,
          params,
        };
      },
    }),
    getConfig: builder.mutation<GetResponse<Config>, Omit<GetRequest, 'index' | 'id'>>({
      query: (params) => {
        return {
          url: `${CONFIG_INDEX_NAME}/_doc/1`,
          method: 'GET',
          params,
        };
      },
    }),
    createConfig: builder.mutation<IndexResponse, Omit<IndexRequest<Config>, 'index'>>({
      query: (arg) => {
        const { body, ...rest } = arg;
        // ! create doc id 1
        return {
          url: `${CONFIG_INDEX_NAME}/_doc/1`,
          method: 'POST',
          body,
          params: rest,
        };
      },
    }),
    updateConfig: builder.mutation<
      IndexResponse,
      Omit<UpdateRequest<Config, Partial<Config>>, 'id' | 'index'>
    >({
      query: (arg) => {
        const { body, ...rest } = arg;
        const params: Omit<UpdateRequest, 'id' | 'index'> = {
          ...rest,
          refresh: true,
        };
        // ! update doc id 1
        return {
          url: `${CONFIG_INDEX_NAME}/_update/1`,
          method: 'POST',
          body,
          params,
        };
      },
    }),
  }),
});

export const {
  useInfoMutation,
  useExistsMutation,
  useGetHealthCheckQuery,
  useOpenPitMutation,
  useClosePitMutation,
  useSearchQuery,
  useExportMutation,
  useFindByUrlMutation,
  useGetBookmarkQuery,
  useCreateBookmarkMutation,
  useDeleteBookmarkMutation,
  useUpdateBookmarkMutation,
  usePutPipelineMutation,
  useGetIndexMutation,
  useCreateIndexMutation,
  useDeleteIndexMutation,
  useAliasesMutation,
  useCreateAliasMutation,
  useDeleteAliasMutation,
  useReindexMutation,
  useGetConfigMutation,
  useCreateConfigMutation,
  useUpdateConfigMutation,
} = ElasticSearchApi;
