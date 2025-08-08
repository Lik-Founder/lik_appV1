import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mic, QrCode, RotateCcw, TrendingUp, Users, Video, UtensilsCrossed, Search as SearchIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import likLogoHeart from '@/assets/images/Lik_Logo_Heart_1.0.png';

interface TrendingSearchPageProps {
  onBack: () => void;
  onShowUserProfile: (userId: string) => void;
  onShowRestaurantProfile: (restaurantId: string) => void;
  onShowVideoDetails: (videoId: string) => void;
}

type SearchTab = 'people' | 'videos' | 'restaurants';

interface TrendingSuggestion {
  id: string;
  text: string;
  type: 'people' | 'videos' | 'restaurants';
  trend: 'hot' | 'gaining' | 'stable';
  icon: string;
}

interface SearchResult {
  id: string;
  type: 'user' | 'video' | 'restaurant';
  name: string;
  subtitle: string;
  image: string;
  verified?: boolean;
  followerCount?: string;
  views?: string;
  duration?: string;
  ranking?: number;
  cuisine?: string;
}

const trendingSuggestions: TrendingSuggestion[] = [
  { id: '1', text: 'Best Ramen in NYC', type: 'restaurants', trend: 'hot', icon: '🍜' },
  { id: '2', text: 'Chef Gordon Ramsay', type: 'people', trend: 'hot', icon: '👨‍🍳' },
  { id: '3', text: 'Food Hack Challenge', type: 'videos', trend: 'gaining', icon: '🎥' },
  { id: '4', text: 'Viral Pasta Recipe', type: 'videos', trend: 'hot', icon: '🍝' },
  { id: '5', text: 'Alex Chen Food Reviews', type: 'people', trend: 'gaining', icon: '👤' },
  { id: '6', text: 'Bella Italia Restaurant', type: 'restaurants', trend: 'stable', icon: '🍕' },
  { id: '7', text: 'TikTok Food Trends 2025', type: 'videos', trend: 'hot', icon: '📱' },
  { id: '8', text: 'Street Food Markets', type: 'restaurants', trend: 'gaining', icon: '🌮' },
];

const trendingHashtags = ['#BestTacosLA', '#FoodHack', '#MichelinStar', '#VeganEats', '#StreetFood', '#BakingTips'];

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'user',
    name: 'Alex Chen',
    subtitle: '2.4M followers',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    verified: true,
    followerCount: '2.4M',
  },
  {
    id: '2',
    type: 'video',
    name: 'Amazing Pasta Recipe',
    subtitle: 'by Chef Marco',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=150&h=150&fit=crop',
    views: '1.2M',
    duration: '2:30',
  },
  {
    id: '3',
    type: 'restaurant',
    name: 'Bella Italia',
    subtitle: 'Italian • Fine Dining',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&h=150&fit=crop',
    verified: true,
    ranking: 3,
    cuisine: 'Italian',
    followerCount: '45K',
  },
];

