import type { ButtonProps } from '@mui/material';
import { Button, CircularProgress } from '@mui/material';
import { grey } from '@mui/material/colors';

type Props = {
  text: string;
  isLoading?: boolean;
} & ButtonProps;

LoadableButton.defaultProps = {
  isLoading: false,
};

function LoadableButton({ isLoading, text, ...rest }: Props): JSX.Element {
  const { disabled, ...props } = rest;

  return (
    <span style={{ position: 'relative', width: 'fit-content' }}>
      <span>
        <Button {...props} disabled={!!(isLoading || disabled)}>
          {text}
        </Button>
      </span>
      {isLoading && (
        <CircularProgress
          sx={{
            color: grey[50],
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
          size={24}
        />
      )}
    </span>
  );
}

export default LoadableButton;
