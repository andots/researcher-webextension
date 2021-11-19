import { Launch } from '@mui/icons-material';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

import { APP_NAME } from 'src/constants';
import { openApp } from 'src/libs/browsers';

function PopupAppbar(): JSX.Element {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent" elevation={1}>
        <Toolbar>
          <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }}>
            {APP_NAME}
          </Typography>
          <Button color="inherit" startIcon={<Launch />} onClick={() => openApp()}>
            Open
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default PopupAppbar;
