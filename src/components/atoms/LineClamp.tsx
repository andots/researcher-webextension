import { Box } from '@mui/material';

// WebkitBoxOrient https://developer.mozilla.org/en-US/docs/Web/CSS/box-orient

type Props = {
  children: React.ReactNode;
  lineClamp: number;
};

function LineClamp({ children, lineClamp }: Props): JSX.Element {
  return (
    <Box
      // className="lineClamp"
      sx={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: lineClamp,
        // width: '100%',
      }}
      // style={{
      //   overflow: 'hidden',
      //   textOverflow: 'ellipsis',
      //   display: '-webkit-box',
      //   WebkitBoxOrient: 'vertical',
      //   WebkitLineClamp: lineClamp,
      // }}
    >
      {children}
    </Box>
  );
}

export default LineClamp;
