import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  XMarkIcon,
  ArrowLeftIcon,
  MapPinIcon,
  AdjustmentsHorizontalIcon,
  ViewColumnsIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  FireIcon,
  StarIcon,
  TrophyIcon,
  BoltIcon,
  GiftIcon,
  TargetIcon,
  PlusIcon,
  MinusIcon,
  ArrowPathIcon,
  ListBulletIcon,
  CurrencyDollarIcon,
  BeakerIcon,
  HandRaisedIcon,
  ShieldCheckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  HeartIcon,
  ShareIcon,
  MapIcon,
  UserIcon,
  BuildingStorefrontIcon,
  PlayIcon,
  PauseIcon,
  EyeIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';
import { useKV } from '@github/spark/hooks';
import LikLogoHeart from '@/assets/images/Lik_Logo_Heart_1.0.png';

// Enhanced Types for Map Features
interface MapBounty {
  id: string;
  dishName: string;
  restaurantName: string;
  restaurantId: string;
  lat: number;
  lng: number;
  category: string;
  cuisine: string;
  timeRemaining: string;
  expiresAt: number;
  rating: number;
  reward: number;
  xpReward: number;
  imageUrl: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  distance: number;
  likes: number;
  participations: number;
  description: string;
  price: string;
  calories: string;
  proximityRequired: boolean;
  tags: string[];
}

interface MapQuest {
  id: string;
  name: string;
  description: string;
  type: 'solo' | 'team';
  reward: number;
  xpReward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  stepCount: number;
  timeLimit: string;
  expiresAt: number;
  imageUrl: string;
  steps: QuestStep[];
  likes: number;
  participations: number;
  tags: string[];
}

interface QuestStep {
  id: string;
  title: string;
  restaurantName: string;
  restaurantId: string;
  lat: number;
  lng: number;
  order: number;
  description: string;
  imageUrl: string;
}

interface MapPin {
  id: string;
  type: 'bounty' | 'quest' | 'quest-step';
  lat: number;
  lng: number;
  data: MapBounty | MapQuest | QuestStep;
  clusterId?: string;
}

interface FilterOptions {
  distance: number[];
  difficulty: string[];
  cuisine: string[];
  rewards: string[];
  timeLeft: string[];
  showClusters: boolean;
  showHeatmap: boolean;
}

// Mock Data
const mockBounties: MapBounty[] = [
  {
    id: 'b1',
    dishName: 'Truffle Pasta',
    restaurantName: 'Bella Italia',
    restaurantId: 'r1',
    lat: 37.7749,
    lng: -122.4194,
    category: 'Italian',
    cuisine: 'Italian',
    timeRemaining: '2h 34m',
    expiresAt: Date.now() + 2 * 60 * 60 * 1000,
    rating: 4.8,
    reward: 750,
    xpReward: 150,
    imageUrl: '/api/placeholder/400/300',
    difficulty: 'Medium',
    distance: 0.3,
    likes: 234,
    participations: 89,
    description: 'Handmade pasta with black truffle and parmesan',
    price: '$28',
    calories: '420 cal',
    proximityRequired: true,
    tags: ['Premium', 'Signature', 'Chef\'s Pick']
  },
  {
    id: 'b2',
    dishName: 'Wagyu Burger',
    restaurantName: 'Prime Burger Co',
    restaurantId: 'r2',
    lat: 37.7849,
    lng: -122.4094,
    category: 'American',
    cuisine: 'American',
    timeRemaining: '4h 12m',
    expiresAt: Date.now() + 4 * 60 * 60 * 1000,
    rating: 4.6,
    reward: 500,
    xpReward: 100,
    imageUrl: '/api/placeholder/400/300',
    difficulty: 'Easy',
    distance: 0.7,
    likes: 156,
    participations: 67,
    description: 'Premium wagyu beef with truffle aioli',
    price: '$24',
    calories: '580 cal',
    proximityRequired: false,
    tags: ['Limited Time', 'Popular']
  },
  {
    id: 'b3',
    dishName: 'Dragon Roll Sushi',
    restaurantName: 'Sakura Sushi',
    restaurantId: 'r3',
    lat: 37.7649,
    lng: -122.4294,
    category: 'Japanese',
    cuisine: 'Japanese',
    timeRemaining: '45m',
    expiresAt: Date.now() + 45 * 60 * 1000,
    rating: 4.9,
    reward: 900,
    xpReward: 200,
    imageUrl: '/api/placeholder/400/300',
    difficulty: 'Hard',
    distance: 1.2,
    likes: 312,
    participations: 43,
    description: 'Fresh eel, avocado, and spicy mayo roll',
    price: '$18',
    calories: '320 cal',
    proximityRequired: true,
    tags: ['Expiring Soon', 'High Reward']
  }
];

