import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftIcon, StarIcon as CrownIcon, FireIcon, CurrencyDollarIcon, HeartIcon, MapIcon, TrophyIcon, ChartBarIcon, StarIcon, LockClosedIcon, ShareIcon, UsersIcon, MapPinIcon, CalendarIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface LikPassportPageProps {
  onBack: () => void;
}

interface UserRank {
  name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond' | 'legendary';
  level: number;
  xp: number;
  maxXp: number;
  bgGradient: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  earned: boolean;
  progress?: number;
  maxProgress?: number;
  earnedDate?: string;
}

interface RestaurantStamp {
  id: string;
  name: string;
  cuisine: string;
  visitDate: string;
  rating: number;
  lat: number;
  lng: number;
  snippet: string;
  image: string;
}

interface TasteProfile {
  sweet: number;
  salty: number;
  spicy: number;
  sour: number;
  bitter: number;
  umami: number;
}

export function LikPassportPage({ onBack }: LikPassportPageProps) {
  const [activeTab, setActiveTab] = useState<'map' | 'achievements' | 'stats'>('map');
  const [selectedStamp, setSelectedStamp] = useState<RestaurantStamp | null>(null);
  const [mapFilter, setMapFilter] = useState<'all' | 'favorite' | 'recent'>('all');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Mock user data
  const userRank: UserRank = {
    name: 'Grand Master',
    tier: 'legendary',
    level: 42,
    xp: 15750,
    maxXp: 20000,
    bgGradient: 'from-purple-600 via-pink-500 to-orange-400'
  };

  const userStats = {
    streakCount: 28,
    likCoins: 2840,
    hearts: 1250,
    restaurantsVisited: 156,
    reviewsWritten: 89,
    friendsCount: 245
  };

  const achievements: Achievement[] = [
    {
      id: '1',
      name: 'Taco Tuesday Champion',
      description: 'Visit 10 Mexican restaurants',
      icon: '🌮',
      rarity: 'epic',
      earned: true,
      earnedDate: '2024-12-15'
    },
    {
      id: '2',
      name: 'Pizza Perfectionist',
      description: 'Rate 25 pizzas with 5 stars',
      icon: '🍕',
      rarity: 'rare',
      earned: true,
      earnedDate: '2024-11-28'
    },
    {
      id: '3',
      name: 'Sweet Tooth',
      description: 'Review 15 dessert places',
      icon: '🍰',
      rarity: 'uncommon',
      earned: true,
      earnedDate: '2024-12-01'
    },
    {
      id: '4',
      name: 'Global Explorer',
      description: 'Try cuisine from 20 different countries',
      icon: '🌍',
      rarity: 'legendary',
      earned: false,
      progress: 17,
      maxProgress: 20
    },
    {
      id: '5',
      name: 'Social Butterfly',
      description: 'Get 100 likes on reviews',
      icon: '🦋',
      rarity: 'rare',
      earned: false,
      progress: 78,
      maxProgress: 100
    },
    {
      id: '6',
      name: 'Early Bird',
      description: 'Visit 5 breakfast spots before 8 AM',
      icon: '🌅',
      rarity: 'common',
      earned: false,
      progress: 2,
      maxProgress: 5
    }
  ];

  const restaurantStamps: RestaurantStamp[] = [
    {
      id: '1',
      name: 'Bella Italia',
      cuisine: 'Italian',
      visitDate: '2024-12-20',
      rating: 4.8,
      lat: 40.7589,
      lng: -73.9851,
      snippet: 'Amazing truffle pasta!',
      image: '/api/placeholder/150/100'
    },
    {
      id: '2',
      name: 'Taco Libre',
      cuisine: 'Mexican',
      visitDate: '2024-12-18',
      rating: 4.5,
      lat: 40.7505,
      lng: -73.9934,
      snippet: 'Best carnitas in the city',
      image: '/api/placeholder/150/100'
    },
    {
      id: '3',
      name: 'Sakura Sushi',
      cuisine: 'Japanese',
      visitDate: '2024-12-15',
      rating: 4.9,
      lat: 40.7614,
      lng: -73.9776,
      snippet: 'Fresh sashimi perfection',
      image: '/api/placeholder/150/100'
    }
  ];

  const tasteProfile: TasteProfile = {
    sweet: 85,
    salty: 70,
    spicy: 60,
    sour: 45,
    bitter: 30,
    umami: 75
  };

  const cuisineStats = [
    { name: 'Asian', percentage: 35, color: '#FF6B6B' },
    { name: 'American', percentage: 25, color: '#4ECDC4' },
    { name: 'Italian', percentage: 20, color: '#45B7D1' },
    { name: 'Mexican', percentage: 15, color: '#FFA07A' },
    { name: 'Other', percentage: 5, color: '#98D8C8' }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'uncommon': return 'from-green-400 to-green-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-orange-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getTierGradient = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'from-orange-600 to-yellow-600';
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-orange-500';
      case 'diamond': return 'from-blue-400 to-purple-600';
      case 'legendary': return 'from-purple-600 via-pink-500 to-orange-400';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="h-full bg-background overflow-y-auto">
      {/* Header with rank and stats */}
      <div className={cn(
        "relative px-6 py-8 bg-gradient-to-br",
        getTierGradient(userRank.tier)
      )}>
        {/* Animated particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-all"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>

        {/* Rank badge */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 flex items-center justify-center text-4xl shadow-2xl">
              <CrownIcon className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              {userRank.level}
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 nav-rum-raisin drop-shadow-lg">
            {userRank.name}
          </h1>
          
          {/* XP Progress */}
          <div className="max-w-xs mx-auto">
            <div className="flex justify-between text-white text-sm mb-2">
              <span>{userRank.xp.toLocaleString()} XP</span>
              <span>{userRank.maxXp.toLocaleString()} XP</span>
            </div>
            <div className="relative h-3 bg-black/20 rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full transition-all duration-500"
                style={{ width: `${(userRank.xp / userRank.maxXp) * 100}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex justify-center space-x-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <FireIcon className="w-5 h-5 text-orange-400 mr-1" />
              <span className="text-white font-bold">{userStats.streakCount}</span>
            </div>
            <span className="text-white/80 text-xs">Streak</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <CurrencyDollarIcon className="w-5 h-5 text-yellow-400 mr-1" />
              <span className="text-white font-bold">{userStats.likCoins.toLocaleString()}</span>
            </div>
            <span className="text-white/80 text-xs">Coins</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <HeartIcon className="w-5 h-5 text-red-400 mr-1" />
              <span className="text-white font-bold">{userStats.hearts.toLocaleString()}</span>
            </div>
            <span className="text-white/80 text-xs">Hearts</span>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="px-6 py-4 bg-background border-b border-border">
        <div className="flex space-x-3">
          {[
            { id: 'map', label: 'Map', icon: MapIcon },
            { id: 'achievements', label: 'Achievements', icon: TrophyIcon },
            { id: 'stats', label: 'Stats', icon: ChartBarIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-full font-medium transition-all",
                activeTab === tab.id
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg transform scale-105"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <tab.icon size={16} />
              <span className="nav-rum-raisin">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="pb-6">
        {activeTab === 'map' && (
          <div className="p-6">
            {/* Map filters */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-2">
                {[
                  { id: 'all', label: 'All Visits' },
                  { id: 'favorite', label: 'Favorites' },
                  { id: 'recent', label: 'Recent' }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setMapFilter(filter.id as any)}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium transition-all",
                      mapFilter === filter.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={cn(
                  "p-2 rounded-full transition-all",
                  showHeatmap ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                <FunnelIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive map visualization */}
            <Card className="p-6 mb-6 bg-gradient-to-br from-blue-50 to-green-50">
              <div className="aspect-[16/10] relative bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden">
                {/* Simulated map with restaurant stamps */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPinIcon className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Interactive Culinary Journey Map</p>
                    <p className="text-xs text-muted-foreground mt-1">{restaurantStamps.length} restaurants visited</p>
                  </div>
                </div>
                
                {/* Restaurant stamps positioned around the map */}
                {restaurantStamps.map((stamp, index) => (
                  <button
                    key={stamp.id}
                    onClick={() => setSelectedStamp(stamp)}
                    className="absolute w-8 h-8 bg-gradient-to-br from-red-400 to-pink-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm hover:scale-110 transition-transform"
                    style={{
                      left: `${20 + index * 25}%`,
                      top: `${30 + (index % 2) * 20}%`
                    }}
                  >
                    {index + 1}
                  </button>
                ))}

                {/* Travel lines connecting restaurants */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {restaurantStamps.slice(0, -1).map((_, index) => (
                    <line
                      key={index}
                      x1={`${20 + index * 25}%`}
                      y1={`${30 + (index % 2) * 20}%`}
                      x2={`${20 + (index + 1) * 25}%`}
                      y2={`${30 + ((index + 1) % 2) * 20}%`}
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="animate-pulse"
                    />
                  ))}
                </svg>
              </div>
            </Card>

            {/* Selected stamp details */}
            {selectedStamp && (
              <Card className="p-4 border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg nav-rum-raisin">{selectedStamp.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedStamp.cuisine} • {selectedStamp.visitDate}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{selectedStamp.rating}</span>
                  </div>
                </div>
                <p className="text-sm mb-3 italic">"{selectedStamp.snippet}"</p>
                <button
                  onClick={() => setSelectedStamp(null)}
                  className="text-xs text-primary hover:underline"
                >
                  Close
                </button>
              </Card>
            )}

            {/* Journey stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{restaurantStamps.length}</div>
                <div className="text-sm text-muted-foreground">Stamps Collected</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500">12</div>
                <div className="text-sm text-muted-foreground">Cities Explored</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-500">8</div>
                <div className="text-sm text-muted-foreground">Cuisine Types</div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="p-6">
            {/* Featured achievements carousel */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4 nav-rum-raisin">Recent Achievements</h2>
              <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
                {achievements.filter(a => a.earned).slice(0, 3).map((achievement) => (
                  <Card key={achievement.id} className="flex-shrink-0 w-48 p-4 bg-gradient-to-br from-yellow-100 to-orange-100 border border-yellow-200">
                    <div className="text-center">
                      <div className="text-3xl mb-2">{achievement.icon}</div>
                      <h3 className="font-semibold text-sm mb-1">{achievement.name}</h3>
                      <p className="text-xs text-muted-foreground">{achievement.earnedDate}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* All achievements grid */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold nav-rum-raisin">All Achievements</h2>
                <Button variant="outline" size="sm">
                  <ShareIcon className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <Card 
                    key={achievement.id} 
                    className={cn(
                      "p-4 relative overflow-hidden transition-all hover:scale-105",
                      achievement.earned 
                        ? "bg-gradient-to-br shadow-lg" 
                        : "bg-muted/50 opacity-75"
                    )}
                    style={achievement.earned ? { 
                      background: `linear-gradient(135deg, ${getRarityColor(achievement.rarity).replace('from-', '').replace('to-', ', ')})` 
                    } : {}}
                  >
                    {!achievement.earned && (
                      <div className="absolute top-2 right-2">
                        <LockClosedIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className="text-2xl mb-2 filter grayscale-0">
                        {achievement.icon}
                      </div>
                      <h3 className={cn(
                        "font-semibold text-sm mb-1",
                        achievement.earned ? "text-white" : "text-foreground"
                      )}>
                        {achievement.name}
                      </h3>
                      <p className={cn(
                        "text-xs mb-2",
                        achievement.earned ? "text-white/80" : "text-muted-foreground"
                      )}>
                        {achievement.description}
                      </p>
                      
                      {!achievement.earned && achievement.progress !== undefined && (
                        <div className="space-y-1">
                          <Progress 
                            value={(achievement.progress! / achievement.maxProgress!) * 100} 
                            className="h-2"
                          />
                          <p className="text-xs text-muted-foreground">
                            {achievement.progress}/{achievement.maxProgress}
                          </p>
                        </div>
                      )}
                      
                      {achievement.earned && (
                        <Badge variant="secondary" className="text-xs">
                          {achievement.rarity}
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="p-6 space-y-6">
            {/* Taste profile wheel */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 nav-rum-raisin">Taste Profile</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  {Object.entries(tasteProfile).map(([taste, value]) => (
                    <div key={taste} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize font-medium">{taste}</span>
                        <span className="text-muted-foreground">{value}%</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-4 border-primary/30">
                    <div className="text-center">
                      <div className="text-2xl mb-1">👅</div>
                      <div className="text-xs text-muted-foreground">Taste Profile</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Cuisine distribution */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 nav-rum-raisin">Cuisine Preferences</h2>
              <div className="space-y-3">
                {cuisineStats.map((cuisine) => (
                  <div key={cuisine.name} className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: cuisine.color }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{cuisine.name}</span>
                        <span className="text-muted-foreground">{cuisine.percentage}%</span>
                      </div>
                      <Progress value={cuisine.percentage} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Visit statistics */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 nav-rum-raisin">Visit Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{userStats.restaurantsVisited}</div>
                  <div className="text-sm text-muted-foreground">Restaurants</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-500">{userStats.reviewsWritten}</div>
                  <div className="text-sm text-muted-foreground">Reviews</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-500">4.7</div>
                  <div className="text-sm text-muted-foreground">Avg Rating</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-500">28</div>
                  <div className="text-sm text-muted-foreground">This Month</div>
                </div>
              </div>
            </Card>

            {/* Top dishes */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 nav-rum-raisin">Top 5 Favorite Dishes</h2>
              <div className="space-y-3">
                {[
                  { name: 'Truffle Pasta', restaurant: 'Bella Italia', rating: 4.9 },
                  { name: 'Spicy Ramen', restaurant: 'Noodle House', rating: 4.8 },
                  { name: 'Fish Tacos', restaurant: 'Coastal Grill', rating: 4.7 },
                  { name: 'Margherita Pizza', restaurant: 'Tony\'s', rating: 4.6 },
                  { name: 'Chocolate Soufflé', restaurant: 'Sweet Dreams', rating: 4.5 }
                ].map((dish, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{dish.name}</div>
                      <div className="text-sm text-muted-foreground">{dish.restaurant}</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <StarIcon className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{dish.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Social comparison */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold nav-rum-raisin">Social Stats</h2>
                <Button variant="outline" size="sm">
                  <UsersIcon className="w-4 h-4 mr-2" />
                  Compare with Friends
                </Button>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                <div className="text-lg font-bold text-primary">Top 15%</div>
                <div className="text-sm text-muted-foreground">Among your friends</div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}