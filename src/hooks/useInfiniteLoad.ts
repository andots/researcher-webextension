import { useEffect } from 'react';

export function useInfiniteLoad(
  loader: React.RefObject<HTMLDivElement>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadMore: (entries: any) => void,
): void {
  useEffect(() => {
    const observer = new IntersectionObserver(loadMore, {
      root: null,
      rootMargin: '0px',
      threshold: 0.25,
    });

    const { current } = loader;

    if (loader && current != null) {
      observer.observe(current);
    }

    return () => {
      if (current != null) {
        observer.unobserve(current);
      }
    };
  }, [loader, loadMore]);
}
