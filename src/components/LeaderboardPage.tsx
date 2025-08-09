import { useState } from 'react';
import { ArrowLeft, MagnifyingGlass, Globe, CaretDown, Star, Heart, TrendUp, CaretRight, Funnel } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConsistentAvatar } from '@/components/ui/consistent-avatar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LeaderboardPageProps {
  onBack: () => void;
  onShowRestaurantProfile?: (restaurantId: string) => void;
  onShowUserProfile?: (userId: string) => void;
}

type TabType = 'foods' | 'restaurants' | 'likers';
type SortPeriod = 'week' | 'month' | 'year';
type ScopeType = 'global' | 'national' | 'city';
type CuisineFilter = 'all' | 'italian' | 'american' | 'japanese' | 'mexican' | 'french' | 'indian' | 'chinese' | 'thai' | 'mediterranean';
type DishFilter = 'all' | 'appetizers' | 'mains' | 'desserts' | 'drinks' | 'sushi' | 'pasta' | 'burgers' | 'pizza' | 'seafood';

interface LeaderboardItem {
  id: string;
  rank: number;
  name: string;
  subtitle: string;
  imageUrl: string;
  rating: number;
  likes: number;
  reviews?: number;
  badge?: string;
  isSpecial?: boolean;
  cuisine?: string;
  category?: string;
}

