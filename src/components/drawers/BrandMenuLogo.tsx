import { Menu } from '@mui/icons-material';
import { Box, IconButton, Button, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useHistory } from 'react-router-dom';

import FlexBox from 'src/components/atoms/FlexBox';
import { APP_NAME, ROUTE_HOME } from 'src/constants';

type Props = {
  onMenuIconClick: () => void;
};

function BrandMenuLogo({ onMenuIconClick }: Props): JSX.Element {
  const history = useHistory();

  return (
    <Box alignItems="center" display="flex">
      <IconButton onClick={() => onMenuIconClick()} size="large">
        <Menu />
      </IconButton>
      <Box>
        <Button
          sx={{
            margin: 0,
            padding: 0,
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
          onClick={() => history.push(ROUTE_HOME)}>
          <FlexBox alignItems="center">
            <Box mr={0.5} />
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: grey[700] }}>
              {APP_NAME}
            </Typography>
          </FlexBox>
        </Button>
      </Box>
    </Box>
  );
}

export default BrandMenuLogo;
