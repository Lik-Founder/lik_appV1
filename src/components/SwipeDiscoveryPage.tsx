import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSwipeGestures } from '@/hooks/use-swipe-gestures';
import { useKV } from '@github/spark/hooks';
import { 
  ArrowLeftIcon as ArrowLeft, 
  MagnifyingGlassIcon as Search, 
  HeartIcon as Heart, 
  XMarkIcon as X, 
  StarIcon as Star, 
  MapPinIcon as MapPin, 
  CurrencyDollarIcon as DollarSign,
  ClockIcon as Clock,
  UsersIcon as Users,
  AdjustmentsHorizontalIcon as Filter,
  ArrowPathIcon as RotateCcw,
  SparklesIcon as Sparkles,
  TrophyIcon as Trophy,
  BoltIcon as Zap,
  ViewfinderCircleIcon as Target,
  EyeIcon as Eye
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

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
}

interface SwipeDiscoveryPageProps {
  onBack: () => void;
  onShowRestaurantProfile: (restaurantId: string) => void;
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
    avgPrice: '$24'
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
    avgPrice: '$18'
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
    avgPrice: '$16'
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
    avgPrice: '$22'
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
    avgPrice: '$35'
  }
];

const moods = [
  { id: 'adventurous', label: 'Adventurous', icon: '🚀', color: 'bg-primary' },
  { id: 'comfort', label: 'Comfort Food', icon: '🍝', color: 'bg-secondary' },
  { id: 'healthy', label: 'Healthy', icon: '🥗', color: 'bg-accent' },
  { id: 'cheap', label: 'Cheap Eats', icon: '💸', color: 'bg-destructive' }
];

