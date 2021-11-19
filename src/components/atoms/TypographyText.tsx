import type { TypographyProps } from '@mui/material';
import { Typography } from '@mui/material';

type Props = {
  text: string;
} & TypographyProps;

function TypographyText({ text, ...args }: Props): JSX.Element {
  return <Typography {...args}>{text}</Typography>;
}

export default TypographyText;
