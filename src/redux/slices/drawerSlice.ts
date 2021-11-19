import { createSlice } from '@reduxjs/toolkit';

export type DrawerState = {
  isLeftDrawerPrimaryOpen: boolean;
  isLeftDrawerSecondaryOpen: boolean;
  isOverlayDrawerOpen: boolean;
  isOverlayDrawerEnabled: boolean;
  isAutoToggleEnabled: boolean;
};

const initialState: DrawerState = {
  isLeftDrawerPrimaryOpen: false,
  isLeftDrawerSecondaryOpen: false,
  isOverlayDrawerOpen: false,
  isOverlayDrawerEnabled: true,
  isAutoToggleEnabled: true,
};

const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    toggleIsAutoToggleEnabled(state) {
      state.isAutoToggleEnabled = !state.isAutoToggleEnabled;
    },
    // Primary Left Drawer
    openLeftDrawerPrimary(state) {
      state.isLeftDrawerPrimaryOpen = true;
    },
    closeLeftDrawerPrimary(state) {
      state.isLeftDrawerPrimaryOpen = false;
    },
    toggleLeftDrawerPrimary(state) {
      state.isLeftDrawerPrimaryOpen = !state.isLeftDrawerPrimaryOpen;
    },
    // Secondary Left Drawer
    openLeftDrawerSecondary(state) {
      state.isLeftDrawerSecondaryOpen = true;
    },
    closeLeftDrawerSecondary(state) {
      state.isLeftDrawerSecondaryOpen = false;
    },
    toggleLeftDrawerSecondary(state) {
      state.isLeftDrawerSecondaryOpen = !state.isLeftDrawerSecondaryOpen;
    },
    // Secondary Left Drawer
    openOverlayDrawer(state) {
      state.isOverlayDrawerOpen = true;
    },
    closeOverlayDrawer(state) {
      state.isOverlayDrawerOpen = false;
    },
    toggleOverlayDrawer(state) {
      state.isOverlayDrawerOpen = !state.isOverlayDrawerOpen;
    },
    closeAllDrawers(state) {
      state.isLeftDrawerSecondaryOpen = false;
      state.isLeftDrawerPrimaryOpen = false;
    },
  },
});

export default drawerSlice.reducer;

export const {
  toggleIsAutoToggleEnabled,
  openLeftDrawerPrimary,
  closeLeftDrawerPrimary,
  toggleLeftDrawerPrimary,
  openLeftDrawerSecondary,
  closeLeftDrawerSecondary,
  toggleLeftDrawerSecondary,
  openOverlayDrawer,
  closeOverlayDrawer,
  toggleOverlayDrawer,
  closeAllDrawers,
} = drawerSlice.actions;
