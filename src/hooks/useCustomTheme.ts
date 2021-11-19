import { useMemo } from 'react';

import type { Theme } from '@mui/material';

import { useAppSelector } from 'src/redux/store';
import darkTheme from 'src/themes/darkTheme';
import lightTheme from 'src/themes/lightTheme';

const useCustomTheme = (): Theme => {
  const isDarkMode = useAppSelector((s) => s.settings.isDarkMode);
  const myTheme = useMemo(() => {
    if (isDarkMode) {
      return darkTheme();
    }

    return lightTheme();
  }, [isDarkMode]);

  return myTheme;
};

export default useCustomTheme;
