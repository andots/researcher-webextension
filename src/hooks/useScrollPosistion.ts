import { useLayoutEffect } from 'react';

import { useUnmount, useWindowScroll } from 'react-use';

import { setScrollPosition } from 'src/redux/slices/scrollSlice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';

const useScrollPosition = (currentQuery: string): void => {
  const { x: currentX, y: currentY } = useWindowScroll();
  const dispatch = useAppDispatch();
  const { query, coordinate } = useAppSelector((s) => s.scroll);

  // ! scroll before re-render
  useLayoutEffect(() => {
    if (query === currentQuery) window.scrollTo(coordinate.x, coordinate.y);
  }, [currentQuery, query, coordinate]);

  useUnmount(() => {
    dispatch(
      setScrollPosition({
        query: currentQuery,
        coordinate: { x: currentX, y: currentY },
      }),
    );
  });
};

export default useScrollPosition;
