import { useState } from 'react';

import {
  ExpandLess,
  ExpandMore,
  Home,
  ImportExport,
  PushPin,
  Settings,
  StarBorder,
  VideoLibrary,
} from '@mui/icons-material';
import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Rating,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import BrandMenuLogo from 'src/components/drawers/BrandMenuLogo';
import IconList from 'src/components/drawers/list_group/IconList';
import {
  LEFT_DRAWER_WIDTH,
  NAVBAR_HEIGHT,
  ROUTE_HOME,
  ROUTE_IMPORT,
  ROUTE_SEARCH,
  ROUTE_SETTINGS,
  VIDEO_SITES,
} from 'src/constants';
import type { SearchMode } from 'src/types';

type Props = {
  open: boolean;
  variant: 'persistent' | 'permanent' | 'temporary';
  onMenuIconClick: () => void;
  displayBrandHead: boolean;
  onClose: () => void;
};

function LeftDrawer({
  open,
  displayBrandHead,
  variant,
  onMenuIconClick,
  onClose,
}: Props): JSX.Element {
  const { t } = useTranslation();
  const history = useHistory<SearchMode>();
  const [openStars, setOpenStars] = useState(true);

  const handleToggleStarMenu = () => {
    setOpenStars(!openStars);
  };

  const goToSearchByStars = (value: number) => {
    history.push(ROUTE_SEARCH, { stars: value });
  };

  return (
    <>
      <Drawer
        open={open}
        variant={variant}
        transitionDuration={0}
        elevation={0}
        onClose={() => onClose()}>
        {/* <CustomScrollbar width={LEFT_DRAWER_WIDTH}> */}
        {displayBrandHead && (
          <Box
            sx={{
              paddingTop: '2px',
              paddingLeft: '14px',
            }}>
            <BrandMenuLogo onMenuIconClick={onMenuIconClick} />
          </Box>
        )}
        <Box
          sx={{
            width: LEFT_DRAWER_WIDTH,
            padding: 1,
          }}>
          {!displayBrandHead && <Box height={NAVBAR_HEIGHT} />}

          <List>
            <IconList
              headerText={t('Home')}
              icon={<Home />}
              onClick={() => history.push(ROUTE_HOME)}
            />

            <IconList
              headerText={t('Read Later')}
              icon={<PushPin />}
              onClick={() => history.push(ROUTE_SEARCH, { isReadLater: true })}
            />

            <ListItemButton onClick={handleToggleStarMenu}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary={t('Stars')} />
              {openStars ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openStars} timeout="auto" unmountOnExit>
              <List component="div">
                {[5, 4, 3, 2, 1, 0].map((v, i) => {
                  return (
                    <ListItemButton
                      key={i}
                      sx={{ pl: 4 }}
                      onClick={() => goToSearchByStars(v)}>
                      <Rating value={v} readOnly />
                    </ListItemButton>
                  );
                })}
              </List>
            </Collapse>

            <IconList
              headerText={t('Videos')}
              icon={<VideoLibrary />}
              onClick={() => history.push(ROUTE_SEARCH, { sites: VIDEO_SITES })}
            />

            <IconList
              headerText={t('Import')}
              icon={<ImportExport />}
              onClick={() => history.push(ROUTE_IMPORT)}
            />

            <IconList
              headerText={t('Settings')}
              icon={<Settings />}
              onClick={() => history.push(ROUTE_SETTINGS)}
            />
          </List>
        </Box>
        {/* </CustomScrollbar> */}
      </Drawer>
    </>
  );
}

export default LeftDrawer;
