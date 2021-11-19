import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';

type Props = {
  children: React.ReactNode;
} & BoxProps;

function FlexBox({ children, ...args }: Props): JSX.Element {
  return (
    <Box display="flex" {...args}>
      {children}
    </Box>
  );
}

export default FlexBox;
