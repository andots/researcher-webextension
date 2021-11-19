import type { TypographyProps } from '@mui/material';

import LineClamp from 'src/components/atoms/LineClamp';
import TypographyText from 'src/components/atoms/TypographyText';

type Props = {
  text: string;
  lineClamp: number;
} & TypographyProps;

function LineClampText({ text, lineClamp, ...args }: Props): JSX.Element {
  return (
    <LineClamp lineClamp={lineClamp}>
      <TypographyText text={text} {...args} />
    </LineClamp>
  );
}

export default LineClampText;
