import { useState, useRef } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { BountyCardModal } from '@/components/BountyCardModal';
import { QuestCardModal } from '@/components/QuestCardModal';
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
  Sparkle,
  RotateCcw
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

// Enhanced data for modals
const getBountyModalData = (bounty: Bounty) => ({
  id: bounty.id,
  title: bounty.dishName,
  restaurant: bounty.restaurantName,
  description: `Experience the authentic flavors of our signature ${bounty.dishName}. This carefully crafted dish combines traditional ingredients with modern preparation techniques to create an unforgettable taste experience.`,
  image: bounty.imageUrl,
  reward: `${bounty.reward} LKC`,
  xp: '+50 XP',
  difficulty: bounty.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard',
  timeLeft: bounty.timeRemaining,
  distance: '0.8 miles',
  rating: bounty.rating,
  likes: Math.floor(Math.random() * 500) + 100,
  completedBy: ['Alex', 'Sarah', 'Mike', 'Emma', 'David'],
  category: bounty.category,
  price: '$' + (Math.floor(Math.random() * 20) + 10),
  calories: Math.floor(Math.random() * 400) + 300 + ' cal',
  ingredients: ['Fresh herbs', 'Premium spices', 'Organic vegetables', 'Artisan bread'],
  allergens: ['Gluten', 'Dairy'],
  nutritionFacts: {
    protein: '25g',
    carbs: '45g', 
    fat: '18g',
    fiber: '6g'
  }
});

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

// Enhanced data for quest modals
const getQuestModalData = (quest: Quest) => ({
  id: quest.id,
  title: quest.name,
  description: quest.description + '. Complete this epic food journey to earn exclusive rewards and unlock new areas of the city.',
  image: quest.imageUrl,
  reward: `${quest.reward} LKC`,
  xp: '+100 XP',
  difficulty: quest.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard' | 'extreme',
  timeLeft: quest.timeLimit,
  locations: quest.locationCount,
  category: 'Food Adventure',
  type: quest.type as 'solo' | 'team' | 'community',
  progress: {
    current: Math.floor(Math.random() * quest.locationCount),
    total: quest.locationCount
  },
  requirements: [
    'Visit all required locations',
    'Try the signature dish at each spot',
    'Rate your experience',
    'Share photos with the community'
  ],
  locations_list: Array.from({ length: quest.locationCount }, (_, i) => ({
    name: `Location ${i + 1}`,
    address: `${100 + i * 10} Main St, City`,
    completed: Math.random() > 0.5
  })),
  participants: Math.floor(Math.random() * 200) + 50,
  leaderboard: {
    position: Math.floor(Math.random() * 10) + 1,
    total: 100
  },
  tips: [
    'Visit during peak hours for the best experience',
    'Ask for recommendations from the staff',
    'Take photos for bonus points'
  ],
  questGiver: {
    name: 'Chef Martinez',
    avatar: 'CM',
    title: 'Food Explorer'
  }
});

interface LikPageProps {
  onShowRestaurantProfile?: (restaurantId: string) => void;
  onShowLikPassport?: () => void;
  onShowMessagesPage?: () => void;
  onShowNotifications?: () => void;
  onShowBountyDetails?: (bountyId: string) => void;
}

