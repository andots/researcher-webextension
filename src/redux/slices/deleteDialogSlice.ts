import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

type DeleteDialogState = {
  isOpen: boolean;
  id: string | undefined;
  index: string | undefined;
};

const initialState: DeleteDialogState = {
  isOpen: false,
  id: undefined,
  index: undefined,
};

const deleteDialogSlice = createSlice({
  name: 'deleteDialog',
  initialState,
  reducers: {
    openDeleteDialog(state, action: PayloadAction<{ id: string; index: string }>) {
      const { id, index } = action.payload;
      state.isOpen = true;
      state.id = id;
      state.index = index;
    },
    closeDeleteDialog(state) {
      state.isOpen = false;
      state.id = undefined;
      state.index = undefined;
    },
  },
});

export default deleteDialogSlice.reducer;

export const { openDeleteDialog, closeDeleteDialog } = deleteDialogSlice.actions;
