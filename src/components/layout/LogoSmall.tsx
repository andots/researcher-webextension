import { Box, Button, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

import FlexBox from '../atoms/FlexBox';

import { APP_NAME } from 'src/constants';

type Props = {
  onClick: () => void;
};

function LogoSmall({ onClick }: Props): JSX.Element {
  return (
    <Button
      color="inherit"
      sx={{
        margin: 0,
        padding: 0,
        '&:hover': {
          backgroundColor: 'transparent',
        },
      }}
      onClick={() => onClick()}>
      <FlexBox alignItems="center">
        <Box mr={0.5} />
        <Typography sx={{ fontSize: 16, fontWeight: 500, color: grey[700] }}>
          {APP_NAME}
        </Typography>
      </FlexBox>
    </Button>
  );
}

export default LogoSmall;
