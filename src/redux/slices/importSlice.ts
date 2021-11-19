import type { AlertColor } from '@mui/material';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import TreeModel from 'tree-model';

import i18n from 'src/i18n';
import { isWebUrl, uniq } from 'src/libs/utils';
import type { BrowserBookmarksType, ImportResult } from 'src/types';

type State = {
  browserBookmarks: BrowserBookmarksType | undefined;
  importResults: ImportResult[];
  backdropOpen: boolean;
};

const initialState: State = {
  browserBookmarks: undefined,
  importResults: [],
  backdropOpen: false,
};

const initializeImportResults = (urls: string[]) => {
  return urls.map((url) => {
    const result: ImportResult = {
      url,
      status: 'info',
      message: i18n.t('Waiting for fetching'),
    };
    return result;
  });
};

const importSlice = createSlice({
  name: 'import',
  initialState,
  reducers: {
    setBackdropOpen(state, action: PayloadAction<boolean>) {
      state.backdropOpen = action.payload;
    },
    setBrowserBookmarks(
      state,
      action: PayloadAction<browser.Bookmarks.BookmarkTreeNode>,
    ) {
      state.browserBookmarks = action.payload;
      const tree = new TreeModel().parse<BrowserBookmarksType>(state.browserBookmarks);
      tree.walk((node) => {
        node.model.checked = false;
        return node.model.id !== '';
      });
    },
    setImportResultsFromText(state, action: PayloadAction<string>) {
      const text = action.payload;
      const data = uniq(text.split('\n')); // ! uniq beforehand
      const urls: string[] = [];
      data.forEach((url) => {
        if (isWebUrl(url)) {
          urls.push(url);
        }
      });
      state.importResults = initializeImportResults(urls);
    },
    setImportResults(state, action: PayloadAction<string[]>) {
      const urls = action.payload;
      state.importResults = initializeImportResults(urls);
    },
    updateImportResult(state, action: PayloadAction<ImportResult>) {
      const newResult = action.payload;
      const index = state.importResults.findIndex((a) => a.url === newResult.url);
      if (index !== -1) {
        state.importResults[index] = newResult;
      }
    },
    orderImportResults(state) {
      const getValue = (status: AlertColor) => {
        if (status === 'error') {
          return 4;
        } else if (status === 'warning') {
          return 3;
        } else if (status === 'info') {
          return 2;
        } else if (status === 'success') {
          return 1;
        }
        return 0;
      };
      // ! sort error, warning, info, success
      state.importResults.sort((a, b) => {
        const valueA = getValue(a.status);
        const valueB = getValue(b.status);
        return valueA > valueB ? -1 : 1;
      });
    },
    removeImportResult(state, action: PayloadAction<string>) {
      const url = action.payload;
      const index = state.importResults.findIndex((a) => a.url === url);
      if (index !== -1) {
        state.importResults.splice(index, 1);
      }
    },
    toggleNodeChecked(state, action: PayloadAction<string>) {
      if (state.browserBookmarks) {
        const id = action.payload;
        const tree = new TreeModel().parse<BrowserBookmarksType>(state.browserBookmarks);
        const target = tree.first((node) => node.model.id === id);
        if (target) {
          target.model.checked = !target.model.checked;
          // ! if the target node is folder
          if (target.model.type === 'folder' && target.hasChildren()) {
            if (target.model.checked == true) {
              // ! check true all children of the target
              target.walk((node) => {
                node.model.checked = true;
                return node.model.id !== '';
              });
            } else {
              // ! check false all children of the target
              target.walk((node) => {
                node.model.checked = false;
                return node.model.id !== '';
              });
            }
          }
          // ! set urls type === bookmark and checked, also uniq urls
          const urls = uniq(
            tree
              .all((a) => a.model.checked && a.model.type === 'bookmark')
              .map((a) => a.model.url),
          );
          state.importResults = initializeImportResults(urls);
        }
      }
    },
  },
});

export default importSlice.reducer;

export const {
  setBackdropOpen,
  setBrowserBookmarks,
  setImportResults,
  setImportResultsFromText,
  updateImportResult,
  removeImportResult,
  orderImportResults,
  toggleNodeChecked,
} = importSlice.actions;
