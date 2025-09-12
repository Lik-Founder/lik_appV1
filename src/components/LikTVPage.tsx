import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Search, Bell, User, Play, Filter, X, Zap, Star, TrendingUp, Clock, Users, Heart, Bookmark, Share, Volume2, Eye, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface LikTVPageProps {
  onBack: () => void;
}

const featuredShows = [
  {
    id: 1,
    title: 'Chef\'s Table: Culinary Masters',
    description: 'Journey around the world to meet the most innovative chefs who are redefining fine dining with their creativity, passion, and cultural heritage.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    type: 'exclusive',
    rating: 9.2,
    duration: '48 min',
    episodes: 8,
    genre: 'Documentary',
    year: 2024,
    viewers: '2.3M'
  },
  {
    id: 2,
    title: 'Street Food Chronicles',
    description: 'Discover the hidden stories behind the world\'s most beloved street food vendors and their legendary dishes that define entire cultures.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    type: 'original',
    rating: 8.9,
    duration: '35 min',
    episodes: 12,
    genre: 'Travel',
    year: 2024,
    viewers: '1.8M'
  },
  {
    id: 3,
    title: 'The Science of Flavor',
    description: 'Explore the molecular gastronomy revolution as world-renowned chefs push the boundaries of taste, texture, and culinary innovation.',
    image: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    type: 'trending',
    rating: 9.1,
    duration: '52 min',
    episodes: 6,
    genre: 'Science',
    year: 2024,
    viewers: '3.1M'
  }
];

const contentSections = [
  {
    title: 'Trending Now',
    icon: TrendingUp,
    description: 'Most watched this week',
    shows: [
      {
        id: 4,
        title: 'Tokyo Ramen Masters',
        creator: 'Hiroshi Tanaka',
        network: 'Lik Originals',
        thumbnail: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
        views: '1.2M',
        duration: '28:45',
        rating: 4.8,
        likes: '89K',
        type: 'series',
        episodes: 8,
        isNew: true
      },
      {
        id: 5,
        title: 'Michelin Secrets',
        creator: 'Chef Antoine',
        network: 'Food Network',
        thumbnail: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
        views: '892K',
        duration: '42:15',
        rating: 4.9,
        likes: '67K',
        type: 'documentary',
        episodes: 4
      },
      {
        id: 6,
        title: 'Dessert Innovation Lab',
        creator: 'Sweet Science',
        network: 'Lik Studios',
        thumbnail: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2057&q=80',
        views: '567K',
        duration: '31:22',
        rating: 4.7,
        likes: '45K',
        type: 'tutorial',
        episodes: 10,
        isPopular: true
      },
      {
        id: 7,
        title: 'Farm to Fine Dining',
        creator: 'Sustainable Cuisine Co.',
        network: 'Green Kitchen',
        thumbnail: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        views: '423K',
        duration: '38:30',
        rating: 4.6,
        likes: '32K',
        type: 'documentary',
        episodes: 6
      }
    ]
  },
  {
    title: 'Lik Originals',
    icon: Zap,
    description: 'Exclusive content you can\'t find anywhere else',
    shows: [
      {
        id: 8,
        title: 'Global Kitchen Wars',
        creator: 'Lik Productions',
        network: 'Lik Originals',
        thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        views: '2.1M',
        duration: '45:12',
        rating: 4.9,
        likes: '125K',
        type: 'competition',
        episodes: 12,
        isExclusive: true
      },
      {
        id: 9,
        title: 'Hidden Culinary Gems',
        creator: 'Discovery Team',
        network: 'Lik Originals',
        thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        views: '1.6M',
        duration: '33:45',
        rating: 4.8,
        likes: '98K',
        type: 'travel',
        episodes: 15,
        isExclusive: true
      },
      {
        id: 10,
        title: 'Master Class: Techniques',
        creator: 'Culinary Institute',
        network: 'Lik Academy',
        thumbnail: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
        views: '934K',
        duration: '55:20',
        rating: 4.9,
        likes: '76K',
        type: 'educational',
        episodes: 20,
        isExclusive: true
      }
    ]
  },
  {
    title: 'Food Network Favorites',
    icon: Star,
    description: 'Best of Food Network programming',
    shows: [
      {
        id: 11,
        title: 'Iron Chef America',
        creator: 'Food Network',
        network: 'Food Network',
        thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2081&q=80',
        views: '3.2M',
        duration: '60:00',
        rating: 4.7,
        likes: '156K',
        type: 'competition',
        episodes: 24
      },
      {
        id: 12,
        title: 'Chopped Champions',
        creator: 'Food Network',
        network: 'Food Network',
        thumbnail: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2057&q=80',
        views: '2.8M',
        duration: '42:30',
        rating: 4.6,
        likes: '134K',
        type: 'competition',
        episodes: 18
      }
    ]
  },
  {
    title: 'Live Cooking',
    icon: Eye,
    description: 'Live shows and real-time cooking sessions',
    shows: [
      {
        id: 13,
        title: 'Live Kitchen Sessions',
        creator: 'Chef Maria Rodriguez',
        network: 'Lik Live',
        thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        views: '45K watching',
        duration: 'LIVE',
        rating: 4.8,
        likes: '12K',
        type: 'live',
        isLive: true
      },
      {
        id: 14,
        title: 'Morning Pastry Workshop',
        creator: 'French Bakery Co.',
        network: 'Lik Live',
        thumbnail: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
        views: '23K watching',
        duration: 'LIVE',
        rating: 4.9,
        likes: '8K',
        type: 'live',
        isLive: true
      }
    ]
  }
];

