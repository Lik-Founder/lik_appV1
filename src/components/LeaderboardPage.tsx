import { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowLeft, MagnifyingGlass, Globe, CaretDown, Star, Heart, TrendUp, CaretRight, Funnel, CircleNotch } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConsistentAvatar } from '@/components/ui/consistent-avatar';
import { LeaderboardSkeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import likLogo from '@/assets/images/Lik_Logo_Heart_1.0.png';

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

// Mock data generator for infinite scroll simulation
const generateMockData = (tab: TabType, page: number, itemsPerPage: number = 10): LeaderboardItem[] => {
  const startRank = (page - 1) * itemsPerPage + 1;
  const data: LeaderboardItem[] = [];

  for (let i = 0; i < itemsPerPage; i++) {
    const rank = startRank + i;
    
    if (tab === 'restaurants') {
      data.push({
        id: `restaurant-${rank}`,
        rank,
        name: `Restaurant ${rank}`,
        subtitle: `Cuisine • Location ${rank}`,
        imageUrl: `https://images.unsplash.com/photo-${1400000000000 + rank}?w=120&h=120&fit=crop&crop=center`,
        rating: Math.round((4.0 + Math.random() * 1) * 10) / 10,
        likes: Math.floor(Math.random() * 50000) + 10000,
        reviews: Math.floor(Math.random() * 500) + 100,
        cuisine: ['italian', 'american', 'japanese', 'mexican', 'french'][Math.floor(Math.random() * 5)] as any
      });
    } else if (tab === 'foods') {
      data.push({
        id: `food-${rank}`,
        rank,
        name: `Dish ${rank}`,
        subtitle: `Cuisine • Category`,
        imageUrl: `https://images.unsplash.com/photo-${1500000000000 + rank}?w=120&h=120&fit=crop&crop=center`,
        rating: Math.round((4.0 + Math.random() * 1) * 10) / 10,
        likes: Math.floor(Math.random() * 30000) + 5000,
        reviews: Math.floor(Math.random() * 300) + 50,
        category: ['mains', 'appetizers', 'desserts', 'drinks'][Math.floor(Math.random() * 4)] as any
      });
    } else {
      data.push({
        id: `user-${rank}`,
        rank,
        name: `Foodie${rank}`,
        subtitle: `@foodie${rank} • Level ${Math.floor(Math.random() * 50) + 10}`,
        imageUrl: `https://images.unsplash.com/photo-${1600000000000 + rank}?w=120&h=120&fit=crop&crop=face`,
        rating: Math.round((4.0 + Math.random() * 1) * 10) / 10,
        likes: Math.floor(Math.random() * 20000) + 2000,
        reviews: Math.floor(Math.random() * 800) + 100
      });
    }
  }

  return data;
};

// Initial mock data (first page)
const initialMockData = {
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

function getRankIcon(rank: number) {
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
      return 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 border-2 border-yellow-200 shadow-lg shadow-yellow-300/50';
    case 2:
      return 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 border-2 border-slate-200 shadow-lg shadow-slate-300/50';
    case 3:
      return 'bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 border-2 border-orange-200 shadow-lg shadow-orange-300/50';
    default:
      return 'bg-gradient-to-br from-pink-100 to-pink-200 border-2 border-pink-300 text-pink-700 shadow-md';
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
      toast.success(`Opening ${item.name} profile! 🏪✨`);
      onShowRestaurantProfile(item.id);
    } else if (activeTab === 'likers' && onShowUserProfile) {
      toast.success(`Opening ${item.name} profile! 👨‍🍳✨`);
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
        "group relative p-3 sm:p-4 rounded-2xl border-2 transition-all duration-300 touch-feedback shadow-lg backdrop-blur-sm mx-auto max-w-full",
        isClickable && "cursor-pointer hover:shadow-xl hover:scale-[1.01]",
        !isClickable && "cursor-default",
        isPressed && isClickable && "scale-[0.98] shadow-md",
        isFirst && item.rank === 1 
          ? "bg-gradient-to-br from-yellow-50/90 via-orange-50/90 to-pink-50/90 border-yellow-300 shadow-yellow-200/50" 
          : isTopThree
            ? "bg-gradient-to-br from-white/90 to-pink-50/80 border-pink-200"
            : "bg-gradient-to-br from-white/80 to-pink-50/60 border-pink-200/70",
        isClickable && "hover:bg-gradient-to-br hover:from-pink-50/90 hover:to-red-50/80 hover:border-pink-300",
        isTopThree && "ring-2 ring-opacity-30",
        item.rank === 1 && "ring-yellow-400",
        item.rank === 2 && "ring-slate-400",
        item.rank === 3 && "ring-orange-400"
      )}
      onClick={isClickable ? handleClick : undefined}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Rank */}
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full font-bold text-lg sm:text-xl shrink-0 relative",
            getRankStyle(item.rank),
            isTopThree ? "text-white" : "text-pink-700"
          )}
        >
          {/* Sparkle decoration for top 3 */}
          {isTopThree && (
            <div className="absolute -top-1 -right-1 text-xs">✨</div>
          )}
          {typeof getRankIcon(item.rank) === 'string' && getRankIcon(item.rank).length > 1 
            ? getRankIcon(item.rank) 
            : <span className="text-lg sm:text-xl font-black">{getRankIcon(item.rank)}</span>
          }
          {/* Crown for #1 */}
          {item.rank === 1 && (
            <div className="absolute -top-2 sm:-top-3 text-xl sm:text-2xl">👑</div>
          )}
        </div>

        {/* Avatar/Image */}
        {activeTab === 'likers' ? (
          <div className="relative shrink-0">
            <ConsistentAvatar
              src={item.imageUrl}
              alt={item.name}
              fallback={item.name[0]?.toUpperCase()}
              size="lg"
              variant="xp-ring"
              level={item.rank <= 10 ? 50 + (10 - item.rank) * 5 : Math.floor(Math.random() * 30) + 20} // Mock levels based on rank
              xpProgress={Math.random() * 0.8 + 0.2} // Mock XP progress
            />
            {/* Chef hat for top foodies */}
            {item.rank <= 3 && (
              <div className="absolute -top-1 -right-1 text-sm sm:text-base">👨‍🍳</div>
            )}
          </div>
        ) : (
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 bg-pink-100 border-2 border-pink-200 shadow-md relative">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${item.name}`;
              }}
            />
            {/* Special badges for top restaurants/foods */}
            {item.rank <= 3 && (
              <div className="absolute -top-1 -right-1 text-sm sm:text-base">
                {activeTab === 'restaurants' ? '🏪' : '🍽️'}
              </div>
            )}
          </div>
        )}

        {/* Content - Now stacked vertically on mobile */}
        <div className="flex-1 min-w-0">
          {/* Title and subtitle */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base sm:text-lg text-pink-800 line-clamp-1 nav-rum-raisin">
                {item.name}
              </h3>
              <p className="text-sm sm:text-base text-pink-600 line-clamp-1 font-medium">
                {item.subtitle}
              </p>
              {item.badge && (
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full font-medium shadow-md">
                  <span>🎉</span>
                  {item.badge}
                </span>
              )}
            </div>
          </div>

          {/* Stats row - horizontal on all screens */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              {activeTab === 'likers' ? (
                <>
                  {/* Rank placeholder for likers */}
                  <div className="text-xs sm:text-sm text-pink-600 font-bold bg-pink-100 px-2 py-1 rounded-full">
                    🥈 Silver
                  </div>
                  {/* Lik logo count */}
                  <div className="flex items-center gap-1 bg-white/80 px-2 py-1 rounded-full shadow-md border border-pink-200">
                    <img 
                      src={likLogo} 
                      alt="Lik" 
                      className="w-4 h-4" 
                    />
                    <span className="text-sm font-bold text-pink-700">
                      {item.likes >= 1000 
                        ? `${(item.likes / 1000).toFixed(item.likes >= 100000 ? 0 : 1)}K`
                        : item.likes
                      }
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm sm:text-base bg-white/80 px-2 py-1 rounded-full shadow-md">
                    <Star size={16} className="fill-current" />
                    {item.rating}
                  </div>
                  <div className="flex items-center gap-1 text-red-500 text-sm font-semibold bg-white/80 px-2 py-1 rounded-full shadow-md">
                    <Heart size={14} className="fill-current" />
                    {item.likes >= 1000 
                      ? `${(item.likes / 1000).toFixed(item.likes >= 100000 ? 0 : 1)}K`
                      : item.likes
                    }
                  </div>
                  {item.reviews && (
                    <div className="hidden sm:flex items-center gap-1 text-pink-600 text-xs font-medium bg-white/80 px-2 py-1 rounded-full shadow-sm">
                      <TrendUp size={12} />
                      {item.reviews >= 1000 
                        ? `${(item.reviews / 1000).toFixed(1)}K`
                        : item.reviews
                      }
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Navigation Arrow or Info */}
            {isClickable ? (
              <div className="flex items-center bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-2 rounded-full shadow-md">
                <div className="text-xs sm:text-sm font-medium mr-1 nav-rum-raisin hidden sm:block">
                  Tap
                </div>
                <CaretRight 
                  size={16} 
                  className="transition-all duration-300 group-hover:translate-x-1" 
                />
              </div>
            ) : activeTab === 'foods' ? (
              <div className="text-center bg-pink-100 px-2 py-1 rounded-full border border-pink-200">
                <div className="text-xs text-pink-600 font-medium">View only</div>
              </div>
            ) : null}
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
  
  // Floating app bar behavior
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAppBarVisible, setIsAppBarVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;
      const threshold = 50;

      if (currentScrollY > threshold) {
        // Hide app bar when scrolling down
        if (currentScrollY > lastScrollY.current) {
          setIsAppBarVisible(false);
        }
        // Show app bar when scrolling up
        else if (currentScrollY < lastScrollY.current) {
          setIsAppBarVisible(true);
        }
      } else {
        // Always show at top
        setIsAppBarVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Infinite scroll state
  const [allData, setAllData] = useState<Record<TabType, LeaderboardItem[]>>(() => ({
    restaurants: initialMockData.restaurants,
    foods: initialMockData.foods,
    likers: initialMockData.likers
  }));
  const [currentPage, setCurrentPage] = useState<Record<TabType, number>>({
    restaurants: 1,
    foods: 1,
    likers: 1
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(false);

  // Simulate API call for loading more data
  const loadMoreData = async (tab: TabType, page: number) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate new data
    const newData = generateMockData(tab, page, 10);
    
    // Simulate reaching end of data after 20 pages (200 items)
    const hasMore = page < 20;
    
    return { data: newData, hasMore };
  };

  const fetchNextPage = async () => {
    if (isLoading || !hasNextPage) return;

    setIsLoading(true);
    try {
      const nextPage = currentPage[activeTab] + 1;
      const { data: newData, hasMore } = await loadMoreData(activeTab, nextPage);

      setAllData(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], ...newData]
      }));
      
      setCurrentPage(prev => ({
        ...prev,
        [activeTab]: nextPage
      }));
      
      setHasNextPage(hasMore);
    } catch (error) {
      toast.error('Failed to load more data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset infinite scroll state when tab changes
  useEffect(() => {
    setHasNextPage(currentPage[activeTab] < 20); // Reset hasNextPage based on current tab
  }, [activeTab, currentPage]);

  // Reset data and pagination when filters change significantly
  useEffect(() => {
    // In a real app, you would refetch data with new filters
    // For now, we'll just reset to simulate filtered results
    if (searchQuery || cuisineFilter !== 'all' || dishFilter !== 'all') {
      setHasNextPage(false); // Disable infinite scroll when filtering
    } else {
      setHasNextPage(currentPage[activeTab] < 20);
    }
  }, [searchQuery, cuisineFilter, dishFilter, activeTab, currentPage]);

  // Set up infinite scroll observer
  const observerRef = useInfiniteScroll({
    hasNextPage: hasNextPage && !searchQuery && cuisineFilter === 'all' && dishFilter === 'all',
    isLoading,
    fetchNextPage
  });

  // Get current data with filters applied
  const currentData = allData[activeTab] || [];
  const filteredData = useMemo(() => {
    return currentData.filter(item => {
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
  }, [currentData, searchQuery, activeTab, cuisineFilter, dishFilter]);

  // Handle tab change
  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;
    
    setIsInitialLoading(true);
    setActiveTab(tab);
    // Reset filters when switching tabs
    setCuisineFilter('all');
    setDishFilter('all');
    setShowFilters(false);
    setSearchQuery('');
    
    // Simulate loading delay for tab switch
    setTimeout(() => {
      setIsInitialLoading(false);
    }, 300);
  };

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
      case 'global': return 'Worldwide 🌍';
      case 'national': return 'National 🇺🇸';
      case 'city': return 'City 🏙️';
      default: return 'Worldwide 🌍';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-pink-50 via-red-50 to-orange-50">
      {/* Floating Header */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-50 floating-app-bar",
        isAppBarVisible ? "visible" : "hidden"
      )}>
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-pink-200/50 bg-gradient-to-r from-pink-100/95 to-red-100/95 backdrop-blur-md floating-app-bar-backdrop">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0 hover:bg-pink-200/50 rounded-full w-10 h-10"
          >
            <ArrowLeft size={20} className="text-pink-700" />
          </Button>
          
          <div className="flex items-center gap-2 flex-1 justify-center">
            <span className="text-2xl sm:text-3xl">🏆</span>
            <h1 className="text-lg sm:text-xl font-semibold text-center nav-rum-raisin bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
              Leaderboard
            </h1>
            <span className="text-2xl sm:text-3xl">👑</span>
          </div>
        </div>

        {/* Sticky Filters */}
        <div className="bg-gradient-to-r from-pink-100/95 to-red-100/95 backdrop-blur-md border-b border-pink-200/50 floating-app-bar-backdrop">
          {/* Tabs */}
          <div className="flex p-3 sm:p-4 gap-2 sm:gap-3">
            {([
              { key: 'foods', label: 'Dishes', emoji: '🍽️' },
              { key: 'restaurants', label: 'Restaurants', emoji: '🏪' },
              { key: 'likers', label: 'Foodies', emoji: '👨‍🍳' }
            ] as { key: TabType; label: string; emoji: string }[]).map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? 'default' : 'secondary'}
                onClick={() => handleTabChange(tab.key)}
                className={cn(
                  "flex-1 rounded-full font-medium transition-all duration-300 nav-rum-raisin gap-1 sm:gap-2 h-10 sm:h-12 text-sm sm:text-base shadow-lg border-2",
                  activeTab === tab.key 
                    ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-pink-300/50 border-pink-300 font-bold scale-105 transform" 
                    : "bg-white/80 hover:bg-white text-pink-700 border-pink-200 hover:border-pink-300 hover:scale-102 shadow-pink-200/30"
                )}
              >
                <span className="text-base sm:text-lg">{tab.emoji}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden text-xs">{tab.label.slice(0,6)}</span>
              </Button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="px-3 sm:px-4 pb-3 sm:pb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <MagnifyingGlass 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-500" 
                />
                <Input
                  placeholder={`Search ${activeTab === 'restaurants' ? 'restaurants' : activeTab === 'foods' ? 'dishes' : 'foodies'}... 🔍`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 rounded-full border-2 border-pink-200 bg-white/90 shadow-lg focus:border-pink-400 h-10 sm:h-12 text-sm sm:text-base placeholder:text-pink-400"
                />
              </div>

              {/* Category Filter Button (only for restaurants and foods) */}
              {(activeTab === 'restaurants' || activeTab === 'foods') && (
                <Button
                  variant="outline"
                  className="shrink-0 rounded-full px-3 sm:px-6 h-10 sm:h-12 gap-1 sm:gap-2 nav-rum-raisin font-medium bg-white/80 border-2 border-pink-200 text-pink-700 hover:bg-pink-50 hover:border-pink-300 shadow-lg"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Funnel size={16} />
                  <span className="hidden sm:inline">Filter</span>
                  <CaretDown 
                    size={14} 
                    className={cn(
                      "transition-transform duration-300",
                      showFilters && "rotate-180"
                    )}
                  />
                </Button>
              )}

              {/* Scope Selector */}
              <Button
                variant="outline"
                className="shrink-0 rounded-full px-3 sm:px-6 h-10 sm:h-12 gap-1 sm:gap-2 nav-rum-raisin font-medium bg-white/80 border-2 border-pink-200 text-pink-700 hover:bg-pink-50 hover:border-pink-300 shadow-lg"
                onClick={() => {
                  const scopes: ScopeType[] = ['global', 'national', 'city'];
                  const currentIndex = scopes.indexOf(scope);
                  const nextScope = scopes[(currentIndex + 1) % scopes.length];
                  setScope(nextScope);
                }}
              >
                <Globe size={16} />
                <span className="hidden sm:inline">{getScopeText()}</span>
                <span className="sm:hidden text-xs">
                  {scope === 'global' ? '🌍' : scope === 'national' ? '🇺🇸' : '🏙️'}
                </span>
              </Button>
            </div>

            {/* Category Filters (expandable) */}
            {showFilters && (activeTab === 'restaurants' || activeTab === 'foods') && (
              <div className="mt-3 sm:mt-4 animate-in slide-in-from-top-2 duration-300">
                <div className="bg-gradient-to-br from-white/90 to-pink-50/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border-2 border-pink-200/50 backdrop-blur-sm">
                  <h3 className="text-base sm:text-lg font-bold text-pink-700 mb-3 sm:mb-4 nav-rum-raisin flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">
                      {activeTab === 'restaurants' ? '🍽️' : '🥘'}
                    </span>
                    <span className="text-sm sm:text-base">
                      {activeTab === 'restaurants' ? 'Filter by Cuisine' : 'Filter by Category'}
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
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
                          toast.success(`Filtering by ${filter.label} ${filter.emoji}`);
                        }}
                        className={cn(
                          "rounded-full gap-1 sm:gap-2 text-xs sm:text-sm font-medium transition-all nav-rum-raisin h-8 sm:h-10 px-3 sm:px-4 shadow-md border-2",
                          (activeTab === 'restaurants' ? cuisineFilter : dishFilter) === filter.key 
                            ? "bg-gradient-to-r from-pink-500 to-red-500 text-white border-pink-300 shadow-pink-300/50 font-bold scale-105 transform" 
                            : "bg-white/90 hover:bg-pink-50 text-pink-700 border-pink-200 hover:border-pink-300 hover:scale-102"
                        )}
                      >
                        <span className="text-sm sm:text-base">{filter.emoji}</span>
                        <span className="hidden sm:inline">{filter.label}</span>
                        <span className="sm:hidden text-xs">{filter.label.slice(0,8)}</span>
                      </Button>
                    ))}
                  </div>
                  
                  {/* Filter Stats */}
                  <div className="flex items-center justify-between mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-pink-200/50">
                    <div className="flex items-center gap-2">
                      <span className="text-lg sm:text-2xl">📊</span>
                      <span className="text-xs sm:text-sm font-medium text-pink-700 nav-rum-raisin">
                        {filteredData.length} {activeTab === 'restaurants' ? 'restaurants' : activeTab === 'foods' ? 'dishes' : 'results'} found
                      </span>
                    </div>
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
                          toast.success('Filters cleared! ✨');
                        }}
                        className="text-xs sm:text-sm h-6 sm:h-8 px-2 sm:px-4 rounded-full nav-rum-raisin text-pink-600 hover:bg-pink-100 border border-pink-200 hover:border-pink-300"
                      >
                        🧹 Clear
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Period Selector */}
            <div className="flex justify-center mt-3 sm:mt-4">
              <div className="flex bg-white/80 rounded-full p-1 sm:p-2 shadow-lg border-2 border-pink-200">
                {(['week', 'month', 'year'] as SortPeriod[]).map((period) => (
                  <Button
                    key={period}
                    variant={sortPeriod === period ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSortPeriod(period)}
                    className={cn(
                      "capitalize rounded-full px-3 sm:px-6 h-8 sm:h-10 font-medium transition-all nav-rum-raisin text-xs sm:text-sm",
                      sortPeriod === period 
                        ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-md font-bold" 
                        : "hover:bg-pink-50 text-pink-700 font-medium"
                    )}
                  >
                    {period === 'week' && '📅 '}
                    {period === 'month' && '🗓️ '}
                    {period === 'year' && '📆 '}
                    {period}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content with top padding to account for floating header */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-auto smooth-scroll-container" 
        style={{ paddingTop: '200px' }}
      >
        {/* Title */}
        <div className="px-3 sm:px-4 py-4 sm:py-8 text-center bg-gradient-to-br from-pink-50 to-red-50">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <span className="text-2xl sm:text-4xl">✨</span>
            <h2 className="text-xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text nav-rum-raisin">
              {getTabTitle()}
            </h2>
            <span className="text-2xl sm:text-4xl">✨</span>
          </div>
          <div className="max-w-xs sm:max-w-sm mx-auto bg-white/70 rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-lg border border-pink-200">
            <p className="text-xs sm:text-sm text-pink-700 leading-relaxed font-medium">
              {getTabDescription()}
            </p>
          </div>
        </div>

        {/* Loading state for tab switch */}
        {isInitialLoading ? (
          <div className="animate-in fade-in-50 duration-300">
            <LeaderboardSkeleton />
          </div>
        ) : (
          /* Leaderboard List */
          <div className="px-2 sm:px-4 pb-6 sm:pb-8 space-y-3 sm:space-y-4">
            {filteredData.length > 0 ? (
              <>
                {filteredData.map((item, index) => (
                  <div
                    key={item.id}
                    className="leaderboard-item-enter"
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
                ))}

                {/* Infinite Scroll Trigger */}
                {hasNextPage && !searchQuery && cuisineFilter === 'all' && dishFilter === 'all' && (
                  <div ref={observerRef} className="flex justify-center py-6">
                    {isLoading ? (
                      <div className="infinite-scroll-indicator loading flex items-center gap-3 bg-gradient-to-r from-pink-50 to-red-50 rounded-2xl px-6 py-4 shadow-lg border-2 border-pink-200 backdrop-blur-sm">
                        <CircleNotch size={20} className="leaderboard-loading-spinner text-pink-500" />
                        <span className="text-pink-700 font-medium nav-rum-raisin">
                          Loading more amazing {activeTab}...
                        </span>
                        <span className="text-lg">✨</span>
                      </div>
                    ) : (
                      <div className="infinite-scroll-indicator text-center bg-gradient-to-r from-white/80 to-pink-50/80 rounded-2xl px-6 py-4 shadow-lg border-2 border-pink-200 backdrop-blur-sm">
                        <div className="flex items-center gap-2 justify-center">
                          <span className="text-pink-600 text-sm font-medium nav-rum-raisin">
                            Scroll for more
                          </span>
                          <span className="text-lg">🏆</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Loading More Items Skeleton */}
                {isLoading && (
                  <div className="animate-in fade-in-50 duration-300">
                    <div className="space-y-3 sm:space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={`loading-${i}`}
                          className="p-3 sm:p-4 rounded-2xl border-2 border-pink-200/30 bg-white/40 backdrop-blur-sm loading-shimmer"
                        >
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full skeleton-item shrink-0" />
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl skeleton-item shrink-0" />
                            <div className="flex-1 space-y-2">
                              <div className="h-5 skeleton-item rounded-lg w-3/4" />
                              <div className="h-4 skeleton-item rounded-lg w-1/2" />
                              <div className="flex gap-2 mt-2">
                                <div className="h-6 w-16 skeleton-item rounded-full" />
                                <div className="h-6 w-16 skeleton-item rounded-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* End of Results Indicator */}
                {!hasNextPage && !searchQuery && cuisineFilter === 'all' && dishFilter === 'all' && filteredData.length > 8 && (
                  <div className="text-center py-6">
                    <div className="celebration-bounce bg-gradient-to-r from-pink-100 to-red-100 rounded-2xl p-6 shadow-lg border-2 border-pink-200 max-w-sm mx-auto">
                      <span className="text-3xl mb-3 block">🏁</span>
                      <p className="text-pink-700 text-lg font-semibold nav-rum-raisin mb-2">
                        You've reached the end!
                      </p>
                      <p className="text-pink-600 text-sm">
                        You've seen all the top {activeTab} in our leaderboard! 🎉
                      </p>
                      <div className="mt-3 text-xs text-pink-500 font-medium">
                        {filteredData.length} items loaded
                      </div>
                    </div>
                  </div>
                )}

                {/* Filtered Results Info */}
                {(searchQuery || cuisineFilter !== 'all' || dishFilter !== 'all') && (
                  <div className="text-center py-4">
                    <div className="bg-blue-50 rounded-2xl p-4 shadow-lg border-2 border-blue-200 max-w-sm mx-auto">
                      <span className="text-2xl mb-2 block">🔍</span>
                      <p className="text-blue-700 text-sm font-medium nav-rum-raisin">
                        Showing filtered results • Clear filters to load more
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className="bg-white/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-pink-200 max-w-xs sm:max-w-sm mx-auto">
                  <span className="text-4xl sm:text-6xl mb-3 sm:mb-4 block">😔</span>
                  <p className="text-pink-700 text-base sm:text-lg font-semibold nav-rum-raisin mb-2">No results found</p>
                  <p className="text-pink-600 text-sm">
                    Try adjusting your search or filters! 🔍✨
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}