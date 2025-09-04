import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSwipeGestures } from '@/hooks/use-swipe-gestures';
import { useKV } from '@github/spark/hooks';
import { 
  ArrowLeftIcon as ArrowLeft, 
  HeartIcon as Heart, 
  XMarkIcon as X, 
  StarIcon as Star, 
  MapPinIcon as MapPin, 
  CurrencyDollarIcon as DollarSign,
  ClockIcon as Clock,
  UsersIcon as Users,
  AdjustmentsHorizontalIcon as Filter,
  TrophyIcon as Trophy,
  BoltIcon as Zap,
  ViewfinderCircleIcon as Target,
  EyeIcon as Eye,
  FireIcon as Fire,
  CheckIcon as Check,
  GiftIcon as Gift,
  BeakerIcon as Beaker,
  LightBulbIcon as Lightbulb,
  SparklesIcon as Sparkles,
  RocketLaunchIcon as Rocket,
  ShieldCheckIcon as Shield,
  TagIcon as Tag
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import likLogo from '@/assets/images/Lik_Logo_Heart_1.0.png';

interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  distance: string;
  priceRange: string;
  rating: number;
  description: string;
  menuHighlights: string[];
  hours: string;
  avgPrice: string;
  isFlipped?: boolean;
  bounty?: {
    id: string;
    title: string;
    reward: number;
    difficulty: 'easy' | 'medium' | 'hard';
    expiresIn: string;
  };
  quest?: {
    id: string;
    title: string;
    steps: number;
    reward: number;
    participants: number;
  };
  socialProof?: {
    friendsWhoLiked: string[];
    tasteMatch: number;
  };
  achievements?: string[];
}

interface SwipeDiscoveryPageProps {
  onBack: () => void;
}

const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Bella Italia',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
    cuisine: 'Italian',
    distance: '0.3 mi',
    priceRange: '$$',
    rating: 4.8,
    description: 'Authentic Italian cuisine with fresh pasta made daily',
    menuHighlights: ['Truffle Pasta', 'Margherita Pizza', 'Tiramisu'],
    hours: '11AM - 10PM',
    avgPrice: '$24',
    bounty: {
      id: 'b1',
      title: 'Try the Truffle Pasta',
      reward: 250,
      difficulty: 'medium',
      expiresIn: '2h 15m'
    },
    socialProof: {
      friendsWhoLiked: ['Alex', 'Sarah', 'Mike'],
      tasteMatch: 94
    },
    achievements: ['Hidden Gem', 'Chef\'s Pick']
  },
  {
    id: '2',
    name: 'Tokyo Ramen Bar',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    cuisine: 'Japanese',
    distance: '0.5 mi',
    priceRange: '$',
    rating: 4.6,
    description: 'Traditional ramen with rich, flavorful broths',
    menuHighlights: ['Tonkotsu Ramen', 'Gyoza', 'Miso Ramen'],
    hours: '5PM - 12AM',
    avgPrice: '$18',
    quest: {
      id: 'q1',
      title: 'Ramen Quest: Tokyo Trio',
      steps: 3,
      reward: 500,
      participants: 127
    },
    socialProof: {
      friendsWhoLiked: ['Emma', 'David'],
      tasteMatch: 87
    },
    achievements: ['Late Night Legend', 'Authentic Taste']
  },
  {
    id: '3',
    name: 'The Burger Joint',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    cuisine: 'American',
    distance: '0.8 mi',
    priceRange: '$$',
    rating: 4.4,
    description: 'Gourmet burgers with locally sourced ingredients',
    menuHighlights: ['Truffle Burger', 'Sweet Potato Fries', 'Milkshakes'],
    hours: '12PM - 11PM',
    avgPrice: '$16',
    bounty: {
      id: 'b2',
      title: 'Ultimate Burger Challenge',
      reward: 300,
      difficulty: 'hard',
      expiresIn: '4h 30m'
    },
    socialProof: {
      friendsWhoLiked: ['Chris', 'Lisa'],
      tasteMatch: 76
    },
    achievements: ['Local Favorite', 'Instagram Famous']
  },
  {
    id: '4',
    name: 'Spice Garden',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    cuisine: 'Indian',
    distance: '1.2 mi',
    priceRange: '$',
    rating: 4.7,
    description: 'Authentic Indian spices and traditional recipes',
    menuHighlights: ['Butter Chicken', 'Biryani', 'Naan Bread'],
    hours: '5PM - 10PM',
    avgPrice: '$22',
    quest: {
      id: 'q2',
      title: 'Spice Master Journey',
      steps: 5,
      reward: 750,
      participants: 89
    },
    socialProof: {
      friendsWhoLiked: ['Raj', 'Priya', 'Tom'],
      tasteMatch: 92
    },
    achievements: ['Spice Master', 'Vegetarian Paradise']
  },
  {
    id: '5',
    name: 'Ocean Fresh',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
    cuisine: 'Seafood',
    distance: '2.1 mi',
    priceRange: '$$$',
    rating: 4.9,
    description: 'Fresh catch daily with sustainable seafood practices',
    menuHighlights: ['Grilled Salmon', 'Lobster Roll', 'Fish Tacos'],
    hours: '4PM - 10PM',
    avgPrice: '$35',
    bounty: {
      id: 'b3',
      title: 'Catch of the Day Special',
      reward: 400,
      difficulty: 'easy',
      expiresIn: '6h 45m'
    },
    socialProof: {
      friendsWhoLiked: ['Marina', 'Jack'],
      tasteMatch: 83
    },
    achievements: ['Sustainable Choice', 'Premium Quality']
  }
];

