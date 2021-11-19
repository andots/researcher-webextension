import type { ThunkAction, Action } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { localStorage } from 'redux-persist-webextension-storage';

import type { RootState } from './rootReducer';
import rootReducer from './rootReducer';

import { ElasticSearchApi } from 'src/redux/services/elasticsearch/api';

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage: localStorage,
    whitelist: ['settings'],
  },
  rootReducer,
);

// ! https://redux-toolkit.js.org/usage/usage-guide
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(ElasticSearchApi.middleware);
  },
});

setupListeners(store.dispatch);

// export persistor
export const persistor = persistStore(store);

// Export a hook that can be reused to resolve types
export type AppDispatch = typeof store.dispatch;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;

// hot reloading for redux
// if (process.env.NODE_ENV === 'development' && import.meta.hot) {
//   console.log('update redux store');
//   import.meta.hot.accept('./rootReducer', () => {
//     const newRootReducer = require('./rootReducer').default;
//     store.replaceReducer(newRootReducer);
//   });
// }
