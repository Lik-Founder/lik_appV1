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
  onShowReservationManager?: () => void;
}

export function LikPage({ onShowRestaurantProfile, onShowLikPassport, onShowMessagesPage, onShowNotifications, onShowBountyDetails, onShowReservationManager }: LikPageProps) {
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
      case 'reservations':
        onShowReservationManager?.();
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
    <div className="h-full flex flex-col bg-gradient-to-br from-[#FF7BAA]/10 via-[#FF1A75]/5 to-[#B30026]/10 overflow-hidden relative">
      {/* Candy-Gloss Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Glossy Orbs */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-[#FF7BAA]/30 to-[#FF1A75]/20 rounded-full blur-sm"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-gradient-to-br from-[#FF1A75]/25 to-[#B30026]/15 rounded-full blur-sm"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-br from-[#FF4D88]/20 to-[#FF7BAA]/15 rounded-full blur-sm"></div>
        <div className="absolute top-1/2 right-8 w-8 h-8 bg-gradient-to-br from-[#FF7BAA]/30 to-[#FF4D88]/25 rounded-full blur-sm"></div>
        
        {/* Ambient Glow Particles */}
        <div className="absolute top-20 left-1/3 w-4 h-4 bg-[#FF4D88]/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 right-1/3 w-6 h-6 bg-[#FF7BAA]/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 left-16 w-3 h-3 bg-[#FF1A75]/35 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating Sparkles */}
        <div className="absolute top-24 right-24 text-[#FF4D88]/50 animate-pulse">✨</div>
        <div className="absolute bottom-32 left-20 text-[#FF7BAA]/40 animate-pulse" style={{ animationDelay: '1.5s' }}>💫</div>
        <div className="absolute top-48 left-1/2 text-[#FF1A75]/45 animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</div>
      </div>

      {/* Candy-Gloss Header with Enhanced 3D Effects */}
      <div className="bg-gradient-to-r from-[#FF7BAA]/15 via-[#FF1A75]/10 to-[#B30026]/15 backdrop-blur-lg border-b border-[#FF4D88]/20 shadow-[0_8px_32px_rgba(255,77,136,0.12)] relative">
        {/* Header Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA]/5 via-[#FF4D88]/8 to-[#FF1A75]/5 blur-xl"></div>
        {/* Top Section - Enhanced User Progress with Candy-Gloss Effects */}
        <div className="relative px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          {/* Profile with Candy-Gloss XP Ring */}
          <div 
            ref={avatarRef}
            className="relative cursor-pointer group flex-shrink-0"
            onClick={handleAvatarClick}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
              {/* Candy-Gloss XP Progress Ring with Enhanced Glow */}
              <div className="absolute inset-0">
                {/* Outer Glow Ring */}
                <div className="absolute inset-0 rounded-full" style={{
                  background: `conic-gradient(from 0deg, 
                    rgba(255, 123, 170, 0.4) 0deg,
                    rgba(255, 26, 117, 0.6) ${xpProgress * 3.6}deg,
                    rgba(179, 0, 38, 0.8) ${xpProgress * 3.6}deg,
                    transparent ${xpProgress * 3.6}deg)`,
                  filter: 'blur(3px)'
                }}></div>
                
                <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="2"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    fill="none"
                    stroke="url(#candyGlossXpGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 35}`}
                    strokeDashoffset={`${2 * Math.PI * 35 * (1 - xpProgress / 100)}`}
                    className="transition-all duration-500 drop-shadow-[0_0_8px_rgba(255,77,136,0.6)]"
                  />
                  <defs>
                    <linearGradient id="candyGlossXpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF7BAA" />
                      <stop offset="50%" stopColor="#FF1A75" />
                      <stop offset="100%" stopColor="#B30026" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              {/* Enhanced Sparkle Effects with Candy Colors */}
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 animate-pulse">
                <Sparkle size={14} className="text-[#FF4D88] drop-shadow-[0_0_4px_rgba(255,77,136,0.8)]" />
              </div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 sm:w-3 sm:h-3 animate-pulse" style={{ animationDelay: '1s' }}>
                <Sparkle size={10} className="text-[#FF7BAA] drop-shadow-[0_0_3px_rgba(255,123,170,0.8)]" />
              </div>
              <div className="absolute -top-1 -left-1 w-2 h-2 animate-pulse" style={{ animationDelay: '0.5s' }}>
                <Sparkle size={8} className="text-[#FF1A75] drop-shadow-[0_0_2px_rgba(255,26,117,0.8)]" />
              </div>
              
              {/* Profile Picture with Candy-Gloss Border */}
              <div className="absolute inset-2 sm:inset-3">
                <div className="w-full h-full rounded-full p-0.5 bg-gradient-to-br from-[#FF7BAA] via-[#FF1A75] to-[#B30026] shadow-[0_0_16px_rgba(255,77,136,0.4)]">
                  <Avatar className="w-full h-full border-2 border-white/90 shadow-lg">
                    <AvatarImage src="/src/assets/images/user-avatar.jpg" alt="User" />
                    <AvatarFallback className="text-sm sm:text-lg font-bold bg-gradient-to-br from-[#FF7BAA] to-[#FF1A75] text-white">
                      U
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              
              {/* Candy-Gloss Level Badge */}
              <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="glossy-red-pill px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-bold flex items-center gap-1 shadow-[0_0_12px_rgba(255,77,136,0.5)]">
                  <Crown size={10} className="text-white drop-shadow-sm" />
                  <span className="text-white">{userProgress.level}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Row with Candy-Gloss Effects */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            {/* Streak with Candy-Gloss Effect */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA] to-[#FF1A75] rounded-full blur-sm opacity-60"></div>
                <div className="relative flex items-center gap-1 glossy-red-pill px-2 sm:px-3 py-1 sm:py-2 shadow-[0_0_16px_rgba(255,77,136,0.5)]">
                  <Flame size={14} weight="fill" className="text-white drop-shadow-sm" />
                  <span className="font-bold text-xs sm:text-sm text-white">{userProgress.streakCount}</span>
                </div>
              </div>
              <span className="text-xs text-gray-600 mt-1 font-medium hidden sm:inline">Streak</span>
            </div>

            {/* Tickets with Candy-Gloss Effect */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF1A75] to-[#B30026] rounded-full blur-sm opacity-60"></div>
                <div className="relative flex items-center gap-1 glossy-red-pill px-2 sm:px-3 py-1 sm:py-2 shadow-[0_0_16px_rgba(179,0,38,0.5)]">
                  <Ticket size={14} weight="fill" className="text-white drop-shadow-sm" />
                  <span className="font-bold text-xs sm:text-sm text-white">{userProgress.likTickets}</span>
                </div>
              </div>
              <span className="text-xs text-gray-600 mt-1 font-medium hidden sm:inline">Tickets</span>
            </div>

            {/* Coins with Candy-Gloss Effect */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF4D88] to-[#FF7BAA] rounded-full blur-sm opacity-60"></div>
                <div className="relative flex items-center gap-1 glossy-red-pill px-2 sm:px-3 py-1 sm:py-2 shadow-[0_0_16px_rgba(255,77,136,0.5)]">
                  <Coins size={14} weight="fill" className="text-white drop-shadow-sm animate-pulse" />
                  <span className="font-bold text-xs sm:text-sm text-white">{userProgress.likCoins > 999 ? `${(userProgress.likCoins / 1000).toFixed(1)}k` : userProgress.likCoins}</span>
                </div>
              </div>
              <span className="text-xs text-gray-600 mt-1 font-medium hidden sm:inline">Coins</span>
            </div>
          </div>
        </div>

        {/* Secondary Navigation with Enhanced Candy-Gloss Effects */}
        <div className="relative px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-center">
          {/* Navigation Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA]/5 via-[#FF4D88]/8 to-[#FF1A75]/5 blur-lg"></div>
          
          <div className="relative flex items-center gap-3 sm:gap-4 lg:gap-6 w-full max-w-md justify-center">
            {/* Leaderboard with Candy-Gloss Style */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#FF4D88]/30 rounded-full blur-md"></div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-[0_0_12px_rgba(255,77,136,0.3)] border border-[#FF4D88]/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,77,136,0.5)] hover:scale-105"
              >
                <Trophy size={16} className="text-[#FF1A75] drop-shadow-sm" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-[#FF4D88] to-[#FF1A75] rounded-full shadow-[0_0_6px_rgba(255,77,136,0.8)]"></div>
              </Button>
            </div>

            {/* Enhanced Tab Selector with Candy-Gloss Design */}
            <div className="relative">
              {/* Tab Container Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA]/20 via-[#FF4D88]/25 to-[#FF1A75]/20 rounded-xl sm:rounded-2xl blur-lg"></div>
              
              <div className="relative bg-white/70 backdrop-blur-md rounded-xl sm:rounded-2xl p-1 sm:p-1.5 flex shadow-[0_0_20px_rgba(255,77,136,0.2)] border border-[#FF4D88]/30 flex-1 max-w-xs">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveView('bounties')}
                  className={cn(
                    "font-rum-raisin rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 relative overflow-hidden flex-1 text-xs sm:text-sm transition-all duration-300",
                    activeView === 'bounties' 
                      ? "glossy-red-pill text-white font-bold shadow-[0_0_16px_rgba(255,77,136,0.6)]" 
                      : "text-gray-600 font-medium hover:bg-white/50 hover:text-[#FF1A75] hover:shadow-[0_0_8px_rgba(255,77,136,0.2)]"
                  )}
                >
                  <Target size={12} className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Bounties</span>
                  <span className="sm:hidden">Bounty</span>
                  {activeView === 'bounties' && (
                    <Sparkle size={10} className="ml-1 sm:ml-2 text-white drop-shadow-sm" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveView('quests')}
                  className={cn(
                    "font-rum-raisin rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 relative overflow-hidden flex-1 text-xs sm:text-sm transition-all duration-300",
                    activeView === 'quests' 
                      ? "glossy-red-pill text-white font-bold shadow-[0_0_16px_rgba(255,77,136,0.6)]" 
                      : "text-gray-600 font-medium hover:bg-white/50 hover:text-[#FF1A75] hover:shadow-[0_0_8px_rgba(255,77,136,0.2)]"
                  )}
                >
                  <Sword size={12} className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Quests</span>
                  <span className="sm:hidden">Quest</span>
                  {activeView === 'quests' && (
                    <Shield size={10} className="ml-1 sm:ml-2 text-white drop-shadow-sm" />
                  )}
                </Button>
              </div>
            </div>

            {/* Rewards with Candy-Gloss Style */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#FF7BAA]/30 rounded-full blur-md"></div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-[0_0_12px_rgba(255,123,170,0.3)] border border-[#FF7BAA]/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,123,170,0.5)] hover:scale-105"
              >
                <Gift size={16} className="text-[#FF1A75] drop-shadow-sm" />
                <div className="absolute -top-0.5 -right-0.5">
                  <Confetti size={10} className="text-[#FF4D88] drop-shadow-[0_0_4px_rgba(255,77,136,0.8)]" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
        {/* Enhanced Filter Tabs with Candy-Gloss Design */}
        {activeView === 'bounties' && (
          <>
            <div className="px-3 sm:px-4 py-4 sm:py-6 flex justify-center">
              <div className="flex gap-2 sm:gap-3 flex-wrap justify-center max-w-sm sm:max-w-none">
                {(['nearby', 'most-wanted', 'for-you'] as const).map((filter) => (
                  <div key={filter} className="relative">
                    {selectedFilter === filter && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA]/40 via-[#FF4D88]/50 to-[#FF1A75]/40 rounded-full blur-md"></div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFilter(filter)}
                      className={cn(
                        "relative rounded-full font-rum-raisin px-3 sm:px-4 py-1.5 sm:py-2 overflow-hidden text-xs sm:text-sm transition-all duration-300",
                        selectedFilter === filter 
                          ? "glossy-red-pill text-white font-bold shadow-[0_0_16px_rgba(255,77,136,0.6)]" 
                          : "bg-white/60 backdrop-blur-sm text-gray-600 font-medium hover:bg-white/80 shadow-md hover:shadow-[0_0_12px_rgba(255,77,136,0.3)] hover:text-[#FF1A75] hover:scale-105"
                      )}
                    >
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
                        <Sparkle size={8} className="ml-1 sm:ml-1.5 text-white drop-shadow-sm" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Search Bar with Candy-Gloss Effects */}
            <div className="px-3 sm:px-4 pb-4 sm:pb-6">
              <div className="relative max-w-md mx-auto">
                {/* Multi-layer glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA]/20 via-[#FF4D88]/30 to-[#FF1A75]/20 rounded-xl sm:rounded-2xl blur-lg"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA]/10 via-[#FF4D88]/15 to-[#FF1A75]/10 rounded-xl sm:rounded-2xl blur-sm"></div>
                
                <div className="relative bg-white/80 backdrop-blur-md rounded-xl sm:rounded-2xl border border-[#FF4D88]/30 shadow-[0_0_20px_rgba(255,77,136,0.15)]">
                  <MagnifyingGlass className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#FF1A75] drop-shadow-sm" size={16} />
                  <Input
                    placeholder="🔍 Discover epic bounties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-transparent border-none text-gray-700 placeholder-gray-500 font-medium text-sm sm:text-base focus:ring-2 focus:ring-[#FF4D88]/40"
                  />
                  <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-gradient-to-r from-[#FF4D88] to-[#FF7BAA] rounded-full shadow-[0_0_8px_rgba(255,77,136,0.6)] animate-pulse"></div>
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

      {/* Enhanced Floating Map Button with Candy-Gloss Design */}
      <div className="fixed bottom-20 sm:bottom-24 left-1/2 transform -translate-x-1/2 z-10">
        <div className="relative">
          {/* Multi-layer glow effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA] via-[#FF4D88] to-[#FF1A75] rounded-full blur-xl opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF1A75] to-[#B30026] rounded-full blur-lg opacity-40"></div>
          
          {/* Pulsing Ring Effect */}
          <div className="absolute inset-0 rounded-full border-2 border-[#FF4D88]/30 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border border-[#FF7BAA]/20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          
          <Button 
            size="sm" 
            className="glossy-red-pill relative px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base shadow-[0_0_24px_rgba(255,77,136,0.6)] hover:shadow-[0_0_32px_rgba(255,77,136,0.8)] transition-all duration-300 hover:scale-110"
          >
            <MapPin size={14} className="mr-1 sm:mr-2 text-white drop-shadow-sm" />
            <span className="font-bold hidden xs:inline text-white">Explore Map</span>
            <span className="font-bold xs:hidden text-white">Map</span>
            <Sparkle size={10} className="ml-1 sm:ml-2 text-white drop-shadow-sm animate-pulse" />
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
      {/* Enhanced Bounties Section with Candy-Gloss Theme */}
      <div className="space-y-4">
        <div className="text-center relative py-2">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-[#DC143C]/40 to-transparent blur-sm"></div>
            <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-[#FF1A75] via-[#DC143C] to-[#8B0000]"></div>
          </div>
          <h3 className="relative bg-gradient-to-r from-[#FF1A75] via-[#DC143C] to-[#8B0000] bg-clip-text text-transparent px-3 font-bold text-base sm:text-lg font-rum-raisin drop-shadow-sm">
            ✨ LEGENDARY BOUNTIES ✨
          </h3>
        </div>
        
        {/* Mobile-optimized single column layout */}
        <div className="space-y-4">
          {bounties.slice(0, 2).map((bounty, index) => (
            <div key={bounty.id} className="relative perspective-1000 w-full max-w-sm mx-auto">
              {/* Enhanced Multi-layer Glow Effects */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#FF1A75]/30 via-[#DC143C]/40 to-[#8B0000]/30 rounded-2xl blur-xl opacity-60"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#DC143C]/20 via-[#FF1A75]/25 to-[#8B0000]/20 rounded-2xl blur-lg opacity-80"></div>
              
              <div 
                className={cn(
                  "relative w-full h-[200px] sm:h-[240px] transform-style-preserve-3d transition-all duration-700 cursor-pointer",
                  flippedCards.has(bounty.id) && "rotate-y-180"
                )}
                onClick={() => onBountyClick?.(bounty)}
              >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden">
                  <Card className="h-full overflow-hidden bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-lg border-2 border-[#FF4D88]/30 shadow-[0_0_24px_rgba(255,77,136,0.2)] rounded-2xl">
                    {/* Background Image with Enhanced Overlay */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${foodImages[index % foodImages.length]})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-[#FF1A75]/20 to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FF7BAA]/10 via-transparent to-[#FF1A75]/10"></div>
                    </div>

                    {/* Enhanced Bounty Badge with Candy-Gloss */}
                    <div className="absolute top-3 left-3 z-20">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA] to-[#FF1A75] rounded-full blur-sm opacity-60"></div>
                        <div className="relative glossy-red-pill px-2 py-1 text-xs font-bold shadow-[0_0_12px_rgba(255,77,136,0.6)] flex items-center gap-1">
                          <Crown size={10} className="text-white drop-shadow-sm" />
                          <span className="text-white font-rum-raisin">BOUNTY</span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Difficulty Indicator with Candy-Gloss */}
                    <div className="absolute top-3 right-3 z-20">
                      <div className="relative">
                        <div className={cn(
                          "absolute inset-0 rounded-full blur-sm opacity-60",
                          bounty.difficulty === 'Easy' && "bg-gradient-to-r from-emerald-400 to-green-500",
                          bounty.difficulty === 'Medium' && "bg-gradient-to-r from-[#FF7BAA] to-[#FF4D88]",
                          bounty.difficulty === 'Hard' && "bg-gradient-to-r from-[#FF1A75] to-[#B30026]"
                        )}></div>
                        <div className={cn(
                          "relative px-2 py-1 rounded-full text-xs font-bold text-white shadow-[0_0_12px_rgba(255,77,136,0.4)] border border-white/30 flex items-center gap-1",
                          bounty.difficulty === 'Easy' && "bg-gradient-to-r from-emerald-400 to-green-500",
                          bounty.difficulty === 'Medium' && "bg-gradient-to-r from-[#FF7BAA] to-[#FF4D88]",
                          bounty.difficulty === 'Hard' && "bg-gradient-to-r from-[#FF1A75] to-[#B30026]"
                        )}>
                          <Lightning size={10} className="text-white drop-shadow-sm" />
                          <span className="font-rum-raisin">{bounty.difficulty}</span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Timer Badge with Candy-Gloss */}
                    <div className="absolute top-12 right-3 z-20">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF1A75]/80 to-[#B30026]/80 rounded-full blur-sm"></div>
                        <div className="relative bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs font-bold border border-[#FF4D88]/30 shadow-[0_0_8px_rgba(255,77,136,0.4)]">
                          <Timer size={10} className="inline mr-1 text-[#FF4D88] drop-shadow-sm" />
                          <span className="font-rum-raisin">{bounty.timeRemaining}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                      {/* Enhanced Taste Match and Friends with Candy-Gloss */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full blur-sm opacity-60"></div>
                          <div className="relative bg-gradient-to-r from-emerald-400 to-green-500 px-2 py-1 rounded-full text-xs font-bold text-white shadow-[0_0_8px_rgba(34,197,94,0.5)]">
                            <span className="font-rum-raisin">92% Match</span>
                          </div>
                        </div>
                        <div className="flex -space-x-1">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="w-5 h-5 bg-white rounded-full border-2 border-[#FF4D88]/50 flex items-center justify-center shadow-[0_0_6px_rgba(255,77,136,0.3)]">
                              <span className="text-xs">👤</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <h4 className="font-bold text-lg sm:text-xl mb-1 text-shadow-lg line-clamp-1 font-rum-raisin">
                        {bounty.dishName}
                      </h4>
                      <p 
                        className="text-sm sm:text-base opacity-90 cursor-pointer hover:underline mb-3 line-clamp-1 font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          onShowRestaurantProfile?.(bounty.restaurantId);
                        }}
                      >
                        {bounty.restaurantName}
                      </p>

                      {/* Enhanced Reward Section with Candy-Gloss */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA] to-[#FF4D88] rounded-full blur-sm opacity-60"></div>
                            <div className="relative flex items-center gap-1 bg-gradient-to-r from-[#FF7BAA] to-[#FF4D88] px-2 py-1 rounded-full shadow-[0_0_8px_rgba(255,77,136,0.5)]">
                              <Coins size={12} weight="fill" className="text-white drop-shadow-sm" />
                              <span className="font-bold text-xs text-white font-rum-raisin">+{bounty.reward}</span>
                            </div>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FF1A75] to-[#B30026] rounded-full blur-sm opacity-60"></div>
                            <div className="relative flex items-center gap-1 bg-gradient-to-r from-[#FF1A75] to-[#B30026] px-2 py-1 rounded-full shadow-[0_0_8px_rgba(179,0,38,0.5)]">
                              <Lightning size={12} className="text-white drop-shadow-sm" />
                              <span className="font-bold text-xs text-white font-rum-raisin">+50 XP</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="glossy-red-pill font-bold px-3 py-1 rounded-full text-xs shadow-[0_0_12px_rgba(255,77,136,0.6)] hover:shadow-[0_0_16px_rgba(255,77,136,0.8)] transition-all duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="font-rum-raisin">Accept</span>
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
                  <Card className="h-full overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border border-[#FF1A75]/30 shadow-xl rounded-2xl p-4 text-white">
                    <div className="h-full flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-lg mb-3 text-center text-[#FF7BAA]">
                          Bounty Details
                        </h4>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-[#FF4D88]" />
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

                        <div className="mt-3 p-2 bg-[#8B0000]/30 rounded-lg">
                          <p className="text-xs text-[#FF7BAA] line-clamp-2">
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
                          className="flex-1 border-red-400 text-red-300 hover:bg-red-400/10 text-xs py-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 glossy-red-pill text-xs py-1"
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

      {/* Enhanced Local Bounties Grid with Candy-Gloss Theme */}
      <div className="space-y-4">
        <div className="text-center relative py-2">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-[#FF4D88]/30 to-transparent blur-sm"></div>
            <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-[#FF4D88] via-[#FF1A75] to-[#B30026]"></div>
          </div>
          <h3 className="relative bg-gradient-to-r from-[#FF4D88] via-[#FF1A75] to-[#B30026] bg-clip-text text-transparent px-3 font-bold text-base sm:text-lg font-rum-raisin drop-shadow-sm">
            🎯 NEARBY ADVENTURES
          </h3>
        </div>
        
        {/* Mobile-optimized grid with proper spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-lg sm:max-w-none mx-auto">
          {bounties.map((bounty, index) => (
            <div key={`local-${bounty.id}`} className="relative perspective-1000">
              {/* Enhanced Candy-Gloss Glow Effects */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF4D88]/20 via-[#FF1A75]/25 to-[#B30026]/20 rounded-xl blur-lg opacity-60"></div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF7BAA]/15 via-[#FF4D88]/20 to-[#FF1A75]/15 rounded-xl blur-md opacity-80"></div>
              
              <div 
                className="relative h-40 sm:h-48 cursor-pointer group"
                onClick={() => onShowBountyDetails?.(bounty.id)}
              >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden">
                  <Card className="h-full overflow-hidden bg-white/95 backdrop-blur-sm border-2 border-[#FF4D88]/25 shadow-[0_0_16px_rgba(255,77,136,0.15)] rounded-xl group-hover:shadow-[0_0_24px_rgba(255,77,136,0.25)] transition-all duration-300">
                    {/* Enhanced Background Image with Candy-Gloss Overlay */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${foodImages[(index + 2) % foodImages.length]})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-[#FF1A75]/10 to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FF7BAA]/5 via-transparent to-[#FF4D88]/5"></div>
                    </div>

                    {/* Enhanced Difficulty Indicator with Candy-Gloss */}
                    <div className="absolute top-2 left-2 z-10">
                      <div className="relative">
                        <div className={cn(
                          "absolute inset-0 rounded-full blur-sm opacity-60",
                          bounty.difficulty === 'Easy' && "bg-emerald-400",
                          bounty.difficulty === 'Medium' && "bg-[#FF4D88]",
                          bounty.difficulty === 'Hard' && "bg-[#FF1A75]"
                        )}></div>
                        <div className={cn(
                          "relative w-3 h-3 rounded-full border-2 border-white shadow-[0_0_8px_rgba(255,77,136,0.4)]",
                          bounty.difficulty === 'Easy' && "bg-emerald-400",
                          bounty.difficulty === 'Medium' && "bg-[#FF4D88]",
                          bounty.difficulty === 'Hard' && "bg-[#FF1A75]"
                        )}></div>
                      </div>
                    </div>

                    {/* Enhanced Content with Candy-Gloss */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white z-10">
                      <h4 className="font-bold text-sm sm:text-base mb-1 line-clamp-1 font-rum-raisin">
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
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#FF1A75]/60 rounded-full blur-sm"></div>
                          <div className="relative flex items-center gap-1 bg-[#FF1A75]/80 text-white px-2 py-1 rounded-full text-xs shadow-[0_0_8px_rgba(255,26,117,0.4)]">
                            <Timer size={10} className="text-white drop-shadow-sm" />
                            <span className="font-medium font-rum-raisin">{bounty.timeRemaining}</span>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#FF4D88]/60 rounded-full blur-sm"></div>
                          <div className="relative flex items-center gap-1 bg-[#FF4D88]/80 text-white px-2 py-1 rounded-full text-xs shadow-[0_0_8px_rgba(255,77,136,0.4)]">
                            <span className="font-bold font-rum-raisin">+{bounty.reward}</span>
                            <Coins size={10} weight="fill" className="text-white drop-shadow-sm" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Accept Button with Candy-Gloss */}
                    <div className="absolute top-2 right-2 z-10 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA] to-[#FF4D88] rounded-full blur-sm opacity-60"></div>
                        <Button 
                          size="sm" 
                          className="relative glossy-red-pill text-white px-2 py-1 text-xs rounded-full shadow-[0_0_12px_rgba(255,77,136,0.5)] hover:shadow-[0_0_16px_rgba(255,77,136,0.7)] transition-all duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="font-rum-raisin">Accept</span>
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
    </div>
  );
}

function QuestsView({ quests, onQuestClick }: { 
  quests: Quest[], 
  onQuestClick?: (quest: Quest) => void 
}) {
  return (
    <div className="px-3 sm:px-4 space-y-6 pb-6">
      {/* Enhanced Epic Quests with Candy-Gloss Theme */}
      <div className="space-y-4">
        <div className="text-center relative py-2">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 sm:w-40 h-1 bg-gradient-to-r from-transparent via-[#DC143C]/40 to-transparent blur-sm"></div>
            <div className="w-20 sm:w-24 h-0.5 bg-gradient-to-r from-[#FF1A75] via-[#DC143C] to-[#8B0000]"></div>
          </div>
          <h3 className="relative bg-gradient-to-r from-[#FF1A75] via-[#DC143C] to-[#8B0000] bg-clip-text text-transparent px-3 font-bold text-base sm:text-lg font-rum-raisin drop-shadow-sm">
            ⚔️ LEGENDARY QUESTS ⚔️
          </h3>
        </div>
        
        <div className="space-y-4 max-w-lg mx-auto lg:max-w-none">
          {quests.map((quest, index) => (
            <div key={quest.id} className="relative">
              {/* Enhanced Multi-layer Glow Effects */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#FF1A75]/25 via-[#DC143C]/35 to-[#8B0000]/25 rounded-2xl sm:rounded-3xl blur-xl opacity-60"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#DC143C]/15 via-[#FF1A75]/20 to-[#8B0000]/15 rounded-2xl sm:rounded-3xl blur-lg opacity-80"></div>
              
              <Card 
                className="relative overflow-hidden bg-white/90 backdrop-blur-md border-2 border-[#FF4D88]/30 shadow-[0_0_24px_rgba(255,77,136,0.2)] rounded-2xl sm:rounded-3xl cursor-pointer hover:shadow-[0_0_32px_rgba(255,77,136,0.3)] transition-all duration-300"
                onClick={() => onQuestClick?.(quest)}
              >
                {/* Enhanced Quest Type Badge with Candy-Gloss */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
                  <div className="relative">
                    <div className={cn(
                      "absolute inset-0 rounded-full blur-sm opacity-60",
                      quest.type === 'team' 
                        ? "bg-gradient-to-r from-[#FF1A75] to-[#B30026]" 
                        : "bg-gradient-to-r from-[#FF7BAA] to-[#FF4D88]"
                    )}></div>
                    <div className={cn(
                      "relative px-2 sm:px-3 py-1 sm:py-2 rounded-full text-white shadow-[0_0_12px_rgba(255,77,136,0.5)] border border-white/30 flex items-center gap-1 sm:gap-2",
                      quest.type === 'team' 
                        ? "bg-gradient-to-r from-[#FF1A75] to-[#B30026]" 
                        : "bg-gradient-to-r from-[#FF7BAA] to-[#FF4D88]"
                    )}>
                      {quest.type === 'team' ? (
                        <>
                          <Users size={12} className="text-white drop-shadow-sm" />
                          <span className="text-xs font-bold font-rum-raisin">TEAM</span>
                        </>
                      ) : (
                        <>
                          <Shield size={12} className="text-white drop-shadow-sm" />
                          <span className="text-xs font-bold font-rum-raisin">SOLO</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced Difficulty Badge with Candy-Gloss */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
                  <div className="relative">
                    <div className={cn(
                      "absolute inset-0 rounded-full blur-sm opacity-60",
                      quest.difficulty === 'Easy' && "bg-gradient-to-r from-emerald-400 to-green-500",
                      quest.difficulty === 'Medium' && "bg-gradient-to-r from-[#FF7BAA] to-[#FF4D88]",
                      quest.difficulty === 'Hard' && "bg-gradient-to-r from-[#FF1A75] to-[#B30026]",
                      quest.difficulty === 'Extreme' && "bg-gradient-to-r from-[#B30026] to-[#8B0000]"
                    )}></div>
                    <div className={cn(
                      "relative px-2 sm:px-3 py-1 rounded-full text-xs font-bold text-white shadow-[0_0_12px_rgba(255,77,136,0.4)] border border-white/30",
                      quest.difficulty === 'Easy' && "bg-gradient-to-r from-emerald-400 to-green-500",
                      quest.difficulty === 'Medium' && "bg-gradient-to-r from-[#FF7BAA] to-[#FF4D88]",
                      quest.difficulty === 'Hard' && "bg-gradient-to-r from-[#FF1A75] to-[#B30026]",
                      quest.difficulty === 'Extreme' && "bg-gradient-to-r from-[#B30026] to-[#8B0000]"
                    )}>
                      <Sword size={8} className="inline mr-1 text-white drop-shadow-sm" />
                      <span className="font-rum-raisin">{quest.difficulty}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  {/* Enhanced Quest Header with Candy-Gloss */}
                  <div className="mb-4 pt-6 sm:pt-8">
                    <h4 className="font-bold text-lg sm:text-xl mb-2 flex items-center font-rum-raisin">
                      <Trophy size={18} className="text-[#FF4D88] mr-2 flex-shrink-0 drop-shadow-sm" />
                      <span className="line-clamp-1">{quest.name}</span>
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed bg-gradient-to-r from-[#FF7BAA]/5 to-[#FF4D88]/5 rounded-lg p-2 sm:p-3 border border-[#FF4D88]/20 line-clamp-2 sm:line-clamp-none">
                      {quest.description}
                    </p>
                  </div>

                  {/* Enhanced Quest Stats with Candy-Gloss */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    {/* Reward */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA]/20 to-[#FF4D88]/20 rounded-xl blur-sm"></div>
                      <div className="relative bg-gradient-to-r from-[#FF7BAA]/10 to-[#FF4D88]/10 rounded-xl p-3 border border-[#FF4D88]/30 shadow-[0_0_12px_rgba(255,77,136,0.1)]">
                        <div className="flex items-center gap-2 mb-1">
                          <Coins size={16} weight="fill" className="text-[#FF1A75] flex-shrink-0 drop-shadow-sm" />
                          <span className="font-bold text-[#FF1A75] text-sm sm:text-base font-rum-raisin">Epic Reward</span>
                        </div>
                        <div className="text-lg sm:text-xl font-black text-[#B30026] font-rum-raisin">+{quest.reward} LKC</div>
                      </div>
                    </div>

                    {/* Locations */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF4D88]/20 to-[#FF1A75]/20 rounded-xl blur-sm"></div>
                      <div className="relative bg-gradient-to-r from-[#FF4D88]/10 to-[#FF1A75]/10 rounded-xl p-3 border border-[#FF1A75]/30 shadow-[0_0_12px_rgba(255,26,117,0.1)]">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin size={16} className="text-[#FF1A75] flex-shrink-0 drop-shadow-sm" />
                          <span className="font-bold text-[#FF1A75] text-sm sm:text-base font-rum-raisin">Journey</span>
                        </div>
                        <div className="text-lg sm:text-xl font-black text-[#B30026] font-rum-raisin">{quest.locationCount} Places</div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Quest Footer with Candy-Gloss */}
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA]/5 to-[#FF4D88]/5 rounded-xl blur-sm"></div>
                    <div className="relative flex items-center justify-between bg-gradient-to-r from-white/60 to-white/80 rounded-xl p-3 border border-[#FF4D88]/20 shadow-[0_0_8px_rgba(255,77,136,0.1)]">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[#FF1A75] flex-shrink-0 drop-shadow-sm" />
                        <span className="text-sm font-medium text-[#FF1A75] font-rum-raisin">Time Limit</span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF4D88]/20 to-[#FF1A75]/20 rounded-lg blur-sm"></div>
                        <div className="relative flex items-center gap-2 bg-white rounded-lg px-2 sm:px-3 py-1 shadow-[0_0_8px_rgba(255,77,136,0.2)] border border-[#FF4D88]/20">
                          <Timer size={12} className="text-[#FF1A75] flex-shrink-0 drop-shadow-sm" />
                          <span className="font-bold text-[#B30026] text-sm font-rum-raisin">{quest.timeLimit}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Action Button with Candy-Gloss */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA] via-[#FF4D88] to-[#FF1A75] rounded-xl blur-lg opacity-40"></div>
                      <Button className="glossy-red-pill font-bold px-6 sm:px-8 py-2 sm:py-3 rounded-xl text-sm sm:text-base shadow-[0_0_16px_rgba(255,77,136,0.6)] hover:shadow-[0_0_24px_rgba(255,77,136,0.8)] transition-all duration-300 hover:scale-105">
                        <Lightning size={14} className="mr-2 text-white drop-shadow-sm" />
                        <span className="font-rum-raisin">Accept Quest</span>
                        <Sparkle size={12} className="ml-2 text-white drop-shadow-sm" />
                      </Button>
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