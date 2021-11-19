import { Box, Divider } from '@mui/material';

type Props = {
  spacing?: number;
};

function SpacerDivider({ spacing = 0 }: Props): JSX.Element {
  return (
    <Box my={spacing}>
      <Divider />
    </Box>
  );
}

export default SpacerDivider;
