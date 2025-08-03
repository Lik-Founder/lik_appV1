import { useCallback, useRef, useState } from 'react';

interface UseCarouselSwipeProps {
  itemCount: number;
  currentIndex: number;
  onIndexChange: (index: number) => void;
  threshold?: number;
  disabled?: boolean;
}

interface SwipeState {
  startX: number;
  currentX: number;
  isDragging: boolean;
  startTime: number;
}

export function useCarouselSwipe({
  itemCount,
  currentIndex,
  onIndexChange,
  threshold = 50,
  disabled = false,
}: UseCarouselSwipeProps) {
  const swipeStateRef = useRef<SwipeState>({
    startX: 0,
    currentX: 0,
    isDragging: false,
    startTime: 0,
  });
  const [dragOffset, setDragOffset] = useState(0);

  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (disabled) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    
    swipeStateRef.current = {
      startX: clientX,
      currentX: clientX,
      isDragging: true,
      startTime: Date.now(),
    };
    
    // Prevent default only for touch events to avoid interfering with mouse events
    if ('touches' in e) {
      e.preventDefault();
    }
  }, [disabled]);

  const handleTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (disabled || !swipeStateRef.current.isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - swipeStateRef.current.startX;
    
    swipeStateRef.current.currentX = clientX;
    setDragOffset(deltaX);
    
    // Prevent default to avoid scrolling on mobile
    if ('touches' in e) {
      e.preventDefault();
    }
  }, [disabled]);

  const handleTouchEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (disabled || !swipeStateRef.current.isDragging) return;
    
    const deltaX = swipeStateRef.current.currentX - swipeStateRef.current.startX;
    const deltaTime = Date.now() - swipeStateRef.current.startTime;
    const velocity = Math.abs(deltaX) / deltaTime;
    
    // Reset drag state
    swipeStateRef.current.isDragging = false;
    setDragOffset(0);
    
    // Determine if swipe was significant enough
    const isSignificantSwipe = Math.abs(deltaX) > threshold || velocity > 0.5;
    
    if (isSignificantSwipe) {
      if (deltaX > 0) {
        // Swipe right - go to previous
        const newIndex = currentIndex === 0 ? itemCount - 1 : currentIndex - 1;
        onIndexChange(newIndex);
      } else {
        // Swipe left - go to next
        const newIndex = currentIndex === itemCount - 1 ? 0 : currentIndex + 1;
        onIndexChange(newIndex);
      }
    }
  }, [disabled, threshold, currentIndex, itemCount, onIndexChange]);

  const handleMouseLeave = useCallback(() => {
    if (disabled || !swipeStateRef.current.isDragging) return;
    
    // End drag if mouse leaves the area
    swipeStateRef.current.isDragging = false;
    setDragOffset(0);
  }, [disabled]);

  const swipeHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleTouchStart,
    onMouseMove: handleTouchMove,
    onMouseUp: handleTouchEnd,
    onMouseLeave: handleMouseLeave,
  };

  return {
    swipeHandlers,
    dragOffset,
    isDragging: swipeStateRef.current.isDragging,
  };
}