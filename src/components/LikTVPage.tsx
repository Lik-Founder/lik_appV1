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
  restaurant?: string;
  location?: string;
  viewCount?: string;
  likes?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  category?: 'Challenge' | 'Tutorial' | 'Review' | 'Behind Scenes';
  coins?: number;
  xp?: number;
  trending?: boolean;
  verified?: boolean;
}

const featuredShows: FoodShow[] = [
  {
    id: '1',
    title: 'Ultimate Ramen Battle 2024',
    description: '10 master chefs compete in the most epic ramen cooking challenge. Watch as they create mind-blowing bowls for the ultimate prize of 10,000 Lik Coins!',
    thumbnail: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop',
    creator: 'Chef Master Series',
    category: 'Challenge',
    coins: 500,
    xp: 250,
    trending: true,
    verified: true
  },
  {
    id: '2',
    title: 'Secret Pizza Recipe Revealed',
    description: 'The legendary chef from NYC\'s #1 rated pizzeria finally shares his secret dough recipe that took 20 years to perfect.',
    thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop',
    creator: 'Tony Pizzaiolo',
    restaurant: "Tony's Authentic NY",
    category: 'Tutorial',
    coins: 300,
    xp: 150,
    verified: true
  },
  {
    id: '3',
    title: 'Street Food Adventures: Bangkok',
    description: 'Join us as we explore the hidden gems of Bangkok\'s street food scene, discovering incredible flavors and meeting amazing vendors.',
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
    creator: 'Food Explorer',
    location: 'Bangkok, Thailand',
    category: 'Review',
    coins: 200,
    xp: 100,
    trending: true
  }
];

const gamingShows: FoodShow[] = [
  {
    id: '4',
    title: 'Taco Tuesday Challenge',
    creator: "Maria's Kitchen",
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    location: 'Los Angeles',
    difficulty: 'Easy',
    category: 'Challenge',
    coins: 150,
    xp: 75,
    viewCount: '234K',
    likes: '12K'
  },
  {
    id: '5',
    title: 'Perfect Pasta Techniques',
    creator: "Nonna's Secrets",
    thumbnail: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop',
    location: 'Rome',
    difficulty: 'Medium',
    category: 'Tutorial',
    coins: 250,
    xp: 125,
    viewCount: '456K',
    likes: '23K',
    verified: true
  },
  {
    id: '6',
    title: 'Sushi Master Class',
    creator: "Tokyo Sushi Pro",
    thumbnail: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop',
    location: 'Tokyo',
    difficulty: 'Hard',
    category: 'Tutorial',
    coins: 400,
    xp: 200,
    viewCount: '789K',
    likes: '34K',
    verified: true
  },
  {
    id: '7',
    title: 'Dessert Showdown',
    creator: "Sweet Victory",
    thumbnail: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    location: 'Paris',
    difficulty: 'Medium',
    category: 'Challenge',
    coins: 300,
    xp: 150,
    viewCount: '345K',
    likes: '18K',
    trending: true
  }
];

const restaurantSpotlights: FoodShow[] = [
  {
    id: '8',
    title: 'Behind the Kitchen: Michelin Star Magic',
    creator: 'Restaurant Insider',
    restaurant: "Le Bernardin",
    thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    viewCount: '1.2M',
    likes: '67K',
    category: 'Behind Scenes',
    verified: true
  },
  {
    id: '9',
    title: 'Farm to Fork Journey',
    creator: 'Sustainable Eats',
    restaurant: "Green Valley Bistro",
    thumbnail: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop',
    viewCount: '890K',
    likes: '45K',
    category: 'Behind Scenes'
  },
  {
    id: '10',
    title: 'BBQ Pit Master Secrets',
    creator: 'Smoke & Fire',
    restaurant: "Franklin BBQ",
    thumbnail: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop',
    viewCount: '654K',
    likes: '32K',
    category: 'Tutorial',
    trending: true
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

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'Hard': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'Challenge': return '🏆';
      case 'Tutorial': return '📚';
      case 'Review': return '⭐';
      case 'Behind Scenes': return '🎬';
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
                  
                  {/* Trending Badge */}
                  {show.trending && (
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

                        {/* Rewards Display */}
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                            <span className="text-yellow-400">🪙</span>
                            <span className="text-yellow-400 text-xs font-bold">+{show.coins}</span>
                          </div>
                          <div className="flex items-center space-x-1 bg-purple-500/20 px-2 py-1 rounded-full">
                            <span className="text-purple-400">⭐</span>
                            <span className="text-purple-400 text-xs font-bold">+{show.xp} XP</span>
                          </div>
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
          {/* Gaming & Challenges Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-rum-raisin font-bold text-white text-shadow-lg flex items-center">
                <span className="text-2xl mr-2">🎮</span>
                Cooking Challenges & Tutorials
              </h3>
              <Button 
                variant="ghost" 
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
              >
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gamingShows.map((show) => (
                <div
                  key={show.id}
                  className="relative rounded-2xl overflow-hidden border-2 border-white/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <div className="flex h-28">
                    {/* Thumbnail */}
                    <div 
                      className="w-32 bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${show.thumbnail})` }}
                    >
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayIcon className="w-8 h-8 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 text-white">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-lg">{getCategoryIcon(show.category)}</span>
                        {show.verified && (
                          <StarIcon className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      
                      <h4 className="font-rum-raisin font-bold text-sm mb-1 line-clamp-1 text-shadow">
                        {show.title}
                      </h4>
                      
                      <p className="text-xs text-white/80 mb-2">{show.creator}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {show.difficulty && (
                            <span className={cn("text-xs font-bold", getDifficultyColor(show.difficulty))}>
                              {show.difficulty}
                            </span>
                          )}
                          <span className="text-white/60 text-xs">•</span>
                          <span className="text-white/80 text-xs">{show.viewCount}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">🪙</span>
                            <span className="text-yellow-400 text-xs font-bold">{show.coins}</span>
                          </div>
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

          {/* Restaurant Spotlights Section */}
          <div className="pb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-rum-raisin font-bold text-white text-shadow-lg flex items-center">
                <span className="text-2xl mr-2">🍽️</span>
                Restaurant Spotlights
              </h3>
              <Button 
                variant="ghost" 
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
              >
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurantSpotlights.map((show) => (
                <div
                  key={show.id}
                  className="rounded-2xl overflow-hidden border-2 border-white/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <div className="relative h-32">
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
                      <div className="flex items-center justify-between">
                        <p className="text-white/80 text-xs">{show.restaurant || show.creator}</p>
                        <div className="flex items-center space-x-2 text-xs text-white/80">
                          <span>👁️ {show.viewCount}</span>
                          <span>❤️ {show.likes}</span>
                        </div>
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