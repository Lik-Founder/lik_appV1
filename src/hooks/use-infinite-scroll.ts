import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  hasNextPage: boolean;
  isLoading: boolean;
  fetchNextPage: () => void;
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
}

export function useInfiniteScroll({
  hasNextPage,
  isLoading,
  fetchNextPage,
  threshold = 0.1,
  root = null,
  rootMargin = '100px'
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isLoading) {
        fetchNextPage();
      }
    },
    [hasNextPage, isLoading, fetchNextPage]
  );

  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root,
      rootMargin,
      threshold
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [handleObserver, root, rootMargin, threshold]);

  return observerRef;
}