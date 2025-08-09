import { useState, useRef } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProfileDropdown } from '@/components/ProfileDropdown';
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
  Timer,
  Lightning,
  Trophy,
  Crown,
  Confetti,
  Target,
  Sword,
  Shield,
  Sparkle
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
    restaurantId: 'rest7',
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
    restaurantId: 'rest8',
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

interface LikPageProps {
  onShowRestaurantProfile?: (restaurantId: string) => void;
  onShowLikPassport?: () => void;
  onShowMessagesPage?: () => void;
}

export function LikPage({ onShowRestaurantProfile, onShowLikPassport, onShowMessagesPage }: LikPageProps) {
  const [userProgress] = useKV('user-progress', mockUserProgress);
  const [bounties] = useKV('bounties', mockBounties);
  const [quests] = useKV('quests', mockQuests);
  const [activeView, setActiveView] = useState<'bounties' | 'quests'>('bounties');
  const [selectedFilter, setSelectedFilter] = useState<'nearby' | 'most-wanted' | 'for-you'>('nearby');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Profile dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownAnchorRect, setDropdownAnchorRect] = useState<DOMRect | null>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  const xpProgress = (userProgress.xp / userProgress.xpToNextLevel) * 100;

  // Handle avatar click for dropdown
  const handleAvatarClick = () => {
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      setDropdownAnchorRect(rect);
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  // Handle dropdown navigation
  const handleDropdownNavigate = (destination: string) => {
    setIsDropdownOpen(false);
    
    switch (destination) {
      case 'passport':
        onShowLikPassport?.();
        break;
      case 'messages':
        onShowMessagesPage?.();
        break;
      default:
        console.log('Navigate to:', destination);
    }
  };

  // Mock user data for dropdown
  const mockUser = {
    avatar: '/src/assets/images/user-avatar.jpg',
    displayName: 'John Doe',
    username: '@johndoe',
    tasteTitle: 'Grand Master',
    level: userProgress.level,
    xp: userProgress.xp,
    maxXp: userProgress.xpToNextLevel,
    badges: [
      { id: '1', icon: '🏆', label: 'Top Reviewer', verified: true },
      { id: '2', icon: '🍕', label: 'Pizza Expert' }
    ]
  };

  const mockStats = {
    streak: userProgress.streakCount,
    tickets: userProgress.likTickets,
    likCoins: userProgress.likCoins > 999 ? `${(userProgress.likCoins / 1000).toFixed(1)}k` : userProgress.likCoins.toString(),
    hearts: '3.2k'
  };

  const mockDailyProgress = {
    currentTime: '00:00',
    targetTime: '02:00',
    bonusReward: '+2 LP',
    streakDays: 7,
    currentStreak: userProgress.streakCount
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 overflow-hidden relative">
      {/* Magical Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-pink-200 rounded-full opacity-25 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-8 w-8 h-8 bg-orange-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Fixed Header */}
      <div className="bg-gradient-to-r from-purple-100/90 via-blue-100/90 to-indigo-100/90 backdrop-blur-lg border-b border-white/50 shadow-lg">
        {/* Top Section - User Progress */}
        <div className="px-4 py-4 flex items-center justify-between">
          {/* Profile with Magical XP Ring */}
          <div 
            ref={avatarRef}
            className="relative cursor-pointer group"
            onClick={handleAvatarClick}
          >
            <div className="w-20 h-20 relative transform transition-transform duration-300 group-hover:scale-105">
              {/* Magical XP Progress Ring with Sparkles */}
              <div className="absolute inset-0 animate-spin-slow">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    fill="none"
                    stroke="url(#magicalXpGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 35}`}
                    strokeDashoffset={`${2 * Math.PI * 35 * (1 - xpProgress / 100)}`}
                    className="transition-all duration-500 filter drop-shadow-lg"
                  />
                  <defs>
                    <linearGradient id="magicalXpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="25%" stopColor="#a855f7" />
                      <stop offset="50%" stopColor="#c084fc" />
                      <stop offset="75%" stopColor="#d8b4fe" />
                      <stop offset="100%" stopColor="#e9d5ff" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              {/* Sparkle Effects */}
              <div className="absolute -top-1 -right-1 w-4 h-4 animate-pulse">
                <Sparkle size={16} className="text-yellow-400 animate-spin" />
              </div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 animate-pulse" style={{ animationDelay: '0.5s' }}>
                <Sparkle size={12} className="text-pink-400 animate-spin" />
              </div>
              
              {/* Profile Picture */}
              <div className="absolute inset-3">
                <Avatar className="w-full h-full border-2 border-white shadow-lg">
                  <AvatarImage src="/src/assets/images/user-avatar.jpg" alt="User" />
                  <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                    U
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Glowing Level Badge */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white animate-pulse">
                <Crown size={12} className="inline mr-1" />
                {userProgress.level}
              </div>
            </div>
          </div>

          {/* Animated Stats Row */}
          <div className="flex items-center gap-6">
            {/* Streak with Fire Animation */}
            <div className="flex flex-col items-center transform transition-transform duration-300 hover:scale-110">
              <div className="flex items-center gap-1 bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-2 rounded-full shadow-lg">
                <Flame size={18} weight="fill" className="animate-pulse" />
                <span className="font-bold text-sm">{userProgress.streakCount}</span>
              </div>
              <span className="text-xs text-gray-600 mt-1 font-medium">Streak</span>
            </div>

            {/* Tickets with Sparkle */}
            <div className="flex flex-col items-center transform transition-transform duration-300 hover:scale-110">
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-2 rounded-full shadow-lg">
                <Ticket size={18} weight="fill" className="animate-bounce" />
                <span className="font-bold text-sm">{userProgress.likTickets}</span>
              </div>
              <span className="text-xs text-gray-600 mt-1 font-medium">Tickets</span>
            </div>

            {/* Coins with Glow */}
            <div className="flex flex-col items-center transform transition-transform duration-300 hover:scale-110">
              <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-2 rounded-full shadow-lg">
                <Coins size={18} weight="fill" className="animate-spin" style={{ animationDuration: '3s' }} />
                <span className="font-bold text-sm">{userProgress.likCoins > 999 ? `${(userProgress.likCoins / 1000).toFixed(1)}k` : userProgress.likCoins}</span>
              </div>
              <span className="text-xs text-gray-600 mt-1 font-medium">Coins</span>
            </div>
          </div>
        </div>

        {/* Magical Secondary Navigation */}
        <div className="px-4 py-3 flex items-center justify-center">
          <div className="flex items-center gap-6">
            {/* Leaderboard with Trophy */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="group relative bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            >
              <Trophy size={20} className="text-yellow-600 group-hover:animate-bounce" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </Button>

            {/* Enchanted Tab Selector */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-1.5 flex shadow-xl border border-white/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveView('bounties')}
                className={cn(
                  "nav-rum-raisin rounded-xl px-6 py-3 transition-all duration-300 relative overflow-hidden",
                  activeView === 'bounties' 
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg transform scale-105" 
                    : "text-gray-600 font-medium hover:bg-white/50"
                )}
              >
                {activeView === 'bounties' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 animate-pulse"></div>
                )}
                <Target size={16} className="mr-2" />
                Bounties
                {activeView === 'bounties' && (
                  <Sparkle size={12} className="ml-2 animate-spin" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveView('quests')}
                className={cn(
                  "nav-rum-raisin rounded-xl px-6 py-3 transition-all duration-300 relative overflow-hidden",
                  activeView === 'quests' 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold shadow-lg transform scale-105" 
                    : "text-gray-600 font-medium hover:bg-white/50"
                )}
              >
                {activeView === 'quests' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 animate-pulse"></div>
                )}
                <Sword size={16} className="mr-2" />
                Quests
                {activeView === 'quests' && (
                  <Shield size={12} className="ml-2 animate-bounce" />
                )}
              </Button>
            </div>

            {/* Magical Rewards */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="group relative bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            >
              <Gift size={20} className="text-purple-600 group-hover:animate-pulse" />
              <div className="absolute -top-1 -right-1">
                <Confetti size={12} className="text-yellow-400 animate-bounce" />
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
        {/* Show filter tabs and search only for bounties */}
        {activeView === 'bounties' && (
          <>
            {/* Magical Filter Tabs */}
            <div className="px-4 py-6 flex justify-center">
              <div className="flex gap-3">
                {(['nearby', 'most-wanted', 'for-you'] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFilter(filter)}
                    className={cn(
                      "rounded-full nav-rum-raisin px-4 py-2 transition-all duration-300 relative overflow-hidden",
                      selectedFilter === filter 
                        ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold shadow-lg transform scale-105" 
                        : "bg-white/60 backdrop-blur-sm text-gray-600 font-medium hover:bg-white/80 shadow-md"
                    )}
                  >
                    {selectedFilter === filter && (
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 to-teal-400 opacity-30 animate-pulse"></div>
                    )}
                    {filter === 'nearby' && (
                      <>
                        <MapPin size={14} className="mr-1.5" />
                        Nearby
                      </>
                    )}
                    {filter === 'most-wanted' && (
                      <>
                        <Lightning size={14} className="mr-1.5" />
                        Most Wanted
                      </>
                    )}
                    {filter === 'for-you' && (
                      <>
                        <Star size={14} className="mr-1.5" />
                        For You
                      </>
                    )}
                    {selectedFilter === filter && (
                      <Sparkle size={10} className="ml-1.5 animate-spin" />
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Enchanted Search Bar */}
            <div className="px-4 pb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl blur-sm opacity-50"></div>
                <div className="relative bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-lg">
                  <MagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 animate-pulse" size={18} />
                  <Input
                    placeholder="🔍 Search for magical bounties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-transparent border-none text-gray-700 placeholder-gray-500 font-medium"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeView === 'bounties' ? (
          <BountiesView bounties={bounties} onShowRestaurantProfile={onShowRestaurantProfile} />
        ) : (
          <QuestsView quests={quests} />
        )}
      </div>

      {/* Floating Magical Map Button */}
      <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
          <Button 
            size="sm" 
            className="relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-full shadow-2xl border-2 border-white/30 transform transition-all duration-300 hover:scale-110 hover:rotate-3"
          >
            <MapPin size={16} className="mr-2 animate-bounce" />
            <span className="font-bold">Explore Map</span>
            <Sparkle size={12} className="ml-2 animate-spin" />
          </Button>
        </div>
      </div>

      {/* Profile Dropdown */}
      <ProfileDropdown
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        anchorRect={dropdownAnchorRect}
        user={mockUser}
        stats={mockStats}
        dailyProgress={mockDailyProgress}
        onNavigate={handleDropdownNavigate}
      />
    </div>
  );
}

function BountiesView({ bounties, onShowRestaurantProfile }: { bounties: Bounty[], onShowRestaurantProfile?: (restaurantId: string) => void }) {
  return (
    <div className="px-4 space-y-6">
      {/* Magical Promoted Bounties Carousel */}
      <div className="space-y-4">
        <div className="text-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
          </div>
          <h3 className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 px-4 font-bold text-lg text-transparent bg-clip-text">
            ✨ LEGENDARY BOUNTIES ✨
          </h3>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide justify-center pb-2">
          {bounties.slice(0, 2).map((bounty, index) => (
            <div key={bounty.id} className="relative group">
              {/* Magical Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-300 animate-pulse"></div>
              
              <Card className="relative min-w-[300px] overflow-hidden bg-white/90 backdrop-blur-md border border-white/50 shadow-xl rounded-3xl transform transition-all duration-300 group-hover:scale-105 group-hover:-rotate-1">
                {/* Bounty Difficulty Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg border border-white/30",
                    bounty.difficulty === 'Easy' && "bg-gradient-to-r from-green-400 to-emerald-500",
                    bounty.difficulty === 'Medium' && "bg-gradient-to-r from-yellow-400 to-orange-500",
                    bounty.difficulty === 'Hard' && "bg-gradient-to-r from-red-400 to-pink-500"
                  )}>
                    <Lightning size={10} className="inline mr-1" />
                    {bounty.difficulty}
                  </div>
                </div>

                {/* Timer Badge */}
                <div className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-bold border border-white/20">
                  <Timer size={12} className="inline mr-1 animate-pulse" />
                  {bounty.timeRemaining}
                </div>

                <div className="relative">
                  <div className="aspect-[4/3] bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 flex items-center justify-center relative overflow-hidden">
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-4 left-4 w-8 h-8 bg-yellow-300 rounded-full animate-bounce"></div>
                      <div className="absolute bottom-6 right-6 w-6 h-6 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-orange-300 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-full p-6 shadow-lg">
                      <ForkKnife size={40} className="text-orange-600" />
                    </div>
                  </div>
                  
                  {/* Magical Info Overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-gradient-to-r from-black/80 to-gray-800/80 backdrop-blur-lg rounded-2xl p-4 text-white border border-white/20 shadow-2xl">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-lg flex items-center">
                            <Crown size={16} className="text-yellow-400 mr-2" />
                            {bounty.dishName}
                          </h4>
                          <p 
                            className="text-sm opacity-90 cursor-pointer hover:underline flex items-center group"
                            onClick={() => onShowRestaurantProfile?.(bounty.restaurantId)}
                          >
                            <MapPin size={12} className="mr-1 group-hover:animate-bounce" />
                            {bounty.restaurantName}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1 bg-white/20 rounded-full px-2 py-1">
                            <Star size={14} weight="fill" className="text-yellow-400 animate-pulse" />
                            <span className="text-sm font-bold">{bounty.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Reward Section */}
                      <div className="flex items-center justify-between bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-2 border border-yellow-400/30">
                        <span className="text-xs opacity-75 flex items-center">
                          <Trophy size={12} className="mr-1" />
                          Epic Reward
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-lg text-yellow-400">+{bounty.reward}</span>
                          <Coins size={16} weight="fill" className="text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Local Bounties Grid */}
      <div className="space-y-4">
        <div className="text-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>
          </div>
          <h3 className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 px-4 font-bold text-lg text-transparent bg-clip-text">
            🎯 NEARBY ADVENTURES
          </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {bounties.map((bounty, index) => (
            <div key={`local-${bounty.id}`} className="relative group">
              {/* Mini Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              
              <Card className="relative overflow-hidden bg-white/90 backdrop-blur-sm border border-white/50 shadow-lg rounded-2xl transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-1">
                {/* Mini Difficulty Badge */}
                <div className="absolute top-2 left-2 z-10">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    bounty.difficulty === 'Easy' && "bg-green-400",
                    bounty.difficulty === 'Medium' && "bg-yellow-400",
                    bounty.difficulty === 'Hard' && "bg-red-400"
                  )}></div>
                </div>

                <div className="aspect-square bg-gradient-to-br from-emerald-100 via-teal-100 to-blue-100 flex items-center justify-center relative overflow-hidden">
                  {/* Mini Background Animation */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-300 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-3 left-3 w-3 h-3 bg-teal-300 rounded-full animate-bounce"></div>
                  </div>
                  
                  <div className="relative bg-white/70 backdrop-blur-sm rounded-full p-4 shadow-md">
                    <ForkKnife size={24} className="text-teal-600" />
                  </div>
                </div>
                
                <div className="p-3">
                  <h4 className="font-bold text-sm mb-1 flex items-center">
                    <Target size={12} className="text-emerald-500 mr-1" />
                    {bounty.dishName}
                  </h4>
                  <p 
                    className="text-xs text-gray-600 mb-2 cursor-pointer hover:underline flex items-center group"
                    onClick={() => onShowRestaurantProfile?.(bounty.restaurantId)}
                  >
                    <MapPin size={10} className="mr-1 group-hover:animate-bounce" />
                    {bounty.restaurantName}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      <Timer size={10} className="animate-pulse" />
                      <span className="font-medium">{bounty.timeRemaining}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                      <span className="font-bold">+{bounty.reward}</span>
                      <Coins size={10} weight="fill" className="animate-bounce" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestsView({ quests }: { quests: Quest[] }) {
  return (
    <div className="px-4 space-y-6">
      {/* Magical Epic Quests */}
      <div className="space-y-4">
        <div className="text-center relative pt-2">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
          </div>
          <h3 className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 px-4 font-bold text-lg text-transparent bg-clip-text">
            ⚔️ LEGENDARY QUESTS ⚔️
          </h3>
        </div>
        
        <div className="space-y-4">
          {quests.map((quest, index) => (
            <div key={quest.id} className="relative group">
              {/* Epic Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300 animate-pulse"></div>
              
              <Card className="relative overflow-hidden bg-white/90 backdrop-blur-md border border-white/50 shadow-xl rounded-3xl transform transition-all duration-300 group-hover:scale-[1.02] group-hover:-rotate-1">
                {/* Quest Type Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className={cn(
                    "px-3 py-2 rounded-full text-white shadow-lg border border-white/30 flex items-center gap-2",
                    quest.type === 'team' 
                      ? "bg-gradient-to-r from-purple-500 to-indigo-600" 
                      : "bg-gradient-to-r from-blue-500 to-cyan-600"
                  )}>
                    {quest.type === 'team' ? (
                      <>
                        <Users size={16} className="animate-bounce" />
                        <span className="text-xs font-bold">TEAM</span>
                      </>
                    ) : (
                      <>
                        <Shield size={16} className="animate-pulse" />
                        <span className="text-xs font-bold">SOLO</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Difficulty Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg border border-white/30",
                    quest.difficulty === 'Easy' && "bg-gradient-to-r from-green-400 to-emerald-500",
                    quest.difficulty === 'Medium' && "bg-gradient-to-r from-yellow-400 to-orange-500",
                    quest.difficulty === 'Hard' && "bg-gradient-to-r from-red-400 to-pink-500",
                    quest.difficulty === 'Extreme' && "bg-gradient-to-r from-purple-500 to-pink-600"
                  )}>
                    <Sword size={10} className="inline mr-1" />
                    {quest.difficulty}
                  </div>
                </div>

                <div className="p-6">
                  {/* Quest Header */}
                  <div className="mb-4">
                    <h4 className="font-bold text-xl mb-2 flex items-center">
                      <Trophy size={20} className="text-yellow-500 mr-2 animate-bounce" />
                      {quest.name}
                    </h4>
                    <p className="text-gray-600 leading-relaxed bg-gray-50/50 rounded-lg p-3 border border-gray-200/50">
                      {quest.description}
                    </p>
                  </div>

                  {/* Quest Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Reward */}
                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-3 border border-yellow-200/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Coins size={18} weight="fill" className="text-yellow-600 animate-spin" style={{ animationDuration: '3s' }} />
                        <span className="font-bold text-yellow-800">Epic Reward</span>
                      </div>
                      <div className="text-xl font-black text-yellow-700">+{quest.reward} LKC</div>
                    </div>

                    {/* Locations */}
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-3 border border-blue-200/50">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin size={18} className="text-blue-600 animate-pulse" />
                        <span className="font-bold text-blue-800">Journey</span>
                      </div>
                      <div className="text-xl font-black text-blue-700">{quest.locationCount} Places</div>
                    </div>
                  </div>

                  {/* Quest Footer */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200/50">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-600 animate-pulse" />
                      <span className="text-sm font-medium text-gray-700">Time Limit</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1 shadow-sm">
                      <Timer size={14} className="text-orange-500" />
                      <span className="font-bold text-gray-800">{quest.timeLimit}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 flex justify-center">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg border border-white/30 transform transition-all duration-300 hover:scale-105 hover:-rotate-1">
                      <Lightning size={16} className="mr-2 animate-bounce" />
                      Accept Quest
                      <Sparkle size={14} className="ml-2 animate-spin" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}