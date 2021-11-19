import type { SearchHit } from '@elastic/elasticsearch/api/types';
import type { PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

import { getSearchTotalHits } from 'src/libs/elasticsearch';
import { ElasticSearchApi } from 'src/redux/services/elasticsearch/api';
import { getSearchBody } from 'src/redux/services/elasticsearch/config/queries';
import type { AppThunk } from 'src/redux/store';
import type { BookmarkResponse, BookmarkSearchResponse, SearchMode } from 'src/types';

const SEARCH_SIZE = 12;

type State = {
  searchHits: SearchHit<BookmarkResponse>[];
  totalHits: number;
  from: number;
  isInitialized: boolean;
  hasMore: boolean;
  isLoading: boolean;
  error?: FetchBaseQueryError | SerializedError;
};

const initialState: State = {
  searchHits: [],
  totalHits: 0,
  from: 0,
  isInitialized: false,
  hasMore: false,
  isLoading: false,
  error: undefined,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchError(
      state,
      action: PayloadAction<FetchBaseQueryError | SerializedError | undefined>,
    ) {
      state.error = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setInitialSearchHits(state, action: PayloadAction<BookmarkSearchResponse>) {
      const data = action.payload;
      const total = getSearchTotalHits(data.hits.total);
      state.searchHits = data.hits.hits;
      state.totalHits = total;
      state.from = SEARCH_SIZE;
      state.hasMore = total >= SEARCH_SIZE;
      state.isInitialized = true;
    },
    pushSearchHits(state, action: PayloadAction<BookmarkSearchResponse>) {
      const data = action.payload;
      state.searchHits.push(...data.hits.hits);
      state.from = state.from + SEARCH_SIZE;
      state.hasMore = state.totalHits >= state.from + SEARCH_SIZE;
    },
    removeSearchHit(state, action: PayloadAction<{ id: string; index: string }>) {
      const { id, index } = action.payload;
      const idx = state.searchHits.findIndex((a) => a._id === id && a._index === index);
      if (idx !== -1) {
        state.searchHits.splice(idx, 1);
        const total = state.totalHits - 1;
        const currentFrom = state.from - 1;
        state.totalHits = total;
        state.from = currentFrom;
        state.hasMore = total >= currentFrom + SEARCH_SIZE;
      }
    },
    updateSearchHit(
      state,
      action: PayloadAction<{
        id: string;
        index: string;
        patch: Partial<BookmarkResponse>;
      }>,
    ) {
      const { id, index, patch } = action.payload;
      const idx = state.searchHits.findIndex((a) => a._id === id && a._index === index);
      if (idx !== -1) {
        const hit = state.searchHits[idx];
        if (hit._source != null) {
          hit._source = {
            ...hit._source,
            ...patch,
          };
        }
      }
    },
    resetSearchHits() {
      return initialState;
    },
  },
});

export default searchSlice.reducer;

export const {
  setSearchError,
  setIsLoading,
  setInitialSearchHits,
  pushSearchHits,
  resetSearchHits,
  removeSearchHit,
  updateSearchHit,
} = searchSlice.actions;

export const getSearchHits =
  (searchMode: SearchMode): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setIsLoading(true));
    const from = getState().search.from;
    const body = getSearchBody(searchMode);
    const { data, error } = await dispatch(
      ElasticSearchApi.endpoints.search.initiate({ size: SEARCH_SIZE, from, body }),
    );
    if (data) {
      if (from === 0) {
        dispatch(setInitialSearchHits(data));
      } else {
        dispatch(pushSearchHits(data));
      }
    } else if (error) {
      dispatch(setSearchError(error));
    }
    dispatch(setIsLoading(false));
  };

// This will immediately remove all existing cache entries, and all queries will be considered 'uninitialized'.
export const resetSearchCache = (): AppThunk => async (dispatch) => {
  dispatch(ElasticSearchApi.util.resetApiState());
};
