import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft,
  Trophy,
  Medal,
  Crown,
  Star,
  TrendingUp,
  MapPin,
  Fire,
  Calendar,
  Users,
  Target,
  ChartBar,
  Globe,
  Clock
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface LeaderboardPageProps {
  onBack: () => void;
}

// Mock leaderboard data
const globalLeaderboard = [
  {
    id: '1',
    username: 'FoodieKing',
    displayName: 'Marcus Johnson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    level: 156,
    xp: 234567,
    rank: 1,
    location: 'New York, NY',
    restaurants: 847,
    streak: 42
  },
  {
    id: '2',
    username: 'TasteExplorer',
    displayName: 'Sofia Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    level: 142,
    xp: 198432,
    rank: 2,
    location: 'Los Angeles, CA',
    restaurants: 693,
    streak: 38
  },
  {
    id: '3',
    username: 'CulinaryMaster',
    displayName: 'Ahmed Hassan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    level: 138,
    xp: 187921,
    rank: 3,
    location: 'Chicago, IL',
    restaurants: 612,
    streak: 29
  },
  {
    id: '4',
    username: 'SpiceSeeker',
    displayName: 'Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    level: 134,
    xp: 176543,
    rank: 4,
    location: 'Houston, TX',
    restaurants: 578,
    streak: 33
  },
  {
    id: '5',
    username: 'FlavorHunter',
    displayName: 'James Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    level: 129,
    xp: 165298,
    rank: 5,
    location: 'Miami, FL',
    restaurants: 534,
    streak: 25
  }
];

const weeklyLeaderboard = [
  {
    id: '6',
    username: 'RisingStar',
    displayName: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
    level: 89,
    xp: 12450,
    rank: 1,
    location: 'Seattle, WA',
    restaurants: 23,
    streak: 7
  },
  {
    id: '7',
    username: 'NewFoodie',
    displayName: 'Tyler Davis',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face',
    level: 76,
    xp: 9876,
    rank: 2,
    location: 'Portland, OR',
    restaurants: 18,
    streak: 6
  },
  {
    id: '8',
    username: 'TasteBud',
    displayName: 'Zoe Kim',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    level: 71,
    xp: 8432,
    rank: 3,
    location: 'Denver, CO',
    restaurants: 16,
    streak: 5
  }
];

const restaurantLeaderboard = [
  {
    id: 'r1',
    name: 'Giuseppe\'s Pizzeria',
    avatar: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&h=150&fit=crop',
    rating: 4.9,
    reviews: 2847,
    rank: 1,
    location: 'Brooklyn, NY',
    category: 'Italian',
    trending: true
  },
  {
    id: 'r2',
    name: 'Sakura Sushi House',
    avatar: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=150&h=150&fit=crop',
    rating: 4.8,
    reviews: 1923,
    rank: 2,
    location: 'Los Angeles, CA',
    category: 'Japanese',
    trending: false
  },
  {
    id: 'r3',
    name: 'Taco Libre',
    avatar: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150&h=150&fit=crop',
    rating: 4.7,
    reviews: 1654,
    rank: 3,
    location: 'Austin, TX',
    category: 'Mexican',
    trending: true
  }
];

