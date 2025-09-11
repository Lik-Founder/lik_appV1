import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlayIcon, ChevronLeftIcon, FireIcon, TrophyIcon, StarIcon, ClockIcon, EyeIcon, HeartIcon, PlusIcon, BookmarkIcon, ShareIcon, SpeakerWaveIcon, PauseIcon } from '@heroicons/react/24/outline';
import { PlayIcon as PlayIconSolid } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  category?: 'Series' | 'Documentary' | 'Tutorial' | 'Behind Scenes' | 'Review' | 'Travel' | 'Live';
  season?: number;
  episode?: number;
  rating?: number;
  trending?: boolean;
  verified?: boolean;
  new?: boolean;
  featured?: boolean;
  progress?: number;
  isLive?: boolean;
  quality?: '4K' | 'HD' | 'SD';
}

const featuredShows: FoodShow[] = [
  {
    id: '1',
    title: 'Chef\'s Table: Pizza',
    description: 'Journey to the birthplace of pizza to meet the masters who are redefining this beloved comfort food with their creativity and passion.',
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1200&h=675&fit=crop',
    creator: 'David Gelb',
    network: 'Food Network',
    category: 'Series',
    season: 1,
    episode: 6,
    duration: '52 min',
    rating: 4.9,
    quality: '4K',
    trending: true,
    verified: true,
    featured: true,
    progress: 35
  },
  {
    id: '2',
    title: 'Street Food: Asia',
    description: 'Colorful and rich in flavor, history and tradition. Explore the world of Asian street food culture.',
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=675&fit=crop',
    creator: 'Kenji López-Alt',
    network: 'Culinary Adventures',
    location: 'Tokyo, Japan',
    category: 'Travel',
    duration: '38 min',
    rating: 4.8,
    quality: '4K',
    verified: true,
    new: true
  },
  {
    id: '3',
    title: 'The Art of Pasta',
    description: 'Italian grandmothers share secrets passed down through generations in this heartwarming series.',
    thumbnail: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200&h=675&fit=crop',
    creator: "Nonna's Kitchen",
    channel: "Italian Culinary Institute",
    location: 'Tuscany, Italy',
    category: 'Tutorial',
    duration: '32 min',
    rating: 4.9,
    quality: 'HD',
    verified: true,
    featured: true,
    progress: 0
  }
];

const trendingShows: FoodShow[] = [
  {
    id: '4',
    title: 'Bourdain: No Reservations',
    creator: 'Anthony Bourdain',
    network: 'Travel Channel',
    thumbnail: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
    viewCount: '12.5M',
    likes: '890K',
    category: 'Travel',
    duration: '45 min',
    rating: 4.9,
    quality: 'HD',
    verified: true,
    trending: true
  },
  {
    id: '5',
    title: 'Salt Fat Acid Heat',
    creator: 'Samin Nosrat',
    network: 'Netflix',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    viewCount: '8.2M',
    likes: '456K',
    category: 'Documentary',
    duration: '58 min',
    rating: 4.7,
    quality: '4K',
    verified: true,
    new: true
  },
  {
    id: '6',
    title: 'Mind of a Chef',
    creator: 'David Chang',
    network: 'PBS',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    viewCount: '3.7M',
    likes: '187K',
    category: 'Series',
    duration: '55 min',
    rating: 4.6,
    quality: 'HD',
    trending: true,
    verified: true
  },
  {
    id: '7',
    title: 'Cooked',
    creator: 'Michael Pollan',
    network: 'Netflix',
    thumbnail: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop',
    viewCount: '6.1M',
    likes: '321K',
    category: 'Documentary',
    duration: '48 min',
    rating: 4.5,
    quality: '4K',
    verified: true
  }
];

const liveShows: FoodShow[] = [
  {
    id: '8',
    title: 'Live from Test Kitchen',
    creator: 'Bon Appétit',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    category: 'Live',
    isLive: true,
    viewCount: '12.3K watching',
    verified: true,
    quality: 'HD'
  },
  {
    id: '9',
    title: 'Morning Coffee & Pastries',
    creator: 'French Café',
    thumbnail: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
    category: 'Live',
    isLive: true,
    viewCount: '8.9K watching',
    location: 'Paris, France',
    verified: true,
    quality: 'HD'
  }
];

