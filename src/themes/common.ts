import { grey } from '@mui/material/colors';
import type { TypographyOptions } from '@mui/material/styles/createTypography';

import {
  BREAKPOINT_LARGE,
  BREAKPOINT_MEDIUM,
  BREAKPOINT_SMALL,
  BREAKPOINT_X_LARGE,
  BREAKPOINT_X_SMALL,
} from 'src/constants';

// common theme
export const commonPrimaryMain = '#4c96d7';
export const commonBackgroundWhite = '#efefef';

export const commonTextBlack = grey[800];
export const commonTextWhite = '#efefef';
export const commonTextGray = '#7a7a7a';

// custom breakpoints
export const commonBreakPoints = {
  values: {
    xs: BREAKPOINT_X_SMALL,
    sm: BREAKPOINT_SMALL,
    md: BREAKPOINT_MEDIUM,
    lg: BREAKPOINT_LARGE,
    xl: BREAKPOINT_X_LARGE,
  },
};

// common pallet
export const commonPaletteError = {
  main: '#ee0000',
  dark: '#c40000',
};

// common config
// https://material-ui.com/ja/customization/default-theme/?expand-path=$.typography
export const commonTypography: TypographyOptions = {
  fontFamily: [
    'Roboto',
    '-apple-system',
    'BlinkMacSystemFont',
    'Hiragino Kaku Gothic ProN',
    'Hiragino Sans',
    'Arial',
    'BIZ UDPGothic',
    'Meiryo',
    'sans-serif',
    'Segoe UI',
    'Helvetica Neue',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
  ].join(','),
  fontSize: 14,
  h1: {
    fontWeight: 500,
    fontSize: '3rem',
    lineHeight: 1.167,
    letterSpacing: '0em',
  },
  h2: {
    fontWeight: 'normal',
    // fontSize: '2.125rem',
    fontSize: '1.3rem',
    lineHeight: 1.6,
    // letterSpacing: '0.00735em',
  },
  h3: {
    fontWeight: 500,
    fontSize: '1.5rem',
    lineHeight: 1.334,
    letterSpacing: '0em',
  },
  h4: {
    fontWeight: 500,
    fontSize: '1.25rem',
    lineHeight: 1.6,
    letterSpacing: '0.0075em',
  },
  h5: {
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: 1.2,
    letterSpacing: '0.0075em',
  },
  h6: {
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: 1.2,
    letterSpacing: '0.0075em',
  },
  body1: {
    fontSize: '0.9rem',
  },
  // overline: {
  //   fontWeight: "bold",
  // },
};

export const commonMuiButtonOverrides = {
  root: {
    fontSize: '0.875rem',
    letterSpacing: '0.08rem',
    borderRadius: '1px',
  },
  text: {
    paddingLeft: 12,
    paddingRight: 12,
  },
};

export const commonMuiDrawer = {
  paperAnchorLeft: {
    borderRightColor: 'none',
    borderColor: 'transparent !important',
  },
};
