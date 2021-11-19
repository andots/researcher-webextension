import { Box, Button, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

type Props = {
  icon: JSX.Element;
  text: string;
  onClick: () => void;
};

function SmallSidebarItem({ icon, text, onClick }: Props): JSX.Element {
  return (
    <Button
      sx={{
        width: '100%',
        padding: 0,
        paddingTop: 1,
        paddingBottom: 1,
        marginTop: 1,
        marginBottom: 1,
      }}
      onClick={onClick}
      color="inherit">
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            color: grey[600], // ! should set this?
          }}>
          {icon}
        </Box>
        <Typography
          sx={{
            fontSize: 9,
          }}
          variant="caption">
          {text}
        </Typography>
      </Box>
    </Button>
  );
}

export default SmallSidebarItem;
