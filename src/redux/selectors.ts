import type { RootState } from 'src/redux/rootReducer';
import type { DrawerState } from 'src/redux/slices/drawerSlice';

export const selectDrawerState = (state: RootState): DrawerState => {
  return state.drawer;
};

type ImportNumbers = {
  success: number;
  error: number;
  warning: number;
};

export const selectImportResultsReport = (state: RootState): ImportNumbers => {
  let success = 0;
  let error = 0;
  let warning = 0;
  state.import.importResults.forEach((a) => {
    if (a.status === 'success') {
      success += 1;
    } else if (a.status === 'error') {
      error += 1;
    } else if (a.status === 'warning') {
      warning += 1;
    }
  });
  return { success, error, warning };
};

// export const selectSuccessImportsNumber = (state: RootState): number => {
//   const count = state.import.importResults.filter((a) => a.status === 'success').length;
//   return count;
// };
