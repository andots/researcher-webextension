import { ThemeProvider } from '@mui/material';

import EsCheck from 'src/components/app/EsCheck';
import Routing from 'src/components/app/Routing';
import AppLayout from 'src/components/layout/AppLayout';
import useCustomTheme from 'src/hooks/useCustomTheme';

import 'src/styles/global.scss';
import 'src/styles/readable.scss';

function App(): JSX.Element {
  const theme = useCustomTheme();

  return (
    <ThemeProvider theme={theme}>
      <AppLayout>
        <EsCheck>
          <Routing />
        </EsCheck>
      </AppLayout>
    </ThemeProvider>
  );
}

export default App;
