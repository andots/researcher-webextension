import { lazy, Suspense } from 'react';

import { Route, Switch } from 'react-router-dom';

import { ROUTE_HOME, ROUTE_IMPORT, ROUTE_SEARCH, ROUTE_SETTINGS } from 'src/constants';

const SearchPage = lazy(() => import('src/pages/SearchPage'));
const ImportPage = lazy(() => import('src/pages/ImportPage'));
const SettingsPage = lazy(() => import('src/pages/SettingsPage'));

function Routing(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <Switch>
        <Route path={ROUTE_HOME} exact>
          <SearchPage />
        </Route>
        {/* component will be remounted each render */}
        {/* <Route path={ROUTE_SEARCH} exact component={SearchPage} /> */}
        <Route path={ROUTE_SEARCH} exact>
          <SearchPage />
        </Route>
        <Route path={ROUTE_IMPORT} exact>
          <ImportPage />
        </Route>
        <Route path={ROUTE_SETTINGS} exact>
          <SettingsPage />
        </Route>
      </Switch>
    </Suspense>
  );
}

export default Routing;
