import { useState, useRef } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { BountyCardModal } from '@/components/BountyCardModal';
import { QuestCardModal } from '@/components/QuestCardModal';
import likBackground from '@/assets/images/lik_background.png';
import { 
  FireIcon, 
  DocumentIcon as TicketIcon, 
  ChartBarIcon, 
  GiftIcon, 
  MagnifyingGlassIcon,
  MapPinIcon as MapPin,
  ClockIcon,
  StarIcon,
  UsersIcon,
  BoltIcon as LightningIcon,
  TrophyIcon,
  ShieldCheckIcon,
  ArrowPathIcon as RotateCcwIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { 
  CurrencyDollarIcon as CoinsIcon
} from '@heroicons/react/24/solid';
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
  onNavigate: (page: string) => void;
  onSelectBounty: (bounty: any) => void;
}

export function LikPage({ onNavigate, onSelectBounty }: LikPageProps) {
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

  const xpProgress = userProgress?.xp && userProgress?.xpToNextLevel 
    ? (userProgress.xp / userProgress.xpToNextLevel) * 100 
    : 0;

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
        onNavigate('lik-passport');
        break;
      case 'reservations':
        onNavigate('reservation-manager');
        break;
      case 'messages':
        onNavigate('messages');
        break;
      case 'notifications':
        onNavigate('notifications');
        break;
      default:
        console.log('Navigate to:', destination);
    }
  };

  // Mock user data for dropdown
  const mockUser = {
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    displayName: 'John Doe',
    username: '@johndoe',
    tasteTitle: 'Grand Master',
    level: userProgress?.level || 24,
    xp: userProgress?.xp || 1250,
    maxXp: userProgress?.xpToNextLevel || 1500,
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
    <div className="h-full flex flex-col overflow-hidden relative">
      {/* Enhanced Background with Lik Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ 
          backgroundImage: `url(${likBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Candy-glass gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF7BAA]/20 via-[#FF1A75]/10 to-[#B30026]/15"></div>
        
        {/* Floating magical effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Candy-Gloss Orbs */}
          <div className="absolute top-16 left-8 w-16 h-16 bg-gradient-to-br from-[#FF7BAA]/40 to-[#FF1A75]/30 rounded-full blur-lg"></div>
          <div className="absolute top-40 right-12 w-12 h-12 bg-gradient-to-br from-[#FF4D88]/35 to-[#B30026]/25 rounded-full blur-md"></div>
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-[#FF1A75]/30 to-[#8B0000]/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 right-16 w-14 h-14 bg-gradient-to-br from-[#FF7BAA]/35 to-[#FF4D88]/25 rounded-full blur-lg"></div>
          
          {/* Magical Sparkles */}
          <div className="absolute top-24 right-20 text-3xl text-[#FF7BAA]/70">✨</div>
          <div className="absolute bottom-40 left-16 text-2xl text-[#FF4D88]/60">🌟</div>
          <div className="absolute top-56 left-1/3 text-xl text-[#FF1A75]/65">💫</div>
        </div>
      </div>

      {/* Header without App Bar - Direct Content */}
      <div className="relative z-10 px-4 py-6">
        {/* Enhanced User Progress Header */}
        <div className="flex items-center justify-between">
          {/* Profile Avatar with Enhanced Glow */}
          <div 
            ref={avatarRef}
            className="relative cursor-pointer group flex-shrink-0"
            onClick={handleAvatarClick}
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-[#FF7BAA] to-[#FF4D88] rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
            <ProfileAvatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
              alt="User"
              level={userProgress?.level || 24}
              xp={userProgress?.xp || 1250}
              maxXp={userProgress?.xpToNextLevel || 1500}
              size="md"
            />
          </div>

          {/* Enhanced Stats with Better Visibility */}
          <div className="flex items-center gap-4">
            {/* Streak */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA] to-[#FF1A75] rounded-full blur-lg opacity-70"></div>
                <div className="relative glossy-red-pill px-3 py-2 shadow-[0_0_20px_rgba(255,77,136,0.6)]">
                  <FireIcon width={16} height={16} className="text-white drop-shadow-lg inline mr-1" />
                  <span className="font-bold text-sm text-white font-rum-raisin">{userProgress.streakCount}</span>
                </div>
              </div>
              <span className="text-xs text-white/80 mt-1 font-medium drop-shadow-md">Streak</span>
            </div>

            {/* Tickets */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF4D88] to-[#B30026] rounded-full blur-lg opacity-70"></div>
                <div className="relative glossy-red-pill px-3 py-2 shadow-[0_0_20px_rgba(255,77,136,0.6)]">
                  <TicketIcon className="w-4 h-4 text-white drop-shadow-lg inline mr-1" />
                  <span className="font-bold text-sm text-white font-rum-raisin">{userProgress.likTickets}</span>
                </div>
              </div>
              <span className="text-xs text-white/80 mt-1 font-medium drop-shadow-md">Tickets</span>
            </div>

            {/* Coins */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF1A75] to-[#8B0000] rounded-full blur-lg opacity-70"></div>
                <div className="relative glossy-red-pill px-3 py-2 shadow-[0_0_20px_rgba(255,77,136,0.6)]">
                  <CoinsIcon className="w-4 h-4 text-white drop-shadow-lg inline mr-1" />
                  <span className="font-bold text-sm text-white font-rum-raisin">{userProgress.likCoins > 999 ? `${(userProgress.likCoins / 1000).toFixed(1)}k` : userProgress.likCoins}</span>
                </div>
              </div>
              <span className="text-xs text-white/80 mt-1 font-medium drop-shadow-md">Coins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-20 relative z-10">
        {/* Enhanced Navigation Row - Moved Below Header and Off App Bar */}
        <div className="relative z-10 px-4 pb-2">
          <div className="flex items-center justify-center gap-6">
            {/* Leaderboard */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#FF7BAA]/40 rounded-full blur-md"></div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onNavigate('leaderboard')}
                className="relative bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 shadow-[0_0_16px_rgba(255,123,170,0.4)] border border-white/30 transition-all duration-300 hover:shadow-[0_0_24px_rgba(255,123,170,0.6)]"
              >
                <TrophyIcon className="w-5 h-5 text-white drop-shadow-lg" />
              </Button>
            </div>

            {/* Enhanced Tab Selector */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA]/30 via-[#FF4D88]/40 to-[#FF1A75]/30 rounded-2xl blur-lg"></div>
              
              <div className="relative bg-white/20 backdrop-blur-md rounded-2xl p-2 flex shadow-[0_0_24px_rgba(255,123,170,0.3)] border border-white/30">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveView('bounties')}
                  className={cn(
                    "font-rum-raisin rounded-xl px-6 py-3 relative overflow-hidden transition-all duration-300",
                    activeView === 'bounties' 
                      ? "glossy-red-pill text-white font-bold shadow-[0_0_20px_rgba(255,123,170,0.7)]" 
                      : "text-white/80 font-medium hover:bg-white/20 hover:text-white hover:shadow-[0_0_12px_rgba(255,123,170,0.3)]"
                  )}
                >
                  <StarIcon className="w-4 h-4 mr-2" />
                  Bounties
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveView('quests')}
                  className={cn(
                    "font-rum-raisin rounded-xl px-6 py-3 relative overflow-hidden transition-all duration-300",
                    activeView === 'quests' 
                      ? "glossy-red-pill text-white font-bold shadow-[0_0_20px_rgba(255,123,170,0.7)]" 
                      : "text-white/80 font-medium hover:bg-white/20 hover:text-white hover:shadow-[0_0_12px_rgba(255,123,170,0.3)]"
                  )}
                >
                  <ShieldCheckIcon className="w-4 h-4 mr-2" />
                  Quests
                </Button>
              </div>
            </div>

            {/* Rewards */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#FF4D88]/40 rounded-full blur-md"></div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onNavigate('rewards')}
                className="relative bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 shadow-[0_0_16px_rgba(255,77,136,0.4)] border border-white/30 transition-all duration-300 hover:shadow-[0_0_24px_rgba(255,77,136,0.6)]"
              >
                <GiftIcon className="w-5 h-5 text-white drop-shadow-lg" />
                <div className="absolute -top-1 -right-1">
                  <GiftIcon className="w-3 h-3 text-[#FF7BAA] drop-shadow-[0_0_6px_rgba(255,123,170,0.8)]" />
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Filter Tabs */}
        {activeView === 'bounties' && (
          <div className="px-4 py-2 flex justify-center">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {/* Filter Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-[#FF4D88]/40 rounded-full blur-md"></div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 shadow-[0_0_16px_rgba(255,77,136,0.4)] border border-white/30 transition-all duration-300 hover:shadow-[0_0_24px_rgba(255,77,136,0.6)]"
                >
                  <FunnelIcon className="w-4 h-4 text-white drop-shadow-lg" />
                </Button>
              </div>
              
              {(['nearby', 'most-wanted', 'for-you'] as const).map((filter) => (
                <div key={filter} className="relative">
                  {selectedFilter === filter && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA]/50 via-[#FF4D88]/60 to-[#FF1A75]/50 rounded-full blur-lg"></div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFilter(filter)}
                    className={cn(
                      "relative rounded-full font-rum-raisin px-4 py-2 overflow-hidden transition-all duration-300",
                      selectedFilter === filter 
                        ? "glossy-red-pill text-white font-bold shadow-[0_0_20px_rgba(255,123,170,0.7)]" 
                        : "bg-white/20 backdrop-blur-md text-white/90 font-medium hover:bg-white/30 shadow-md hover:shadow-[0_0_16px_rgba(255,123,170,0.4)] hover:text-white border border-white/30"
                    )}
                  >
                    {filter === 'nearby' && 'Nearby'}
                    {filter === 'most-wanted' && 'Most Wanted'}
                    {filter === 'for-you' && 'For You'}
                  </Button>
                </div>
              ))}
              
              {/* Search Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-[#FF4D88]/40 rounded-full blur-md"></div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 shadow-[0_0_16px_rgba(255,77,136,0.4)] border border-white/30 transition-all duration-300 hover:shadow-[0_0_24px_rgba(255,77,136,0.6)]"
                >
                  <MagnifyingGlassIcon className="w-4 h-4 text-white drop-shadow-lg" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeView === 'bounties' ? (
          <BountiesView 
            bounties={bounties} 
            onBountyClick={(bounty) => setSelectedBounty(getBountyModalData(bounty))}
          />
        ) : (
          <QuestsView 
            quests={quests} 
            onQuestClick={(quest) => setSelectedQuest(getQuestModalData(quest))}
          />
        )}
      </div>

      {/* Enhanced Floating Map Button */}
      <div className="fixed bottom-map-mobile left-1/2 transform -translate-x-1/2 z-10">
        <div className="relative">
          {/* Multi-layer glow effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA] via-[#FF4D88] to-[#FF1A75] rounded-full blur-xl opacity-60"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF4D88] to-[#B30026] rounded-full blur-lg opacity-50"></div>
          
          {/* Pulsing Ring Effect */}
          <div className="absolute inset-0 rounded-full border-2 border-[#FF7BAA]/40"></div>
          <div className="absolute inset-0 rounded-full border border-[#FF4D88]/30"></div>
          
          <Button 
            size="sm" 
            className="glossy-red-pill relative px-6 py-3 rounded-full text-base shadow-[0_0_28px_rgba(255,123,170,0.7)] hover:shadow-[0_0_36px_rgba(255,123,170,0.9)] transition-all duration-300"
            onClick={() => onNavigate('bounty-quest-map')}
          >
            <MapPin className="w-4 h-4 mr-2 text-white drop-shadow-lg" />
            <span className="font-bold text-white font-rum-raisin">Explore Map</span>
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
        />
      )}
    </div>
  );
}

function BountiesView({ bounties, onBountyClick }: { 
  bounties: Bounty[], 
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
    <div className="px-4 space-y-6 pb-6">
      {/* Enhanced Bounties Section */}
      <div className="space-y-4">        
        {/* Mobile-optimized single column layout */}
        <div className="space-y-4">
          {bounties.slice(0, 2).map((bounty, index) => (
            <div key={bounty.id} className="relative perspective-1000 w-full max-w-sm mx-auto">
              {/* Enhanced Multi-layer Glow Effects */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#FF7BAA]/40 via-[#FF4D88]/50 to-[#FF1A75]/40 rounded-2xl blur-xl opacity-60"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF4D88]/30 via-[#FF1A75]/35 to-[#B30026]/30 rounded-2xl blur-lg opacity-80"></div>
              
              <div 
                className={cn(
                  "relative w-full h-[240px] transform-style-preserve-3d transition-all duration-700 cursor-pointer",
                  flippedCards.has(bounty.id) && "rotate-y-180"
                )}
                onClick={() => onBountyClick?.(bounty)}
              >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden">
                  <Card className="h-full overflow-hidden bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl border-2 border-[#FF7BAA]/40 shadow-[0_0_28px_rgba(255,123,170,0.3)] rounded-2xl">
                    {/* Background Image with Enhanced Overlay */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${foodImages[index % foodImages.length]})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-[#FF1A75]/15 to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FF7BAA]/15 via-transparent to-[#FF4D88]/10"></div>
                    </div>

                    {/* Enhanced Bounty Badge */}
                    <div className="absolute top-3 left-3 z-20">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA] to-[#FF4D88] rounded-full blur-md opacity-70"></div>
                        <div className="relative glossy-red-pill px-2 py-1 text-xs font-bold shadow-[0_0_16px_rgba(255,123,170,0.7)] flex items-center gap-1">
                          <span className="text-white font-rum-raisin">BOUNTY</span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Difficulty Indicator */}
                    <div className="absolute top-3 right-3 z-20">
                      <div className="relative">
                        <div className={cn(
                          "absolute inset-0 rounded-full blur-md opacity-70",
                          bounty.difficulty === 'Easy' && "bg-gradient-to-r from-emerald-400 to-green-500",
                          bounty.difficulty === 'Medium' && "bg-gradient-to-r from-[#FF7BAA] to-[#FF4D88]",
                          bounty.difficulty === 'Hard' && "bg-gradient-to-r from-[#FF1A75] to-[#B30026]"
                        )}></div>
                        <div className={cn(
                          "relative px-2 py-1 rounded-full text-xs font-bold text-white shadow-[0_0_16px_rgba(255,123,170,0.5)] border border-white/40 flex items-center gap-1",
                          bounty.difficulty === 'Easy' && "bg-gradient-to-r from-emerald-400 to-green-500",
                          bounty.difficulty === 'Medium' && "bg-gradient-to-r from-[#FF7BAA] to-[#FF4D88]",
                          bounty.difficulty === 'Hard' && "bg-gradient-to-r from-[#FF1A75] to-[#B30026]"
                        )}>
                          <LightningIcon className="w-3 h-3 text-white drop-shadow-lg" />
                          <span className="font-rum-raisin">{bounty.difficulty}</span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Timer Badge */}
                    <div className="absolute top-12 right-3 z-20">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF1A75]/90 to-[#B30026]/90 rounded-full blur-md"></div>
                        <div className="relative bg-black/80 backdrop-blur-md rounded-full px-2 py-1 text-white text-xs font-bold border border-[#FF7BAA]/40 shadow-[0_0_12px_rgba(255,123,170,0.5)]">
                          <ClockIcon className="w-3 h-3 inline mr-1 text-[#FF7BAA] drop-shadow-lg" />
                          <span className="font-rum-raisin">{bounty.timeRemaining}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                      {/* Enhanced Taste Match and Friends */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full blur-md opacity-70"></div>
                          <div className="relative bg-gradient-to-r from-emerald-400 to-green-500 px-2 py-1 rounded-full text-xs font-bold text-white shadow-[0_0_12px_rgba(34,197,94,0.6)]">
                            <span className="font-rum-raisin">92% Match</span>
                          </div>
                        </div>
                        <div className="flex -space-x-1">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="w-5 h-5 bg-white rounded-full border-2 border-[#FF7BAA]/60 flex items-center justify-center shadow-[0_0_8px_rgba(255,123,170,0.4)]">
                              <span className="text-xs">👤</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <h4 className="font-bold text-xl mb-1 text-shadow-lg line-clamp-1 font-rum-raisin">
                        {bounty.dishName}
                      </h4>
                      <p 
                        className="text-base opacity-90 cursor-pointer hover:underline mb-3 line-clamp-1 font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {bounty.restaurantName}
                      </p>

                      {/* Enhanced Reward Section */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA] to-[#FF4D88] rounded-full blur-md opacity-70"></div>
                            <div className="relative flex items-center gap-1 bg-gradient-to-r from-[#FF7BAA] to-[#FF4D88] px-2 py-1 rounded-full shadow-[0_0_12px_rgba(255,123,170,0.6)]">
                              <CoinsIcon className="w-3 h-3 text-white drop-shadow-lg fill-current" />
                              <span className="font-bold text-xs text-white font-rum-raisin">+{bounty.reward}</span>
                            </div>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FF1A75] to-[#B30026] rounded-full blur-md opacity-70"></div>
                            <div className="relative flex items-center gap-1 bg-gradient-to-r from-[#FF1A75] to-[#B30026] px-2 py-1 rounded-full shadow-[0_0_12px_rgba(255,26,117,0.6)]">
                              <LightningIcon className="w-3 h-3 text-white drop-shadow-lg" />
                              <span className="font-bold text-xs text-white font-rum-raisin">+50 XP</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="glossy-red-pill font-bold px-3 py-1 rounded-full text-xs shadow-[0_0_16px_rgba(255,123,170,0.7)] hover:shadow-[0_0_20px_rgba(255,123,170,0.9)] transition-all duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="font-rum-raisin">Accept</span>
                        </Button>
                      </div>
                    </div>

                    {/* Tap to flip hint */}
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-white/60 text-xs flex items-center gap-1">
                      <RotateCcwIcon className="w-3 h-3" />
                      <span>Tap to flip</span>
                    </div>
                  </Card>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                  <Card className="h-full overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border border-[#FF7BAA]/40 shadow-xl rounded-2xl p-4 text-white">
                    <div className="h-full flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-lg mb-3 text-center text-[#FF7BAA]">
                          Bounty Details
                        </h4>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#FF7BAA]" />
                            <span className="text-sm">0.8 miles away</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <StarIcon className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm">{bounty.rating} rating</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <UsersIcon className="w-4 h-4 text-green-400" />
                            <span className="text-sm">12 friends completed</span>
                          </div>
                        </div>

                        <div className="mt-3 p-2 bg-[#FF1A75]/20 rounded-lg">
                          <p className="text-xs text-[#FF7BAA] line-clamp-2">
                            "Amazing flavors and perfect spice level. Worth every coin!"
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <StarIcon key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 border-[#FF7BAA] text-[#FF7BAA] hover:bg-[#FF7BAA]/10 text-xs py-1"
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

      {/* Enhanced Local Bounties Grid */}
      <div className="space-y-4">
        <div className="text-center relative py-2">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#FF4D88]/40 to-transparent blur-sm"></div>
            <div className="w-20 h-0.5 bg-gradient-to-r from-[#FF4D88] via-[#FF1A75] to-[#B30026]"></div>
          </div>
          <h3 className="relative bg-gradient-to-r from-[#FF4D88] via-[#FF1A75] to-[#B30026] bg-clip-text text-transparent px-3 font-bold text-lg font-rum-raisin drop-shadow-lg">
            🎯 NEARBY ADVENTURES
          </h3>
        </div>
        
        {/* Mobile-optimized grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg sm:max-w-none mx-auto">
          {bounties.map((bounty, index) => (
            <div key={`local-${bounty.id}`} className="relative perspective-1000">
              {/* Enhanced Glow Effects */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF7BAA]/30 via-[#FF4D88]/35 to-[#FF1A75]/30 rounded-xl blur-lg opacity-60"></div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF4D88]/25 via-[#FF1A75]/30 to-[#B30026]/25 rounded-xl blur-md opacity-80"></div>
              
              <div 
                className="relative h-48 cursor-pointer group"
                onClick={() => onBountyClick?.(bounty)}
              >
                <Card className="h-full overflow-hidden bg-white/90 backdrop-blur-md border-2 border-[#FF7BAA]/30 shadow-[0_0_20px_rgba(255,123,170,0.2)] rounded-xl group-hover:shadow-[0_0_28px_rgba(255,123,170,0.3)] transition-all duration-300">
                  {/* Enhanced Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${foodImages[(index + 2) % foodImages.length]})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-[#FF1A75]/10 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF7BAA]/8 via-transparent to-[#FF4D88]/8"></div>
                  </div>

                  {/* Enhanced Difficulty Indicator */}
                  <div className="absolute top-2 left-2 z-10">
                    <div className="relative">
                      <div className={cn(
                        "absolute inset-0 rounded-full blur-md opacity-70",
                        bounty.difficulty === 'Easy' && "bg-emerald-400",
                        bounty.difficulty === 'Medium' && "bg-[#FF7BAA]",
                        bounty.difficulty === 'Hard' && "bg-[#FF1A75]"
                      )}></div>
                      <div className={cn(
                        "relative w-3 h-3 rounded-full border-2 border-white shadow-[0_0_12px_rgba(255,123,170,0.5)]",
                        bounty.difficulty === 'Easy' && "bg-emerald-400",
                        bounty.difficulty === 'Medium' && "bg-[#FF7BAA]",
                        bounty.difficulty === 'Hard' && "bg-[#FF1A75]"
                      )}></div>
                    </div>
                  </div>

                  {/* Enhanced Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white z-10">
                    <h4 className="font-bold text-base mb-1 line-clamp-1 font-rum-raisin">
                      {bounty.dishName}
                    </h4>
                    <p 
                      className="text-sm opacity-90 cursor-pointer hover:underline mb-2 line-clamp-1"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {bounty.restaurantName}
                    </p>
                    
                    <div className="flex items-center justify-between gap-1">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#FF1A75]/70 rounded-full blur-md"></div>
                        <div className="relative flex items-center gap-1 bg-[#FF1A75]/90 text-white px-2 py-1 rounded-full text-xs shadow-[0_0_12px_rgba(255,26,117,0.5)]">
                          <ClockIcon className="w-3 h-3 text-white drop-shadow-lg" />
                          <span className="font-medium font-rum-raisin">{bounty.timeRemaining}</span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#FF7BAA]/70 rounded-full blur-md"></div>
                        <div className="relative flex items-center gap-1 bg-[#FF7BAA]/90 text-white px-2 py-1 rounded-full text-xs shadow-[0_0_12px_rgba(255,123,170,0.5)]">
                          <span className="font-bold font-rum-raisin">+{bounty.reward}</span>
                          <CoinsIcon className="w-3 h-3 text-white drop-shadow-lg fill-current" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Accept Button */}
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA] to-[#FF4D88] rounded-full blur-md opacity-70"></div>
                      <Button 
                        size="sm" 
                        className="relative glossy-red-pill text-white px-2 py-1 text-xs rounded-full shadow-[0_0_16px_rgba(255,123,170,0.6)] hover:shadow-[0_0_20px_rgba(255,123,170,0.8)] transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="font-rum-raisin">Accept</span>
                      </Button>
                    </div>
                  </div>
                </Card>
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
    <div className="px-4 space-y-6 pb-6">
      {/* Enhanced Epic Quests */}
      <div className="space-y-4">
        <div className="space-y-4 max-w-lg mx-auto lg:max-w-none">
          {quests.map((quest, index) => (
            <div key={quest.id} className="relative">
              {/* Enhanced Multi-layer Glow Effects */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#FF1A75]/35 via-[#B30026]/45 to-[#8B0000]/35 rounded-3xl blur-xl opacity-60"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#B30026]/25 via-[#FF1A75]/30 to-[#8B0000]/25 rounded-3xl blur-lg opacity-80"></div>
              
              <Card 
                className="relative overflow-hidden bg-white/90 backdrop-blur-xl border-2 border-[#FF7BAA]/40 shadow-[0_0_28px_rgba(255,123,170,0.3)] rounded-3xl cursor-pointer hover:shadow-[0_0_36px_rgba(255,123,170,0.4)] transition-all duration-300"
                onClick={() => onQuestClick?.(quest)}
              >
                {/* Enhanced Quest Type Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="relative">
                    <div className={cn(
                      "absolute inset-0 rounded-full blur-md opacity-70",
                      quest.type === 'team' 
                        ? "bg-gradient-to-r from-[#FF1A75] to-[#B30026]" 
                        : "bg-gradient-to-r from-[#FF7BAA] to-[#FF4D88]"
                    )}></div>
                    <div className={cn(
                      "relative px-3 py-2 rounded-full text-white shadow-[0_0_16px_rgba(255,123,170,0.6)] border border-white/40 flex items-center gap-2",
                      quest.type === 'team' 
                        ? "bg-gradient-to-r from-[#FF1A75] to-[#B30026]" 
                        : "bg-gradient-to-r from-[#FF7BAA] to-[#FF4D88]"
                    )}>
                      {quest.type === 'team' ? (
                        <>
                          <UsersIcon className="w-4 h-4 text-white drop-shadow-lg" />
                          <span className="text-sm font-bold font-rum-raisin">TEAM</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheckIcon className="w-4 h-4 text-white drop-shadow-lg" />
                          <span className="text-sm font-bold font-rum-raisin">SOLO</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced Difficulty Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="relative">
                    <div className={cn(
                      "absolute inset-0 rounded-full blur-md opacity-70",
                      quest.difficulty === 'Easy' && "bg-gradient-to-r from-emerald-400 to-green-500",
                      quest.difficulty === 'Medium' && "bg-gradient-to-r from-[#FF7BAA] to-[#FF4D88]",
                      quest.difficulty === 'Hard' && "bg-gradient-to-r from-[#FF1A75] to-[#B30026]",
                      quest.difficulty === 'Extreme' && "bg-gradient-to-r from-[#B30026] to-[#8B0000]"
                    )}></div>
                    <div className={cn(
                      "relative px-3 py-1 rounded-full text-sm font-bold text-white shadow-[0_0_16px_rgba(255,123,170,0.5)] border border-white/40",
                      quest.difficulty === 'Easy' && "bg-gradient-to-r from-emerald-400 to-green-500",
                      quest.difficulty === 'Medium' && "bg-gradient-to-r from-[#FF7BAA] to-[#FF4D88]",
                      quest.difficulty === 'Hard' && "bg-gradient-to-r from-[#FF1A75] to-[#B30026]",
                      quest.difficulty === 'Extreme' && "bg-gradient-to-r from-[#B30026] to-[#8B0000]"
                    )}>
                      <span className="font-rum-raisin">{quest.difficulty}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Enhanced Quest Header */}
                  <div className="mb-4 pt-8">
                    <h4 className="font-bold text-xl mb-2 flex items-center font-rum-raisin">
                      <TrophyIcon className="w-5 h-5 text-[#FF7BAA] mr-2 flex-shrink-0 drop-shadow-lg" />
                      <span className="line-clamp-1">{quest.name}</span>
                    </h4>
                    <p className="text-gray-700 text-base leading-relaxed bg-gradient-to-r from-[#FF7BAA]/8 to-[#FF4D88]/8 rounded-lg p-3 border border-[#FF7BAA]/30 line-clamp-2">
                      {quest.description}
                    </p>
                  </div>

                  {/* Enhanced Quest Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {/* Reward */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA]/25 to-[#FF4D88]/25 rounded-xl blur-md"></div>
                      <div className="relative bg-gradient-to-r from-[#FF7BAA]/15 to-[#FF4D88]/15 rounded-xl p-3 border border-[#FF7BAA]/40 shadow-[0_0_16px_rgba(255,123,170,0.15)]">
                        <div className="flex items-center gap-2 mb-1">
                          <CoinsIcon className="w-4 h-4 text-[#FF1A75] flex-shrink-0 drop-shadow-lg fill-current" />
                          <span className="font-bold text-[#FF1A75] text-base font-rum-raisin">Epic Reward</span>
                        </div>
                        <div className="text-xl font-black text-[#B30026] font-rum-raisin">+{quest.reward} LKC</div>
                      </div>
                    </div>

                    {/* Locations */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF4D88]/25 to-[#FF1A75]/25 rounded-xl blur-md"></div>
                      <div className="relative bg-gradient-to-r from-[#FF4D88]/15 to-[#FF1A75]/15 rounded-xl p-3 border border-[#FF1A75]/40 shadow-[0_0_16px_rgba(255,26,117,0.15)]">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-[#FF1A75] flex-shrink-0 drop-shadow-lg" />
                          <span className="font-bold text-[#FF1A75] text-base font-rum-raisin">Journey</span>
                        </div>
                        <div className="text-xl font-black text-[#B30026] font-rum-raisin">{quest.locationCount} Places</div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Quest Footer */}
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA]/8 to-[#FF4D88]/8 rounded-xl blur-md"></div>
                    <div className="relative flex items-center justify-between bg-gradient-to-r from-white/70 to-white/90 rounded-xl p-3 border border-[#FF7BAA]/30 shadow-[0_0_12px_rgba(255,123,170,0.15)]">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-[#FF1A75] flex-shrink-0 drop-shadow-lg" />
                        <span className="text-sm font-medium text-[#FF1A75] font-rum-raisin">Time Limit</span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA]/30 to-[#FF1A75]/30 rounded-lg blur-md"></div>
                        <div className="relative flex items-center gap-2 bg-white rounded-lg px-3 py-1 shadow-[0_0_12px_rgba(255,123,170,0.3)] border border-[#FF7BAA]/30">
                          <ClockIcon className="w-3 h-3 text-[#FF1A75] flex-shrink-0 drop-shadow-lg" />
                          <span className="font-bold text-[#B30026] text-sm font-rum-raisin">{quest.timeLimit}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Action Button */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF7BAA] via-[#FF4D88] to-[#FF1A75] rounded-xl blur-lg opacity-50"></div>
                      <Button className="glossy-red-pill font-bold px-8 py-3 rounded-xl text-base shadow-[0_0_20px_rgba(255,123,170,0.7)] hover:shadow-[0_0_28px_rgba(255,123,170,0.9)] transition-all duration-300">
                        <LightningIcon className="w-4 h-4 mr-2 text-white drop-shadow-lg" />
                        <span className="font-rum-raisin">Accept Quest</span>
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