export function SwipeDiscoveryPage({ onBack, onShowRestaurantProfile }: SwipeDiscoveryPageProps) {
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | 'down' | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [swipeStreak, setSwipeStreak] = useKV('swipe-streak', 0);
  const [totalSwipes, setTotalSwipes] = useKV('total-swipes', 0);
  const [savedRestaurants, setSavedRestaurants] = useKV('saved-restaurants', [] as string[]);
  const [xpPoints, setXpPoints] = useKV('xp-points', 0);
  const [showRoulette, setShowRoulette] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [swipeTogetherMode, setSwipeTogetherMode] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const currentRestaurant = restaurants[currentIndex];
  
  const xpProgress = (xpPoints % 100);
  const level = Math.floor(xpPoints / 100) + 1;

  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (!currentRestaurant) return;
    
    setSwipeDirection(direction);
    
    // Handle different swipe actions
    switch (direction) {
      case 'left': // Not interested
        break;
      case 'right': // Open restaurant profile
        setTimeout(() => {
          onShowRestaurantProfile(currentRestaurant.id);
        }, 300);
        return;
      case 'up': // Save for later
        setSavedRestaurants(prev => [...prev, currentRestaurant.id]);
        break;
      case 'down': // Quick skip
        break;
    }
    
    // Update stats
    setTotalSwipes(prev => prev + 1);
    setSwipeStreak(prev => prev + 1);
    setXpPoints(prev => prev + 5);
    
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
      setXpPoints(prev => prev + 10);
    }, 2000);
  };

  const selectMood = (moodId: string) => {
    setSelectedMood(moodId);
    setShowMoodSelector(false);
    // In a real app, this would filter restaurants
    setXpPoints(prev => prev + 3);
  };

  if (!currentRestaurant) {
    return (
      <div className="h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">You've seen them all!</h2>
          <p className="text-muted-foreground mb-4">Check back later for more restaurants</p>
          <Button onClick={onBack} className="glossy-red-pill">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="text-center">
            <div className="text-sm font-medium">Level {level}</div>
            <Progress value={xpProgress} className="w-20 h-2" />
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Zap className="h-4 w-4 text-primary" />
            <span>{xpPoints}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setShowMoodSelector(true)}>
            <Filter className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Streak Indicator */}
      <div className="absolute top-20 left-4 z-10">
        <div className="bg-gradient-to-r from-primary to-accent text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
          <Trophy className="h-4 w-4" />
          {swipeStreak} streak
        </div>
      </div>

      {/* Swipe Together Mode Toggle */}
      <div className="absolute top-20 right-4 z-10">
        <Button
          variant={swipeTogetherMode ? "default" : "secondary"}
          size="sm"
          onClick={() => setSwipeTogetherMode(!swipeTogetherMode)}
          className="rounded-full"
        >
          <Users className="h-4 w-4 mr-1" />
          Together
        </Button>
      </div>

      {/* Main Swipe Card */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div 
          ref={cardRef}
          {...swipeHandlers}
          className={cn(
            "relative w-full max-w-sm h-[600px] perspective-1000 cursor-grab active:cursor-grabbing",
            swipeDirection === 'left' && "animate-swipe-left",
            swipeDirection === 'right' && "animate-swipe-right", 
            swipeDirection === 'up' && "animate-swipe-up",
            swipeDirection === 'down' && "animate-swipe-down"
          )}
          onClick={handleCardFlip}
          onDoubleClick={handleDoubleClick}
        >
          <Card className={cn(
            "absolute inset-0 transform-style-preserve-3d transition-transform duration-700 overflow-hidden",
            isFlipped && "rotate-y-180"
          )}>
            {/* Front of Card */}
            <div className="absolute inset-0 backface-hidden">
              <div 
                className="h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${currentRestaurant.image})` }}
              >
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Top Tags */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-white/90 text-black">
                      {currentRestaurant.cuisine}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/90 text-black">
                      <MapPin className="h-3 w-3 mr-1" />
                      {currentRestaurant.distance}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{currentRestaurant.rating}</span>
                  </div>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">{currentRestaurant.name}</h2>
                  <p className="text-white/80 mb-4">{currentRestaurant.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{currentRestaurant.priceRange}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-white/60">
                      Tap to flip • Double tap to save
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back of Card */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white p-6">
              <div className="h-full flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{currentRestaurant.name}</h3>
                  <p className="text-muted-foreground text-sm">{currentRestaurant.description}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Menu Highlights</h4>
                  <div className="space-y-2">
                    {currentRestaurant.menuHighlights.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-xs">🍽️</span>
                        </div>
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{currentRestaurant.hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Avg {currentRestaurant.avgPrice}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-center text-muted-foreground">
                    Swipe ↑ to save • Swipe → to view profile • Swipe ← to skip
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Swipe Feedback Icons */}
          <div className={cn(
            "absolute top-1/2 left-8 transform -translate-y-1/2 text-6xl transition-all duration-200",
            swipeDirection === 'left' ? "opacity-100 scale-110" : "opacity-0 scale-90"
          )}>
            <div className="bg-red-500 rounded-full p-4 text-white">
              <X className="h-8 w-8" />
            </div>
          </div>
          
          <div className={cn(
            "absolute top-1/2 right-8 transform -translate-y-1/2 text-6xl transition-all duration-200",
            swipeDirection === 'right' ? "opacity-100 scale-110" : "opacity-0 scale-90"
          )}>
            <div className="bg-green-500 rounded-full p-4 text-white">
              <Eye className="h-8 w-8" />
            </div>
          </div>
          
          <div className={cn(
            "absolute top-8 left-1/2 transform -translate-x-1/2 text-6xl transition-all duration-200",
            swipeDirection === 'up' ? "opacity-100 scale-110" : "opacity-0 scale-90"
          )}>
            <div className="bg-primary rounded-full p-4 text-white">
              <Heart className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-12 h-12 bg-white border-2 border-red-200 hover:bg-red-50"
          onClick={() => handleSwipe('left')}
        >
          <X className="h-5 w-5 text-red-500" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-14 h-14 bg-white border-2 border-primary/20 hover:bg-primary/5"
          onClick={() => handleSwipe('up')}
        >
          <Heart className="h-6 w-6 text-primary" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-12 h-12 bg-white border-2 border-green-200 hover:bg-green-50"
          onClick={() => handleSwipe('right')}
        >
          <Eye className="h-5 w-5 text-green-500" />
        </Button>
      </div>

      {/* Roulette Button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <Button
          onClick={() => setShowRoulette(true)}
          className="rounded-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-medium flex items-center gap-2"
        >
          <Target className="h-4 w-4" />
          Lik Roulette
        </Button>
      </div>

      {/* Mood Selector Modal */}
      {showMoodSelector && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-80 p-6">
            <h3 className="text-lg font-bold mb-4 text-center">What's your mood?</h3>
            <div className="grid grid-cols-2 gap-3">
              {moods.map((mood) => (
                <Button
                  key={mood.id}
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => selectMood(mood.id)}
                >
                  <span className="text-2xl">{mood.icon}</span>
                  <span className="text-sm">{mood.label}</span>
                </Button>
              ))}
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4" 
              onClick={() => setShowMoodSelector(false)}
            >
              Skip
            </Button>
          </Card>
        </div>
      )}

      {/* Roulette Modal */}
      {showRoulette && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-80 p-6 text-center">
            <h3 className="text-lg font-bold mb-4">Lik Roulette</h3>
            <div className={cn(
              "w-32 h-32 mx-auto mb-6 rounded-full border-4 border-primary flex items-center justify-center text-4xl",
              isSpinning && "animate-spin"
            )}>
              🎯
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Let fate decide your next meal!
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setShowRoulette(false)}
                disabled={isSpinning}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleRouletteSpin}
                disabled={isSpinning}
                className="flex-1 glossy-red-pill"
              >
                {isSpinning ? 'Spinning...' : 'Spin!'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}