const categories = [
  { name: 'All', icon: '🎬', color: 'primary' },
  { name: 'Series', icon: '📺', color: 'blue' },
  { name: 'Documentary', icon: '🎥', color: 'green' },
  { name: 'Tutorial', icon: '👨‍🍳', color: 'orange' },
  { name: 'Travel', icon: '🌍', color: 'purple' },
  { name: 'Live', icon: '🔴', color: 'red' },
  { name: 'Review', icon: '⭐', color: 'yellow' }
];

export function LikTVPage({ onBack }: LikTVPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isPlaying, setIsPlaying] = useState(false);

  // Set up swipe gestures for hero carousel
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
    if (isUserInteracting || isDragging || isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredShows.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isUserInteracting, isDragging, isPlaying]);

  const currentShow = featuredShows[currentSlide];

  const getCategoryIcon = (category?: string) => {
    const cat = categories.find(c => c.name === category);
    return cat?.icon || '📺';
  };

  const getCategoryColor = (category?: string) => {
    const cat = categories.find(c => c.name === category);
    return cat?.color || 'primary';
  };

  const getQualityBadge = (quality?: string) => {
    switch (quality) {
      case '4K': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'HD': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-black">
      
      {/* Netflix-style App Bar */}
      <div className="sticky top-0 z-50 bg-gradient-to-b from-black/90 via-black/70 to-transparent backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-4">
          {/* Left Side - Logo */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 hover:bg-white/10 text-white rounded-lg transition-all"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <img src={likLogo} alt="Lik" className="w-8 h-8" />
              <h1 className="text-xl md:text-2xl font-rum-raisin font-bold text-white">
                LikTV
              </h1>
            </div>
          </div>

          {/* Right Side - Controls */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-white/10 text-white rounded-lg transition-all"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="px-4 pb-4">
            <div className="relative max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search shows, creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border-gray-600 text-white placeholder-gray-400 pl-10 rounded-lg focus:border-white"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Category Navigation */}
        <div className="px-4 pb-4">
          <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
                className={cn(
                  "px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all",
                  selectedCategory === category.name
                    ? "bg-white text-black hover:bg-gray-200"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                )}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <div className="relative h-[70vh] overflow-hidden">
          <div 
            className="flex h-full transition-transform duration-700 ease-out"
            {...enhancedSwipeHandlers}
            style={{ 
              transform: `translateX(-${currentSlide * 100}%) translateX(${dragOffset}px)`,
              transition: dragOffset !== 0 ? 'none' : 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {featuredShows.map((show, index) => (
              <div
                key={show.id}
                className="min-w-full h-full relative"
                style={{
                  backgroundImage: `url(${show.thumbnail})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <div className="max-w-2xl">
                    {/* Quality & Category Badges */}
                    <div className="flex items-center space-x-3 mb-4">
                      {show.quality && (
                        <Badge className={cn("text-white font-bold px-3 py-1", getQualityBadge(show.quality))}>
                          {show.quality}
                        </Badge>
                      )}
                      <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                        <span className="mr-1">{getCategoryIcon(show.category)}</span>
                        {show.category}
                      </Badge>
                      {show.verified && (
                        <StarIcon className="w-5 h-5 text-blue-400" />
                      )}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-rum-raisin font-bold text-white mb-4 leading-tight">
                      {show.title}
                    </h1>
                    
                    <p className="text-sm md:text-base text-gray-200 mb-6 max-w-xl leading-relaxed">
                      {show.description}
                    </p>

                    {/* Show Info */}
                    <div className="flex items-center space-x-4 mb-6 text-gray-300">
                      <span className="font-medium">{show.creator}</span>
                      {show.network && (
                        <>
                          <span>•</span>
                          <span>{show.network}</span>
                        </>
                      )}
                      {show.rating && (
                        <>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">⭐</span>
                            <span>{show.rating}</span>
                          </div>
                        </>
                      )}
                      {show.duration && (
                        <>
                          <span>•</span>
                          <span>{show.duration}</span>
                        </>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-4">
                      <Button 
                        size="lg"
                        className="bg-white text-black hover:bg-gray-200 font-bold px-8 py-3 rounded-lg"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? (
                          <PauseIcon className="w-6 h-6 mr-2" />
                        ) : (
                          <PlayIconSolid className="w-6 h-6 mr-2" />
                        )}
                        {isPlaying ? 'Pause' : 'Play'}
                      </Button>

                      <Button 
                        variant="outline"
                        size="lg"
                        className="bg-gray-600/70 backdrop-blur-sm border-gray-600 text-white hover:bg-gray-600 px-6 py-3 rounded-lg"
                      >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        My List
                      </Button>

                      <Button 
                        variant="ghost"
                        size="lg"
                        className="text-white hover:bg-white/10 p-3 rounded-full"
                      >
                        <HeartIcon className="w-6 h-6" />
                      </Button>

                      <Button 
                        variant="ghost"
                        size="lg"
                        className="text-white hover:bg-white/10 p-3 rounded-full"
                      >
                        <ShareIcon className="w-6 h-6" />
                      </Button>
                    </div>

                    {/* Progress Bar */}
                    {show.progress && show.progress > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                          <span>Continue watching</span>
                          <span>{show.progress}% complete</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1">
                          <div 
                            className="bg-red-600 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${show.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Audio Controls */}
                <div className="absolute bottom-8 right-8">
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10 p-3 rounded-full border border-white/30"
                  >
                    <SpeakerWaveIcon className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Hero Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {featuredShows.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentSlide ? "bg-white w-8" : "bg-gray-500 hover:bg-gray-400"
                )}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="px-4 md:px-8 space-y-12 py-12 bg-gradient-to-b from-black to-gray-900">
          
          {/* Live Now Section */}
          {liveShows.length > 0 && (
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <h2 className="text-xl md:text-2xl font-rum-raisin font-bold text-white">
                  Live Now
                </h2>
              </div>
              <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
                {liveShows.map((show) => (
                  <div
                    key={show.id}
                    className="min-w-[280px] bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-all cursor-pointer group"
                  >
                    <div className="relative">
                      <img
                        src={show.thumbnail}
                        alt={show.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-red-500 px-2 py-1 rounded text-white text-xs font-bold flex items-center space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span>LIVE</span>
                      </div>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <PlayIconSolid className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-rum-raisin font-bold text-white mb-1">{show.title}</h3>
                      <p className="text-gray-400 text-xs mb-2">{show.creator}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{show.viewCount}</span>
                        {show.verified && <StarIcon className="w-4 h-4 text-blue-400" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <FireIcon className="w-6 h-6 text-orange-500" />
                <h2 className="text-xl md:text-2xl font-rum-raisin font-bold text-white">
                  Trending Now
                </h2>
              </div>
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                See All →
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trendingShows.map((show, index) => (
                <div
                  key={show.id}
                  className="group cursor-pointer"
                >
                  <div className="relative mb-3">
                    <img
                      src={show.thumbnail}
                      alt={show.title}
                      className="w-full aspect-video object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 rounded-lg transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <PlayIconSolid className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-bold">
                      #{index + 1}
                    </div>
                    {show.quality && (
                      <div className={cn("absolute top-2 right-2 px-2 py-1 rounded text-white text-xs font-bold", getQualityBadge(show.quality))}>
                        {show.quality}
                      </div>
                    )}
                  </div>
                  <h3 className="text-base font-rum-raisin font-bold text-white mb-1 line-clamp-1 group-hover:text-red-400 transition-colors">
                    {show.title}
                  </h3>
                  <p className="text-gray-400 text-xs mb-1">{show.creator}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{show.viewCount}</span>
                    <div className="flex items-center space-x-1">
                      {show.verified && <StarIcon className="w-3 h-3 text-blue-400" />}
                      {show.rating && (
                        <span className="text-yellow-400">⭐ {show.rating}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My List Section */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <BookmarkIcon className="w-6 h-6 text-white" />
              <h2 className="text-xl md:text-2xl font-rum-raisin font-bold text-white">
                Continue Watching
              </h2>
            </div>
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
              {featuredShows.filter(show => show.progress && show.progress > 0).map((show) => (
                <div
                  key={show.id}
                  className="min-w-[320px] bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-all cursor-pointer group"
                >
                  <div className="relative">
                    <img
                      src={show.thumbnail}
                      alt={show.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <PlayIconSolid className="w-12 h-12 text-white" />
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                      <div 
                        className="bg-red-600 h-1"
                        style={{ width: `${show.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-rum-raisin font-bold text-white mb-1">{show.title}</h3>
                    <p className="text-gray-400 text-xs mb-2">{show.creator}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{show.progress}% complete</span>
                      <span className="text-gray-500">{show.duration}</span>
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