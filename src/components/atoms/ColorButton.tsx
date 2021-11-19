import type { ButtonProps } from '@mui/material';

import LoadableButton from 'src/components/atoms/LoadableButton';

type StyleProps = {
  backgroundColor: string;
  hoverColor: string;
};

type Props = {
  text: string;
  isLoading?: boolean;
} & ButtonProps &
  StyleProps;

ColorButton.defaultProps = {
  isLoading: false,
};

function ColorButton({
  text,
  backgroundColor,
  hoverColor,
  isLoading,
  ...args
}: Props): JSX.Element {
  return (
    <LoadableButton
      sx={{
        color: (theme) => theme.palette.getContrastText(backgroundColor),
        backgroundColor,
        '&:hover': {
          backgroundColor: hoverColor,
        },
      }}
      isLoading={isLoading}
      text={text}
      {...args}
    />
  );
}

export default ColorButton;