export function LikTVPage({ onBack }: LikTVPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentPos, setCurrentPos] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentSlide((prev) => (prev + 1) % featuredShows.length);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startPos;
    setCurrentPos(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const threshold = 50;
    if (currentPos > threshold) {
      setCurrentSlide((prev) => (prev - 1 + featuredShows.length) % featuredShows.length);
    } else if (currentPos < -threshold) {
      setCurrentSlide((prev) => (prev + 1) % featuredShows.length);
    }
    
    setIsDragging(false);
    setCurrentPos(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartPos(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startPos;
    setCurrentPos(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const threshold = 50;
    if (currentPos > threshold) {
      setCurrentSlide((prev) => (prev - 1 + featuredShows.length) % featuredShows.length);
    } else if (currentPos < -threshold) {
      setCurrentSlide((prev) => (prev + 1) % featuredShows.length);
    }
    
    setIsDragging(false);
    setCurrentPos(0);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exclusive': return 'from-amber-500 to-orange-600';
      case 'original': return 'from-red-500 to-rose-600';
      case 'trending': return 'from-emerald-500 to-teal-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const filters = ['All', 'Originals', 'Food Network', 'Live', 'Documentaries', 'Cooking Shows', 'Travel', 'Competition'];

  return (
    <div className="flex flex-col h-full min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 text-white overflow-hidden">
      {/* Modern Floating Header */}
      <div className="relative z-50 p-4">
        <div className="flex items-center justify-between backdrop-blur-xl bg-black/20 rounded-2xl border border-white/10 px-6 py-4 shadow-2xl">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/10 transition-all duration-200 rounded-xl p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <Play className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">LikTV</h1>
                <p className="text-xs text-gray-400">Food • Entertainment • Culture</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {showSearch ? (
              <div className="flex items-center gap-2 bg-black/40 rounded-xl px-4 py-2 backdrop-blur-sm border border-white/10 w-64">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search shows, creators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-white placeholder-gray-400 focus-visible:ring-0 text-sm"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSearch(false)}
                  className="text-gray-400 hover:text-white hover:bg-white/10 p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(true)}
                className="text-white hover:bg-white/10 transition-all duration-200 rounded-xl p-3"
              >
                <Search className="w-5 h-5" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "text-white hover:bg-white/10 transition-all duration-200 rounded-xl p-3",
                showFilters && "bg-white/10"
              )}
            >
              <Filter className="w-5 h-5" />
            </Button>
            
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 transition-all duration-200 rounded-xl p-3">
              <Bell className="w-5 h-5" />
            </Button>
            
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 transition-all duration-200 rounded-xl p-3">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Enhanced Filters */}
        {showFilters && (
          <div className="mt-4 backdrop-blur-xl bg-black/20 rounded-2xl border border-white/10 p-4 shadow-2xl">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {filters.map((filter, index) => (
                <Button
                  key={filter}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className={cn(
                    "whitespace-nowrap border-white/20 text-white hover:bg-white/20 transition-all duration-200 rounded-xl",
                    selectedFilter === filter 
                      ? "bg-gradient-to-r from-red-500 to-red-600 border-red-400 text-white shadow-lg" 
                      : "bg-white/5 hover:bg-white/10"
                  )}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Hero Carousel with Cinematic Design */}
        <div className="relative h-[85vh] mb-16 overflow-hidden">
          <div
            ref={carouselRef}
            className="flex transition-transform duration-1000 ease-out h-full"
            style={{
              transform: `translateX(${(-currentSlide * 100) + (isDragging ? (currentPos / window.innerWidth) * 100 : 0)}%)`
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {featuredShows.map((show, index) => (
              <div
                key={show.id}
                className="flex-none w-full h-full relative cursor-grab active:cursor-grabbing"
              >
                <img
                  src={show.image}
                  alt={show.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                
                {/* Multiple Gradient Overlays for Depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
                
                {/* Content with Superior Hierarchy */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                  <div className="max-w-4xl">
                    {/* Meta Information */}
                    <div className="flex items-center gap-4 mb-6">
                      <span className={cn("px-4 py-2 rounded-full text-sm font-bold text-white backdrop-blur-sm bg-gradient-to-r", getTypeColor(show.type))}>
                        {show.type.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-2 text-yellow-400 backdrop-blur-sm bg-black/30 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-semibold">{show.rating}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 backdrop-blur-sm bg-black/30 px-3 py-1 rounded-full">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{show.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 backdrop-blur-sm bg-black/30 px-3 py-1 rounded-full">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">{show.viewers}</span>
                      </div>
                      <span className="text-gray-300 text-sm backdrop-blur-sm bg-black/30 px-3 py-1 rounded-full">
                        {show.episodes} Episodes • {show.year}
                      </span>
                    </div>
                    
                    {/* Title with Dramatic Sizing */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tight">
                      {show.title}
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-3xl font-light">
                      {show.description}
                    </p>
                    
                    {/* Action Buttons with Premium Styling */}
                    <div className="flex items-center gap-6">
                      <Button 
                        size="lg"
                        className="bg-white text-black hover:bg-gray-100 font-bold px-10 py-4 text-lg rounded-xl transition-all duration-200 shadow-2xl hover:shadow-white/20 hover:scale-105"
                      >
                        <Play className="w-6 h-6 mr-3" />
                        Watch Now
                      </Button>
                      <Button 
                        variant="outline"
                        size="lg"
                        className="border-white/40 text-white hover:bg-white/10 px-8 py-4 backdrop-blur-sm rounded-xl transition-all duration-200 font-semibold"
                      >
                        <Info className="w-5 h-5 mr-2" />
                        More Info
                      </Button>
                      <Button 
                        variant="ghost"
                        size="lg"
                        className="text-white hover:bg-white/10 p-4 rounded-xl transition-all duration-200"
                      >
                        <Bookmark className="w-6 h-6" />
                      </Button>
                      <Button 
                        variant="ghost"
                        size="lg"
                        className="text-white hover:bg-white/10 p-4 rounded-xl transition-all duration-200"
                      >
                        <Share className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Audio Control */}
                <div className="absolute bottom-8 right-8">
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10 p-3 rounded-full border border-white/30 backdrop-blur-sm"
                  >
                    <Volume2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Enhanced Carousel Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
            {featuredShows.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "transition-all duration-500 rounded-full",
                  index === currentSlide 
                    ? "w-12 h-3 bg-gradient-to-r from-red-500 to-red-600 shadow-lg" 
                    : "w-3 h-3 bg-white/30 hover:bg-white/50"
                )}
              />
            ))}
          </div>
        </div>

        {/* Content Sections with Enhanced Design */}
        <div className="px-6 md:px-12 space-y-16 pb-32">
          {contentSections.map((section, sectionIndex) => (
            <div key={section.title} className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{section.title}</h2>
                    <p className="text-gray-400 text-lg">{section.description}</p>
                  </div>
                </div>
                <Button variant="ghost" className="text-gray-400 hover:text-white flex items-center gap-2">
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {section.shows.map((show, index) => (
                  <div
                    key={show.id}
                    className="group cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-white/10 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-white/20">
                      <div className="relative">
                        <img
                          src={show.thumbnail}
                          alt={show.title}
                          className="w-full h-52 md:h-60 object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        
                        {/* Hover Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-2xl">
                            <Play className="w-8 h-8 text-black ml-1" />
                          </div>
                        </div>
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          {show.isLive && (
                            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm font-bold flex items-center gap-1">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              LIVE
                            </div>
                          )}
                          {show.isNew && (
                            <div className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm font-bold">
                              NEW
                            </div>
                          )}
                          {show.isExclusive && (
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm font-bold">
                              EXCLUSIVE
                            </div>
                          )}
                        </div>
                        
                        {/* Duration */}
                        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                          {show.duration}
                        </div>
                        
                        {/* Rating */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/80 text-yellow-400 text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{show.rating}</span>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-red-400 transition-colors leading-tight">
                          {show.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3">{show.creator}</p>
                        <p className="text-gray-500 text-xs mb-3">{show.network}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{show.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span>{show.likes}</span>
                            </div>
                          </div>
                          {show.episodes && (
                            <span className="text-xs text-gray-500">{show.episodes} eps</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}