// Mock data for demonstration
const mockData = {
  restaurants: [
    {
      id: 'bella-italia', // Use the same ID as the restaurant profile
      rank: 1,
      name: 'Bella Italia',
      subtitle: 'Italian • Manhattan',
      imageUrl: `https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=120&h=120&fit=crop&crop=center`,
      rating: 4.8,
      likes: 200000,
      reviews: 1500,
      badge: 'Debut',
      isSpecial: true,
      cuisine: 'italian'
    },
    {
      id: '2',
      rank: 2,
      name: 'The Golden Spoon',
      subtitle: 'American • New York City',
      imageUrl: `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=120&h=120&fit=crop&crop=center`,
      rating: 4.4,
      likes: 180000,
      reviews: 1200,
      cuisine: 'american'
    },
    {
      id: '3',
      rank: 3,
      name: 'Sakura Sushi',
      subtitle: 'Japanese • Brooklyn',
      imageUrl: `https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=120&h=120&fit=crop&crop=center`,
      rating: 4.3,
      likes: 160000,
      reviews: 900,
      cuisine: 'japanese'
    },
    {
      id: '4',
      rank: 4,
      name: 'Taco Paradise',
      subtitle: 'Mexican • Queens',
      imageUrl: `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=120&h=120&fit=crop&crop=center`,
      rating: 4.4,
      likes: 230000,
      reviews: 800,
      cuisine: 'mexican'
    },
    {
      id: '5',
      rank: 5,
      name: 'French Quarter',
      subtitle: 'French • Manhattan',
      imageUrl: `https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=120&h=120&fit=crop&crop=center`,
      rating: 4.5,
      likes: 100000,
      reviews: 600,
      cuisine: 'french'
    },
    {
      id: '6',
      rank: 6,
      name: 'Spice Route',
      subtitle: 'Indian • Brooklyn',
      imageUrl: `https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=120&h=120&fit=crop&crop=center`,
      rating: 4.6,
      likes: 100000,
      reviews: 750,
      cuisine: 'indian'
    },
    {
      id: '7',
      rank: 7,
      name: 'Dragon Palace',
      subtitle: 'Chinese • Chinatown',
      imageUrl: `https://images.unsplash.com/photo-1552566626-52f8b828add9?w=120&h=120&fit=crop&crop=center`,
      rating: 4.2,
      likes: 95000,
      reviews: 680,
      cuisine: 'chinese'
    },
    {
      id: '8',
      rank: 8,
      name: 'Thai Garden',
      subtitle: 'Thai • Queens',
      imageUrl: `https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=120&h=120&fit=crop&crop=center`,
      rating: 4.3,
      likes: 88000,
      reviews: 520,
      cuisine: 'thai'
    }
  ],
  foods: [
    {
      id: '1',
      rank: 1,
      name: 'Truffle Risotto',
      subtitle: 'Italian • Fine Dining',
      imageUrl: `https://images.unsplash.com/photo-1516685018646-549198525c1b?w=120&h=120&fit=crop&crop=center`,
      rating: 4.9,
      likes: 85000,
      reviews: 420,
      category: 'mains'
    },
    {
      id: '2',
      rank: 2,
      name: 'Wagyu Burger',
      subtitle: 'American • Gourmet',
      imageUrl: `https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&h=120&fit=crop&crop=center`,
      rating: 4.7,
      likes: 92000,
      reviews: 380,
      category: 'burgers'
    },
    {
      id: '3',
      rank: 3,
      name: 'Dragon Roll',
      subtitle: 'Japanese • Sushi',
      imageUrl: `https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=120&h=120&fit=crop&crop=center`,
      rating: 4.6,
      likes: 78000,
      reviews: 290,
      category: 'sushi'
    },
    {
      id: '4',
      rank: 4,
      name: 'Lobster Thermidor',
      subtitle: 'French • Seafood',
      imageUrl: `https://images.unsplash.com/photo-1559737558-2f5a35db6c04?w=120&h=120&fit=crop&crop=center`,
      rating: 4.8,
      likes: 65000,
      reviews: 210,
      category: 'seafood'
    },
    {
      id: '5',
      rank: 5,
      name: 'Chocolate Soufflé',
      subtitle: 'French • Dessert',
      imageUrl: `https://images.unsplash.com/photo-1551024506-0bccd828d307?w=120&h=120&fit=crop&crop=center`,
      rating: 4.7,
      likes: 55000,
      reviews: 189,
      category: 'desserts'
    },
    {
      id: '6',
      rank: 6,
      name: 'Margherita Pizza',
      subtitle: 'Italian • Traditional',
      imageUrl: `https://images.unsplash.com/photo-1513104890138-7c749659a591?w=120&h=120&fit=crop&crop=center`,
      rating: 4.5,
      likes: 72000,
      reviews: 340,
      category: 'pizza'
    },
    {
      id: '7',
      rank: 7,
      name: 'Caesar Salad',
      subtitle: 'American • Appetizer',
      imageUrl: `https://images.unsplash.com/photo-1546793665-c74683f339c1?w=120&h=120&fit=crop&crop=center`,
      rating: 4.4,
      likes: 48000,
      reviews: 280,
      category: 'appetizers'
    },
    {
      id: '8',
      rank: 8,
      name: 'Carbonara Pasta',
      subtitle: 'Italian • Classic',
      imageUrl: `https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=120&h=120&fit=crop&crop=center`,
      rating: 4.6,
      likes: 58000,
      reviews: 195,
      category: 'pasta'
    }
  ],
  likers: [
    {
      id: '1',
      rank: 1,
      name: 'FoodieExplorer',
      subtitle: '@foodieexplorer • Level 47',
      imageUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face`,
      rating: 4.8,
      likes: 15000,
      reviews: 1200
    },
    {
      id: '2',
      rank: 2,
      name: 'ChefMaster',
      subtitle: '@chefmaster • Level 42',
      imageUrl: `https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=120&h=120&fit=crop&crop=face`,
      rating: 4.6,
      likes: 12000,
      reviews: 980
    },
    {
      id: '3',
      rank: 3,
      name: 'TasteAdventurer',
      subtitle: '@tasteadventurer • Level 38',
      imageUrl: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face`,
      rating: 4.5,
      likes: 10500,
      reviews: 850
    },
    {
      id: '4',
      rank: 4,
      name: 'GourmetGuru',
      subtitle: '@gourmetguru • Level 35',
      imageUrl: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face`,
      rating: 4.4,
      likes: 9200,
      reviews: 720
    },
    {
      id: '5',
      rank: 5,
      name: 'CulinaryQueen',
      subtitle: '@culinaryqueen • Level 31',
      imageUrl: `https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face`,
      rating: 4.3,
      likes: 8800,
      reviews: 650
    }
  ]
};

// Filter options
const cuisineFilters: { key: CuisineFilter; label: string; emoji: string }[] = [
  { key: 'all', label: 'All Cuisines', emoji: '🌍' },
  { key: 'italian', label: 'Italian', emoji: '🍝' },
  { key: 'american', label: 'American', emoji: '🍔' },
  { key: 'japanese', label: 'Japanese', emoji: '🍣' },
  { key: 'mexican', label: 'Mexican', emoji: '🌮' },
  { key: 'french', label: 'French', emoji: '🥐' },
  { key: 'indian', label: 'Indian', emoji: '🍛' },
  { key: 'chinese', label: 'Chinese', emoji: '🥢' },
  { key: 'thai', label: 'Thai', emoji: '🍜' },
  { key: 'mediterranean', label: 'Mediterranean', emoji: '🫒' }
];

const dishFilters: { key: DishFilter; label: string; emoji: string }[] = [
  { key: 'all', label: 'All Dishes', emoji: '🍽️' },
  { key: 'appetizers', label: 'Appetizers', emoji: '🥗' },
  { key: 'mains', label: 'Main Courses', emoji: '🍖' },
  { key: 'desserts', label: 'Desserts', emoji: '🍰' },
  { key: 'drinks', label: 'Drinks', emoji: '🍹' },
  { key: 'sushi', label: 'Sushi', emoji: '🍣' },
  { key: 'pasta', label: 'Pasta', emoji: '🍝' },
  { key: 'burgers', label: 'Burgers', emoji: '🍔' },
  { key: 'pizza', label: 'Pizza', emoji: '🍕' },
  { key: 'seafood', label: 'Seafood', emoji: '🦞' }
];
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return rank.toString();
  }
}

function getRankStyle(rank: number) {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300';
    case 2:
      return 'bg-gradient-to-br from-gray-300 to-gray-500 border-gray-200';
    case 3:
      return 'bg-gradient-to-br from-orange-400 to-orange-600 border-orange-300';
    default:
      return 'bg-muted border-border';
  }
}

function LeaderboardCard({ 
  item, 
  isFirst, 
  activeTab, 
  onShowRestaurantProfile, 
  onShowUserProfile 
}: { 
  item: LeaderboardItem; 
  isFirst: boolean;
  activeTab: TabType;
  onShowRestaurantProfile?: (restaurantId: string) => void;
  onShowUserProfile?: (userId: string) => void;
}) {
  const isTopThree = item.rank <= 3;
  const [isPressed, setIsPressed] = useState(false);
  
  const handleClick = () => {
    if (activeTab === 'restaurants' && onShowRestaurantProfile) {
      toast.success(`Opening ${item.name} profile`);
      onShowRestaurantProfile(item.id);
    } else if (activeTab === 'likers' && onShowUserProfile) {
      toast.success(`Opening ${item.name} profile`);
      onShowUserProfile(item.id);
    }
    // For foods tab, we could navigate to a food detail page in the future
    // For now, foods don't have a specific navigation target
  };

  const handleTouchStart = () => {
    if (isClickable) {
      setIsPressed(true);
    }
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
  };

  const isClickable = activeTab === 'restaurants' || activeTab === 'likers';
  
  return (
    <div
      className={cn(
        "group relative p-4 rounded-2xl border transition-all duration-200 touch-feedback",
        isClickable && "cursor-pointer hover:shadow-lg",
        !isClickable && "cursor-default",
        isPressed && isClickable && "scale-[0.98] shadow-sm",
        isFirst && item.rank === 1 
          ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg" 
          : isClickable 
            ? "bg-card hover:bg-card/80" 
            : "bg-card",
        isTopThree && "ring-1",
        item.rank === 1 && "ring-yellow-300",
        item.rank === 2 && "ring-gray-300",
        item.rank === 3 && "ring-orange-300"
      )}
      onClick={isClickable ? handleClick : undefined}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      <div className="flex items-center gap-4">
        {/* Rank */}
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold text-lg shrink-0",
            getRankStyle(item.rank),
            isTopThree ? "text-white" : "text-foreground"
          )}
        >
          {typeof getRankIcon(item.rank) === 'string' && getRankIcon(item.rank).length > 1 
            ? getRankIcon(item.rank) 
            : <span className="text-lg">{getRankIcon(item.rank)}</span>
          }
        </div>

        {/* Avatar/Image */}
        {activeTab === 'likers' ? (
          <ConsistentAvatar
            src={item.imageUrl}
            alt={item.name}
            fallback={item.name[0]?.toUpperCase()}
            size="xl"
            variant="xp-ring"
            level={item.rank <= 10 ? 50 + (10 - item.rank) * 5 : Math.floor(Math.random() * 30) + 20} // Mock levels based on rank
            xpProgress={Math.random() * 0.8 + 0.2} // Mock XP progress
          />
        ) : (
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-muted">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${item.name}`;
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                {item.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {item.subtitle}
              </p>
              {item.badge && (
                <span className="inline-block mt-1 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                  {item.badge}
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="text-right shrink-0 flex items-center gap-3">
              <div>
                <div className="flex items-center gap-1 text-yellow-500 font-semibold text-lg">
                  <Star size={18} className="fill-current" />
                  {item.rating}
                </div>
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <Heart size={14} className="fill-current" />
                  {item.likes >= 1000 
                    ? `${(item.likes / 1000).toFixed(item.likes >= 100000 ? 0 : 1)}K`
                    : item.likes
                  }
                </div>
                {item.reviews && (
                  <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                    <TrendUp size={12} />
                    {item.reviews >= 1000 
                      ? `${(item.reviews / 1000).toFixed(1)}K`
                      : item.reviews
                    }
                  </div>
                )}
              </div>
              
              {/* Navigation Arrow or Info */}
              {isClickable ? (
                <div className="flex items-center">
                  <div className="text-xs text-primary font-medium mr-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    Tap to view
                  </div>
                  <CaretRight 
                    size={20} 
                    className="text-primary transition-all duration-200 group-hover:text-primary group-hover:transform group-hover:translate-x-1" 
                  />
                </div>
              ) : activeTab === 'foods' ? (
                <div className="text-xs text-muted-foreground opacity-60 text-center">
                  <div>View only</div>
                  <div className="text-[10px] mt-1">Coming soon</div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LeaderboardPage({ onBack, onShowRestaurantProfile, onShowUserProfile }: LeaderboardPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('restaurants');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortPeriod, setSortPeriod] = useState<SortPeriod>('week');
  const [scope, setScope] = useState<ScopeType>('global');
  const [cuisineFilter, setCuisineFilter] = useState<CuisineFilter>('all');
  const [dishFilter, setDishFilter] = useState<DishFilter>('all');
  const [showFilters, setShowFilters] = useState(false);

  const currentData = mockData[activeTab] || [];
  const filteredData = currentData.filter(item => {
    // Text search filter
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category/cuisine filter
    let matchesCategory = true;
    if (activeTab === 'restaurants' && cuisineFilter !== 'all') {
      matchesCategory = item.cuisine === cuisineFilter;
    } else if (activeTab === 'foods' && dishFilter !== 'all') {
      matchesCategory = item.category === dishFilter;
    }
    
    return matchesSearch && matchesCategory;
  });

  const getTabTitle = () => {
    const periodText = sortPeriod === 'week' ? 'This Week' : 
                     sortPeriod === 'month' ? 'This Month' : 'This Year';
    const tabText = activeTab === 'restaurants' ? 'Restaurants' :
                   activeTab === 'foods' ? 'Dishes' : 'Food Lovers';
    
    // Add filter context
    let filterText = '';
    if (activeTab === 'restaurants' && cuisineFilter !== 'all') {
      const filter = cuisineFilters.find(f => f.key === cuisineFilter);
      filterText = ` • ${filter?.label}`;
    } else if (activeTab === 'foods' && dishFilter !== 'all') {
      const filter = dishFilters.find(f => f.key === dishFilter);
      filterText = ` • ${filter?.label}`;
    }
    
    return `Top ${tabText} ${periodText}${filterText}`;
  };

  const getTabDescription = () => {
    let baseDescription = '';
    switch (activeTab) {
      case 'restaurants':
        baseDescription = 'Most popular restaurants ranked by community ratings and reviews';
        break;
      case 'foods':
        baseDescription = 'Highest rated dishes across all restaurants and cuisines';
        break;
      case 'likers':
        baseDescription = 'Top food reviewers and content creators in the community';
        break;
    }
    
    // Add filter context
    if (activeTab === 'restaurants' && cuisineFilter !== 'all') {
      const filter = cuisineFilters.find(f => f.key === cuisineFilter);
      baseDescription += ` • Filtered by ${filter?.label} cuisine`;
    } else if (activeTab === 'foods' && dishFilter !== 'all') {
      const filter = dishFilters.find(f => f.key === dishFilter);
      baseDescription += ` • Showing ${filter?.label} only`;
    }
    
    return baseDescription;
  };

  const getScopeText = () => {
    switch (scope) {
      case 'global': return 'Worldwide';
      case 'national': return 'National';
      case 'city': return 'City';
      default: return 'Worldwide';
    }
  };

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0"
        >
          <ArrowLeft size={24} />
        </Button>
        
        <h1 className="text-xl font-semibold text-center flex-1 mr-10 nav-rum-raisin">
          Leaderboard
        </h1>
      </div>

      {/* Sticky Filters */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        {/* Tabs */}
        <div className="flex p-4 gap-2">
          {([
            { key: 'foods', label: 'Dishes' },
            { key: 'restaurants', label: 'Restaurants' },
            { key: 'likers', label: 'Foodies' }
          ] as { key: TabType; label: string }[]).map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'secondary'}
              onClick={() => {
                setActiveTab(tab.key);
                // Reset filters when switching tabs
                setCuisineFilter('all');
                setDishFilter('all');
                setShowFilters(false);
                setSearchQuery('');
              }}
              className={cn(
                "flex-1 rounded-full font-medium transition-all duration-200 nav-rum-raisin",
                activeTab === tab.key 
                  ? "bg-foreground text-background shadow-lg transform scale-105 font-semibold" 
                  : "bg-muted hover:bg-muted/80 text-muted-foreground hover:scale-102 font-light"
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlass 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
              <Input
                placeholder={`Search ${activeTab === 'restaurants' ? 'restaurants' : activeTab === 'foods' ? 'dishes' : 'foodies'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full border-muted-foreground/20"
              />
            </div>

            {/* Category Filter Button (only for restaurants and foods) */}
            {(activeTab === 'restaurants' || activeTab === 'foods') && (
              <Button
                variant="outline"
                className="shrink-0 rounded-full px-4 gap-2 nav-rum-raisin font-light"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Funnel size={16} />
                Filter
                <CaretDown 
                  size={14} 
                  className={cn(
                    "transition-transform duration-200",
                    showFilters && "rotate-180"
                  )}
                />
              </Button>
            )}

            {/* Scope Selector */}
            <Button
              variant="outline"
              className="shrink-0 rounded-full px-4 gap-2 nav-rum-raisin font-light"
              onClick={() => {
                const scopes: ScopeType[] = ['global', 'national', 'city'];
                const currentIndex = scopes.indexOf(scope);
                const nextScope = scopes[(currentIndex + 1) % scopes.length];
                setScope(nextScope);
              }}
            >
              <Globe size={16} />
              {getScopeText()}
            </Button>
          </div>

          {/* Category Filters (expandable) */}
          {showFilters && (activeTab === 'restaurants' || activeTab === 'foods') && (
            <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
              <div className="bg-muted/50 rounded-2xl p-4">
                <h3 className="text-sm font-medium text-foreground mb-3 nav-rum-raisin">
                  {activeTab === 'restaurants' ? '🍽️ Filter by Cuisine' : '🥘 Filter by Category'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(activeTab === 'restaurants' ? cuisineFilters : dishFilters).map((filter) => (
                    <Button
                      key={filter.key}
                      variant={(activeTab === 'restaurants' ? cuisineFilter : dishFilter) === filter.key ? 'default' : 'secondary'}
                      size="sm"
                      onClick={() => {
                        if (activeTab === 'restaurants') {
                          setCuisineFilter(filter.key as CuisineFilter);
                        } else {
                          setDishFilter(filter.key as DishFilter);
                        }
                        toast.success(`Filtering by ${filter.label}`);
                      }}
                      className={cn(
                        "rounded-full gap-2 text-xs font-medium transition-all nav-rum-raisin",
                        (activeTab === 'restaurants' ? cuisineFilter : dishFilter) === filter.key 
                          ? "bg-foreground text-background shadow-md scale-105 font-semibold" 
                          : "bg-background hover:bg-background/80 text-muted-foreground hover:text-foreground font-light"
                      )}
                    >
                      <span className="text-sm">{filter.emoji}</span>
                      {filter.label}
                    </Button>
                  ))}
                </div>
                
                {/* Filter Stats */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">
                    {filteredData.length} {activeTab === 'restaurants' ? 'restaurants' : activeTab === 'foods' ? 'dishes' : 'results'} found
                  </span>
                  {((activeTab === 'restaurants' && cuisineFilter !== 'all') || 
                    (activeTab === 'foods' && dishFilter !== 'all')) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (activeTab === 'restaurants') {
                          setCuisineFilter('all');
                        } else {
                          setDishFilter('all');
                        }
                        toast.success('Filters cleared');
                      }}
                      className="text-xs h-6 px-2 rounded-full nav-rum-raisin"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Period Selector */}
          <div className="flex justify-center mt-3">
            <div className="flex bg-muted rounded-full p-1">
              {(['week', 'month', 'year'] as SortPeriod[]).map((period) => (
                <Button
                  key={period}
                  variant={sortPeriod === period ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortPeriod(period)}
                  className={cn(
                    "capitalize rounded-full px-4 font-medium transition-all nav-rum-raisin",
                    sortPeriod === period 
                      ? "bg-background text-foreground shadow-sm font-semibold" 
                      : "hover:bg-background/50 font-light"
                  )}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Title */}
        <div className="px-4 py-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {getTabTitle()}
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            {getTabDescription()}
          </p>
        </div>

        {/* Leaderboard List */}
        <div className="px-4 pb-6 space-y-3 animate-in fade-in duration-300">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <div
                key={item.id}
                className="animate-in slide-in-from-bottom-4 duration-300"
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <LeaderboardCard 
                  item={item} 
                  isFirst={index === 0}
                  activeTab={activeTab}
                  onShowRestaurantProfile={onShowRestaurantProfile}
                  onShowUserProfile={onShowUserProfile}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12 animate-in fade-in duration-500">
              <p className="text-muted-foreground text-lg">No results found</p>
              <p className="text-muted-foreground text-sm mt-2">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}