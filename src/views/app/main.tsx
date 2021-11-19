import { render } from 'preact';

import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import store, { persistor } from 'src/redux/store';
import App from 'src/views/app/App';

import 'src/i18n';

const Main = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </PersistGate>
    </Provider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
render(<Main />, document.getElementById('root')!);
