import { Launch } from '@mui/icons-material';
import { Alert, AlertTitle, Button } from '@mui/material';

import FlexBox from 'src/components/atoms/FlexBox';
import { openApp } from 'src/libs/browsers';

type Props = {
  title: string;
  buttonText: string;
};

function AlertBox({ title, buttonText }: Props): JSX.Element {
  return (
    <FlexBox flexDirection="column" sx={{ padding: 2 }}>
      <Alert severity="error">
        <AlertTitle>{title}</AlertTitle>
      </Alert>
      <FlexBox justifyContent="flex-end" sx={{ mt: 1 }}>
        <Button variant="contained" startIcon={<Launch />} onClick={() => openApp()}>
          {buttonText}
        </Button>
      </FlexBox>
    </FlexBox>
  );
}

export default AlertBox;