const foodMoods = [
  { 
    id: 'adventure', 
    label: 'Adventure Mode', 
    icon: '🚀', 
    color: 'from-purple-500 to-pink-500',
    description: 'Try something completely new!'
  },
  { 
    id: 'comfort', 
    label: 'Comfort Craving', 
    icon: '🍲', 
    color: 'from-amber-500 to-orange-500',
    description: 'Warm, cozy, familiar flavors'
  },
  { 
    id: 'healthy', 
    label: 'Fresh & Light', 
    icon: '🥗', 
    color: 'from-green-500 to-emerald-500',
    description: 'Clean eating, energizing meals'
  },
  { 
    id: 'indulgent', 
    label: 'Treat Yourself', 
    icon: '🍰', 
    color: 'from-rose-500 to-pink-500',
    description: 'Life\'s too short for boring food'
  },
  { 
    id: 'social', 
    label: 'Squad Goals', 
    icon: '🍻', 
    color: 'from-blue-500 to-cyan-500',
    description: 'Perfect for sharing with friends'
  },
  { 
    id: 'date', 
    label: 'Date Night', 
    icon: '💕', 
    color: 'from-red-500 to-rose-500',
    description: 'Romantic ambiance & intimate dining'
  },
  { 
    id: 'quick', 
    label: 'Quick Bite', 
    icon: '⚡', 
    color: 'from-yellow-500 to-orange-500',
    description: 'Fast, delicious, on-the-go'
  },
  { 
    id: 'fancy', 
    label: 'Fine Dining', 
    icon: '🥂', 
    color: 'from-violet-500 to-purple-500',
    description: 'Sophisticated, upscale experiences'
  },
  { 
    id: 'spicy', 
    label: 'Heat Seeker', 
    icon: '🌶️', 
    color: 'from-red-500 to-orange-500',
    description: 'Bring on the fire!'
  },
  { 
    id: 'sweet', 
    label: 'Sweet Tooth', 
    icon: '🍭', 
    color: 'from-pink-400 to-rose-400',
    description: 'Desserts and sweet treats'
  },
  { 
    id: 'late-night', 
    label: 'Night Owl', 
    icon: '🌙', 
    color: 'from-indigo-500 to-blue-500',
    description: 'Late night cravings satisfied'
  },
  { 
    id: 'brunch', 
    label: 'Brunch Vibes', 
    icon: '🥞', 
    color: 'from-yellow-400 to-amber-500',
    description: 'Weekend breakfast perfection'
  }
];

const cuisinePreferences = [
  { 
    id: 'american', 
    label: 'American', 
    icon: '🍔', 
    color: 'from-red-400 to-blue-400',
    description: 'Classic comfort food'
  },
  { 
    id: 'italian', 
    label: 'Italian', 
    icon: '🍝', 
    color: 'from-green-500 to-red-500',
    description: 'Pasta, pizza, perfection'
  },
  { 
    id: 'asian', 
    label: 'Asian Fusion', 
    icon: '🍜', 
    color: 'from-red-500 to-yellow-500',
    description: 'Bold flavors, fresh ingredients'
  },
  { 
    id: 'mexican', 
    label: 'Mexican', 
    icon: '🌮', 
    color: 'from-green-500 to-red-500',
    description: 'Vibrant, spicy, authentic'
  },
  { 
    id: 'indian', 
    label: 'Indian', 
    icon: '🍛', 
    color: 'from-orange-500 to-red-500',
    description: 'Rich spices and curries'
  },
  { 
    id: 'mediterranean', 
    label: 'Mediterranean', 
    icon: '🫒', 
    color: 'from-blue-500 to-green-500',
    description: 'Fresh, healthy, flavorful'
  },
  { 
    id: 'japanese', 
    label: 'Japanese', 
    icon: '🍣', 
    color: 'from-red-500 to-pink-500',
    description: 'Sushi, ramen, precision'
  },
  { 
    id: 'french', 
    label: 'French', 
    icon: '🥐', 
    color: 'from-blue-500 to-red-500',
    description: 'Elegant, refined, classic'
  },
  { 
    id: 'thai', 
    label: 'Thai', 
    icon: '🍛', 
    color: 'from-green-500 to-orange-500',
    description: 'Sweet, sour, spicy harmony'
  },
  { 
    id: 'chinese', 
    label: 'Chinese', 
    icon: '🥟', 
    color: 'from-red-500 to-yellow-500',
    description: 'Traditional and modern'
  },
  { 
    id: 'bbq', 
    label: 'BBQ & Grill', 
    icon: '🔥', 
    color: 'from-orange-500 to-red-500',
    description: 'Smoky, grilled perfection'
  },
  { 
    id: 'seafood', 
    label: 'Seafood', 
    icon: '🦞', 
    color: 'from-blue-400 to-teal-500',
    description: 'Fresh catch daily'
  }
];

const dietaryPreferences = [
  { 
    id: 'vegetarian', 
    label: 'Vegetarian', 
    icon: '🌱', 
    color: 'from-green-400 to-emerald-500',
    description: 'Plant-based goodness'
  },
  { 
    id: 'vegan', 
    label: 'Vegan', 
    icon: '🥬', 
    color: 'from-green-500 to-lime-500',
    description: 'Completely plant-based'
  },
  { 
    id: 'gluten-free', 
    label: 'Gluten-Free', 
    icon: '🌾', 
    color: 'from-yellow-400 to-amber-500',
    description: 'Safe for celiac diets'
  },
  { 
    id: 'keto', 
    label: 'Keto-Friendly', 
    icon: '🥑', 
    color: 'from-green-400 to-teal-500',
    description: 'Low-carb, high-fat options'
  },
  { 
    id: 'halal', 
    label: 'Halal', 
    icon: '☪️', 
    color: 'from-emerald-500 to-green-600',
    description: 'Halal-certified cuisine'
  },
  { 
    id: 'kosher', 
    label: 'Kosher', 
    icon: '✡️', 
    color: 'from-blue-500 to-indigo-500',
    description: 'Kosher-certified options'
  },
  { 
    id: 'paleo', 
    label: 'Paleo', 
    icon: '🦴', 
    color: 'from-orange-400 to-red-500',
    description: 'Whole foods, no processed'
  },
  { 
    id: 'low-sodium', 
    label: 'Low Sodium', 
    icon: '🧂', 
    color: 'from-blue-400 to-cyan-500',
    description: 'Heart-healthy choices'
  }
];

