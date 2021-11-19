import {
  Home,
  ImportExport,
  Settings,
  StarBorder,
  VideoLibrary,
  WatchLaterOutlined,
} from '@mui/icons-material';
import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import SmallSidebarItem from './SmallSidebarItem';

import {
  LEFT_DRAWER_SECONDARY_WIDTH,
  ROUTE_HOME,
  ROUTE_IMPORT,
  ROUTE_SEARCH,
  ROUTE_SETTINGS,
  VIDEO_SITES,
} from 'src/constants';
import type { SearchMode } from 'src/types';

type Props = {
  open: boolean;
};

function SmallSidebar({ open }: Props): JSX.Element {
  const { t } = useTranslation();
  const history = useHistory<SearchMode>();

  if (open) {
    return (
      <Container
        sx={{
          position: 'fixed',
          left: '0px',
          backgroundColor: 'background.paper',
          width: LEFT_DRAWER_SECONDARY_WIDTH,
          height: '100vh',
        }}
        disableGutters>
        <SmallSidebarItem
          icon={<Home />}
          text={t('Home')}
          onClick={() => history.push(ROUTE_HOME)}
        />
        <SmallSidebarItem
          icon={<WatchLaterOutlined />}
          text={t('Read Later')}
          onClick={() => history.push(ROUTE_SEARCH, { isReadLater: true })}
        />
        <SmallSidebarItem
          icon={<StarBorder />}
          text={t('Stars')}
          onClick={() => history.push(ROUTE_SEARCH, { stars: 5 })}
        />
        <SmallSidebarItem
          icon={<VideoLibrary />}
          text={t('Videos')}
          onClick={() => history.push(ROUTE_SEARCH, { sites: VIDEO_SITES })}
        />
        <SmallSidebarItem
          icon={<ImportExport />}
          text={t('Import')}
          onClick={() => history.push(ROUTE_IMPORT)}
        />
        <SmallSidebarItem
          icon={<Settings />}
          text={t('Settings')}
          onClick={() => history.push(ROUTE_SETTINGS)}
        />
      </Container>
    );
  }

  return <span />;
}

export default SmallSidebar;
