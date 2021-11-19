import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { ListViewType } from 'src/types';

const DEFAULT_URL = 'http://localhost:9200/';

export type SettingState = {
  isDarkMode: boolean;
  listViewType: ListViewType;
  elasticsearchUrl: string;
};

const initialState: SettingState = {
  isDarkMode: false,
  listViewType: 'headline',
  elasticsearchUrl: DEFAULT_URL,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.isDarkMode = !state.isDarkMode;
    },
    setListViewType(state, action: PayloadAction<ListViewType>) {
      state.listViewType = action.payload;
    },
    setElasticsearchUrl(state, action: PayloadAction<string>) {
      try {
        const url = new URL(action.payload);
        state.elasticsearchUrl = url.toString();
      } catch {
        state.elasticsearchUrl = DEFAULT_URL;
      }
    },
  },
});

export default settingsSlice.reducer;

export const { toggleTheme, setListViewType, setElasticsearchUrl } =
  settingsSlice.actions;
