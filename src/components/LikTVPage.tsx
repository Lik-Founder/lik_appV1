import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlayIcon, ChevronLeftIcon, FireIcon, TrophyIcon, StarIcon, FunnelIcon, ClockIcon, AdjustmentsHorizontalIcon, SparklesIcon, EyeIcon, HeartIcon } from '@heroicons/react/24/outline';
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Latest');

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
      case 'All': return '🎬';
      case 'Series': return '📺';
      case 'Documentary': return '🎥';
      case 'Tutorial': return '👨‍🍳';
      case 'Behind Scenes': return '🎭';
      case 'Review': return '⭐';
      case 'Travel': return '🌍';
      default: return '📺';
    }
  };

  const filterOptions = ['All', 'Series', 'Documentary', 'Tutorial', 'Travel', 'Review'];
  const sortOptions = ['Latest', 'Popular', 'Trending', 'Top Rated', 'Duration'];

  return (
    <div className="flex flex-col h-full min-h-screen bg-gradient-to-br from-slate-900 via-background to-slate-900">
      
      {/* Enhanced App Bar with Glassmorphic Design */}
      <div className="sticky top-0 z-30">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-xl border-b border-primary/20"></div>
        
        {/* Floating light effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-24 h-24 bg-accent/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Left Side - Back Button & Enhanced Logo */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2 hover:bg-primary/20 text-foreground rounded-xl transition-all hover:scale-110 group"
              >
                <ChevronLeftIcon className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform" />
              </Button>
              <div className="flex items-center space-x-2 group">
                <div className="relative">
                  <img src={likLogo} alt="Lik" className="w-8 h-8 transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-30"></div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-rum-raisin font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    LikTV
                  </h1>
                  <span className="text-xs text-muted-foreground -mt-1">Food Content Platform</span>
                </div>
              </div>
            </div>

            {/* Right Side - Enhanced Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={cn(
                  "p-2 rounded-xl transition-all hover:scale-110",
                  isSearchOpen 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "hover:bg-primary/20 text-foreground"
                )}
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-accent/20 text-foreground rounded-xl transition-all hover:scale-110"
              >
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
              </Button>
              
              {/* Live indicator */}
              <div className="flex items-center space-x-1 bg-red-500/20 px-2 py-1 rounded-full liktv-badge-glow">
                <div className="w-2 h-2 bg-red-500 rounded-full liktv-live-pulse"></div>
                <span className="text-xs text-red-400 font-medium">LIVE</span>
              </div>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          {isSearchOpen && (
            <div className="px-4 pb-3 liktv-search-expand">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 rounded-2xl blur-sm"></div>
                <div className="relative liktv-backdrop-enhanced rounded-2xl p-1">
                  <div className="flex items-center">
                    <MagnifyingGlassIcon className="w-5 h-5 ml-3 text-primary" />
                    <Input
                      placeholder="Search culinary adventures..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none px-3"
                      autoFocus
                    />
                    <div className="flex items-center space-x-1 mr-2">
                      <SparklesIcon className="w-4 h-4 text-accent animate-pulse" />
                      <span className="text-xs text-accent font-medium">AI</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Filter Chips */}
          <div className="px-4 pb-3">
            <div className="flex items-center space-x-3 overflow-x-auto scrollbar-hide">
              {/* Category Filters with Icons */}
              {filterOptions.map((filter) => (
                <Button
                  key={filter}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className={cn(
                    "px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all relative overflow-hidden group",
                    selectedFilter === filter
                      ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/30 scale-105 liktv-filter-active"
                      : "liktv-glass-card text-muted-foreground hover:bg-primary/20 hover:text-primary hover:border-primary/50"
                  )}
                >
                  {selectedFilter === filter && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 animate-pulse"></div>
                  )}
                  <span className="relative z-10 flex items-center space-x-1">
                    <span>{getCategoryIcon(filter)}</span>
                    <span>{filter}</span>
                  </span>
                </Button>
              ))}
              
              {/* Enhanced Trending Button */}
              <Button
                variant="ghost"
                size="sm"
                className="px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium relative overflow-hidden group bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 hover:from-orange-500/30 hover:to-red-500/30 border border-orange-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 animate-pulse"></div>
                <div className="relative z-10 flex items-center space-x-1">
                  <FireIcon className="w-4 h-4 animate-pulse" />
                  <span>Trending</span>
                </div>
              </Button>
              
              {/* Sort with enhanced styling */}
              <div className="flex items-center space-x-2 bg-card/30 backdrop-blur-sm rounded-full px-3 py-2 border border-border/50">
                <ClockIcon className="w-4 h-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-foreground text-sm focus:outline-none appearance-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option} className="bg-background text-foreground">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Enhanced Design */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Floating background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="liktv-floating-elements absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="liktv-floating-elements absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl"></div>
          <div className="liktv-floating-elements absolute top-3/4 left-1/2 w-32 h-32 bg-secondary/5 rounded-full blur-2xl"></div>
        </div>

        {/* Enhanced Hero Carousel Section */}
        <div className="relative mx-4 mb-8 mt-6">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 rounded-3xl blur-xl"></div>
          
          <div 
            className="liktv-carousel relative h-[350px] overflow-hidden cursor-grab active:cursor-grabbing select-none rounded-3xl border border-primary/30 shadow-2xl shadow-primary/10"
            {...enhancedSwipeHandlers}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 20px 40px rgba(0, 0, 0, 0.3)'
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
                  className="min-w-full h-full relative bg-cover bg-center rounded-3xl overflow-hidden"
                  style={{ backgroundImage: `url(${show.thumbnail})` }}
                >
                  {/* Enhanced Overlay with Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20" />
                  
                  {/* Premium Quality Badge */}
                  {show.featured && (
                    <div className="absolute top-6 left-6 flex items-center space-x-2 bg-gradient-to-r from-yellow-500/90 to-orange-500/90 px-4 py-2 rounded-full shadow-lg">
                      <SparklesIcon className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-bold">FEATURED</span>
                    </div>
                  )}

                  {/* New Badge with Animation */}
                  {show.new && !show.featured && (
                    <div className="absolute top-6 left-6 flex items-center space-x-2 bg-gradient-to-r from-green-500/90 to-emerald-500/90 px-4 py-2 rounded-full shadow-lg animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                      <span className="text-white text-sm font-bold">NEW</span>
                    </div>
                  )}

                  {/* Enhanced Trending Badge */}
                  {show.trending && !show.new && !show.featured && (
                    <div className="absolute top-6 left-6 flex items-center space-x-2 bg-gradient-to-r from-orange-500/90 to-red-500/90 px-4 py-2 rounded-full shadow-lg">
                      <FireIcon className="w-4 h-4 text-white animate-pulse" />
                      <span className="text-white text-sm font-bold">TRENDING</span>
                    </div>
                  )}

                  {/* Enhanced Verified Badge */}
                  {show.verified && (
                    <div className="absolute top-6 right-6 bg-gradient-to-r from-blue-500/90 to-purple-500/90 p-3 rounded-full shadow-lg">
                      <StarIcon className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  {/* Enhanced Content Section */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    {/* Category and Network Tags */}
                    <div className="flex items-center space-x-3 mb-4">
                      <Badge className="bg-card/80 backdrop-blur-sm text-card-foreground border border-border/50 text-sm px-3 py-1">
                        <span className="mr-1">{getCategoryIcon(show.category)}</span>
                        {show.category}
                      </Badge>
                      {show.network && (
                        <Badge className="bg-blue-500/20 backdrop-blur-sm text-blue-200 border border-blue-500/30 text-sm px-3 py-1">
                          {show.network}
                        </Badge>
                      )}
                      {show.rating && (
                        <Badge className="bg-yellow-500/20 backdrop-blur-sm text-yellow-300 border border-yellow-500/30 text-sm px-3 py-1">
                          ⭐ {show.rating}
                        </Badge>
                      )}
                    </div>
                    
                    <h2 className="text-3xl font-rum-raisin font-bold mb-3 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                      {show.title}
                    </h2>
                    
                    <p className="text-base mb-6 max-w-2xl opacity-90 line-clamp-2 text-gray-200 leading-relaxed">
                      {show.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button 
                          className="glossy-red-pill font-rum-raisin text-white px-8 py-3 text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                        >
                          <PlayIcon className="w-5 h-5 mr-3" />
                          Watch Now
                        </Button>

                        <Button 
                          variant="outline"
                          className="bg-card/20 backdrop-blur-sm border-border/50 text-foreground hover:bg-card/40 px-6 py-3 rounded-2xl"
                        >
                          <HeartIcon className="w-5 h-5 mr-2" />
                          Save
                        </Button>
                      </div>

                      {/* Enhanced Show Details */}
                      <div className="flex items-center space-x-3">
                        {show.duration && (
                          <Badge className="bg-card/60 backdrop-blur-sm text-card-foreground border border-border/30 px-3 py-1">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            {show.duration}
                          </Badge>
                        )}
                        {show.season && (
                          <Badge className="bg-purple-500/20 backdrop-blur-sm text-purple-300 border border-purple-500/30 px-3 py-1">
                            Season {show.season}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Progress Bar for Current Episode */}
                  {show.featured && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600/50">
                      <div className="h-full bg-gradient-to-r from-primary to-accent w-1/3 rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Enhanced Dots Indicator */}
            <div className="absolute bottom-8 right-8 flex space-x-3">
              {featuredShows.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "transition-all rounded-full border-2 hover:scale-110",
                    index === currentSlide 
                      ? "w-12 h-3 bg-gradient-to-r from-primary to-accent border-white/50 shadow-lg" 
                      : "w-3 h-3 bg-white/30 border-white/30 hover:bg-white/50"
                  )}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>

            {/* Auto-play Progress Indicator */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
              <div 
                className="liktv-carousel-progress h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-300"
                style={{ 
                  width: `${((currentSlide + 1) / featuredShows.length) * 100}%`,
                  opacity: isUserInteracting ? 0.3 : 1
                }}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Content Sections */}
        <div className="px-4 space-y-10 pb-24 relative z-10">
          {/* For You Section with Enhanced Design */}
          <div>
            <div className="liktv-section-header flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-2xl font-rum-raisin font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Curated For You
                  </h3>
                  <p className="text-sm text-muted-foreground">Based on your food preferences</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="text-primary hover:text-primary-foreground hover:bg-primary rounded-xl px-4 py-2 font-medium transition-all hover:scale-105"
              >
                View All →
              </Button>
            </div>
            
            <div className="liktv-content-grid grid grid-cols-1 md:grid-cols-2 gap-6">
              {forYouShows.map((show, index) => (
                <div
                  key={show.id}
                  className="liktv-card-hover liktv-glass-card group relative rounded-3xl overflow-hidden border border-primary/20 hover:border-primary/50 cursor-pointer"
                >
                  {/* Enhanced glass morphism effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="flex h-36 relative z-10">
                    {/* Enhanced Thumbnail */}
                    <div 
                      className="w-44 bg-cover bg-center relative overflow-hidden"
                      style={{ backgroundImage: `url(${show.thumbnail})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-background/60 group-hover:from-transparent group-hover:via-background/10 group-hover:to-background/40 transition-all duration-500" />
                      
                      {/* Enhanced Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="liktv-play-button w-12 h-12 bg-card/80 backdrop-blur-sm text-card-foreground rounded-full flex items-center justify-center border-2 border-primary/30 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                          <PlayIcon className="w-6 h-6 ml-1" />
                        </div>
                      </div>
                      
                      {/* Quality badges */}
                      {show.new && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-500 px-2 py-1 rounded-full shadow-lg">
                          <span className="text-white text-xs font-bold">NEW</span>
                        </div>
                      )}
                      
                      {/* View count overlay */}
                      {show.viewCount && (
                        <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full">
                          <div className="flex items-center space-x-1">
                            <EyeIcon className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground font-medium">{show.viewCount}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Enhanced Content */}
                    <div className="flex-1 p-5 text-foreground">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getCategoryIcon(show.category)}</span>
                          <Badge className="bg-card/50 text-card-foreground text-xs px-2 py-1">
                            {show.category}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          {show.verified && (
                            <StarIcon className="w-4 h-4 text-blue-400" />
                          )}
                          {show.rating && (
                            <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                              <span className="text-yellow-400 text-xs font-medium">⭐ {show.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <h4 className="font-rum-raisin font-bold text-base mb-2 line-clamp-1 text-foreground group-hover:text-primary transition-colors">
                        {show.title}
                      </h4>
                      
                      <div className="space-y-1 mb-3">
                        <p className="text-sm text-muted-foreground font-medium">{show.creator}</p>
                        {show.channel && (
                          <p className="text-xs text-blue-300">{show.channel}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                          {show.duration && (
                            <div className="flex items-center space-x-1">
                              <ClockIcon className="w-3 h-3" />
                              <span>{show.duration}</span>
                            </div>
                          )}
                          {show.likes && (
                            <div className="flex items-center space-x-1">
                              <HeartIcon className="w-3 h-3" />
                              <span>{show.likes}</span>
                            </div>
                          )}
                        </div>
                        
                        {show.trending && (
                          <Badge className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-500/30 text-xs px-2 py-1">
                            🔥 Hot
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Popular Series Section */}
          <div className="pb-8">
            <div className="liktv-section-header flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">📺</span>
                </div>
                <div>
                  <h3 className="text-2xl font-rum-raisin font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                    Popular Series
                  </h3>
                  <p className="text-sm text-muted-foreground">Most watched food shows</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="text-purple-400 hover:text-white hover:bg-purple-500 rounded-xl px-4 py-2 font-medium transition-all hover:scale-105"
              >
                Explore →
              </Button>
            </div>
            
            <div className="liktv-content-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularSeries.map((show) => (
                <div
                  key={show.id}
                  className="liktv-card-hover liktv-glass-card group rounded-3xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 cursor-pointer"
                >
                  {/* Enhanced glass effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                  
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={show.thumbnail}
                      alt={show.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    
                    {/* Enhanced Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="liktv-play-button w-16 h-16 bg-card/80 backdrop-blur-sm text-card-foreground rounded-full flex items-center justify-center border-2 border-primary/50 shadow-xl transform scale-75 group-hover:scale-100 transition-all duration-300">
                        <PlayIcon className="w-8 h-8 ml-1" />
                      </div>
                    </div>

                    {/* Enhanced Badges */}
                    {show.verified && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full shadow-lg">
                        <StarIcon className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {show.trending && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 rounded-full shadow-lg">
                        <span className="text-white text-xs font-bold flex items-center space-x-1">
                          <FireIcon className="w-3 h-3" />
                          <span>HOT</span>
                        </span>
                      </div>
                    )}

                    {/* Enhanced Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="font-rum-raisin font-bold text-lg mb-2 text-white group-hover:text-primary transition-colors line-clamp-1">
                        {show.title}
                      </h4>
                      
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-300 text-sm font-medium">{show.network || show.creator}</p>
                        {show.rating && (
                          <div className="flex items-center space-x-1 bg-yellow-500/20 backdrop-blur-sm px-2 py-1 rounded-full">
                            <span className="text-yellow-400 text-sm">⭐ {show.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <EyeIcon className="w-4 h-4" />
                          <span>{show.viewCount}</span>
                        </div>
                        {show.season && show.episode && (
                          <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs px-2 py-1">
                            S{show.season} • {show.episode} eps
                          </Badge>
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