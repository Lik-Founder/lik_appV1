import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
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
  onSlideChange,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const totalSlides = children.length;

  // Progress animation for auto-scroll
  const startProgressAnimation = useCallback(() => {
    if (autoScroll && !isHovered) {
      setProgressValue(0);
      const startTime = Date.now();
      
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = (elapsed / autoScrollInterval) * 100;
        
        if (progress >= 100) {
          setProgressValue(100);
        } else {
          setProgressValue(progress);
          progressRef.current = setTimeout(updateProgress, 16); // ~60fps
        }
      };
      
      updateProgress();
    }
  }, [autoScroll, isHovered, autoScrollInterval]);

  const stopProgressAnimation = useCallback(() => {
    if (progressRef.current) {
      clearTimeout(progressRef.current);
      setProgressValue(0);
    }
  }, []);

  // Auto-scroll functionality
  const startAutoScroll = useCallback(() => {
    if (autoScroll && !isHovered && totalSlides > 1) {
      startProgressAnimation();
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % totalSlides;
          onSlideChange?.(nextIndex);
          return nextIndex;
        });
      }, autoScrollInterval);
    }
  }, [autoScroll, isHovered, totalSlides, autoScrollInterval, onSlideChange, startProgressAnimation]);

  const stopAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    stopProgressAnimation();
  }, [stopProgressAnimation]);

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
    // Reset auto-scroll when manually navigating
    if (autoScroll) {
      stopAutoScroll();
      startAutoScroll();
    }
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

  // Keyboard navigation support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        goToPrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        goToNext();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1);
        break;
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
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`Carousel with ${totalSlides} slides`}
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
            <CaretLeft size={16} />
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
            <CaretRight size={16} />
          </Button>
        </>
      )}

      {/* Dot indicators */}
      {showDots && totalSlides > 1 && (
        <div className="flex justify-center gap-3 mt-4">
          {children.map((_, index) => (
            <button
              key={index}
              className={cn(
                "carousel-dot relative rounded-full transition-all duration-300 ease-out",
                "touch-target cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50",
                "border-2 border-white/20",
                currentIndex === index 
                  ? "bg-gradient-to-r from-primary to-secondary h-2 w-2 shadow-lg shadow-primary/30 active" 
                  : "bg-white/60 h-2 w-2 hover:bg-white/80 hover:scale-110 shadow-md"
              )}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={currentIndex === index ? 'true' : 'false'}
              tabIndex={0}
              style={{
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                '--dot-index': index,
              } as React.CSSProperties}
            >
              {/* Active dot glow effect */}
              {currentIndex === index && (
                <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
              )}

              {/* Auto-scroll progress indicator */}
              {currentIndex === index && autoScroll && !isHovered && (
                <div 
                  className="absolute inset-1 rounded-full bg-gradient-to-r from-white/80 to-white/60"
                  style={{
                    clipPath: `polygon(0 0, ${progressValue}% 0, ${progressValue}% 100%, 0 100%)`,
                    transition: 'clip-path 0.1s linear'
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}