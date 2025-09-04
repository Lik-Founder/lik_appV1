import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlayIcon, ChevronLeftIcon, FireIcon, TrophyIcon, StarIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCarouselSwipe } from '@/hooks';
import { cn } from '@/lib/utils';
import likLogo from '@/assets/images/Lik_Logo_Heart_1.0.png';

interface LikTVPageProps {
  onBack: () => void;
}

interface FoodShow {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  creator?: string;
  channel?: string;
  network?: string;
  location?: string;
  viewCount?: string;
  likes?: string;
  duration?: string;
  category?: 'Series' | 'Documentary' | 'Tutorial' | 'Behind Scenes' | 'Review' | 'Travel';
  season?: number;
  episode?: number;
  rating?: number;
  trending?: boolean;
  verified?: boolean;
  new?: boolean;
  featured?: boolean;
}

const featuredShows: FoodShow[] = [
  {
    id: '1',
    title: 'Chef\'s Table: BBQ Masters',
    description: 'An intimate look at the world\'s most talented BBQ pitmasters and their unique techniques. Follow their journeys from humble beginnings to culinary stardom.',
    thumbnail: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&h=600&fit=crop',
    creator: 'David Gelb',
    network: 'Food Network',
    category: 'Series',
    season: 2,
    episode: 6,
    duration: '52 min',
    rating: 4.8,
    trending: true,
    verified: true,
    featured: true
  },
  {
    id: '2',
    title: 'The Secret Life of Sourdough',
    description: 'Master baker Nancy Silverton reveals the ancient art of sourdough bread making in this exclusive documentary series.',
    thumbnail: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop',
    creator: 'Nancy Silverton',
    channel: 'Artisan Bakers TV',
    category: 'Documentary',
    duration: '45 min',
    rating: 4.9,
    verified: true,
    new: true
  },
  {
    id: '3',
    title: 'Street Food Chronicles: Tokyo',
    description: 'Explore the hidden gems of Tokyo\'s street food scene with local vendors who have perfected their craft over generations.',
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
    creator: 'Kenji López-Alt',
    network: 'Culinary Adventures',
    location: 'Tokyo, Japan',
    category: 'Travel',
    duration: '38 min',
    rating: 4.7,
    trending: true,
    verified: true
  }
];

const forYouShows: FoodShow[] = [
  {
    id: '4',
    title: 'Pasta Perfection with Nonna',
    creator: "Nonna's Kitchen",
    channel: "Italian Culinary Institute",
    thumbnail: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop',
    location: 'Tuscany, Italy',
    category: 'Tutorial',
    duration: '32 min',
    viewCount: '2.4M',
    likes: '156K',
    rating: 4.9,
    verified: true
  },
  {
    id: '5',
    title: 'Michelin Stars: The Pursuit',
    creator: "Fine Dining Docs",
    network: "Gourmet TV",
    thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    category: 'Documentary',
    duration: '58 min',
    viewCount: '1.8M',
    likes: '89K',
    rating: 4.6,
    verified: true,
    new: true
  },
  {
    id: '6',
    title: 'Sushi: Art in Motion',
    creator: "Master Jiro",
    channel: "Tokyo Culinary Arts",
    thumbnail: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop',
    location: 'Tokyo, Japan',
    category: 'Documentary',
    duration: '42 min',
    viewCount: '3.1M',
    likes: '203K',
    rating: 4.8,
    verified: true
  },
  {
    id: '7',
    title: 'Farm to Table Revolution',
    creator: "Sustainable Chef",
    channel: "Green Cuisine Network",
    thumbnail: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop',
    category: 'Documentary',
    duration: '48 min',
    viewCount: '945K',
    likes: '67K',
    rating: 4.5,
    trending: true
  }
];

