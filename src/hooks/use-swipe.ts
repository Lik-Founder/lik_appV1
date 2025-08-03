import { useState, useRef, useCallback, useEffect } from 'react';

interface SwipeOptions {
  threshold?: number;
  preventDefaultTouchmoveEvent?: boolean;
  trackMouse?: boolean;
  trackTouch?: boolean;
  rotationAngle?: number;
}

interface SwipeEventData {
  event: TouchEvent | MouseEvent;
  absX: number;
  absY: number;
  deltaX: number;
  deltaY: number;
  dir: 'left' | 'right' | 'up' | 'down';
  velocity: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface SwipeHandlers {
  onSwiped?: (eventData: SwipeEventData) => void;
  onSwipedLeft?: (eventData: SwipeEventData) => void;
  onSwipedRight?: (eventData: SwipeEventData) => void;
  onSwipedUp?: (eventData: SwipeEventData) => void;
  onSwipedDown?: (eventData: SwipeEventData) => void;
  onSwipeStart?: (eventData: Partial<SwipeEventData>) => void;
  onSwiping?: (eventData: SwipeEventData) => void;
  onTap?: (eventData: Partial<SwipeEventData>) => void;
}

const defaultOptions: SwipeOptions = {
  threshold: 10,
  preventDefaultTouchmoveEvent: false,
  trackMouse: false,
  trackTouch: true,
  rotationAngle: 0,
};

export function useSwipe(handlers: SwipeHandlers, options: SwipeOptions = {}) {
  const opts = { ...defaultOptions, ...options };
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  
  const startPos = useRef({ x: 0, y: 0, time: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const isTracking = useRef(false);

  const updateVelocity = useCallback(() => {
    const now = Date.now();
    const timeDiff = now - startPos.current.time;
    
    if (timeDiff > 0) {
      velocity.current.x = (currentPos.current.x - startPos.current.x) / timeDiff;
      velocity.current.y = (currentPos.current.y - startPos.current.y) / timeDiff;
    }
  }, []);

  const getEventData = useCallback((event: TouchEvent | MouseEvent): SwipeEventData => {
    const startX = startPos.current.x;
    const startY = startPos.current.y;
    const endX = currentPos.current.x;
    const endY = currentPos.current.y;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    let dir: 'left' | 'right' | 'up' | 'down';
    if (absX > absY) {
      dir = deltaX > 0 ? 'right' : 'left';
    } else {
      dir = deltaY > 0 ? 'down' : 'up';
    }

    const velocityMagnitude = Math.sqrt(
      velocity.current.x * velocity.current.x + velocity.current.y * velocity.current.y
    );

    return {
      event,
      absX,
      absY,
      deltaX,
      deltaY,
      dir,
      velocity: velocityMagnitude,
      startX,
      startY,
      endX,
      endY,
    };
  }, []);

  const handleStart = useCallback((event: TouchEvent | MouseEvent) => {
    const touch = 'touches' in event ? event.touches[0] : event;
    
    startPos.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    
    currentPos.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
    
    lastPos.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
    
    isTracking.current = true;
    setIsSwiping(false);
    setSwipeDirection(null);
    
    if (handlers.onSwipeStart) {
      handlers.onSwipeStart({
        event,
        startX: startPos.current.x,
        startY: startPos.current.y,
      });
    }
  }, [handlers]);

  const handleMove = useCallback((event: TouchEvent | MouseEvent) => {
    if (!isTracking.current) return;
    
    const touch = 'touches' in event ? event.touches[0] : event;
    
    lastPos.current = { ...currentPos.current };
    currentPos.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
    
    updateVelocity();
    
    const deltaX = currentPos.current.x - startPos.current.x;
    const deltaY = currentPos.current.y - startPos.current.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    if (absX > opts.threshold! || absY > opts.threshold!) {
      if (!isSwiping) {
        setIsSwiping(true);
      }
      
      const eventData = getEventData(event);
      setSwipeDirection(eventData.dir);
      
      if (handlers.onSwiping) {
        handlers.onSwiping(eventData);
      }
    }
    
    if (opts.preventDefaultTouchmoveEvent && event.cancelable) {
      event.preventDefault();
    }
  }, [handlers, isSwiping, opts.threshold, opts.preventDefaultTouchmoveEvent, updateVelocity, getEventData]);

  const handleEnd = useCallback((event: TouchEvent | MouseEvent) => {
    if (!isTracking.current) return;
    
    isTracking.current = false;
    updateVelocity();
    
    const deltaX = currentPos.current.x - startPos.current.x;
    const deltaY = currentPos.current.y - startPos.current.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    const eventData = getEventData(event);
    
    if (absX > opts.threshold! || absY > opts.threshold!) {
      if (handlers.onSwiped) {
        handlers.onSwiped(eventData);
      }
      
      switch (eventData.dir) {
        case 'left':
          if (handlers.onSwipedLeft) handlers.onSwipedLeft(eventData);
          break;
        case 'right':
          if (handlers.onSwipedRight) handlers.onSwipedRight(eventData);
          break;
        case 'up':
          if (handlers.onSwipedUp) handlers.onSwipedUp(eventData);
          break;
        case 'down':
          if (handlers.onSwipedDown) handlers.onSwipedDown(eventData);
          break;
      }
    } else if (absX < 5 && absY < 5) {
      // Consider it a tap
      if (handlers.onTap) {
        handlers.onTap({
          event,
          startX: startPos.current.x,
          startY: startPos.current.y,
        });
      }
    }
    
    setIsSwiping(false);
    setSwipeDirection(null);
  }, [handlers, opts.threshold, updateVelocity, getEventData]);

  const eventHandlers = {
    onTouchStart: opts.trackTouch ? handleStart : undefined,
    onTouchMove: opts.trackTouch ? handleMove : undefined,
    onTouchEnd: opts.trackTouch ? handleEnd : undefined,
    onMouseDown: opts.trackMouse ? handleStart : undefined,
    onMouseMove: opts.trackMouse ? handleMove : undefined,
    onMouseUp: opts.trackMouse ? handleEnd : undefined,
  };

  return {
    ...eventHandlers,
    isSwiping,
    swipeDirection,
  };
}