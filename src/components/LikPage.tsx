import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Flame, 
  Ticket, 
  Coins, 
  ChartBar, 
  Gift, 
  MagnifyingGlass,
  MapPin,
  Clock,
  Star,
  Users,
  ForkKnife,
  Timer
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { UserProgress, Bounty, Quest } from '@/lib/types';

// Mock data for development
const mockUserProgress: UserProgress = {
  level: 24,
  xp: 1250,
  xpToNextLevel: 1500,
  streakCount: 4,
  likTickets: 2,
  likCoins: 1200
};

const mockBounties: Bounty[] = [
  {
    id: '1',
    dishName: 'Kebab Combo',
    restaurantName: 'Kebab Shop',
    category: 'Middle Eastern',
    timeRemaining: '24:00',
    rating: 4.5,
    reward: 750,
    imageUrl: '/api/placeholder/300/200',
    difficulty: 'Medium'
  },
  {
    id: '2',
    dishName: 'French Toast',
    restaurantName: "Tex's Diner",
    category: 'Breakfast',
    timeRemaining: '12:30',
    rating: 4.8,
    reward: 500,
    imageUrl: '/api/placeholder/300/200',
    difficulty: 'Easy'
  }
];

const mockQuests: Quest[] = [
  {
    id: '1',
    name: 'Donut Discovery',
    type: 'solo',
    reward: 1000,
    difficulty: 'Medium',
    locationCount: 3,
    timeLimit: '7 Days',
    imageUrl: '/api/placeholder/300/200',
    description: 'Visit 3 different donut shops and try their signature items'
  },
  {
    id: '2',
    name: 'Burger Battle',
    type: 'team',
    reward: 1500,
    difficulty: 'Hard',
    locationCount: 5,
    timeLimit: '14 Days',
    imageUrl: '/api/placeholder/300/200',
    description: 'Team up and conquer the best burger joints in the city'
  }
];