export function TrendingSearchPage({ 
  onBack, 
  onShowUserProfile, 
  onShowRestaurantProfile, 
  onShowVideoDetails 
}: TrendingSearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('people');
  const [showResults, setShowResults] = useState(false);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus search input
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setShowResults(true);
      // Filter results based on active tab and search query
      const filtered = mockSearchResults.filter(result => {
        const matchesQuery = result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            result.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'people' ? result.type === 'user' :
                          activeTab === 'videos' ? result.type === 'video' :
                          result.type === 'restaurant';
        return matchesQuery && matchesTab;
      });
      setFilteredResults(filtered);
    } else {
      setShowResults(false);
      setFilteredResults([]);
    }
  }, [searchQuery, activeTab]);

  const handleSuggestionClick = (suggestion: TrendingSuggestion) => {
    setSearchQuery(suggestion.text);
    setActiveTab(suggestion.type);
  };

  const handleHashtagClick = (hashtag: string) => {
    setSearchQuery(hashtag);
    setActiveTab('videos');
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'user') {
      onShowUserProfile(result.id);
    } else if (result.type === 'restaurant') {
      onShowRestaurantProfile(result.id);
    } else if (result.type === 'video') {
      onShowVideoDetails(result.id);
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'hot':
        return 'text-red-500';
      case 'gaining':
        return 'text-orange-500';
      default:
        return 'text-gray-400';
    }
  };

  const getTrendDot = (trend: string) => {
    switch (trend) {
      case 'hot':
        return 'bg-red-500';
      case 'gaining':
        return 'bg-orange-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-white sticky top-0 z-10">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          className="h-9 w-9 flex-shrink-0"
        >
          <ArrowLeft size={20} />
        </Button>
        
        {/* Search Bar */}
        <div className="flex-1 relative min-w-0">
          <Input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search people, videos, or restaurants..."
            className="pr-20 rounded-full bg-gray-100 border-0 focus:ring-2 focus:ring-primary focus:bg-white text-base"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                setShowResults(true);
              }
            }}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
              <Mic size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
              <QrCode size={16} />
            </Button>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          className="text-primary font-semibold nav-rum-raisin px-3 flex-shrink-0"
          onClick={() => {
            if (searchQuery.trim()) {
              // Trigger search
              setShowResults(true);
            } else {
              setSearchQuery('');
            }
          }}
        >
          Search
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {!showResults ? (
          <div className="pb-safe">
            {/* Tab Selector */}
            <div className="flex items-center justify-center p-4 bg-white border-b border-border/50">
              <div className="bg-gray-100 rounded-full p-1 flex">
                {[
                  { key: 'people' as SearchTab, label: 'People', icon: Users },
                  { key: 'videos' as SearchTab, label: 'Videos', icon: Video },
                  { key: 'restaurants' as SearchTab, label: 'Restaurants', icon: UtensilsCrossed },
                ].map(({ key, label, icon: Icon }) => (
                  <Button
                    key={key}
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab(key)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition-all",
                      activeTab === key
                        ? "bg-white shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon size={16} className="mr-1" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Trending Hashtags */}
            <div className="px-4 mb-6 bg-gray-50/50 py-4">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {trendingHashtags.map((hashtag) => (
                  <Button
                    key={hashtag}
                    variant="outline"
                    size="sm"
                    onClick={() => handleHashtagClick(hashtag)}
                    className="rounded-full whitespace-nowrap bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:from-primary/20 hover:to-accent/20 flex-shrink-0"
                  >
                    {hashtag}
                  </Button>
                ))}
              </div>
            </div>

            {/* You May Like Section */}
            <div className="px-4 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold nav-rum-raisin">You may like</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw size={16} className="mr-1" />
                  Refresh
                </Button>
              </div>

              <div className="space-y-1">
                {trendingSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                  >
                    <div className={cn("w-2 h-2 rounded-full flex-shrink-0", getTrendDot(suggestion.trend))} />
                    <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {suggestion.text}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
                      <TrendingUp size={12} className={cn("transition-colors", getTrendColor(suggestion.trend))} />
                      <span className={cn("text-xs font-medium", getTrendColor(suggestion.trend))}>
                        {suggestion.trend === 'hot' ? 'Trending' : 
                         suggestion.trend === 'gaining' ? 'Trending' : 'Trending'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Search Results
          <div className="p-4 pb-safe">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg nav-rum-raisin">
                Results for "{searchQuery}"
              </h3>
              <span className="text-sm text-muted-foreground">
                {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-3">
              {filteredResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 text-left border border-transparent hover:border-gray-200 hover:shadow-sm"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={result.image}
                      alt={result.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {result.verified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    )}
                    {result.ranking && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-xs font-bold">👑</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground truncate">{result.name}</div>
                    <div className="text-sm text-muted-foreground truncate">{result.subtitle}</div>
                    {result.type === 'video' && result.views && (
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                        <span>{result.views} views</span>
                        <span>•</span>
                        <span>{result.duration}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {result.type === 'user' && (
                      <Button size="sm" variant="outline" className="rounded-full h-8 px-4 text-xs font-medium">
                        Follow
                      </Button>
                    )}
                    {result.type === 'restaurant' && (
                      <>
                        <Button size="sm" variant="outline" className="rounded-full h-8 px-4 text-xs font-medium">
                          Reserve
                        </Button>
                        {result.ranking && (
                          <span className="text-xs text-yellow-600 font-medium">
                            #{result.ranking} {result.cuisine}
                          </span>
                        )}
                      </>
                    )}
                    {result.type === 'video' && (
                      <Button size="sm" variant="ghost" className="text-primary h-8 w-8 p-0">
                        <Video size={16} />
                      </Button>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {filteredResults.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <SearchIcon size={32} className="text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2 nav-rum-raisin">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  Try searching for something else or check the spelling
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery('')}
                  className="rounded-full"
                >
                  Clear search
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}