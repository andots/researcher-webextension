import { combineReducers } from '@reduxjs/toolkit';
import type { Reducer } from '@reduxjs/toolkit';

import { ElasticSearchApi } from 'src/redux/services/elasticsearch/api';
import deleteDialogReducer from 'src/redux/slices/deleteDialogSlice';
import drawerReducer from 'src/redux/slices/drawerSlice';
import esConfigReducer from 'src/redux/slices/esConfigSlice';
import importReducer from 'src/redux/slices/importSlice';
import readableReducer from 'src/redux/slices/readableSlice';
import scrollReducer from 'src/redux/slices/scrollSlice';
import searchReducer from 'src/redux/slices/searchSlice';
import settingReducer from 'src/redux/slices/settingSlice';

const combinedReducer = combineReducers({
  drawer: drawerReducer,
  settings: settingReducer,
  import: importReducer,
  scroll: scrollReducer,
  deleteDialog: deleteDialogReducer,
  esconfig: esConfigReducer,
  readable: readableReducer,
  search: searchReducer,
  [ElasticSearchApi.reducerPath]: ElasticSearchApi.reducer,
});

const rootReducer: Reducer = (state, action) => {
  return combinedReducer(state, action);
};

export type RootState = ReturnType<typeof combinedReducer>;

export default rootReducer;
