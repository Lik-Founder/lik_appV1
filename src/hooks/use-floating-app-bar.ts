import { useState, useEffect, useRef, useCallback } from 'react';

interface UseFloatingAppBarOptions {
  threshold?: number; // Minimum scroll distance to trigger hide/show
  hideOnScrollDown?: boolean; // Whether to hide when scrolling down
  showOnScrollUp?: boolean; // Whether to show when scrolling up
  scrollContainer?: HTMLElement | null; // Custom scroll container
}

export function useFloatingAppBar({
  threshold = 10,
  hideOnScrollDown = true,
  showOnScrollUp = true,
  scrollContainer
}: UseFloatingAppBarOptions = {}) {
  const [isVisible, setIsVisible] = useState(true);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const lastScrollY = useRef(0);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  const handleScroll = useCallback(() => {
    const container = scrollContainer || containerRef.current;
    if (!container) return;

    const currentScrollY = container.scrollTop;
    const scrollDifference = Math.abs(currentScrollY - lastScrollY.current);

    // Only update if scroll difference is significant enough
    if (scrollDifference < threshold) {
      return;
    }

    const direction = currentScrollY > lastScrollY.current ? 'down' : 'up';
    setScrollDirection(direction);

    // Update visibility based on scroll direction
    if (direction === 'down' && hideOnScrollDown && currentScrollY > threshold) {
      setIsVisible(false);
    } else if (direction === 'up' && showOnScrollUp) {
      setIsVisible(true);
    }

    // Show app bar when at the top of the page
    if (currentScrollY <= threshold) {
      setIsVisible(true);
    }

    lastScrollY.current = currentScrollY;

    // Clear any existing timer and set a new one
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }

    // Show app bar after user stops scrolling for a short time
    scrollTimer.current = setTimeout(() => {
      setScrollDirection(null);
    }, 150);
  }, [threshold, hideOnScrollDown, showOnScrollUp, scrollContainer]);

  useEffect(() => {
    const container = scrollContainer || document.documentElement;
    containerRef.current = container;

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', throttledHandleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', throttledHandleScroll);
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, [handleScroll, scrollContainer]);

  return {
    isVisible,
    scrollDirection,
    isScrollingDown: scrollDirection === 'down',
    isScrollingUp: scrollDirection === 'up',
    containerRef: (element: HTMLElement | null) => {
      if (!scrollContainer && element) {
        containerRef.current = element;
      }
    }
  };
}