const mockQuests: MapQuest[] = [
  {
    id: 'q1',
    name: 'Pizza Crawl Challenge',
    description: 'Visit 3 top-rated pizza spots in North Beach',
    type: 'solo',
    reward: 1500,
    xpReward: 300,
    difficulty: 'Medium',
    stepCount: 3,
    timeLimit: '24h',
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    imageUrl: '/api/placeholder/400/300',
    likes: 89,
    participations: 23,
    tags: ['Weekend Special', 'Food Crawl'],
    steps: [
      {
        id: 's1',
        title: 'Margherita at Tony\'s',
        restaurantName: 'Tony\'s Pizza',
        restaurantId: 'r4',
        lat: 37.8049,
        lng: -122.4194,
        order: 1,
        description: 'Classic Margherita pizza',
        imageUrl: '/api/placeholder/300/200'
      },
      {
        id: 's2',
        title: 'Pepperoni Supreme',
        restaurantName: 'Mario\'s Slice',
        restaurantId: 'r5',
        lat: 37.8149,
        lng: -122.4094,
        order: 2,
        description: 'Loaded pepperoni pizza',
        imageUrl: '/api/placeholder/300/200'
      },
      {
        id: 's3',
        title: 'Artisanal White Pizza',
        restaurantName: 'Gourmet Pizza Co',
        restaurantId: 'r6',
        lat: 37.8249,
        lng: -122.4294,
        order: 3,
        description: 'White sauce with fresh herbs',
        imageUrl: '/api/placeholder/300/200'
      }
    ]
  }
];

interface Props {
  onBack: () => void;
  onShowUserProfile?: (userId: string) => void;
  onShowRestaurantProfile?: (restaurantId: string) => void;
}

