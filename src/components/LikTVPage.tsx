import { useState, useEffect } from 'react';
import { MagnifyingGlass, Bell, User, Play, ChevronLeft } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCarouselSwipe } from '@/hooks';
import { cn } from '@/lib/utils';

interface LikTVPageProps {
  onBack: () => void;
}

interface Show {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  creator?: string;
  location?: string;
  viewCount?: string;
}

const featuredShows: Show[] = [
  {
    id: '1',
    title: 'Top Chefs: International',
    description: 'In this annual competition, where 10 chefs from the top rated restaurants in the world come to compete for notoriety and a cash prize.',
    thumbnail: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&h=600&fit=crop'
  },
  {
    id: '2',
    title: 'Street Food Masters',
    description: 'Discover the hidden gems of street food culture from around the world with local food experts.',
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop'
  },
  {
    id: '3',
    title: 'Kitchen Nightmares Global',
    description: 'Watch as celebrity chef transforms struggling restaurants across different continents.',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop'
  }
];

const forYouShows: Show[] = [
  {
    id: '4',
    title: 'Best Steak in San Francisco',
    creator: "Mike's Reviews",
    thumbnail: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    location: 'San Francisco'
  },
  {
    id: '5',
    title: 'Authentic Ramen Guide',
    creator: "Tokyo Eats",
    thumbnail: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    location: 'Tokyo'
  },
  {
    id: '6',
    title: 'Pizza Tour NYC',
    creator: "NYC Food Guide",
    thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    location: 'New York'
  },
  {
    id: '7',
    title: 'Taco Truck Adventures',
    creator: "LA Street Food",
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    location: 'Los Angeles'
  }
];

const popularSeries: Show[] = [
  {
    id: '8',
    title: 'Culinary World Tour',
    viewCount: '2.1M views',
    thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop'
  },
  {
    id: '9',
    title: 'Dessert Masters',
    viewCount: '1.8M views',
    thumbnail: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop'
  },
  {
    id: '10',
    title: 'Farm to Table',
    viewCount: '1.5M views',
    thumbnail: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop'
  },
  {
    id: '11',
    title: 'Wine & Dine',
    viewCount: '1.2M views',
    thumbnail: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop'
  }
];

export function LikTVPage({ onBack }: LikTVPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  // Set up swipe gestures for carousel
  const { swipeHandlers, dragOffset, isDragging } = useCarouselSwipe({
    itemCount: featuredShows.length,
    currentIndex: currentSlide,
    onIndexChange: setCurrentSlide,
    threshold: 50,
  });

  // Track user interaction to pause auto-scroll
  const enhancedSwipeHandlers = {
    ...swipeHandlers,
    onTouchStart: (e: React.TouchEvent) => {
      setIsUserInteracting(true);
      swipeHandlers.onTouchStart(e);
    },
    onMouseDown: (e: React.MouseEvent) => {
      setIsUserInteracting(true);
      swipeHandlers.onMouseDown(e);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      setIsUserInteracting(false);
      swipeHandlers.onTouchEnd(e);
    },
    onMouseUp: (e: React.MouseEvent) => {
      setIsUserInteracting(false);
      swipeHandlers.onMouseUp(e);
    },
  };

  // Auto-scroll carousel (paused during user interaction)
  useEffect(() => {
    if (isUserInteracting || isDragging) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredShows.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isUserInteracting, isDragging]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between p-4 bg-background/95 backdrop-blur-sm border-b border-border">
        {/* LikTV Logo */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-1 hover:bg-muted md:hidden"
          >
            <ChevronLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold text-primary">LikTV</h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search for a show"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-0 focus:bg-background"
            />
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-muted">
            <Bell size={20} />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 hover:bg-muted">
            <User size={20} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Carousel Section */}
        <div 
          className="liktv-carousel relative h-[400px] mb-8 overflow-hidden bg-black cursor-grab active:cursor-grabbing select-none"
          {...enhancedSwipeHandlers}
        >
          <div 
            className={cn(
              "liktv-carousel-slide flex h-full",
              dragOffset !== 0 && "dragging"
            )}
            style={{ 
              transform: `translateX(-${currentSlide * 100}%) translateX(${dragOffset}px)`,
              transition: dragOffset !== 0 ? 'none' : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {featuredShows.map((show, index) => (
              <div
                key={show.id}
                className="min-w-full h-full relative bg-cover bg-center"
                style={{ backgroundImage: `url(${show.thumbnail})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-3xl font-bold mb-2">{show.title}</h2>
                  <p className="text-sm mb-4 max-w-md opacity-90 line-clamp-2">
                    {show.description}
                  </p>
                  <Button 
                    className="bg-white text-black hover:bg-white/90 font-semibold px-6"
                  >
                    <Play size={16} className="mr-2" />
                    Watch Now
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Swipe Indicator */}
          {dragOffset !== 0 && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div 
                className={cn(
                  "bg-white/20 backdrop-blur-sm rounded-full p-4 transition-opacity",
                  Math.abs(dragOffset) > 50 ? "opacity-100" : "opacity-50"
                )}
              >
                <div className="text-white text-sm font-medium">
                  {dragOffset > 0 ? "← Previous" : "Next →"}
                </div>
              </div>
            </div>
          )}

          {/* Dots Indicator */}
          <div className="absolute bottom-6 right-6 flex space-x-2">
            {featuredShows.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentSlide ? "bg-white" : "bg-white/50"
                )}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        <div className="px-4 space-y-8">
          {/* For You Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center nav-rum-raisin">
              <span className="text-primary mr-2">✨</span>
              For You
            </h3>
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
              {forYouShows.map((show) => (
                <div
                  key={show.id}
                  className="flex-shrink-0 w-48 bg-card rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={show.thumbnail}
                      alt={show.title}
                      className="w-full h-28 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-muted-foreground mb-1">{show.creator}</p>
                    <p className="text-sm font-medium line-clamp-2 mb-1">{show.title}</p>
                    <p className="text-xs text-muted-foreground">{show.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Food Series Section */}
          <div className="pb-8">
            <h3 className="text-lg font-semibold mb-4 nav-rum-raisin">Popular Food Series</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {popularSeries.map((show) => (
                <div
                  key={show.id}
                  className="bg-card rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={show.thumbnail}
                      alt={show.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-sm font-medium line-clamp-1 mb-1">
                        {show.title}
                      </p>
                      <p className="text-white/80 text-xs">{show.viewCount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}