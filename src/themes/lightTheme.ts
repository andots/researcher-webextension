import type { Theme } from '@mui/material';
import { createTheme } from '@mui/material';
import { green } from '@mui/material/colors';

import {
  commonBreakPoints,
  commonMuiButtonOverrides,
  commonMuiDrawer,
  commonPaletteError,
  commonPrimaryMain,
  commonTextWhite,
  commonTypography,
} from './common';

// background
const backgroundDefault = '#ffffff';
// const backgroundSecondary = '#efefef';
const backgroundSecondary = '#f5f5f5';
// text
const textPrimary = '#2B2828';
const textSecondary = '#1a0dab';
// icons
// export const lightThemeIconColor = "#7a7a7a";

const lightTheme = (): Theme => {
  return createTheme({
    typography: commonTypography,
    palette: {
      primary: {
        main: commonPrimaryMain,
      },
      secondary: {
        main: green[500],
        contrastText: commonTextWhite,
      },
      text: {
        primary: textPrimary,
        secondary: textSecondary,
      },
      background: {
        default: backgroundDefault,
        paper: backgroundSecondary,
      },
      error: commonPaletteError,
    },
    breakpoints: commonBreakPoints,
    components: {
      MuiButton: {
        styleOverrides: commonMuiButtonOverrides,
      },
      MuiDrawer: {
        styleOverrides: commonMuiDrawer,
      },
    },
  });
};

export default lightTheme;