const ambientPreferences = [
  { 
    id: 'quiet', 
    label: 'Quiet & Cozy', 
    icon: '🤫', 
    color: 'from-slate-400 to-gray-500',
    description: 'Peaceful dining atmosphere'
  },
  { 
    id: 'lively', 
    label: 'Lively & Fun', 
    icon: '🎉', 
    color: 'from-orange-500 to-pink-500',
    description: 'Energetic, buzzing vibe'
  },
  { 
    id: 'romantic', 
    label: 'Romantic', 
    icon: '💝', 
    color: 'from-rose-400 to-pink-500',
    description: 'Perfect for couples'
  },
  { 
    id: 'family', 
    label: 'Family-Friendly', 
    icon: '👨‍👩‍👧‍👦', 
    color: 'from-blue-400 to-green-400',
    description: 'Great for kids and families'
  },
  { 
    id: 'trendy', 
    label: 'Trendy & Hip', 
    icon: '✨', 
    color: 'from-purple-500 to-pink-500',
    description: 'Instagram-worthy spots'
  },
  { 
    id: 'outdoor', 
    label: 'Outdoor Seating', 
    icon: '🌳', 
    color: 'from-green-400 to-emerald-500',
    description: 'Al fresco dining'
  }
];

const discoveryModes = [
  {
    id: 'bounty-hunter',
    title: 'Bounty Hunter',
    icon: '🎯',
    description: 'Hunt for food bounties with epic rewards',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'quest-master',
    title: 'Quest Master',
    icon: '⚔️',
    description: 'Join multi-restaurant food quests',
    color: 'from-purple-500 to-blue-500'
  },
  {
    id: 'flavor-scout',
    title: 'Flavor Scout',
    icon: '🔍',
    description: 'Discover hidden culinary gems',
    color: 'from-green-500 to-teal-500'
  },
  {
    id: 'social-explorer',
    title: 'Social Explorer',
    icon: '👥',
    description: 'Follow friends\' recommendations',
    color: 'from-pink-500 to-purple-500'
  }
];