const popularSeries: FoodShow[] = [
  {
    id: '8',
    title: 'Anthony Bourdain: No Reservations',
    creator: 'Anthony Bourdain',
    network: 'Travel Channel',
    thumbnail: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
    viewCount: '12.5M',
    likes: '890K',
    category: 'Travel',
    season: 8,
    episode: 142,
    duration: '45 min',
    rating: 4.9,
    verified: true
  },
  {
    id: '9',
    title: 'The French Chef',
    creator: 'Julia Child',
    network: 'PBS',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    viewCount: '5.2M',
    likes: '234K',
    category: 'Tutorial',
    season: 10,
    episode: 200,
    duration: '30 min',
    rating: 4.8,
    verified: true
  },
  {
    id: '10',
    title: 'Mind of a Chef',
    creator: 'David Chang',
    network: 'PBS',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    viewCount: '3.7M',
    likes: '187K',
    category: 'Series',
    season: 5,
    episode: 65,
    duration: '55 min',
    rating: 4.7,
    trending: true,
    verified: true
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

  const getRatingStars = (rating?: number) => {
    if (!rating) return '';
    return '⭐'.repeat(Math.floor(rating));
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'Series': return '📺';
      case 'Documentary': return '🎬';
      case 'Tutorial': return '👨‍🍳';
      case 'Behind Scenes': return '🎭';
      case 'Review': return '⭐';
      case 'Travel': return '🌍';
      default: return '📺';
    }
  };

  return (
    <div className="flex flex-col h-full min-h-screen" 
         style={{
           background: 'linear-gradient(135deg, #FF7BAA 0%, #FF1A75 50%, #B30026 100%)'
         }}>
      
      {/* Floating Navigation Bar */}
      <div className="relative z-20 mx-4 mt-4 mb-2">
        <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-white/30"
             style={{
               background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
               backdropFilter: 'blur(16px)',
               boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.2), 0 8px 32px rgba(0, 0, 0, 0.2)'
             }}>
          {/* Back Button & Logo */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 hover:bg-white/20 text-white border border-white/30 rounded-xl"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <img src={likLogo} alt="Lik" className="w-6 h-6" />
              <h1 className="text-xl font-rum-raisin font-bold text-white text-shadow-lg">
                LikTV
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
              <Input
                placeholder="Search food shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 rounded-xl focus:bg-white/30 focus:border-white/50"
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
              🔥
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
              🏆
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Carousel Section */}
        <div className="relative mx-4 mb-6">
          <div 
            className="liktv-carousel relative h-[300px] overflow-hidden bg-black/20 cursor-grab active:cursor-grabbing select-none rounded-2xl border-2 border-white/20"
            {...enhancedSwipeHandlers}
            style={{
              backdropFilter: 'blur(10px)',
              boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
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
                  className="min-w-full h-full relative bg-cover bg-center rounded-2xl overflow-hidden"
                  style={{ backgroundImage: `url(${show.thumbnail})` }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  
                  {/* New Badge */}
                  {show.new && (
                    <div className="absolute top-4 left-4 flex items-center space-x-1 bg-green-500/90 px-3 py-1 rounded-full">
                      <span className="text-white text-xs font-bold">NEW</span>
                    </div>
                  )}

                  {/* Trending Badge */}
                  {show.trending && !show.new && (
                    <div className="absolute top-4 left-4 flex items-center space-x-1 bg-red-500/90 px-3 py-1 rounded-full">
                      <FireIcon className="w-4 h-4 text-white" />
                      <span className="text-white text-xs font-bold">TRENDING</span>
                    </div>
                  )}

                  {/* Verified Badge */}
                  {show.verified && (
                    <div className="absolute top-4 right-4 bg-blue-500/90 p-2 rounded-full">
                      <StarIcon className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getCategoryIcon(show.category)}</span>
                      <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
                        {show.category}
                      </span>
                      {show.network && (
                        <span className="text-sm font-medium bg-blue-500/20 px-2 py-1 rounded-full">
                          {show.network}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-2xl font-rum-raisin font-bold mb-2 text-shadow-lg">
                      {show.title}
                    </h2>
                    
                    <p className="text-sm mb-3 max-w-md opacity-90 line-clamp-2 text-shadow">
                      {show.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button 
                          className="glossy-red-pill font-rum-raisin text-white px-6 py-2"
                        >
                          <PlayIcon className="w-4 h-4 mr-2" />
                          Watch Now
                        </Button>

                        {/* Show Details */}
                        <div className="flex items-center space-x-2">
                          {show.duration && (
                            <div className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded-full">
                              <span className="text-white/80 text-xs">{show.duration}</span>
                            </div>
                          )}
                          {show.rating && (
                            <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                              <span className="text-yellow-400 text-xs">⭐ {show.rating}</span>
                            </div>
                          )}
                          {show.season && (
                            <div className="flex items-center space-x-1 bg-purple-500/20 px-2 py-1 rounded-full">
                              <span className="text-purple-400 text-xs">S{show.season}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 right-6 flex space-x-2">
              {featuredShows.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all border border-white/50",
                    index === currentSlide 
                      ? "bg-white scale-110" 
                      : "bg-white/30 hover:bg-white/50"
                  )}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="px-4 space-y-8 pb-20">
          {/* For You Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-rum-raisin font-bold text-white text-shadow-lg flex items-center">
                <span className="text-2xl mr-2">🎯</span>
                For You
              </h3>
              <Button 
                variant="ghost" 
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
              >
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {forYouShows.map((show) => (
                <div
                  key={show.id}
                  className="relative rounded-2xl overflow-hidden border-2 border-white/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <div className="flex h-32">
                    {/* Thumbnail */}
                    <div 
                      className="w-40 bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${show.thumbnail})` }}
                    >
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayIcon className="w-8 h-8 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      
                      {show.new && (
                        <div className="absolute top-2 left-2 bg-green-500/90 px-2 py-1 rounded-full">
                          <span className="text-white text-xs font-bold">NEW</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 text-white">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-lg">{getCategoryIcon(show.category)}</span>
                        <div className="flex items-center space-x-1">
                          {show.verified && (
                            <StarIcon className="w-4 h-4 text-blue-400" />
                          )}
                          {show.rating && (
                            <span className="text-yellow-400 text-xs">⭐ {show.rating}</span>
                          )}
                        </div>
                      </div>
                      
                      <h4 className="font-rum-raisin font-bold text-sm mb-1 line-clamp-1 text-shadow">
                        {show.title}
                      </h4>
                      
                      <p className="text-xs text-white/80 mb-1">{show.creator}</p>
                      {show.channel && (
                        <p className="text-xs text-blue-300 mb-2">{show.channel}</p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-white/80">
                          {show.duration && <span>{show.duration}</span>}
                          {show.viewCount && (
                            <>
                              <span>•</span>
                              <span>{show.viewCount} views</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {show.trending && (
                    <div className="absolute top-2 right-2 bg-red-500/90 px-2 py-1 rounded-full">
                      <span className="text-white text-xs font-bold">🔥</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Popular Series Section */}
          <div className="pb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-rum-raisin font-bold text-white text-shadow-lg flex items-center">
                <span className="text-2xl mr-2">📺</span>
                Popular Series
              </h3>
              <Button 
                variant="ghost" 
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
              >
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularSeries.map((show) => (
                <div
                  key={show.id}
                  className="rounded-2xl overflow-hidden border-2 border-white/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <div className="relative h-40">
                    <img
                      src={show.thumbnail}
                      alt={show.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
                        <PlayIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {show.verified && (
                      <div className="absolute top-2 right-2 bg-blue-500/90 p-1 rounded-full">
                        <StarIcon className="w-3 h-3 text-white" />
                      </div>
                    )}

                    {show.trending && (
                      <div className="absolute top-2 left-2 bg-red-500/90 px-2 py-1 rounded-full">
                        <span className="text-white text-xs font-bold">🔥</span>
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white font-rum-raisin font-bold text-sm line-clamp-1 text-shadow mb-1">
                        {show.title}
                      </p>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-white/80 text-xs">{show.network || show.creator}</p>
                        <div className="flex items-center space-x-1 text-xs text-white/80">
                          {show.rating && <span>⭐ {show.rating}</span>}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/70">
                        <span>{show.viewCount} views</span>
                        {show.season && show.episode && (
                          <span>S{show.season} • {show.episode} episodes</span>
                        )}
                      </div>
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