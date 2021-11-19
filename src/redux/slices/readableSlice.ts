import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { BookmarkResponse } from 'src/types';

type ReadableState = {
  open: boolean;
  id?: string;
  index?: string;
  bookmarkResponse?: BookmarkResponse;
};

const initialState: ReadableState = {
  open: false,
  id: undefined,
  index: undefined,
  bookmarkResponse: undefined,
};

const readableSlice = createSlice({
  name: 'readable',
  initialState,
  reducers: {
    openReadable(state, action: PayloadAction<Omit<ReadableState, 'open'>>) {
      const { id, index, bookmarkResponse } = action.payload;
      if (id && index && bookmarkResponse) {
        state.open = true;
        state.id = id;
        state.index = index;
        state.bookmarkResponse = bookmarkResponse;
      }
    },
    closeReadable(state) {
      state.open = false;
      state.id = undefined;
      state.index = undefined;
      state.bookmarkResponse = undefined;
    },
  },
});

export default readableSlice.reducer;

export const { openReadable, closeReadable } = readableSlice.actions;