export function LikPage() {
  const [userProgress] = useKV('user-progress', mockUserProgress);
  const [bounties] = useKV('bounties', mockBounties);
  const [quests] = useKV('quests', mockQuests);
  const [activeView, setActiveView] = useState<'bounties' | 'quests'>('bounties');
  const [selectedFilter, setSelectedFilter] = useState<'nearby' | 'most-wanted' | 'for-you'>('nearby');
  const [searchQuery, setSearchQuery] = useState('');

  const xpProgress = (userProgress.xp / userProgress.xpToNextLevel) * 100;

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden relative">
      {/* Fixed Header */}
      <div className="bg-background border-b border-border">
        {/* Top Section - User Progress */}
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Profile with XP Ring */}
          <div className="relative">
            <div className="w-16 h-16 relative">
              {/* XP Progress Ring */}
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="oklch(0.9 0 0)"
                  strokeWidth="3"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="url(#xpGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - xpProgress / 100)}`}
                  className="transition-all duration-300"
                />
                <defs>
                  <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f09433" />
                    <stop offset="25%" stopColor="#e6683c" />
                    <stop offset="50%" stopColor="#dc2743" />
                    <stop offset="75%" stopColor="#cc2366" />
                    <stop offset="100%" stopColor="#bc1888" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Profile Picture */}
              <div className="absolute inset-1 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">U</span>
                </div>
              </div>
              
              {/* Level Badge */}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs font-bold px-2 py-0.5 rounded-full">
                {userProgress.level}
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-4">
            {/* Streak */}
            <div className="flex items-center gap-1">
              <Flame size={20} weight="fill" className="text-orange-500" />
              <span className="font-semibold">{userProgress.streakCount}</span>
            </div>

            {/* Tickets */}
            <div className="flex items-center gap-1">
              <Ticket size={20} weight="fill" className="text-yellow-500" />
              <span className="font-semibold">{userProgress.likTickets}</span>
            </div>

            {/* Coins */}
            <div className="flex items-center gap-1">
              <Coins size={20} weight="fill" className="text-amber-500" />
              <span className="font-semibold">{userProgress.likCoins > 999 ? `${(userProgress.likCoins / 1000).toFixed(1)}k` : userProgress.likCoins}</span>
            </div>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="px-4 py-2 flex items-center justify-center">
          <div className="flex items-center gap-4">
            {/* Leaderboard */}
            <Button variant="ghost" size="sm" className="p-2">
              <ChartBar size={20} />
            </Button>

            {/* Tab Selector */}
            <div className="bg-muted rounded-lg p-1 flex">
              <Button
                variant={activeView === 'bounties' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('bounties')}
                className="font-medium"
              >
                Bounties
              </Button>
              <Button
                variant={activeView === 'quests' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('quests')}
                className="font-medium"
              >
                Quests
              </Button>
            </div>

            {/* Rewards */}
            <Button variant="ghost" size="sm" className="p-2">
              <Gift size={20} />
            </Button>
          </div>
        </div>


      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-16">
        {/* Filter Tabs */}
        <div className="px-4 py-4 flex justify-center">
          <div className="flex gap-2">
            {(['nearby', 'most-wanted', 'for-you'] as const).map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className="rounded-full"
              >
                {filter === 'nearby' && 'Nearby'}
                {filter === 'most-wanted' && 'Most Wanted'}
                {filter === 'for-you' && 'For You'}
              </Button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder={`Search For ${activeView === 'bounties' ? 'Bounty' : 'Quest'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {activeView === 'bounties' ? (
          <BountiesView bounties={bounties} />
        ) : (
          <QuestsView quests={quests} />
        )}
      </div>

      {/* Floating Map Button */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-10">
        <Button 
          size="sm" 
          className="bg-foreground text-background hover:bg-foreground/90 px-4 py-2 rounded-full shadow-lg border border-border/20"
        >
          <MapPin size={14} className="mr-1.5" />
          Map
        </Button>
      </div>
    </div>
  );
}

function BountiesView({ bounties }: { bounties: Bounty[] }) {
  return (
    <div className="px-4 space-y-4">
      {/* Promoted Bounties Carousel */}
      <div className="space-y-3">
        <div className="text-center">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Featured</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide justify-center">
          {bounties.slice(0, 2).map((bounty) => (
            <Card key={bounty.id} className="min-w-[280px] overflow-hidden">
              <div className="relative">
                <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                  <ForkKnife size={32} className="text-muted-foreground" />
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{bounty.dishName}</h4>
                        <p className="text-sm opacity-90">{bounty.restaurantName}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Timer size={14} />
                          <span className="text-sm">{bounty.timeRemaining}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={14} weight="fill" className="text-yellow-400" />
                          <span className="text-sm">{bounty.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs opacity-75">Reward</span>
                      <div className="flex items-center gap-1">
                        <span className="font-bold">+{bounty.reward}</span>
                        <Coins size={14} weight="fill" className="text-yellow-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Local Bounties */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Near You</h3>
        <div className="grid grid-cols-2 gap-3">
          {bounties.map((bounty) => (
            <Card key={`local-${bounty.id}`} className="overflow-hidden">
              <div className="aspect-square bg-muted flex items-center justify-center">
                <ForkKnife size={24} className="text-muted-foreground" />
              </div>
              <div className="p-3">
                <h4 className="font-semibold text-sm mb-1">{bounty.dishName}</h4>
                <p className="text-xs text-muted-foreground mb-2">{bounty.restaurantName}</p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Timer size={12} />
                    <span>{bounty.timeRemaining}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">+{bounty.reward}</span>
                    <Coins size={12} weight="fill" className="text-yellow-500" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestsView({ quests }: { quests: Quest[] }) {
  return (
    <div className="px-4 space-y-4">
      {/* Promoted Quests */}
      <div className="space-y-3">
        <div className="text-center">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Epic Quests</h3>
        </div>
        <div className="space-y-3">
          {quests.map((quest) => (
            <Card key={quest.id} className="overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{quest.name}</h4>
                    <p className="text-sm text-muted-foreground">{quest.description}</p>
                  </div>
                  <div className="ml-3">
                    {quest.type === 'team' ? (
                      <Users size={20} className="text-primary" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <Coins size={16} weight="fill" className="text-yellow-500" />
                    <span className="font-semibold">+{quest.reward} LKC</span>
                  </div>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    quest.difficulty === 'Easy' && "bg-green-100 text-green-700",
                    quest.difficulty === 'Medium' && "bg-yellow-100 text-yellow-700",
                    quest.difficulty === 'Hard' && "bg-orange-100 text-orange-700",
                    quest.difficulty === 'Extreme' && "bg-red-100 text-red-700"
                  )}>
                    {quest.difficulty}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{quest.locationCount} Locations</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{quest.timeLimit}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}