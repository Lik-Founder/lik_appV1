import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface HorizontalCarouselProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  showArrows?: boolean;
  autoScroll?: boolean;
  autoScrollInterval?: number;
}

export function HorizontalCarousel({
  children,
  className = '',
  itemClassName = '',
  showArrows = true,
  autoScroll = false,
  autoScrollInterval = 3000
}: HorizontalCarouselProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(autoScroll);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const scrollElement = scrollRef.current;
    
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollPosition);
      return () => scrollElement.removeEventListener('scroll', checkScrollPosition);
    }
  }, [children]);

  // Auto-scroll functionality
  useEffect(() => {
    if (isAutoScrolling && scrollRef.current) {
      const startAutoScroll = () => {
        autoScrollRef.current = setInterval(() => {
          if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            
            if (scrollLeft >= scrollWidth - clientWidth - 1) {
              // Reset to beginning
              scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
              // Scroll to next item
              scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
            }
          }
        }, autoScrollInterval);
      };

      startAutoScroll();

      return () => {
        if (autoScrollRef.current) {
          clearInterval(autoScrollRef.current);
        }
      };
    }
  }, [isAutoScrolling, autoScrollInterval]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleMouseEnter = () => {
    if (autoScroll) {
      setIsAutoScrolling(false);
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    }
  };

  const handleMouseLeave = () => {
    if (autoScroll) {
      setIsAutoScrolling(true);
    }
  };

  if (children.length === 0) return null;

  return (
    <div 
      className={cn("relative group", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left arrow */}
      {showArrows && canScrollLeft && (
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 z-10",
            "w-8 h-8 rounded-full bg-background/80 hover:bg-background border shadow-lg",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          )}
          onClick={scrollLeft}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
      )}

      {/* Right arrow */}
      {showArrows && canScrollRight && (
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 z-10",
            "w-8 h-8 rounded-full bg-background/80 hover:bg-background border shadow-lg",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          )}
          onClick={scrollRight}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      )}

      {/* Scrollable container */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
      >
        {children.map((child, index) => (
          <div key={index} className={cn("flex-shrink-0", itemClassName)}>
            {child}
          </div>
        ))}
      </div>

      {/* Auto-scroll indicator */}
      {autoScroll && isAutoScrolling && (
        <div className="absolute top-0 right-0 w-1 h-1 bg-primary rounded-full animate-pulse" />
      )}
    </div>
  );
}