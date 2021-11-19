import { useMemo } from 'react';

import { CssBaseline, useMediaQuery, useTheme, Box } from '@mui/material';

import LeftDrawer from 'src/components/drawers/LeftDrawer';
import SmallSidebar from 'src/components/drawers/SmallSidebar';
import NavBar from 'src/components/layout/NavBar';
import {
  LEFT_DRAWER_SECONDARY_WIDTH,
  LEFT_DRAWER_WIDTH,
  NAVBAR_HEIGHT,
} from 'src/constants';
import useAutoToggleDrawer from 'src/hooks/useAutoToggleDrawer';
import {
  closeOverlayDrawer,
  toggleLeftDrawerPrimary,
  toggleOverlayDrawer,
} from 'src/redux/slices/drawerSlice';
import { useAppDispatch } from 'src/redux/store';

type Props = {
  children: React.ReactFragment;
};

function AppLayout({ children }: Props): JSX.Element {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const firstBoundary = useMediaQuery(theme.breakpoints.up('sm'));
  const secondBoundary = useMediaQuery(theme.breakpoints.up('lg'));
  const { isLeftDrawerPrimaryOpen, isLeftDrawerSecondaryOpen, isOverlayDrawerOpen } =
    useAutoToggleDrawer(firstBoundary, secondBoundary);
  const leftDrawerWidth = useMemo(() => {
    if (isLeftDrawerPrimaryOpen) {
      return LEFT_DRAWER_WIDTH;
    } else if (!isLeftDrawerPrimaryOpen && isLeftDrawerSecondaryOpen) {
      return LEFT_DRAWER_SECONDARY_WIDTH;
    }
    return '0px';
  }, [isLeftDrawerPrimaryOpen, isLeftDrawerSecondaryOpen]);

  function toggleDrawer() {
    if (secondBoundary) {
      dispatch(toggleLeftDrawerPrimary());
    } else {
      dispatch(toggleOverlayDrawer());
    }
  }

  return (
    <>
      <CssBaseline />
      <div>
        <div style={{ position: 'relative', zIndex: 1000 }}>
          <NavBar onMenuIconClick={toggleDrawer} />
        </div>

        <Box
          sx={{
            padding: 2,
            zIndex: 100,
            position: 'absolute',
            left: LEFT_DRAWER_WIDTH,
            top: '0px',
            display: 'flex',
            // '&.visible': {
            //   left: '0px',
            // },
          }}>
          <LeftDrawer
            variant="persistent"
            displayBrandHead={false}
            open={isLeftDrawerPrimaryOpen}
            onMenuIconClick={toggleDrawer}
            onClose={() => null}
          />
        </Box>

        <SmallSidebar open={isLeftDrawerSecondaryOpen} />

        <Box
          sx={{
            padding: 3,
            marginTop: NAVBAR_HEIGHT,
            marginLeft: leftDrawerWidth,
          }}
          id="content">
          <div id="page">{children}</div>
        </Box>

        <LeftDrawer
          variant="temporary"
          open={isOverlayDrawerOpen}
          displayBrandHead
          onClose={() => dispatch(closeOverlayDrawer())}
          onMenuIconClick={toggleDrawer}
        />
      </div>
    </>
  );
}

export default AppLayout;
