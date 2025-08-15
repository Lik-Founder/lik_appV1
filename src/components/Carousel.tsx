import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface CarouselProps {
  children: React.ReactNode[];
  autoScroll?: boolean;
  autoScrollInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
  itemClassName?: string;
  onSlideChange?: (index: number) => void;
}

export function Carousel({
  children,
  autoScroll = false,
  autoScrollInterval = 5000,
  showArrows = true,
  showDots = true,
  className = '',
  itemClassName = '',
  onSlideChange
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const totalSlides = children.length;

  // Auto-scroll functionality
  const startAutoScroll = useCallback(() => {
    if (autoScroll && !isHovered && totalSlides > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % totalSlides;
          onSlideChange?.(nextIndex);
          return nextIndex;
        });
      }, autoScrollInterval);
    }
  }, [autoScroll, isHovered, totalSlides, autoScrollInterval, onSlideChange]);

  const stopAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Start/stop auto-scroll based on hover state
  useEffect(() => {
    if (autoScroll) {
      if (isHovered) {
        stopAutoScroll();
      } else {
        startAutoScroll();
      }
    }

    return () => stopAutoScroll();
  }, [autoScroll, isHovered, startAutoScroll, stopAutoScroll]);

  // Navigation functions
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    onSlideChange?.(index);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % totalSlides;
    goToSlide(newIndex);
  };

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  if (totalSlides === 0) return null;

  return (
    <div 
      className={cn("relative group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Main carousel container */}
      <div 
        ref={carouselRef}
        className="overflow-hidden rounded-2xl"
      >
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {children.map((child, index) => (
            <div 
              key={index} 
              className={cn("w-full flex-shrink-0", itemClassName)}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      {/* Navigation arrows */}
      {showArrows && totalSlides > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 z-10",
              "w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 border-0",
              "text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200",
              "backdrop-blur-sm"
            )}
            onClick={goToPrevious}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 z-10",
              "w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 border-0",
              "text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200",
              "backdrop-blur-sm"
            )}
            onClick={goToNext}
          >
            <ChevronRight size={16} />
          </Button>
        </>
      )}
      {/* Dot indicators */}
      {showDots && totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {children.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                currentIndex === index 
                  ? "bg-primary w-6" 
                  : "bg-muted hover:bg-muted-foreground/40"
              )}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}