export function SwipeDiscoveryPage({ onBack }: SwipeDiscoveryPageProps) {
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | 'down' | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [selectedMood, setSelectedMood] = useKV('selected-mood', null as string | null);
  const [selectedCuisine, setSelectedCuisine] = useKV('selected-cuisine', [] as string[]);
  const [selectedDietary, setSelectedDietary] = useKV('selected-dietary', [] as string[]);
  const [selectedAmbient, setSelectedAmbient] = useKV('selected-ambient', [] as string[]);
  const [selectedMode, setSelectedMode] = useState<string>('bounty-hunter');
  const [activePreferenceTab, setActivePreferenceTab] = useState<'mood' | 'cuisine' | 'dietary' | 'ambient'>('mood');
  const [discoveryStreak, setDiscoveryStreak] = useKV('discovery-streak', 0);
  const [totalDiscoveries, setTotalDiscoveries] = useKV('total-discoveries', 0);
  const [savedRestaurants, setSavedRestaurants] = useKV('saved-restaurants', [] as string[]);
  const [acceptedBounties, setAcceptedBounties] = useKV('accepted-bounties', [] as string[]);
  const [joinedQuests, setJoinedQuests] = useKV('joined-quests', [] as string[]);
  const [xpPoints, setXpPoints] = useKV('xp-points', 2450);
  const [likCoins, setLikCoins] = useKV('lik-coins', 1250);
  const [showRoulette, setShowRoulette] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [swipeTogetherMode, setSwipeTogetherMode] = useState(false);
  const [showBountyAccepted, setShowBountyAccepted] = useState(false);
  const [showQuestJoined, setShowQuestJoined] = useState(false);
  const [currentCombo, setCurrentCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useKV('max-combo', 0);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const currentRestaurant = restaurants[currentIndex];
  
  const xpProgress = (xpPoints % 1000);
  const level = Math.floor(xpPoints / 1000) + 1;

  // Combo system for consecutive right swipes
  useEffect(() => {
    if (currentCombo > maxCombo) {
      setMaxCombo(currentCombo);
    }
  }, [currentCombo, maxCombo, setMaxCombo]);

  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (!currentRestaurant) return;
    
    setSwipeDirection(direction);
    
    // Handle different swipe actions based on discovery mode
    switch (direction) {
      case 'left': // Not interested
        setCurrentCombo(0);
        setXpPoints(prev => prev + 5);
        break;
      case 'right': // Explore restaurant
        setCurrentCombo(prev => prev + 1);
        setXpPoints(prev => prev + 15 + (currentCombo * 5)); // Combo bonus
        if (currentRestaurant.bounty) {
          setAcceptedBounties(prev => [...prev, currentRestaurant.bounty!.id]);
          setLikCoins(prev => prev + currentRestaurant.bounty!.reward);
          setShowBountyAccepted(true);
          setTimeout(() => setShowBountyAccepted(false), 2000);
        }
        if (currentRestaurant.quest) {
          setJoinedQuests(prev => [...prev, currentRestaurant.quest!.id]);
          setShowQuestJoined(true);
          setTimeout(() => setShowQuestJoined(false), 2000);
        }
        break;
      case 'up': // Save for later / favorite
        setSavedRestaurants(prev => [...prev, currentRestaurant.id]);
        setCurrentCombo(prev => prev + 1);
        setXpPoints(prev => prev + 10 + (currentCombo * 3));
        break;
      case 'down': // Quick skip with small penalty
        setCurrentCombo(0);
        setXpPoints(prev => Math.max(0, prev - 2));
        break;
    }
    
    // Update discovery stats
    setTotalDiscoveries(prev => prev + 1);
    setDiscoveryStreak(prev => direction === 'left' || direction === 'down' ? 0 : prev + 1);
    
    // Move to next card after animation
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % restaurants.length);
      setSwipeDirection(null);
      setIsFlipped(false);
    }, 300);
  };

  const swipeHandlers = useSwipeGestures({
    onSwipeLeft: () => handleSwipe('left'),
    onSwipeRight: () => handleSwipe('right'),
    onSwipeUp: () => handleSwipe('up'),
    onSwipeDown: () => handleSwipe('down'),
    threshold: 50
  });

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDoubleClick = () => {
    handleSwipe('up');
  };

  const handleRouletteSpin = () => {
    setIsSpinning(true);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * restaurants.length);
      setCurrentIndex(randomIndex);
      setIsSpinning(false);
      setShowRoulette(false);
      setXpPoints(prev => prev + 25);
      setLikCoins(prev => prev + 50);
    }, 2000);
  };

  const selectMood = (moodId: string) => {
    setSelectedMood(moodId);
    setXpPoints(prev => prev + 10);
  };

  const toggleCuisine = (cuisineId: string) => {
    setSelectedCuisine(prev => 
      prev.includes(cuisineId) 
        ? prev.filter(id => id !== cuisineId)
        : [...prev, cuisineId]
    );
    setXpPoints(prev => prev + 5);
  };

  const toggleDietary = (dietaryId: string) => {
    setSelectedDietary(prev => 
      prev.includes(dietaryId) 
        ? prev.filter(id => id !== dietaryId)
        : [...prev, dietaryId]
    );
    setXpPoints(prev => prev + 5);
  };

  const toggleAmbient = (ambientId: string) => {
    setSelectedAmbient(prev => 
      prev.includes(ambientId) 
        ? prev.filter(id => id !== ambientId)
        : [...prev, ambientId]
    );
    setXpPoints(prev => prev + 5);
  };

  const clearAllPreferences = () => {
    setSelectedMood(null);
    setSelectedCuisine([]);
    setSelectedDietary([]);
    setSelectedAmbient([]);
  };

  const applyPreferences = () => {
    setShowMoodSelector(false);
    setXpPoints(prev => prev + 25); // Bonus for applying preferences
  };

  const selectMode = (modeId: string) => {
    setSelectedMode(modeId);
    setShowModeSelector(false);
    setXpPoints(prev => prev + 15);
  };

  if (!currentRestaurant) {
    return (
      <div className="h-full bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="text-8xl mb-6 animate-bounce">🏆</div>
          <h2 className="text-3xl font-bold mb-4 font-rum-raisin bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Discovery Complete!
          </h2>
          <p className="text-muted-foreground mb-6 text-lg">
            You've conquered all nearby culinary adventures! Your taste buds are legendary.
          </p>
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/40 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Discovery Master</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Zap className="h-5 w-5 text-blue-500" />
                <span className="font-medium">+{totalDiscoveries * 15} XP Earned</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <img src={likLogo} alt="Lik Coins" className="w-5 h-5" />
                <span className="font-medium">{likCoins} Lik Coins Collected</span>
              </div>
            </div>
            <Button onClick={onBack} className="glossy-red-pill w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Adventure Hub
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-pink-300/30 to-red-300/30 rounded-full blur-xl animate-float" />
        <div className="absolute top-32 right-16 w-16 h-16 bg-gradient-to-br from-orange-300/30 to-yellow-300/30 rounded-full blur-lg animate-float delay-1000" />
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-xl animate-float delay-2000" />
        <div className="absolute bottom-20 right-12 w-14 h-14 bg-gradient-to-br from-rose-300/30 to-red-300/30 rounded-full blur-lg animate-float delay-500" />
        
        {/* Floating Food Icons */}
        <div className="absolute top-24 right-32 text-2xl animate-float delay-1500">🍕</div>
        <div className="absolute top-64 left-32 text-2xl animate-float delay-3000">🍜</div>
        <div className="absolute bottom-32 right-24 text-2xl animate-float delay-2500">🍔</div>
      </div>

      {/* Gamified Header */}
      <div className="relative z-30 bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-lg border-b-2 border-white/60 shadow-lg">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-white/60 shadow-md">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <img src={likLogo} alt="Lik" className="w-7 h-7" />
            <div className="text-center">
              <div className="font-rum-raisin text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Discovery Arena
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                {discoveryModes.find(m => m.id === selectedMode)?.title || 'Adventure Mode'}
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" onClick={() => setShowModeSelector(true)} className="rounded-full hover:bg-white/60 shadow-md">
            <Target className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Adventure Stats Bar */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Level & XP */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full border border-white/80">
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                  {level}
                </div>
              </div>
              <div className="text-xs">
                <span className="font-bold text-primary">Lv.{level}</span>
                <div className="w-12 bg-gray-200 rounded-full h-1 mt-0.5">
                  <div className="bg-gradient-to-r from-primary to-secondary h-1 rounded-full" style={{ width: `${(xpProgress / 10)}%` }}></div>
                </div>
              </div>
            </div>
            
            {/* Lik Coins */}
            <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-1 rounded-full border border-white/80">
              <img src={likLogo} alt="Lik Coins" className="w-4 h-4" />
              <span className="text-xs font-bold text-orange-600">{likCoins.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Discovery Streak */}
          <div className="flex items-center gap-3">
            {currentCombo > 0 && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                {currentCombo}x COMBO!
              </div>
            )}
            <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
              <Fire className="h-3 w-3" />
              <span className="text-xs font-bold">{discoveryStreak}</span>
            </div>
          </div>
        </div>

        {/* Active Preferences Display */}
        {(selectedMood || selectedCuisine.length > 0 || selectedDietary.length > 0 || selectedAmbient.length > 0) && (
          <div className="px-4 pb-3">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-3 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-3 w-3 text-blue-600" />
                <span className="text-xs font-medium text-blue-600">Active Preferences</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedMood && (
                  <Badge className="bg-primary/10 text-primary border-0 text-xs">
                    {foodMoods.find(m => m.id === selectedMood)?.icon} {foodMoods.find(m => m.id === selectedMood)?.label}
                  </Badge>
                )}
                {selectedCuisine.map(id => (
                  <Badge key={id} className="bg-orange-100 text-orange-600 border-0 text-xs">
                    {cuisinePreferences.find(c => c.id === id)?.icon} {cuisinePreferences.find(c => c.id === id)?.label}
                  </Badge>
                ))}
                {selectedDietary.map(id => (
                  <Badge key={id} className="bg-green-100 text-green-600 border-0 text-xs">
                    {dietaryPreferences.find(d => d.id === id)?.icon} {dietaryPreferences.find(d => d.id === id)?.label}
                  </Badge>
                ))}
                {selectedAmbient.map(id => (
                  <Badge key={id} className="bg-purple-100 text-purple-600 border-0 text-xs">
                    {ambientPreferences.find(a => a.id === id)?.icon} {ambientPreferences.find(a => a.id === id)?.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Adventure Card */}
      <div className="flex-1 flex items-center justify-center p-6 pt-4">
        <div 
          ref={cardRef}
          {...swipeHandlers}
          className={cn(
            "relative w-full max-w-sm h-[520px] perspective-1000 cursor-grab active:cursor-grabbing",
            swipeDirection === 'left' && "animate-swipe-left",
            swipeDirection === 'right' && "animate-swipe-right", 
            swipeDirection === 'up' && "animate-swipe-up",
            swipeDirection === 'down' && "animate-swipe-down"
          )}
          onClick={handleCardFlip}
          onDoubleClick={handleDoubleClick}
        >
          <Card className={cn(
            "absolute inset-0 transform-style-preserve-3d transition-transform duration-700 overflow-hidden bg-white border-4 border-white/80 shadow-2xl rounded-3xl",
            isFlipped && "rotate-y-180"
          )}>
            {/* Front of Adventure Card */}
            <div className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden">
              <div 
                className="h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${currentRestaurant.image})` }}
              >
                {/* Enhanced Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                
                {/* Adventure Badges */}
                <div className="absolute top-4 left-4 right-4 space-y-3">
                  {/* Main Info Row */}
                  <div className="flex justify-between items-start">
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-white/95 text-black border-0 font-medium px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                        {currentRestaurant.cuisine} 🍽️
                      </Badge>
                      <Badge className="bg-white/95 text-black border-0 font-medium px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        {currentRestaurant.distance}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full shadow-lg">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-bold">{currentRestaurant.rating}</span>
                    </div>
                  </div>
                  
                  {/* Special Adventure Tags */}
                  <div className="flex flex-wrap gap-2">
                    {currentRestaurant.achievements?.map((achievement) => (
                      <Badge key={achievement} className="bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white border-0 font-medium px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                        🏆 {achievement}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Bounty/Quest Alert */}
                  {currentRestaurant.bounty && (
                    <div className="bg-gradient-to-r from-red-500/95 to-orange-500/95 text-white px-4 py-2 rounded-2xl shadow-xl backdrop-blur-sm border border-white/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4" />
                        <span className="font-bold text-sm">ACTIVE BOUNTY</span>
                        <div className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-bold",
                          currentRestaurant.bounty.difficulty === 'easy' && "bg-green-500",
                          currentRestaurant.bounty.difficulty === 'medium' && "bg-yellow-500",
                          currentRestaurant.bounty.difficulty === 'hard' && "bg-red-500"
                        )}>
                          {currentRestaurant.bounty.difficulty.toUpperCase()}
                        </div>
                      </div>
                      <div className="text-sm">{currentRestaurant.bounty.title}</div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <img src={likLogo} alt="Lik Coins" className="w-4 h-4" />
                          <span className="font-bold">+{currentRestaurant.bounty.reward}</span>
                        </div>
                        <div className="text-xs opacity-90">⏰ {currentRestaurant.bounty.expiresIn}</div>
                      </div>
                    </div>
                  )}
                  
                  {currentRestaurant.quest && (
                    <div className="bg-gradient-to-r from-purple-500/95 to-blue-500/95 text-white px-4 py-2 rounded-2xl shadow-xl backdrop-blur-sm border border-white/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="h-4 w-4" />
                        <span className="font-bold text-sm">EPIC QUEST</span>
                        <div className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                          {currentRestaurant.quest.participants} joined
                        </div>
                      </div>
                      <div className="text-sm">{currentRestaurant.quest.title}</div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs">{currentRestaurant.quest.steps} locations</div>
                        <div className="flex items-center gap-1">
                          <img src={likLogo} alt="Lik Coins" className="w-4 h-4" />
                          <span className="font-bold">+{currentRestaurant.quest.reward}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Main Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-3xl font-bold mb-3 text-shadow-lg font-rum-raisin">
                    {currentRestaurant.name}
                  </h2>
                  <p className="text-white/90 mb-4 text-shadow leading-relaxed">
                    {currentRestaurant.description}
                  </p>
                  
                  {/* Social Proof */}
                  {currentRestaurant.socialProof && (
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          <div className="flex -space-x-1">
                            {currentRestaurant.socialProof.friendsWhoLiked.slice(0, 3).map((friend, i) => (
                              <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-secondary border border-white flex items-center justify-center text-white text-xs font-bold">
                                {friend[0]}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs">+{currentRestaurant.socialProof.friendsWhoLiked.length} friends</span>
                        </div>
                        <div className="bg-gradient-to-r from-green-400 to-emerald-500 px-3 py-1 rounded-full text-xs font-bold">
                          {currentRestaurant.socialProof.tasteMatch}% match
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Open Now</span>
                    </div>
                    
                    <div className="text-xs text-white/70 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                      Tap to explore • Double tap ❤️
                    </div>
                  </div>
                </div>

                {/* Magical Effects */}
                <div className="absolute top-20 right-8 text-yellow-300 animate-sparkle">✨</div>
                <div className="absolute bottom-32 left-8 text-pink-300 animate-sparkle delay-1000">💫</div>
                {currentRestaurant.bounty && (
                  <div className="absolute top-1/3 right-4 text-orange-400 animate-bounce">🎯</div>
                )}
                {currentRestaurant.quest && (
                  <div className="absolute top-1/2 left-4 text-purple-400 animate-pulse">⚔️</div>
                )}
              </div>
            </div>

            {/* Back of Adventure Card */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-white via-gray-50 to-pink-50 p-6 rounded-3xl">
              <div className="h-full flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2 font-rum-raisin bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {currentRestaurant.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {currentRestaurant.description}
                  </p>
                </div>

                {/* Adventure Details */}
                <div className="mb-6">
                  <h4 className="font-bold mb-4 text-lg flex items-center gap-2">
                    <span className="text-xl">🍽️</span>
                    Adventure Menu
                  </h4>
                  <div className="space-y-3">
                    {currentRestaurant.menuHighlights.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-white to-pink-50 rounded-xl border border-pink-100 shadow-sm">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                          <span className="text-sm">⭐</span>
                        </div>
                        <span className="font-medium text-gray-800">{item}</span>
                        <div className="ml-auto">
                          <Badge className="bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-0 text-xs">
                            Signature
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Adventure Stats */}
                <div className="mt-auto space-y-4">
                  <div className="bg-gradient-to-r from-gray-50 to-pink-50 p-4 rounded-2xl border border-pink-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">{currentRestaurant.hours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Avg {currentRestaurant.avgPrice}</span>
                      </div>
                    </div>
                    
                    {/* Adventure Actions Guide */}
                    <div className="bg-white/80 p-3 rounded-xl space-y-2">
                      <div className="text-xs font-medium text-center text-primary mb-2">Adventure Controls</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">→</div>
                          <span>Accept</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">←</div>
                          <span>Skip</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 bg-pink-100 rounded-full flex items-center justify-center">↑</div>
                          <span>Save</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center">↓</div>
                          <span>Quick Skip</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Enhanced Adventure Feedback Icons */}
          <div className={cn(
            "absolute top-1/2 left-6 transform -translate-y-1/2 transition-all duration-300 z-10",
            swipeDirection === 'left' ? "opacity-100 scale-110" : "opacity-0 scale-90"
          )}>
            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-full p-6 text-white shadow-2xl border-4 border-white">
              <X className="h-10 w-10" />
            </div>
            <div className="text-center mt-2 font-bold text-red-600 text-sm bg-white/90 px-3 py-1 rounded-full">
              Skip Adventure
            </div>
          </div>
          
          <div className={cn(
            "absolute top-1/2 right-6 transform -translate-y-1/2 transition-all duration-300 z-10",
            swipeDirection === 'right' ? "opacity-100 scale-110" : "opacity-0 scale-90"
          )}>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-6 text-white shadow-2xl border-4 border-white">
              <Rocket className="h-10 w-10" />
            </div>
            <div className="text-center mt-2 font-bold text-green-600 text-sm bg-white/90 px-3 py-1 rounded-full">
              Start Adventure
            </div>
          </div>
          
          <div className={cn(
            "absolute top-6 left-1/2 transform -translate-x-1/2 transition-all duration-300 z-10",
            swipeDirection === 'up' ? "opacity-100 scale-110" : "opacity-0 scale-90"
          )}>
            <div className="bg-gradient-to-br from-primary to-secondary rounded-full p-6 text-white shadow-2xl border-4 border-white">
              <Heart className="h-10 w-10" />
            </div>
            <div className="text-center mt-2 font-bold text-primary text-sm bg-white/90 px-3 py-1 rounded-full">
              Save Quest
            </div>
          </div>
          
          <div className={cn(
            "absolute bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-300 z-10",
            swipeDirection === 'down' ? "opacity-100 scale-110" : "opacity-0 scale-90"
          )}>
            <div className="bg-gradient-to-br from-gray-500 to-slate-600 rounded-full p-4 text-white shadow-2xl border-4 border-white">
              <Zap className="h-8 w-8" />
            </div>
            <div className="text-center mt-2 font-bold text-gray-600 text-sm bg-white/90 px-3 py-1 rounded-full">
              Quick Skip
            </div>
          </div>
        </div>
      </div>

      {/* Adventure Action Buttons */}
      <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-14 h-14 bg-white/95 backdrop-blur-sm border-2 border-red-200 hover:bg-red-50 shadow-xl transition-all duration-200 hover:scale-110"
          onClick={() => handleSwipe('left')}
        >
          <X className="h-6 w-6 text-red-500" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-16 h-16 bg-white/95 backdrop-blur-sm border-2 border-primary/30 hover:bg-primary/5 shadow-xl transition-all duration-200 hover:scale-110"
          onClick={() => handleSwipe('up')}
        >
          <Heart className="h-7 w-7 text-primary" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-14 h-14 bg-white/95 backdrop-blur-sm border-2 border-green-200 hover:bg-green-50 shadow-xl transition-all duration-200 hover:scale-110"
          onClick={() => handleSwipe('right')}
        >
          <Rocket className="h-6 w-6 text-green-500" />
        </Button>
      </div>

      {/* Adventure Roulette */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        <Button
          onClick={() => setShowMoodSelector(true)}
          className={cn(
            "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl border-2 border-white/40 relative",
            (selectedMood || selectedCuisine.length > 0 || selectedDietary.length > 0 || selectedAmbient.length > 0) && "ring-2 ring-yellow-400"
          )}
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Preferences
          {(selectedMood || selectedCuisine.length > 0 || selectedDietary.length > 0 || selectedAmbient.length > 0) && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          )}
        </Button>
        
        <Button
          onClick={() => setShowRoulette(true)}
          className="glossy-red-pill px-8 py-4 text-lg font-bold flex items-center gap-3 shadow-xl"
        >
          <Target className="h-5 w-5" />
          <img src={likLogo} alt="Lik" className="w-5 h-5" />
          Adventure Roulette
        </Button>
      </div>

      {/* Bounty Accepted Notification */}
      {showBountyAccepted && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-fadeIn">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-3xl shadow-2xl border-4 border-white flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-lg">Bounty Accepted!</div>
              <div className="text-sm opacity-90">+{currentRestaurant.bounty?.reward} Lik Coins</div>
            </div>
            <div className="animate-bounce">🎯</div>
          </div>
        </div>
      )}

      {/* Quest Joined Notification */}
      {showQuestJoined && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-fadeIn">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-3xl shadow-2xl border-4 border-white flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-lg">Quest Joined!</div>
              <div className="text-sm opacity-90">Epic adventure awaits</div>
            </div>
            <div className="animate-bounce">⚔️</div>
          </div>
        </div>
      )}

      {/* Enhanced Multi-Category Preference Selector Modal */}
      {showMoodSelector && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg bg-white/95 backdrop-blur-md border-2 border-white/60 shadow-2xl rounded-3xl overflow-hidden max-h-[90vh]">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-2xl font-bold font-rum-raisin bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Customize Your Adventure
                </h3>
                <p className="text-muted-foreground text-sm mt-2">
                  Tell us what you're craving and we'll match you perfectly
                </p>
              </div>

              {/* Preference Category Tabs */}
              <div className="flex mb-6 bg-gray-100 rounded-2xl p-1">
                {[
                  { id: 'mood', label: 'Mood', icon: '😋' },
                  { id: 'cuisine', label: 'Cuisine', icon: '🍽️' },
                  { id: 'dietary', label: 'Dietary', icon: '🌱' },
                  { id: 'ambient', label: 'Vibe', icon: '✨' }
                ].map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activePreferenceTab === tab.id ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex-1 rounded-xl transition-all duration-200",
                      activePreferenceTab === tab.id 
                        ? "bg-white shadow-md font-bold" 
                        : "hover:bg-white/50"
                    )}
                    onClick={() => setActivePreferenceTab(tab.id as any)}
                  >
                    <span className="mr-1">{tab.icon}</span>
                    <span className="text-xs">{tab.label}</span>
                  </Button>
                ))}
              </div>

              {/* Scrollable Content Area */}
              <div className="max-h-80 overflow-y-auto scrollbar-hide mb-6">
                {/* Food Mood Tab */}
                {activePreferenceTab === 'mood' && (
                  <div className="grid grid-cols-2 gap-3">
                    {foodMoods.map((mood) => (
                      <Button
                        key={mood.id}
                        variant="outline"
                        className={cn(
                          "h-24 flex-col gap-2 border-2 border-white/60 bg-white/80 hover:bg-white/90 transition-all duration-300 hover:scale-105 rounded-2xl p-3",
                          selectedMood === mood.id && "ring-2 ring-primary ring-offset-2 bg-primary/5"
                        )}
                        onClick={() => selectMood(mood.id)}
                      >
                        <span className="text-2xl mb-1">{mood.icon}</span>
                        <span className="text-xs font-bold text-center leading-tight">{mood.label}</span>
                        <span className="text-xs text-muted-foreground text-center leading-tight">{mood.description}</span>
                      </Button>
                    ))}
                  </div>
                )}

                {/* Cuisine Preferences Tab */}
                {activePreferenceTab === 'cuisine' && (
                  <div className="grid grid-cols-2 gap-3">
                    {cuisinePreferences.map((cuisine) => (
                      <Button
                        key={cuisine.id}
                        variant="outline"
                        className={cn(
                          "h-20 flex-col gap-1 border-2 border-white/60 bg-white/80 hover:bg-white/90 transition-all duration-300 hover:scale-105 rounded-2xl p-3",
                          selectedCuisine.includes(cuisine.id) && "ring-2 ring-primary ring-offset-2 bg-primary/10"
                        )}
                        onClick={() => toggleCuisine(cuisine.id)}
                      >
                        <span className="text-xl mb-1">{cuisine.icon}</span>
                        <span className="text-xs font-bold text-center leading-tight">{cuisine.label}</span>
                        <span className="text-xs text-muted-foreground text-center leading-tight">{cuisine.description}</span>
                        {selectedCuisine.includes(cuisine.id) && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Dietary Preferences Tab */}
                {activePreferenceTab === 'dietary' && (
                  <div className="grid grid-cols-2 gap-3">
                    {dietaryPreferences.map((dietary) => (
                      <Button
                        key={dietary.id}
                        variant="outline"
                        className={cn(
                          "h-20 flex-col gap-1 border-2 border-white/60 bg-white/80 hover:bg-white/90 transition-all duration-300 hover:scale-105 rounded-2xl p-3 relative",
                          selectedDietary.includes(dietary.id) && "ring-2 ring-primary ring-offset-2 bg-primary/10"
                        )}
                        onClick={() => toggleDietary(dietary.id)}
                      >
                        <span className="text-xl mb-1">{dietary.icon}</span>
                        <span className="text-xs font-bold text-center leading-tight">{dietary.label}</span>
                        <span className="text-xs text-muted-foreground text-center leading-tight">{dietary.description}</span>
                        {selectedDietary.includes(dietary.id) && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Ambient Preferences Tab */}
                {activePreferenceTab === 'ambient' && (
                  <div className="grid grid-cols-2 gap-3">
                    {ambientPreferences.map((ambient) => (
                      <Button
                        key={ambient.id}
                        variant="outline"
                        className={cn(
                          "h-20 flex-col gap-1 border-2 border-white/60 bg-white/80 hover:bg-white/90 transition-all duration-300 hover:scale-105 rounded-2xl p-3 relative",
                          selectedAmbient.includes(ambient.id) && "ring-2 ring-primary ring-offset-2 bg-primary/10"
                        )}
                        onClick={() => toggleAmbient(ambient.id)}
                      >
                        <span className="text-xl mb-1">{ambient.icon}</span>
                        <span className="text-xs font-bold text-center leading-tight">{ambient.label}</span>
                        <span className="text-xs text-muted-foreground text-center leading-tight">{ambient.description}</span>
                        {selectedAmbient.includes(ambient.id) && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Preferences Summary */}
              <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                <div className="text-xs font-medium text-center text-blue-600 mb-2">Your Selections</div>
                <div className="flex flex-wrap gap-1 justify-center">
                  {selectedMood && (
                    <Badge className="bg-primary/10 text-primary border-0 text-xs">
                      {foodMoods.find(m => m.id === selectedMood)?.label}
                    </Badge>
                  )}
                  {selectedCuisine.map(id => (
                    <Badge key={id} className="bg-orange-100 text-orange-600 border-0 text-xs">
                      {cuisinePreferences.find(c => c.id === id)?.label}
                    </Badge>
                  ))}
                  {selectedDietary.map(id => (
                    <Badge key={id} className="bg-green-100 text-green-600 border-0 text-xs">
                      {dietaryPreferences.find(d => d.id === id)?.label}
                    </Badge>
                  ))}
                  {selectedAmbient.map(id => (
                    <Badge key={id} className="bg-purple-100 text-purple-600 border-0 text-xs">
                      {ambientPreferences.find(a => a.id === id)?.label}
                    </Badge>
                  ))}
                  {!selectedMood && selectedCuisine.length === 0 && selectedDietary.length === 0 && selectedAmbient.length === 0 && (
                    <span className="text-xs text-muted-foreground">No preferences selected</span>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-2xl border-2 border-gray-200 hover:bg-gray-50 text-xs" 
                  onClick={() => setShowMoodSelector(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="ghost"
                  className="rounded-2xl hover:bg-red-50 text-red-600 text-xs"
                  onClick={clearAllPreferences}
                >
                  Clear All
                </Button>
                <Button
                  onClick={applyPreferences}
                  className="glossy-red-pill flex-1 text-xs"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Apply & Discover
                </Button>
              </div>

              {/* Swipe Together Mode Toggle */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => setSwipeTogetherMode(!swipeTogetherMode)}
                  variant={swipeTogetherMode ? "default" : "outline"}
                  className={cn(
                    "w-full rounded-2xl",
                    swipeTogetherMode ? "glossy-red-pill" : "border-2 border-purple-200 hover:bg-purple-50"
                  )}
                >
                  <Users className="h-4 w-4 mr-2" />
                  {swipeTogetherMode ? "Squad Mode Active" : "Swipe with Friends"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Discovery Mode Selector */}
      {showModeSelector && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg bg-white/95 backdrop-blur-md border-2 border-white/60 shadow-2xl rounded-3xl overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">🎮</div>
                <h3 className="text-2xl font-bold font-rum-raisin bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Choose Your Adventure
                </h3>
                <p className="text-muted-foreground text-sm mt-2">
                  Select your discovery mode for the ultimate food adventure
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                {discoveryModes.map((mode) => (
                  <Button
                    key={mode.id}
                    variant="outline"
                    className={cn(
                      "w-full h-20 flex items-center gap-4 border-2 border-white/60 bg-white/80 hover:bg-white/90 transition-all duration-300 hover:scale-102 rounded-2xl p-4 text-left",
                      selectedMode === mode.id && "ring-2 ring-primary ring-offset-2 bg-primary/5"
                    )}
                    onClick={() => selectMode(mode.id)}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br",
                      mode.color
                    )}>
                      {mode.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-base">{mode.title}</div>
                      <div className="text-sm text-muted-foreground">{mode.description}</div>
                    </div>
                    {selectedMode === mode.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-2xl border-2 border-gray-200 hover:bg-gray-50" 
                  onClick={() => setShowModeSelector(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setShowModeSelector(false)}
                  className="glossy-red-pill flex-1"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Adventure
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Enhanced Adventure Roulette Modal */}
      {showRoulette && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm bg-white/95 backdrop-blur-md border-2 border-white/60 shadow-2xl rounded-3xl overflow-hidden">
            <div className="p-8 text-center">
              <div className="mb-6">
                <img src={likLogo} alt="Lik" className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-2xl font-bold font-rum-raisin bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Adventure Roulette
                </h3>
                <p className="text-muted-foreground text-sm mt-2">
                  Let destiny guide your next culinary quest!
                </p>
              </div>
              
              <div className={cn(
                "w-32 h-32 mx-auto mb-6 rounded-full border-4 border-gradient-to-r from-primary to-secondary flex items-center justify-center text-6xl bg-gradient-to-br from-red-50 to-pink-50 shadow-xl relative overflow-hidden",
                isSpinning && "roulette-spin"
              )}>
                <div className="absolute inset-0 bg-gradient-to-br from-red-100/50 to-pink-100/50 animate-pulse" />
                🎯
                {/* Adventure Icons floating around */}
                {isSpinning && (
                  <>
                    <div className="absolute top-2 left-8 text-lg animate-spin">🍕</div>
                    <div className="absolute top-8 right-2 text-lg animate-spin delay-200">🍜</div>
                    <div className="absolute bottom-2 right-8 text-lg animate-spin delay-400">🍔</div>
                    <div className="absolute bottom-8 left-2 text-lg animate-spin delay-600">🌮</div>
                  </>
                )}
              </div>
              
              {isSpinning && (
                <div className="mb-6">
                  <div className="animate-pulse text-primary font-medium mb-2">
                    Searching for your perfect food adventure...
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-3">
                    <Sparkles className="h-3 w-3" />
                    <span>Scanning 127 nearby restaurants</span>
                    <Sparkles className="h-3 w-3" />
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-2xl border-2 border-gray-200 hover:bg-gray-50" 
                  onClick={() => setShowRoulette(false)}
                  disabled={isSpinning}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleRouletteSpin}
                  disabled={isSpinning}
                  className="glossy-red-pill flex-1"
                >
                  {isSpinning ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Spinning...
                    </div>
                  ) : (
                    <>
                      <Target className="h-4 w-4 mr-2" />
                      Spin Adventure!
                    </>
                  )}
                </Button>
              </div>
              
              {!isSpinning && (
                <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                  <div className="flex items-center justify-center gap-2 text-xs text-orange-600">
                    <Gift className="h-3 w-3" />
                    <span className="font-medium">Bonus: +50 Lik Coins for trying roulette!</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Swipe Together Mode Indicator */}
      {swipeTogetherMode && (
        <div className="absolute top-32 right-4 z-10">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg animate-pulse">
            <Users className="h-4 w-4" />
            <span>Squad Discovery</span>
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          </div>
        </div>
      )}
    </div>
  );
}