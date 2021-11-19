import { Brightness2, Brightness4 } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { toggleTheme } from 'src/redux/slices/settingSlice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';

function ThemeChangeIconButton(): JSX.Element {
  const isDarkMode = useAppSelector((s) => s.settings.isDarkMode);
  const dispatch = useAppDispatch();

  return (
    <IconButton onClick={() => dispatch(toggleTheme())} size="large">
      {isDarkMode ? <Brightness2 /> : <Brightness4 />}
    </IconButton>
  );
}

export default ThemeChangeIconButton;