export function LeaderboardPage({ onBack }: LeaderboardPageProps) {
  const [activeTab, setActiveTab] = useState('global');
  const [timeRange, setTimeRange] = useState('all-time');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown size={20} className="text-yellow-500" weight="fill" />;
      case 2:
        return <Medal size={20} className="text-gray-400" weight="fill" />;
      case 3:
        return <Medal size={20} className="text-amber-600" weight="fill" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="px-2">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-lg font-bold">Leaderboards</h1>
              <p className="text-xs text-muted-foreground">Global food rankings</p>
            </div>
          </div>
          <Trophy size={24} className="text-primary" weight="duotone" />
        </div>
      </div>

      <ScrollArea className="h-full pb-20">
        {/* Stats Header */}
        <div className="px-4 py-6 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Card className="text-center p-3">
              <CardContent className="p-0">
                <Globe size={24} className="mx-auto mb-2 text-primary" />
                <p className="text-xl font-bold">1.2M+</p>
                <p className="text-xs text-muted-foreground">Active Users</p>
              </CardContent>
            </Card>
            <Card className="text-center p-3">
              <CardContent className="p-0">
                <Target size={24} className="mx-auto mb-2 text-accent" />
                <p className="text-xl font-bold">50K+</p>
                <p className="text-xs text-muted-foreground">Restaurants</p>
              </CardContent>
            </Card>
            <Card className="text-center p-3">
              <CardContent className="p-0">
                <Star size={24} className="mx-auto mb-2 text-secondary" />
                <p className="text-xl font-bold">2.8M</p>
                <p className="text-xs text-muted-foreground">Reviews</p>
              </CardContent>
            </Card>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2 justify-center">
            <Button
              variant={timeRange === 'all-time' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('all-time')}
              className="text-xs"
            >
              <Clock size={14} className="mr-1" />
              All Time
            </Button>
            <Button
              variant={timeRange === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('monthly')}
              className="text-xs"
            >
              <Calendar size={14} className="mr-1" />
              This Month
            </Button>
            <Button
              variant={timeRange === 'weekly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('weekly')}
              className="text-xs"
            >
              <TrendingUp size={14} className="mr-1" />
              This Week
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="global" className="text-xs">
                <Users size={16} className="mr-1" />
                Users
              </TabsTrigger>
              <TabsTrigger value="restaurants" className="text-xs">
                <Target size={16} className="mr-1" />
                Places
              </TabsTrigger>
              <TabsTrigger value="trending" className="text-xs">
                <Fire size={16} className="mr-1" />
                Trending
              </TabsTrigger>
            </TabsList>

            {/* Global Leaderboard */}
            <TabsContent value="global" className="mt-0">
              <div className="space-y-3">
                {globalLeaderboard.map((user, index) => (
                  <Card key={user.id} className={cn(
                    "p-4 transition-all hover:shadow-md cursor-pointer",
                    index < 3 && "border-2",
                    user.rank === 1 && "border-yellow-400/50 bg-yellow-50/50",
                    user.rank === 2 && "border-gray-400/50 bg-gray-50/50",
                    user.rank === 3 && "border-amber-400/50 bg-amber-50/50"
                  )}>
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-10 flex justify-center">
                        {getRankIcon(user.rank)}
                      </div>

                      {/* Avatar */}
                      <div className="relative">
                        <Avatar className="w-14 h-14 border-2 border-background">
                          <AvatarImage src={user.avatar} alt={user.username} />
                          <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                        </Avatar>
                        <div className={cn(
                          "absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white",
                          getRankBadgeColor(user.rank)
                        )}>
                          {user.level}
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm truncate">{user.displayName}</h3>
                          {user.rank <= 3 && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                              Top {user.rank}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">@{user.username}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin size={12} />
                            <span>{user.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Fire size={12} />
                            <span>{user.streak} streak</span>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-primary">{user.xp.toLocaleString()} XP</p>
                        <p className="text-xs text-muted-foreground">{user.restaurants} places</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Restaurant Leaderboard */}
            <TabsContent value="restaurants" className="mt-0">
              <div className="space-y-3">
                {restaurantLeaderboard.map((restaurant) => (
                  <Card key={restaurant.id} className={cn(
                    "p-4 transition-all hover:shadow-md cursor-pointer",
                    restaurant.rank <= 3 && "border-2",
                    restaurant.rank === 1 && "border-yellow-400/50 bg-yellow-50/50",
                    restaurant.rank === 2 && "border-gray-400/50 bg-gray-50/50",
                    restaurant.rank === 3 && "border-amber-400/50 bg-amber-50/50"
                  )}>
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-10 flex justify-center">
                        {getRankIcon(restaurant.rank)}
                      </div>

                      {/* Restaurant Image */}
                      <div className="relative">
                        <Avatar className="w-14 h-14 border-2 border-background rounded-lg">
                          <AvatarImage src={restaurant.avatar} alt={restaurant.name} />
                          <AvatarFallback className="rounded-lg">{restaurant.name[0]}</AvatarFallback>
                        </Avatar>
                        {restaurant.trending && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                            <Fire size={12} weight="fill" />
                          </div>
                        )}
                      </div>

                      {/* Restaurant Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm truncate">{restaurant.name}</h3>
                          {restaurant.trending && (
                            <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                              Trending
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-yellow-500" weight="fill" />
                            <span className="text-xs font-medium">{restaurant.rating}</span>
                          </div>
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                            {restaurant.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin size={12} />
                          <span>{restaurant.location}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-primary">{restaurant.reviews}</p>
                        <p className="text-xs text-muted-foreground">reviews</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Trending Leaderboard */}
            <TabsContent value="trending" className="mt-0">
              <div className="space-y-3">
                <Card className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Fire size={24} className="text-red-500" weight="fill" />
                    <div>
                      <h3 className="font-bold text-red-700">🔥 Hot This Week</h3>
                      <p className="text-xs text-red-600">Rising stars and trending spots</p>
                    </div>
                  </div>
                </Card>

                {weeklyLeaderboard.map((user) => (
                  <Card key={user.id} className="p-4 transition-all hover:shadow-md cursor-pointer border-orange-200 bg-orange-50/30">
                    <div className="flex items-center gap-4">
                      {/* Trending Rank */}
                      <div className="flex-shrink-0 w-10 flex justify-center">
                        <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          #{user.rank}
                        </div>
                      </div>

                      {/* Avatar */}
                      <div className="relative">
                        <Avatar className="w-12 h-12 border-2 border-orange-300">
                          <AvatarImage src={user.avatar} alt={user.username} />
                          <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                          {user.level}
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm truncate">{user.displayName}</h3>
                          <Badge className="text-xs px-1.5 py-0.5 bg-gradient-to-r from-orange-400 to-red-500 border-0">
                            Rising
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">@{user.username}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin size={12} />
                            <span>{user.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp size={12} />
                            <span>+{user.xp} XP this week</span>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-orange-600">+{user.xp}</p>
                        <p className="text-xs text-muted-foreground">weekly XP</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}