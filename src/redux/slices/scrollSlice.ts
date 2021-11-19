import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

type Coordinate = {
  x: number;
  y: number;
};

export type ScrollState = {
  query: string;
  coordinate: Coordinate;
};

const initialState: ScrollState = {
  query: '',
  coordinate: { x: 0, y: 0 },
};

const scrollSlice = createSlice({
  name: 'scroll',
  initialState,
  reducers: {
    setScrollPosition(state, action: PayloadAction<ScrollState>) {
      const { coordinate, query } = action.payload;
      state.query = query;
      state.coordinate = coordinate;
    },
  },
});

export default scrollSlice.reducer;

export const { setScrollPosition } = scrollSlice.actions;
