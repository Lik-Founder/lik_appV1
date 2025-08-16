import { useRef, useCallback } from 'react';

interface SwipeTabsOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
  preventScroll?: boolean;
}

export function useSwipeTabs({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  preventScroll = false
}: SwipeTabsOptions) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);
  const isSwipingRef = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      touchEnd.current = null;
      isSwipingRef.current = false;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && touchStart.current) {
      touchEnd.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };

      const deltaX = Math.abs(touchEnd.current.x - touchStart.current.x);
      const deltaY = Math.abs(touchEnd.current.y - touchStart.current.y);

      // If horizontal movement is greater than vertical, it's likely a horizontal swipe
      if (deltaX > deltaY && deltaX > 10) {
        isSwipingRef.current = true;
        if (preventScroll) {
          e.preventDefault();
        }
      }
    }
  }, [preventScroll]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) {
      touchStart.current = null;
      touchEnd.current = null;
      isSwipingRef.current = false;
      return;
    }

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = Math.abs(touchEnd.current.y - touchStart.current.y);

    // Only trigger swipe if horizontal movement is greater than vertical and exceeds threshold
    if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > deltaY) {
      if (deltaX > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }

    touchStart.current = null;
    touchEnd.current = null;
    isSwipingRef.current = false;
  }, [onSwipeLeft, onSwipeRight, threshold]);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}