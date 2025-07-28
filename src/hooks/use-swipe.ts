import { useRef, useCallback, useEffect } from 'react';

export interface SwipeConfig {
  threshold?: number;
  preventDefaultTouchmoveEvent?: boolean;
  trackMouse?: boolean;
  trackTouch?: boolean;
  delta?: number;
  rotationAngle?: number;
}

export interface SwipeEventData {
  event: TouchEvent | MouseEvent;
  absX: number;
  absY: number;
  deltaX: number;
  deltaY: number;
  directionX: number;
  directionY: number;
  velocity: number;
}

export interface SwipeHandlers {
  onSwipeLeft?: (data: SwipeEventData) => void;
  onSwipeRight?: (data: SwipeEventData) => void;
  onSwipeUp?: (data: SwipeEventData) => void;
  onSwipeDown?: (data: SwipeEventData) => void;
  onSwipeStart?: (data: SwipeEventData) => void;
  onSwipeEnd?: (data: SwipeEventData) => void;
  onSwiping?: (data: SwipeEventData) => void;
}

const defaultConfig: SwipeConfig = {
  threshold: 100,
  preventDefaultTouchmoveEvent: false,
  trackMouse: false,
  trackTouch: true,
  delta: 10,
  rotationAngle: 0,
};

export function useSwipe(handlers: SwipeHandlers, config?: SwipeConfig) {
  const elementRef = useRef<HTMLElement>(null);
  const startRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const configRef = useRef({ ...defaultConfig, ...config });

  // Update config ref when config changes
  useEffect(() => {
    configRef.current = { ...defaultConfig, ...config };
  }, [config]);

  const getEventData = useCallback((event: TouchEvent | MouseEvent): SwipeEventData => {
    const touch = 'touches' in event ? event.touches[0] || event.changedTouches[0] : event;
    const start = startRef.current;
    
    if (!start) {
      return {
        event,
        absX: 0,
        absY: 0,
        deltaX: 0,
        deltaY: 0,
        directionX: 0,
        directionY: 0,
        velocity: 0,
      };
    }

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const time = Date.now() - start.time;
    const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / time;

    return {
      event,
      absX,
      absY,
      deltaX,
      deltaY,
      directionX: deltaX > 0 ? 1 : -1,
      directionY: deltaY > 0 ? 1 : -1,
      velocity,
    };
  }, []);

  const handleStart = useCallback((event: TouchEvent | MouseEvent) => {
    const touch = 'touches' in event ? event.touches[0] : event;
    startRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    const data = getEventData(event);
    handlers.onSwipeStart?.(data);
  }, [handlers, getEventData]);

  const handleMove = useCallback((event: TouchEvent | MouseEvent) => {
    if (!startRef.current) return;

    const config = configRef.current;
    const data = getEventData(event);

    if (config.preventDefaultTouchmoveEvent && 'touches' in event) {
      event.preventDefault();
    }

    // Only trigger swiping if movement is above delta threshold
    if (data.absX > config.delta! || data.absY > config.delta!) {
      handlers.onSwiping?.(data);
    }
  }, [handlers, getEventData]);

  const handleEnd = useCallback((event: TouchEvent | MouseEvent) => {
    if (!startRef.current) return;

    const config = configRef.current;
    const data = getEventData(event);

    // Determine swipe direction based on threshold
    const isSwipeLeft = data.deltaX < -config.threshold! && data.absX > data.absY;
    const isSwipeRight = data.deltaX > config.threshold! && data.absX > data.absY;
    const isSwipeUp = data.deltaY < -config.threshold! && data.absY > data.absX;
    const isSwipeDown = data.deltaY > config.threshold! && data.absY > data.absX;

    if (isSwipeLeft) handlers.onSwipeLeft?.(data);
    if (isSwipeRight) handlers.onSwipeRight?.(data);
    if (isSwipeUp) handlers.onSwipeUp?.(data);
    if (isSwipeDown) handlers.onSwipeDown?.(data);

    handlers.onSwipeEnd?.(data);
    startRef.current = null;
  }, [handlers, getEventData]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const config = configRef.current;

    if (config.trackTouch) {
      element.addEventListener('touchstart', handleStart, { passive: true });
      element.addEventListener('touchmove', handleMove, { passive: !config.preventDefaultTouchmoveEvent });
      element.addEventListener('touchend', handleEnd, { passive: true });
    }

    if (config.trackMouse) {
      element.addEventListener('mousedown', handleStart);
      element.addEventListener('mousemove', handleMove);
      element.addEventListener('mouseup', handleEnd);
    }

    return () => {
      if (config.trackTouch) {
        element.removeEventListener('touchstart', handleStart);
        element.removeEventListener('touchmove', handleMove);
        element.removeEventListener('touchend', handleEnd);
      }

      if (config.trackMouse) {
        element.removeEventListener('mousedown', handleStart);
        element.removeEventListener('mousemove', handleMove);
        element.removeEventListener('mouseup', handleEnd);
      }
    };
  }, [handleStart, handleMove, handleEnd]);

  return elementRef;
}