export function LikPage({ onShowRestaurantProfile, onShowLikPassport, onShowMessagesPage, onShowNotifications, onShowBountyDetails }: LikPageProps) {
  const [userProgress] = useKV('user-progress', mockUserProgress);
  const [bounties] = useKV('bounties', mockBounties);
  const [quests] = useKV('quests', mockQuests);
  const [activeView, setActiveView] = useState<'bounties' | 'quests'>('bounties');
  const [selectedFilter, setSelectedFilter] = useState<'nearby' | 'most-wanted' | 'for-you'>('nearby');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [selectedBounty, setSelectedBounty] = useState<any>(null);
  const [selectedQuest, setSelectedQuest] = useState<any>(null);
  
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
      case 'notifications':
        onShowNotifications?.();
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
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-pink-200 rounded-full opacity-25"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-200 rounded-full opacity-30"></div>
        <div className="absolute top-1/2 right-8 w-8 h-8 bg-orange-200 rounded-full opacity-20"></div>
      </div>

      {/* Fixed Header */}
      <div className="bg-gradient-to-r from-purple-100/90 via-blue-100/90 to-indigo-100/90 backdrop-blur-lg border-b border-white/50 shadow-lg">
        {/* Top Section - User Progress */}
        <div className="px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          {/* Profile with Magical XP Ring */}
          <div 
            ref={avatarRef}
            className="relative cursor-pointer group flex-shrink-0"
            onClick={handleAvatarClick}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
              {/* XP Progress Ring */}
              <div className="absolute inset-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
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
                    className="transition-all duration-500"
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
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4">
                <Sparkle size={14} className="text-yellow-400" />
              </div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 sm:w-3 sm:h-3">
                <Sparkle size={10} className="text-pink-400" />
              </div>
              
              {/* Profile Picture */}
              <div className="absolute inset-2 sm:inset-3">
                <Avatar className="w-full h-full border border-white shadow-lg">
                  <AvatarImage src="/src/assets/images/user-avatar.jpg" alt="User" />
                  <AvatarFallback className="text-sm sm:text-lg font-bold bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                    U
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Level Badge */}
              <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg border border-white">
                <Crown size={10} className="inline mr-1" />
                {userProgress.level}
              </div>
            </div>
          </div>

          {/* Stats Row - Mobile optimized */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            {/* Streak */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-full shadow-lg">
                <Flame size={14} weight="fill" />
                <span className="font-bold text-xs sm:text-sm">{userProgress.streakCount}</span>
              </div>
              <span className="text-xs text-gray-600 mt-1 font-medium hidden sm:inline">Streak</span>
            </div>

            {/* Tickets */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-full shadow-lg">
                <Ticket size={14} weight="fill" />
                <span className="font-bold text-xs sm:text-sm">{userProgress.likTickets}</span>
              </div>
              <span className="text-xs text-gray-600 mt-1 font-medium hidden sm:inline">Tickets</span>
            </div>

            {/* Coins */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-full shadow-lg">
                <Coins size={14} weight="fill" />
                <span className="font-bold text-xs sm:text-sm">{userProgress.likCoins > 999 ? `${(userProgress.likCoins / 1000).toFixed(1)}k` : userProgress.likCoins}</span>
              </div>
              <span className="text-xs text-gray-600 mt-1 font-medium hidden sm:inline">Coins</span>
            </div>
          </div>
        </div>

        {/* Secondary Navigation - Mobile optimized */}
        <div className="px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-center">
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 w-full max-w-md justify-center">
            {/* Leaderboard */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg relative"
            >
              <Trophy size={16} className="text-yellow-600" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
            </Button>

            {/* Tab Selector */}
            <div className="bg-white/70 backdrop-blur-md rounded-xl sm:rounded-2xl p-1 sm:p-1.5 flex shadow-xl border border-white/50 flex-1 max-w-xs">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveView('bounties')}
                className={cn(
                  "nav-rum-raisin rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 relative overflow-hidden flex-1 text-xs sm:text-sm",
                  activeView === 'bounties' 
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg" 
                    : "text-gray-600 font-medium hover:bg-white/50"
                )}
              >
                {activeView === 'bounties' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20"></div>
                )}
                <Target size={12} className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Bounties</span>
                <span className="sm:hidden">Bounty</span>
                {activeView === 'bounties' && (
                  <Sparkle size={10} className="ml-1 sm:ml-2" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveView('quests')}
                className={cn(
                  "nav-rum-raisin rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 relative overflow-hidden flex-1 text-xs sm:text-sm",
                  activeView === 'quests' 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold shadow-lg" 
                    : "text-gray-600 font-medium hover:bg-white/50"
                )}
              >
                {activeView === 'quests' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20"></div>
                )}
                <Sword size={12} className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Quests</span>
                <span className="sm:hidden">Quest</span>
                {activeView === 'quests' && (
                  <Shield size={10} className="ml-1 sm:ml-2" />
                )}
              </Button>
            </div>

            {/* Rewards */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg relative"
            >
              <Gift size={16} className="text-purple-600" />
              <div className="absolute -top-0.5 -right-0.5">
                <Confetti size={10} className="text-yellow-400" />
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
            {/* Filter Tabs - Mobile optimized */}
            <div className="px-3 sm:px-4 py-4 sm:py-6 flex justify-center">
              <div className="flex gap-2 sm:gap-3 flex-wrap justify-center max-w-sm sm:max-w-none">
                {(['nearby', 'most-wanted', 'for-you'] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFilter(filter)}
                    className={cn(
                      "rounded-full nav-rum-raisin px-3 sm:px-4 py-1.5 sm:py-2 relative overflow-hidden text-xs sm:text-sm",
                      selectedFilter === filter 
                        ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold shadow-lg" 
                        : "bg-white/60 backdrop-blur-sm text-gray-600 font-medium hover:bg-white/80 shadow-md"
                    )}
                  >
                    {selectedFilter === filter && (
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 to-teal-400 opacity-30"></div>
                    )}
                    {filter === 'nearby' && (
                      <>
                        <MapPin size={12} className="mr-1 sm:mr-1.5" />
                        <span className="hidden xs:inline">Nearby</span>
                        <span className="xs:hidden">Near</span>
                      </>
                    )}
                    {filter === 'most-wanted' && (
                      <>
                        <Lightning size={12} className="mr-1 sm:mr-1.5" />
                        <span className="hidden sm:inline">Most Wanted</span>
                        <span className="sm:hidden">Hot</span>
                      </>
                    )}
                    {filter === 'for-you' && (
                      <>
                        <Star size={12} className="mr-1 sm:mr-1.5" />
                        <span className="hidden xs:inline">For You</span>
                        <span className="xs:hidden">You</span>
                      </>
                    )}
                    {selectedFilter === filter && (
                      <Sparkle size={8} className="ml-1 sm:ml-1.5" />
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Search Bar - Mobile optimized */}
            <div className="px-3 sm:px-4 pb-4 sm:pb-6">
              <div className="relative max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 rounded-xl sm:rounded-2xl blur-sm opacity-50"></div>
                <div className="relative bg-white/80 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/50 shadow-lg">
                  <MagnifyingGlass className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-purple-500" size={16} />
                  <Input
                    placeholder="🔍 Search bounties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-transparent border-none text-gray-700 placeholder-gray-500 font-medium text-sm sm:text-base"
                  />
                  <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeView === 'bounties' ? (
          <BountiesView 
            bounties={bounties} 
            onShowRestaurantProfile={onShowRestaurantProfile} 
            onBountyClick={(bounty) => setSelectedBounty(getBountyModalData(bounty))}
          />
        ) : (
          <QuestsView 
            quests={quests} 
            onQuestClick={(quest) => setSelectedQuest(getQuestModalData(quest))}
          />
        )}
      </div>

      {/* Floating Map Button - Mobile optimized positioning */}
      <div className="fixed bottom-20 sm:bottom-24 left-1/2 transform -translate-x-1/2 z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-40"></div>
          <Button 
            size="sm" 
            className="relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-2xl border border-white/30 text-sm sm:text-base"
          >
            <MapPin size={14} className="mr-1 sm:mr-2" />
            <span className="font-bold hidden xs:inline">Explore Map</span>
            <span className="font-bold xs:hidden">Map</span>
            <Sparkle size={10} className="ml-1 sm:ml-2" />
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

      {/* Bounty Modal */}
      {selectedBounty && (
        <BountyCardModal
          bounty={selectedBounty}
          isOpen={!!selectedBounty}
          onClose={() => setSelectedBounty(null)}
          onAccept={() => {
            console.log('Accepted bounty:', selectedBounty.id);
            setSelectedBounty(null);
          }}
          onShowRestaurantProfile={(restaurantId) => {
            setSelectedBounty(null);
            onShowRestaurantProfile?.(restaurantId);
          }}
        />
      )}

      {/* Quest Modal */}
      {selectedQuest && (
        <QuestCardModal
          quest={selectedQuest}
          isOpen={!!selectedQuest}
          onClose={() => setSelectedQuest(null)}
          onAccept={() => {
            console.log('Accepted quest:', selectedQuest.id);
            setSelectedQuest(null);
          }}
          onShowRestaurantProfile={(restaurantId) => {
            setSelectedQuest(null);
            onShowRestaurantProfile?.(restaurantId);
          }}
        />
      )}
    </div>
  );
}

function BountiesView({ bounties, onShowRestaurantProfile, onBountyClick }: { 
  bounties: Bounty[], 
  onShowRestaurantProfile?: (restaurantId: string) => void,
  onBountyClick?: (bounty: Bounty) => void 
}) {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const toggleCardFlip = (bountyId: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bountyId)) {
        newSet.delete(bountyId);
      } else {
        newSet.add(bountyId);
      }
      return newSet;
    });
  };

  // Mock food images for bounties
  const foodImages = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop&crop=entropy&auto=format',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=300&fit=crop&crop=entropy&auto=format',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=300&fit=crop&crop=entropy&auto=format',
    'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500&h=300&fit=crop&crop=entropy&auto=format',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop&crop=entropy&auto=format',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&h=300&fit=crop&crop=entropy&auto=format'
  ];

  return (
    <div className="px-3 sm:px-4 space-y-6 pb-6">
      {/* Promoted Bounties Section */}
      <div className="space-y-4">
        <div className="text-center relative py-2">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
          </div>
          <h3 className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 bg-clip-text text-transparent px-3 font-bold text-base sm:text-lg">
            ✨ LEGENDARY BOUNTIES ✨
          </h3>
        </div>
        
        {/* Mobile-optimized single column layout */}
        <div className="space-y-4">
          {bounties.slice(0, 2).map((bounty, index) => (
            <div key={bounty.id} className="relative perspective-1000 w-full max-w-sm mx-auto">
              {/* Subtle glow effect - reduced for mobile */}
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-2xl blur opacity-20"></div>
              
              <div 
                className={cn(
                  "relative w-full h-[200px] sm:h-[240px] transform-style-preserve-3d transition-all duration-700 cursor-pointer",
                  flippedCards.has(bounty.id) && "rotate-y-180"
                )}
                onClick={() => onBountyClick?.(bounty)}
              >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden">
                  <Card className="h-full overflow-hidden bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-lg border border-white/60 shadow-xl rounded-2xl">
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${foodImages[index % foodImages.length]})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    </div>

                    {/* Bounty Badge */}
                    <div className="absolute top-3 left-3 z-20">
                      <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg border border-white/30 flex items-center gap-1">
                        <Crown size={10} />
                        BOUNTY
                      </div>
                    </div>

                    {/* Difficulty Indicator */}
                    <div className="absolute top-3 right-3 z-20">
                      <div className={cn(
                        "px-2 py-1 rounded-full text-xs font-bold text-white shadow-lg border border-white/30 flex items-center gap-1",
                        bounty.difficulty === 'Easy' && "bg-gradient-to-r from-green-400 to-emerald-500",
                        bounty.difficulty === 'Medium' && "bg-gradient-to-r from-yellow-400 to-orange-500",
                        bounty.difficulty === 'Hard' && "bg-gradient-to-r from-red-400 to-pink-500"
                      )}>
                        <Lightning size={10} />
                        {bounty.difficulty}
                      </div>
                    </div>

                    {/* Timer Badge */}
                    <div className="absolute top-12 right-3 z-20 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs font-bold border border-white/20">
                      <Timer size={10} className="inline mr-1" />
                      {bounty.timeRemaining}
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                      {/* Taste Match and Friends */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-gradient-to-r from-green-400 to-emerald-500 px-2 py-1 rounded-full text-xs font-bold text-white">
                          92% Match
                        </div>
                        <div className="flex -space-x-1">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="w-5 h-5 bg-white rounded-full border border-white flex items-center justify-center">
                              <span className="text-xs">👤</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <h4 className="font-bold text-lg sm:text-xl mb-1 text-shadow-lg line-clamp-1">
                        {bounty.dishName}
                      </h4>
                      <p 
                        className="text-sm sm:text-base opacity-90 cursor-pointer hover:underline mb-3 line-clamp-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          onShowRestaurantProfile?.(bounty.restaurantId);
                        }}
                      >
                        {bounty.restaurantName}
                      </p>

                      {/* Reward Section - Mobile optimized layout */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 px-2 py-1 rounded-full">
                            <Coins size={12} weight="fill" />
                            <span className="font-bold text-xs text-white">+{bounty.reward}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-gradient-to-r from-blue-400 to-purple-500 px-2 py-1 rounded-full">
                            <Lightning size={12} />
                            <span className="font-bold text-xs text-white">+50 XP</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold px-3 py-1 rounded-full shadow-lg text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Accept
                        </Button>
                      </div>
                    </div>

                    {/* Tap to flip hint */}
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-white/60 text-xs flex items-center gap-1">
                      <RotateCcw size={10} />
                      <span className="hidden sm:inline">Tap to flip</span>
                    </div>
                  </Card>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                  <Card className="h-full overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border border-purple-400/30 shadow-xl rounded-2xl p-4 text-white">
                    <div className="h-full flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-lg mb-3 text-center text-purple-300">
                          Bounty Details
                        </h4>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-purple-400" />
                            <span className="text-sm">0.8 miles away</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star size={14} className="text-yellow-400" />
                            <span className="text-sm">{bounty.rating} rating</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-green-400" />
                            <span className="text-sm">12 friends completed</span>
                          </div>
                        </div>

                        <div className="mt-3 p-2 bg-purple-900/30 rounded-lg">
                          <p className="text-xs text-purple-200 line-clamp-2">
                            "Amazing flavors and perfect spice level. Worth every coin!"
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star key={i} size={10} weight="fill" className="text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 border-purple-400 text-purple-300 hover:bg-purple-400/10 text-xs py-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-xs py-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Local Bounties Grid */}
      <div className="space-y-4">
        <div className="text-center relative py-2">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>
          </div>
          <h3 className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent px-3 font-bold text-base sm:text-lg">
            🎯 NEARBY ADVENTURES
          </h3>
        </div>
        
        {/* Mobile-optimized grid with proper spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-lg sm:max-w-none mx-auto">
          {bounties.map((bounty, index) => (
            <div key={`local-${bounty.id}`} className="relative perspective-1000">
              {/* Subtle glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-xl blur opacity-20"></div>
              
              <div 
                className="relative h-40 sm:h-48 cursor-pointer group"
                onClick={() => onShowBountyDetails?.(bounty.id)}
              >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden">
                  <Card className="h-full overflow-hidden bg-white/95 backdrop-blur-sm border border-white/50 shadow-lg rounded-xl group-hover:shadow-xl transition-all duration-300">
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${foodImages[(index + 2) % foodImages.length]})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    </div>

                    {/* Difficulty Indicator */}
                    <div className="absolute top-2 left-2 z-10">
                      <div className={cn(
                        "w-3 h-3 rounded-full border border-white shadow-lg",
                        bounty.difficulty === 'Easy' && "bg-green-400",
                        bounty.difficulty === 'Medium' && "bg-yellow-400",
                        bounty.difficulty === 'Hard' && "bg-red-400"
                      )}></div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white z-10">
                      <h4 className="font-bold text-sm sm:text-base mb-1 line-clamp-1">
                        {bounty.dishName}
                      </h4>
                      <p 
                        className="text-xs sm:text-sm opacity-90 cursor-pointer hover:underline mb-2 line-clamp-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          onShowRestaurantProfile?.(bounty.restaurantId);
                        }}
                      >
                        {bounty.restaurantName}
                      </p>
                      
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1 bg-orange-500/80 text-white px-2 py-1 rounded-full text-xs">
                          <Timer size={10} />
                          <span className="font-medium">{bounty.timeRemaining}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-500/80 text-white px-2 py-1 rounded-full text-xs">
                          <span className="font-bold">+{bounty.reward}</span>
                          <Coins size={10} weight="fill" />
                        </div>
                      </div>
                    </div>

                    {/* Accept Button - Show on hover for larger screens, always visible on mobile */}
                    <div className="absolute top-2 right-2 z-10 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white px-2 py-1 text-xs rounded-full shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Accept
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestsView({ quests, onQuestClick }: { 
  quests: Quest[], 
  onQuestClick?: (quest: Quest) => void 
}) {
  return (
    <div className="px-3 sm:px-4 space-y-6 pb-6">
      {/* Epic Quests */}
      <div className="space-y-4">
        <div className="text-center relative py-2">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 sm:w-40 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
          </div>
          <h3 className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent px-3 font-bold text-base sm:text-lg">
            ⚔️ LEGENDARY QUESTS ⚔️
          </h3>
        </div>
        
        <div className="space-y-4 max-w-lg mx-auto lg:max-w-none">
          {quests.map((quest, index) => (
            <div key={quest.id} className="relative">
              {/* Subtle glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-2xl sm:rounded-3xl blur opacity-20"></div>
              
              <Card 
                className="relative overflow-hidden bg-white/90 backdrop-blur-md border border-white/50 shadow-xl rounded-2xl sm:rounded-3xl cursor-pointer hover:shadow-2xl transition-all duration-300"
                onClick={() => onQuestClick?.(quest)}
              >
                {/* Quest Type Badge */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
                  <div className={cn(
                    "px-2 sm:px-3 py-1 sm:py-2 rounded-full text-white shadow-lg border border-white/30 flex items-center gap-1 sm:gap-2",
                    quest.type === 'team' 
                      ? "bg-gradient-to-r from-purple-500 to-indigo-600" 
                      : "bg-gradient-to-r from-blue-500 to-cyan-600"
                  )}>
                    {quest.type === 'team' ? (
                      <>
                        <Users size={12} />
                        <span className="text-xs font-bold">TEAM</span>
                      </>
                    ) : (
                      <>
                        <Shield size={12} />
                        <span className="text-xs font-bold">SOLO</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Difficulty Badge */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
                  <div className={cn(
                    "px-2 sm:px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg border border-white/30",
                    quest.difficulty === 'Easy' && "bg-gradient-to-r from-green-400 to-emerald-500",
                    quest.difficulty === 'Medium' && "bg-gradient-to-r from-yellow-400 to-orange-500",
                    quest.difficulty === 'Hard' && "bg-gradient-to-r from-red-400 to-pink-500",
                    quest.difficulty === 'Extreme' && "bg-gradient-to-r from-purple-500 to-pink-600"
                  )}>
                    <Sword size={8} className="inline mr-1" />
                    {quest.difficulty}
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  {/* Quest Header */}
                  <div className="mb-4 pt-6 sm:pt-8">
                    <h4 className="font-bold text-lg sm:text-xl mb-2 flex items-center">
                      <Trophy size={18} className="text-yellow-500 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{quest.name}</span>
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed bg-gray-50/50 rounded-lg p-2 sm:p-3 border border-gray-200/50 line-clamp-2 sm:line-clamp-none">
                      {quest.description}
                    </p>
                  </div>

                  {/* Quest Stats - Mobile optimized grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    {/* Reward */}
                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-3 border border-yellow-200/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Coins size={16} weight="fill" className="text-yellow-600 flex-shrink-0" />
                        <span className="font-bold text-yellow-800 text-sm sm:text-base">Epic Reward</span>
                      </div>
                      <div className="text-lg sm:text-xl font-black text-yellow-700">+{quest.reward} LKC</div>
                    </div>

                    {/* Locations */}
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-3 border border-blue-200/50">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin size={16} className="text-blue-600 flex-shrink-0" />
                        <span className="font-bold text-blue-800 text-sm sm:text-base">Journey</span>
                      </div>
                      <div className="text-lg sm:text-xl font-black text-blue-700">{quest.locationCount} Places</div>
                    </div>
                  </div>

                  {/* Quest Footer */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200/50 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">Time Limit</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-lg px-2 sm:px-3 py-1 shadow-sm">
                      <Timer size={12} className="text-orange-500 flex-shrink-0" />
                      <span className="font-bold text-gray-800 text-sm">{quest.timeLimit}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-center">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-6 sm:px-8 py-2 sm:py-3 rounded-xl shadow-lg border border-white/30 text-sm sm:text-base">
                      <Lightning size={14} className="mr-2" />
                      Accept Quest
                      <Sparkle size={12} className="ml-2" />
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