export function BountyQuestMapPage({ onBack, onShowUserProfile, onShowRestaurantProfile }: Props) {
  // State Management
  const [userLocation] = useState({ lat: 37.7749, lng: -122.4194 });
  const [mapCenter, setMapCenter] = useState(userLocation);
  const [selectedCity, setSelectedCity] = useState('San Francisco');
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [showFilters, setShowFilters] = useState(false);
  const [isRouletting, setIsRouletting] = useState(false);
  const [bottomSheetExpanded, setBottomSheetExpanded] = useState(false);
  
  // Filter State
  const [filters, setFilters] = useState<FilterOptions>({
    distance: [2],
    difficulty: [],
    cuisine: [],
    rewards: [],
    timeLeft: [],
    showClusters: true,
    showHeatmap: false
  });

  // Data Management
  const [mapPins, setMapPins] = useState<MapPin[]>([]);
  const [filteredPins, setFilteredPins] = useState<MapPin[]>([]);

  // Generate map pins from bounties and quests
  useEffect(() => {
    const pins: MapPin[] = [];
    
    // Add bounty pins
    mockBounties.forEach(bounty => {
      pins.push({
        id: bounty.id,
        type: 'bounty',
        lat: bounty.lat,
        lng: bounty.lng,
        data: bounty
      });
    });

    // Add quest step pins
    mockQuests.forEach(quest => {
      quest.steps.forEach(step => {
        pins.push({
          id: step.id,
          type: 'quest-step',
          lat: step.lat,
          lng: step.lng,
          data: { ...step, parentQuest: quest }
        });
      });
    });

    setMapPins(pins);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...mapPins];

    // Distance filter
    const maxDistance = filters.distance[0];
    filtered = filtered.filter(pin => {
      const distance = calculateDistance(userLocation, { lat: pin.lat, lng: pin.lng });
      return distance <= maxDistance;
    });

    // Difficulty filter
    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(pin => {
        const difficulty = pin.type === 'bounty' 
          ? (pin.data as MapBounty).difficulty
          : pin.type === 'quest-step' 
            ? ((pin.data as any).parentQuest as MapQuest).difficulty
            : 'Easy';
        return filters.difficulty.includes(difficulty);
      });
    }

    // Cuisine filter
    if (filters.cuisine.length > 0) {
      filtered = filtered.filter(pin => {
        const cuisine = pin.type === 'bounty' 
          ? (pin.data as MapBounty).cuisine
          : 'Various';
        return filters.cuisine.includes(cuisine);
      });
    }

    setFilteredPins(filtered);
  }, [mapPins, filters, userLocation]);

  // Utility Functions
  const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
             Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
             Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getTimeUntilExpiry = (expiresAt: number) => {
    const now = Date.now();
    const timeLeft = expiresAt - now;
    
    if (timeLeft <= 0) return 'Expired';
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getCountdownProgress = (expiresAt: number, originalDuration: number = 24 * 60 * 60 * 1000) => {
    const now = Date.now();
    const timeLeft = expiresAt - now;
    const progress = Math.max(0, Math.min(1, timeLeft / originalDuration));
    return progress;
  };

  const handleRoulette = useCallback(() => {
    if (filteredPins.length === 0) return;
    
    setIsRouletting(true);
    
    // Simulate roulette spinning
    setTimeout(() => {
      const randomPin = filteredPins[Math.floor(Math.random() * filteredPins.length)];
      setMapCenter({ lat: randomPin.lat, lng: randomPin.lng });
      setSelectedPin(randomPin);
      setBottomSheetExpanded(true);
      setIsRouletting(false);
    }, 2000);
  }, [filteredPins]);

  const handlePinClick = (pin: MapPin) => {
    setSelectedPin(pin);
    setBottomSheetExpanded(false);
  };

  const toggleFilter = (category: keyof FilterOptions, value: string) => {
    if (category === 'showClusters' || category === 'showHeatmap') {
      setFilters(prev => ({
        ...prev,
        [category]: !prev[category]
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [category]: prev[category].includes(value)
          ? prev[category].filter(item => item !== value)
          : [...prev[category], value]
      }));
    }
  };

  // Render Functions
  const renderPin = (pin: MapPin) => {
    const isSelected = selectedPin?.id === pin.id;
    const data = pin.data as any;
    
    let progress = 1;
    let timeColor = 'text-green-500';
    
    if (pin.type === 'bounty') {
      const bounty = data as MapBounty;
      progress = getCountdownProgress(bounty.expiresAt);
      const timeLeft = getTimeUntilExpiry(bounty.expiresAt);
      
      if (timeLeft.includes('m') && !timeLeft.includes('h')) {
        timeColor = 'text-red-500';
      } else if (timeLeft.includes('h') && parseInt(timeLeft) <= 2) {
        timeColor = 'text-yellow-500';
      }
    }

    return (
      <div
        key={pin.id}
        className={cn(
          "absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300",
          isSelected ? "scale-125 z-20" : "scale-100 z-10 hover:scale-110"
        )}
        style={{
          left: `${((pin.lng + 122.4194) / 0.05) * 100}%`,
          top: `${((37.8249 - pin.lat) / 0.06) * 100}%`
        }}
        onClick={() => handlePinClick(pin)}
      >
        {/* Countdown Ring */}
        {pin.type === 'bounty' && (
          <svg
            className="absolute inset-0 w-12 h-12 transform -rotate-90"
            viewBox="0 0 48 48"
          >
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke={progress > 0.5 ? '#10B981' : progress > 0.2 ? '#F59E0B' : '#EF4444'}
              strokeWidth="2"
              strokeDasharray={`${progress * 125.6} 125.6`}
              className="transition-all duration-1000"
            />
          </svg>
        )}
        
        {/* Pin Icon */}
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-lg",
          pin.type === 'bounty' 
            ? "bg-gradient-to-br from-red-400 to-red-600" 
            : pin.type === 'quest-step'
            ? "bg-gradient-to-br from-blue-400 to-blue-600"
            : "bg-gradient-to-br from-purple-400 to-purple-600"
        )}>
          {pin.type === 'bounty' ? (
            <TargetIcon className="w-4 h-4" />
          ) : pin.type === 'quest-step' ? (
            <MapPinIcon className="w-4 h-4" />
          ) : (
            <TrophyIcon className="w-4 h-4" />
          )}
        </div>

        {/* Glow Effect for High Value */}
        {pin.type === 'bounty' && (data as MapBounty).reward > 700 && (
          <div className="absolute inset-0 w-8 h-8 rounded-full bg-yellow-400 opacity-30 animate-ping" />
        )}
      </div>
    );
  };

  const renderBottomSheet = () => {
    if (!selectedPin) return null;

    const data = selectedPin.data as any;
    const isBounty = selectedPin.type === 'bounty';
    const isQuestStep = selectedPin.type === 'quest-step';

    return (
      <div className={cn(
        "fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 z-30",
        bottomSheetExpanded ? "translate-y-0" : "translate-y-[calc(100%-140px)]"
      )}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div 
            className="w-12 h-1.5 bg-gray-300 rounded-full cursor-pointer"
            onClick={() => setBottomSheetExpanded(!bottomSheetExpanded)}
          />
        </div>

        {/* Collapsed Content */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={data.imageUrl || '/api/placeholder/60/60'}
              alt={isBounty ? data.dishName : data.title}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h3 className="font-bold text-lg font-rum-raisin">
                {isBounty ? data.dishName : data.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {isBounty ? data.restaurantName : data.restaurantName}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {isBounty && (
                  <>
                    <Badge variant="secondary" className="bg-red-100 text-red-600">
                      {data.reward} LKC
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-600">
                      +{data.xpReward} XP
                    </Badge>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                      {data.difficulty}
                    </Badge>
                  </>
                )}
              </div>
            </div>
            <ChevronUpIcon 
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform duration-300",
                bottomSheetExpanded ? "rotate-180" : "rotate-0"
              )}
            />
          </div>
        </div>

        {/* Expanded Content */}
        {bottomSheetExpanded && (
          <div className="px-4 pb-8 max-h-[60vh] overflow-y-auto">
            {/* Image Gallery */}
            <div className="mb-4">
              <img
                src={data.imageUrl || '/api/placeholder/400/200'}
                alt={isBounty ? data.dishName : data.title}
                className="w-full h-48 rounded-xl object-cover"
              />
            </div>

            {/* Details */}
            <div className="space-y-4">
              {/* Description */}
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-600 text-sm">
                  {data.description}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Distance</span>
                  </div>
                  <p className="font-semibold">{data.distance?.toFixed(1)} mi</p>
                </div>
                
                {isBounty && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Time Left</span>
                    </div>
                    <p className="font-semibold">{getTimeUntilExpiry(data.expiresAt)}</p>
                  </div>
                )}
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <HeartIcon className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600">{data.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UsersIcon className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">{data.participations}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <img src={LikLogoHeart} alt="Liked by" className="w-4 h-4" />
                  <span className="text-sm text-gray-600 font-rum-raisin">Liked by</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  className="flex-1 glossy-red-pill font-rum-raisin"
                  size="lg"
                >
                  {isBounty ? 'Claim Bounty' : 'Start Step'}
                </Button>
                <Button variant="outline" size="lg">
                  <HeartIcon className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="lg">
                  <ShareIcon className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="lg">
                  <MapIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFilterModal = () => {
    if (!showFilters) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-40 flex items-end">
        <div className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-rum-raisin">Filters</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowFilters(false)}
            >
              <XMarkIcon className="w-5 h-5" />
            </Button>
          </div>

          {/* Distance */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Distance</h3>
            <div className="px-3">
              <Slider
                value={filters.distance}
                onValueChange={(value) => setFilters(prev => ({ ...prev, distance: value }))}
                max={10}
                min={0.5}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>0.5 mi</span>
                <span>{filters.distance[0]} mi</span>
                <span>10 mi</span>
              </div>
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Difficulty</h3>
            <div className="flex flex-wrap gap-2">
              {['Easy', 'Medium', 'Hard', 'Extreme'].map(difficulty => (
                <Button
                  key={difficulty}
                  variant={filters.difficulty.includes(difficulty) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter('difficulty', difficulty)}
                  className={filters.difficulty.includes(difficulty) ? "glossy-red-pill" : ""}
                >
                  {difficulty}
                </Button>
              ))}
            </div>
          </div>

          {/* Cuisine */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Cuisine</h3>
            <div className="flex flex-wrap gap-2">
              {['Italian', 'American', 'Japanese', 'Mexican', 'Thai', 'Indian'].map(cuisine => (
                <Button
                  key={cuisine}
                  variant={filters.cuisine.includes(cuisine) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter('cuisine', cuisine)}
                  className={filters.cuisine.includes(cuisine) ? "glossy-red-pill" : ""}
                >
                  {cuisine}
                </Button>
              ))}
            </div>
          </div>

          {/* Map Options */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Map Options</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Show Clusters</span>
                <Button
                  variant={filters.showClusters ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter('showClusters', '')}
                  className={filters.showClusters ? "glossy-red-pill" : ""}
                >
                  {filters.showClusters ? 'On' : 'Off'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Show Heatmap</span>
                <Button
                  variant={filters.showHeatmap ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter('showHeatmap', '')}
                  className={filters.showHeatmap ? "glossy-red-pill" : ""}
                >
                  {filters.showHeatmap ? 'On' : 'Off'}
                </Button>
              </div>
            </div>
          </div>

          {/* Clear All */}
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setFilters({
              distance: [2],
              difficulty: [],
              cuisine: [],
              rewards: [],
              timeLeft: [],
              showClusters: true,
              showHeatmap: false
            })}
          >
            Clear All Filters
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-background flex flex-col relative">
      {/* Top Bar */}
      <div className="bg-white border-b p-4 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="sm">
              <MapPinIcon className="w-4 h-4 mr-1" />
              {selectedCity}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(true)}
              className={showFilters ? "glossy-red-pill" : ""}
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
              className={viewMode === 'list' ? "glossy-red-pill" : ""}
            >
              {viewMode === 'map' ? <ListBulletIcon className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
          <Button size="sm" variant="outline">
            <FireIcon className="w-4 h-4 mr-1" />
            Nearby
          </Button>
          <Button size="sm" variant="outline">
            <CurrencyDollarIcon className="w-4 h-4 mr-1" />
            Most Rewarding
          </Button>
          <Button size="sm" variant="outline">
            <ClockIcon className="w-4 h-4 mr-1" />
            Expiring Soon
          </Button>
          <Button size="sm" variant="outline">
            <BoltIcon className="w-4 h-4 mr-1" />
            Easy
          </Button>
        </div>
      </div>

      {/* Map Content */}
      <div className="flex-1 relative overflow-hidden">
        {viewMode === 'map' ? (
          <>
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
              {/* Grid lines for map feel */}
              <div className="absolute inset-0 opacity-10">
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={i} className="absolute border-l border-gray-300" style={{ left: `${i * 5}%`, height: '100%' }} />
                ))}
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={i} className="absolute border-t border-gray-300" style={{ top: `${i * 5}%`, width: '100%' }} />
                ))}
              </div>

              {/* User Location */}
              <div
                className="absolute w-4 h-4 bg-blue-500 rounded-full shadow-lg z-10 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                style={{
                  left: `${((userLocation.lng + 122.4194) / 0.05) * 100}%`,
                  top: `${((37.8249 - userLocation.lat) / 0.06) * 100}%`
                }}
              />

              {/* Heatmap overlay */}
              {filters.showHeatmap && (
                <div className="absolute inset-0 opacity-30">
                  {filteredPins.map(pin => (
                    <div
                      key={`heatmap-${pin.id}`}
                      className="absolute w-20 h-20 bg-red-400 rounded-full blur-lg heatmap-pulse"
                      style={{
                        left: `${((pin.lng + 122.4194) / 0.05) * 100}%`,
                        top: `${((37.8249 - pin.lat) / 0.06) * 100}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Map Pins */}
              {filteredPins.map(renderPin)}
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur">
                <PlusIcon className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur">
                <MinusIcon className="w-4 h-4" />
              </Button>
            </div>

            {/* Floating Action Buttons */}
            <div className="absolute bottom-32 right-4 flex flex-col gap-2 z-10">
              <Button
                size="sm"
                variant={filters.showClusters ? "default" : "outline"}
                className={cn(
                  "bg-white/90 backdrop-blur",
                  filters.showClusters && "glossy-red-pill"
                )}
                onClick={() => toggleFilter('showClusters', '')}
              >
                <ViewColumnsIcon className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={filters.showHeatmap ? "default" : "outline"}
                className={cn(
                  "bg-white/90 backdrop-blur",
                  filters.showHeatmap && "glossy-red-pill"
                )}
                onClick={() => toggleFilter('showHeatmap', '')}
              >
                <FireIcon className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur">
                <TrophyIcon className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur">
                <TargetIcon className="w-4 h-4" />
              </Button>
            </div>

            {/* Roulette FAB */}
            <Button
              className={cn(
                "fixed bottom-20 left-4 w-16 h-16 rounded-full glossy-red-pill z-10",
                isRouletting && "animate-spin"
              )}
              onClick={handleRoulette}
              disabled={isRouletting || filteredPins.length === 0}
            >
              {isRouletting ? (
                <ArrowPathIcon className="w-6 h-6" />
              ) : (
                <PlayIcon className="w-6 h-6" />
              )}
            </Button>
          </>
        ) : (
          /* List View */
          <div className="p-4 space-y-3 overflow-y-auto">
            {filteredPins.map(pin => {
              const data = pin.data as any;
              const isBounty = pin.type === 'bounty';
              
              return (
                <Card 
                  key={pin.id} 
                  className="cursor-pointer hover:shadow-md transition-all"
                  onClick={() => handlePinClick(pin)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <img
                        src={data.imageUrl || '/api/placeholder/80/80'}
                        alt={isBounty ? data.dishName : data.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold font-rum-raisin">
                          {isBounty ? data.dishName : data.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {isBounty ? data.restaurantName : data.restaurantName}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {isBounty && (
                            <>
                              <Badge variant="secondary" className="bg-red-100 text-red-600">
                                {data.reward} LKC
                              </Badge>
                              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                                {data.distance?.toFixed(1)} mi
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {isBounty && (
                          <p className="text-sm text-gray-500">
                            {getTimeUntilExpiry(data.expiresAt)}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                          <StarSolid className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm">{data.rating || '4.5'}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Sheet */}
      {renderBottomSheet()}

      {/* Filter Modal */}
      {renderFilterModal()}
    </div>
  );
}