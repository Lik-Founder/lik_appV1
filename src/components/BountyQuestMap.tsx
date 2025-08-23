import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MapPin, Filter, List, Target, Compass, Map as MapIcon, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface BountyQuestMapProps {
  onBack: () => void;
  onShowRestaurantProfile?: (restaurantId: string) => void;
  onShowUserProfile?: (userId: string) => void;
}

interface BountyQuestPin {
  id: string;
  type: 'bounty' | 'quest';
  title: string;
  latitude: number;
  longitude: number;
  reward: number;
  xp: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLeft: number; // minutes
  imageUrl: string;
  cuisine: string;
  distance: number; // meters
  restaurant: string;
  description?: string;
  stepCount?: number; // for quests
  likes?: number;
  participants?: number;
}

interface FilterState {
  distance: number;
  difficulty: string[];
  cuisine: string[];
  timeFilter: string;
  rewardFilter: string;
}

export function BountyQuestMap({ onBack, onShowRestaurantProfile, onShowUserProfile }: BountyQuestMapProps) {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedPin, setSelectedPin] = useState<BountyQuestPin | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showClusters, setShowClusters] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    distance: 5,
    difficulty: [],
    cuisine: [],
    timeFilter: 'all',
    rewardFilter: 'all'
  });
  const [isRouletteSpin, setIsRouletteSpin] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Mock data for demonstration
  const mockPins: BountyQuestPin[] = [
    {
      id: '1',
      type: 'bounty',
      title: 'Spicy Ramen Challenge',
      latitude: 37.7749,
      longitude: -122.4194,
      reward: 750,
      xp: 50,
      difficulty: 'medium',
      timeLeft: 45,
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
      cuisine: 'Japanese',
      distance: 250,
      restaurant: 'Ramen House',
      description: 'Complete our spiciest ramen bowl in under 15 minutes',
      likes: 23,
      participants: 8
    },
    {
      id: '2',
      type: 'quest',
      title: 'Taco Trail Adventure',
      latitude: 37.7849,
      longitude: -122.4094,
      reward: 1200,
      xp: 100,
      difficulty: 'hard',
      timeLeft: 120,
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      cuisine: 'Mexican',
      distance: 450,
      restaurant: 'Multiple Locations',
      description: 'Visit 3 authentic taco spots in the Mission',
      stepCount: 3,
      likes: 67,
      participants: 24
    },
    {
      id: '3',
      type: 'bounty',
      title: 'Pizza Paradise',
      latitude: 37.7649,
      longitude: -122.4294,
      reward: 500,
      xp: 30,
      difficulty: 'easy',
      timeLeft: 90,
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop',
      cuisine: 'Italian',
      distance: 180,
      restaurant: 'Tony\'s Pizza',
      description: 'Try our new truffle pizza creation',
      likes: 45,
      participants: 12
    }
  ];

  const [pins, setPins] = useState<BountyQuestPin[]>(mockPins);

  const formatTimeLeft = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTimeLeftColor = (minutes: number) => {
    if (minutes <= 30) return 'text-red-500';
    if (minutes <= 60) return 'text-orange-500';
    return 'text-green-500';
  };

  const handleRoulette = () => {
    setIsRouletteSpin(true);
    
    // Simulate roulette spin
    setTimeout(() => {
      const randomPin = pins[Math.floor(Math.random() * pins.length)];
      setSelectedPin(randomPin);
      setIsRouletteSpin(false);
      
      // Simulate map fly-to animation
      if (mapRef.current) {
        mapRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 2000);
  };

  const handleClaimBounty = (pin: BountyQuestPin) => {
    // TODO: Implement bounty claiming logic with Supabase
    console.log('Claiming bounty:', pin.id);
    // Remove pin from map after claiming
    setPins(prev => prev.filter(p => p.id !== pin.id));
    setSelectedPin(null);
  };

  const handleJoinQuest = (pin: BountyQuestPin) => {
    // TODO: Implement quest joining logic with Supabase
    console.log('Joining quest:', pin.id);
  };

  const FilterSheet = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="glossy-red-pill text-white border-red-300">
          <Filter className="w-4 h-4 mr-1" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[80vh]">
        <SheetHeader>
          <SheetTitle className="font-rum-raisin">Map Filters</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 p-4">
          {/* Distance Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Distance: {filters.distance} km</label>
            <Slider
              value={[filters.distance]}
              onValueChange={(value) => setFilters(prev => ({ ...prev, distance: value[0] }))}
              max={25}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <div className="flex gap-2">
              {['easy', 'medium', 'hard'].map((diff) => (
                <Button
                  key={diff}
                  variant={filters.difficulty.includes(diff) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      difficulty: prev.difficulty.includes(diff)
                        ? prev.difficulty.filter(d => d !== diff)
                        : [...prev.difficulty, diff]
                    }));
                  }}
                  className={filters.difficulty.includes(diff) ? "glossy-red-pill text-white" : ""}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Cuisine Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Cuisine</label>
            <div className="flex flex-wrap gap-2">
              {['Japanese', 'Mexican', 'Italian', 'Chinese', 'Indian', 'American'].map((cuisine) => (
                <Button
                  key={cuisine}
                  variant={filters.cuisine.includes(cuisine) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      cuisine: prev.cuisine.includes(cuisine)
                        ? prev.cuisine.filter(c => c !== cuisine)
                        : [...prev.cuisine, cuisine]
                    }));
                  }}
                  className={filters.cuisine.includes(cuisine) ? "glossy-red-pill text-white" : ""}
                >
                  {cuisine}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  const PinBottomSheet = ({ pin }: { pin: BountyQuestPin }) => (
    <Sheet open={!!selectedPin} onOpenChange={() => setSelectedPin(null)}>
      <SheetContent side="bottom" className="max-h-[85vh] rounded-t-3xl bg-gradient-to-b from-white to-red-50/30 border-t-2 border-red-100">
        <div className="space-y-4">
          {/* Header Image with Enhanced Candy-Gloss */}
          <div className="relative h-48 -mx-6 -mt-6 rounded-t-3xl overflow-hidden">
            <img 
              src={pin.imageUrl} 
              alt={pin.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-pink-500/10" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="relative">
                  <div className={cn(
                    "absolute inset-0 rounded-lg blur-sm opacity-80",
                    getDifficultyColor(pin.difficulty)
                  )} />
                  <Badge className={cn(
                    "relative text-white font-bold border border-white/30",
                    getDifficultyColor(pin.difficulty)
                  )}>
                    {pin.difficulty.toUpperCase()}
                  </Badge>
                </div>
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20">
                  <span className={cn("font-bold text-sm", getTimeLeftColor(pin.timeLeft))}>
                    ⏰ {formatTimeLeft(pin.timeLeft)} left
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-shadow-lg font-rum-raisin">{pin.title}</h3>
              <p className="text-sm opacity-90 font-medium">{pin.restaurant}</p>
            </div>
          </div>

          {/* Enhanced Details with Candy-Gloss */}
          <div className="px-6 space-y-4">
            {/* Rewards with Enhanced Styling */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-md opacity-60" />
                <div className="relative flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg border border-yellow-300">
                  <span className="text-xl">🪙</span>
                  <span className="font-bold font-rum-raisin">{pin.reward}</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-md opacity-60" />
                <div className="relative flex items-center gap-2 bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 text-white px-4 py-2 rounded-full shadow-lg border border-blue-300">
                  <span className="text-xl">⭐</span>
                  <span className="font-bold font-rum-raisin">{pin.xp} XP</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-100">
              <p className="text-gray-700 font-medium">{pin.description}</p>
            </div>

            {/* Meta Info with Enhanced Styling */}
            <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-1 text-red-600">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{pin.distance}m away</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span>❤️</span>
                  <span className="font-medium">{pin.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>👥</span>
                  <span className="font-medium">{pin.participants}</span>
                </div>
              </div>
            </div>

            {/* Quest Steps (if quest) */}
            {pin.type === 'quest' && pin.stepCount && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                <h4 className="font-bold mb-2 text-purple-800 font-rum-raisin">🧭 Quest Journey</h4>
                <div className="text-purple-700 font-medium">
                  {pin.stepCount} epic locations to conquer
                </div>
              </div>
            )}

            {/* Enhanced Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                className="flex-1 h-12 text-lg font-bold font-rum-raisin glossy-red-pill"
                onClick={() => pin.type === 'bounty' ? handleClaimBounty(pin) : handleJoinQuest(pin)}
              >
                {pin.type === 'bounty' ? '🎯 Claim Bounty' : '🧭 Join Quest'}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 border-2 border-red-200 text-red-600 hover:bg-red-50 transition-all duration-300"
              >
                <span className="text-lg">📍</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 border-2 border-purple-200 text-purple-600 hover:bg-purple-50 transition-all duration-300"
              >
                <span className="text-lg">💾</span>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background to-red-50">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b bg-white/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-1 bg-gradient-to-r from-red-100 to-pink-100 px-3 py-1.5 rounded-full text-sm border border-red-200">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="font-medium text-red-700">San Francisco</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <FilterSheet />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            {viewMode === 'map' ? <List className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide">
        <Badge variant="outline" className="whitespace-nowrap">Nearby</Badge>
        <Badge variant="outline" className="whitespace-nowrap">Most Rewarding</Badge>
        <Badge variant="outline" className="whitespace-nowrap">Expiring Soon</Badge>
        <Badge variant="outline" className="whitespace-nowrap">Easy</Badge>
        <Badge variant="outline" className="whitespace-nowrap">Japanese</Badge>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full bg-gradient-to-br from-blue-100 via-green-50 to-red-100 relative overflow-hidden">
            {/* Mock Map Background with Candy-Gloss Theme */}
            <div className="absolute inset-0 opacity-30">
              <div className="grid grid-cols-8 grid-rows-10 h-full w-full">
                {Array.from({ length: 80 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "border border-gray-200",
                      i % 7 === 0 && "bg-gradient-to-br from-red-50 to-pink-50",
                      i % 11 === 0 && "bg-gradient-to-br from-orange-50 to-yellow-50"
                    )} 
                  />
                ))}
              </div>
            </div>

            {/* Heatmap Layer */}
            {showHeatmap && (
              <div className="absolute inset-0 pointer-events-none">
                {pins.map((pin) => (
                  <div
                    key={`heatmap-${pin.id}`}
                    className="absolute rounded-full bg-gradient-radial from-red-400/40 to-transparent heatmap-pulse"
                    style={{
                      left: `${50 + (pin.longitude + 122.4194) * 1000}%`,
                      top: `${50 + (37.7749 - pin.latitude) * 1000}%`,
                      width: `${pin.reward / 10}px`,
                      height: `${pin.reward / 10}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                ))}
              </div>
            )}

            {/* User Location with Candy-Gloss Effect */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full border-2 border-white shadow-lg relative z-10" />
                <div className="absolute inset-0 w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-30" />
                <div className="absolute inset-0 w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
              </div>
            </div>

            {/* Map Pins with Enhanced Candy-Gloss Theming */}
            {pins.map((pin) => (
              <div
                key={pin.id}
                className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer map-pin-bounce"
                style={{
                  left: `${50 + (pin.longitude + 122.4194) * 1000}%`,
                  top: `${50 + (37.7749 - pin.latitude) * 1000}%`
                }}
                onClick={() => setSelectedPin(pin)}
              >
                {/* Enhanced Countdown Ring with Candy-Gloss */}
                <div className="relative">
                  <svg className="w-14 h-14 transform -rotate-90 absolute -top-1 -left-1">
                    <circle
                      cx="28"
                      cy="28"
                      r="26"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      className={cn(
                        "drop-shadow-lg",
                        getTimeLeftColor(pin.timeLeft)
                      )}
                      strokeDasharray={`${(pin.timeLeft / 120) * 163.36} 163.36`}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Enhanced Pin with Candy-Gloss */}
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-xl border-2 border-white relative z-10",
                    pin.type === 'bounty' 
                      ? 'bg-gradient-to-br from-red-400 via-red-500 to-red-600 shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
                      : 'bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 shadow-[0_0_20px_rgba(147,51,234,0.5)]'
                  )}>
                    <span className="drop-shadow-lg">
                      {pin.type === 'bounty' ? '🎯' : '🧭'}
                    </span>
                  </div>
                  
                  {/* Enhanced Reward Badge with Candy-Gloss */}
                  <div className="absolute -top-3 -right-3 z-20">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-sm opacity-80" />
                      <div className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg border border-white/50">
                        {pin.reward}
                      </div>
                    </div>
                  </div>

                  {/* Difficulty Indicator */}
                  <div className="absolute -bottom-2 -left-2 z-20">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 border-white shadow-md",
                      getDifficultyColor(pin.difficulty)
                    )} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Floating Controls with Candy-Gloss */}
          <div className="absolute right-4 top-4 space-y-3">
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "bg-white/90 backdrop-blur-sm shadow-lg border-2 transition-all duration-300",
                showClusters 
                  ? "bg-gradient-to-r from-red-50 to-pink-50 border-red-300 text-red-600 shadow-[0_0_12px_rgba(239,68,68,0.3)]" 
                  : "border-gray-200 hover:border-red-300 hover:bg-red-50"
              )}
              onClick={() => setShowClusters(!showClusters)}
            >
              <Layers className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "bg-white/90 backdrop-blur-sm shadow-lg border-2 transition-all duration-300",
                showHeatmap 
                  ? "bg-gradient-to-r from-orange-50 to-red-50 border-orange-300 text-orange-600 shadow-[0_0_12px_rgba(249,115,22,0.3)]" 
                  : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
              )}
              onClick={() => setShowHeatmap(!showHeatmap)}
            >
              <span className="text-lg">🔥</span>
            </Button>
          </div>

          {/* Enhanced Roulette FAB with Candy-Gloss */}
          <div className="absolute bottom-6 right-6">
            <div className="relative">
              {/* Multi-layer glow effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-500 rounded-full blur-lg opacity-40" />
              
              <Button
                className={cn(
                  "relative w-16 h-16 rounded-full text-white shadow-2xl border-2 border-white/30 transition-all duration-300",
                  "bg-gradient-to-br from-purple-500 via-pink-500 to-red-500",
                  "hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] hover:scale-110",
                  isRouletteSpin && "animate-spin"
                )}
                onClick={handleRoulette}
                disabled={isRouletteSpin}
              >
                <span className="text-2xl drop-shadow-lg">🎰</span>
              </Button>
            </div>
          </div>

          {/* Enhanced Recenter Button with Candy-Gloss */}
          <div className="absolute bottom-6 left-6">
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-white/90 backdrop-blur-sm shadow-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
            >
              <Target className="w-4 h-4 text-blue-600" />
            </Button>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-3 p-4">
            {pins.map((pin) => (
              <div
                key={pin.id}
                className="bg-white rounded-2xl shadow-sm border p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedPin(pin)}
              >
                <div className="flex gap-3">
                  <img 
                    src={pin.imageUrl} 
                    alt={pin.title}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">{pin.title}</h3>
                      <Badge className={cn("text-white text-xs", getDifficultyColor(pin.difficulty))}>
                        {pin.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{pin.restaurant}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-600 font-medium">🪙 {pin.reward}</span>
                        <span className="text-blue-600 font-medium">⭐ {pin.xp}</span>
                      </div>
                      <span className={cn("text-sm font-medium", getTimeLeftColor(pin.timeLeft))}>
                        {formatTimeLeft(pin.timeLeft)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Sheet */}
      {selectedPin && <PinBottomSheet pin={selectedPin} />}
    </div>
  );
}