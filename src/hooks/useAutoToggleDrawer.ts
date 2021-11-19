import { useCallback, useEffect } from 'react';

import {
  openLeftDrawerPrimary,
  closeLeftDrawerPrimary,
  openLeftDrawerSecondary,
  closeAllDrawers,
  closeOverlayDrawer,
} from 'src/redux/slices/drawerSlice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';

type ReturnType = {
  isLeftDrawerPrimaryOpen: boolean;
  isLeftDrawerSecondaryOpen: boolean;
  isOverlayDrawerOpen: boolean;
};

function useAutoToggleDrawer(
  isGreaterThanFirstBoundary: boolean,
  isGreaterThanSecondBoundary: boolean,
): ReturnType {
  const { isLeftDrawerPrimaryOpen, isLeftDrawerSecondaryOpen, isOverlayDrawerOpen } =
    useAppSelector((s) => s.drawer);
  const dispatch = useAppDispatch();

  const onBreakpoints = useCallback(() => {
    if (!isGreaterThanFirstBoundary && !isGreaterThanSecondBoundary) {
      dispatch(closeAllDrawers());
    } else if (isGreaterThanFirstBoundary && !isGreaterThanSecondBoundary) {
      dispatch(closeLeftDrawerPrimary());
      dispatch(openLeftDrawerSecondary());
    } else if (isGreaterThanFirstBoundary && isGreaterThanSecondBoundary) {
      dispatch(closeOverlayDrawer());
      dispatch(openLeftDrawerSecondary());
      dispatch(openLeftDrawerPrimary());
    }
  }, [isGreaterThanFirstBoundary, isGreaterThanSecondBoundary, dispatch]);

  useEffect(() => {
    onBreakpoints();
  }, [isGreaterThanFirstBoundary, isGreaterThanSecondBoundary, onBreakpoints]);

  return {
    isLeftDrawerPrimaryOpen,
    isLeftDrawerSecondaryOpen,
    isOverlayDrawerOpen,
  };
}

export default useAutoToggleDrawer;
