import type { Theme } from '@mui/material';
import { createTheme } from '@mui/material';
import { blue, green, grey } from '@mui/material/colors';

import {
  commonBreakPoints,
  commonMuiButtonOverrides,
  commonMuiDrawer,
  commonPaletteError,
  commonPrimaryMain,
  commonTypography,
} from './common';

// background
const backgroundDefault = '#181818';
const backgroundSecondary = '#212121';

// palette
const darkThemePrimaryMain = commonPrimaryMain;

// text
const textPrimary = grey[50];
const textSecondary = blue[300];

// icon
// const iconColor = grey[300];

const darkTheme = (): Theme => {
  return createTheme({
    typography: commonTypography,
    palette: {
      mode: 'dark',
      primary: {
        main: darkThemePrimaryMain,
        contrastText: grey[50],
      },
      secondary: {
        main: green[500],
        contrastText: grey[50],
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

export default darkTheme;
