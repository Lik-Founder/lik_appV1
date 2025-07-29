import { useRef, useState, useCallback } from 'react';

interface SwipeConfig {
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function useCommentSwipe({
  threshold = 50,
  onSwipeLeft,
  onSwipeRight
}: SwipeConfig) {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const isSwiping = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
    setSwipeDirection(null);
    setSwipeDistance(0);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartX.current) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX.current;
    const deltaY = Math.abs(currentY - touchStartY.current);

    // Only consider horizontal swipes (vertical scrolling should work normally)
    if (deltaY > 30) return;

    // Prevent default scrolling when swiping horizontally
    if (Math.abs(deltaX) > 10) {
      e.preventDefault();
      isSwiping.current = true;
    }

    if (Math.abs(deltaX) > threshold) {
      const direction = deltaX > 0 ? 'right' : 'left';
      setSwipeDirection(direction);
      setSwipeDistance(Math.abs(deltaX));
    }
  }, [threshold]);

  const handleTouchEnd = useCallback(() => {
    if (!isSwiping.current) return;

    if (swipeDirection === 'left' && onSwipeLeft) {
      onSwipeLeft();
    } else if (swipeDirection === 'right' && onSwipeRight) {
      onSwipeRight();
    }

    // Reset state
    touchStartX.current = 0;
    touchStartY.current = 0;
    isSwiping.current = false;
    setSwipeDirection(null);
    setSwipeDistance(0);
  }, [swipeDirection, onSwipeLeft, onSwipeRight]);

  const getSwipeStyle = useCallback(() => {
    if (!swipeDirection || swipeDistance === 0) return {};

    const opacity = Math.min(swipeDistance / (threshold * 2), 1);
    return {
      transform: `translateX(${swipeDirection === 'right' ? swipeDistance : -swipeDistance}px)`,
      opacity: 1 - opacity * 0.3
    };
  }, [swipeDirection, swipeDistance, threshold]);

  return {
    swipeDirection,
    swipeDistance,
    isSwiping: isSwiping.current,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    getSwipeStyle
  };
}