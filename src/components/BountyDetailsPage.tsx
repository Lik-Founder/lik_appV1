import { useState, useEffect } from 'react';
import { ArrowLeftIcon, MapPinIcon as MapPin, ClockIcon, StarIcon, UsersIcon, TrophyIcon, CurrencyDollarIcon, ViewfinderCircleIcon, CameraIcon, ShareIcon, BookmarkIcon, CheckCircleIcon as CheckCircle } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import likLogoHeart from '@/assets/images/Lik_Logo_Heart_1.0.png';

interface BountyDetailsPageProps {
  bountyId: string;
  onBack: () => void;
  onShowRestaurantProfile?: (restaurantId: string) => void;
  onShowUserProfile?: (userId: string) => void;
}

// Mock data for the bounty
const mockBountyData = {
  id: '1',
  title: 'Kebab Combo Challenge',
  restaurant: {
    id: 'rest1',
    name: 'Kebab Shop',
    rating: 4.5,
    address: '123 Food Street, Downtown',
    distance: '0.3 miles',
    isOpen: true,
    verified: true
  },
  dish: {
    name: 'Mediterranean Kebab Combo',
    description: 'Authentic lamb and chicken kebab served with fresh pita, hummus, and Mediterranean salad',
    price: '$18.99',
    calories: 650,
    allergens: ['Gluten', 'Dairy'],
    ingredients: ['Lamb', 'Chicken', 'Pita Bread', 'Hummus', 'Mediterranean Salad', 'Tzatziki'],
    spiceLevel: 2,
    dietaryTags: ['Halal', 'High Protein']
  },
  bounty: {
    reward: {
      coins: 750,
      xp: 50
    },
    difficulty: 'Intermediate',
    timeLimit: '24 hours',
    requirements: [
      'Visit during lunch hours (11 AM - 3 PM)',
      'Order the Mediterranean Kebab Combo',
      'Take a photo of your meal',
      'Share your experience with a review'
    ],
    completedBy: 127,
    totalSlots: 200,
    category: 'Food Challenge',
    sponsor: 'Kebab Shop',
    endDate: '2024-02-15T15:00:00Z'
  },
  gallery: [
    '/api/placeholder/400/300',
    '/api/placeholder/400/300',
    '/api/placeholder/400/300',
    '/api/placeholder/400/300'
  ],
  reviews: [
    {
      id: '1',
      user: {
        name: 'Alex Chen',
        avatar: '/api/placeholder/40/40',
        level: 12
      },
      rating: 5,
      text: 'Amazing flavors! The lamb was perfectly seasoned.',
      date: '2 days ago',
      helpful: 24
    },
    {
      id: '2',
      user: {
        name: 'Sarah Kim',
        avatar: '/api/placeholder/40/40',
        level: 8
      },
      rating: 4,
      text: 'Great portion size and fresh ingredients.',
      date: '1 week ago',
      helpful: 18
    }
  ],
  similarBounties: [
    {
      id: '2',
      title: 'Pizza Paradise',
      restaurant: 'Tony\'s Pizza',
      reward: 500,
      difficulty: 'Easy'
    },
    {
      id: '3',
      title: 'Sushi Master',
      restaurant: 'Sakura Sushi',
      reward: 900,
      difficulty: 'Hard'
    }
  ]
};

export function BountyDetailsPage({ bountyId, onBack, onShowRestaurantProfile, onShowUserProfile }: BountyDetailsPageProps) {
  const [bountyData] = useState(mockBountyData);
  const [timeLeft, setTimeLeft] = useState('23h 45m');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    // Simulate countdown timer
    const timer = setInterval(() => {
      // Update time left logic would go here
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAcceptBounty = () => {
    setIsAccepted(true);
    // Add bounty acceptance logic here
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const progress = (bountyData.bounty.completedBy / bountyData.bounty.totalSlots) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-pink-100">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg nav-rum-raisin text-gray-900">Bounty Details</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Share className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bookmark className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="pb-32 overflow-y-auto">
        {/* Hero Image Gallery */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={bountyData.gallery[selectedImageIndex]}
            alt={bountyData.dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Image Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {bountyData.gallery.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  selectedImageIndex === index ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>

          {/* Bounty Badge */}
          <div className="absolute top-4 left-4">
            <Badge className={cn("text-white font-bold", getDifficultyColor(bountyData.bounty.difficulty))}>
              <Trophy className="w-3 h-3 mr-1" />
              {bountyData.bounty.difficulty}
            </Badge>
          </div>

          {/* Timer */}
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
            <Timer className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">{timeLeft}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 pt-6 space-y-6">
          {/* Bounty Header */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 nav-rum-raisin">
                {bountyData.title}
              </h2>
              <p className="text-gray-600 mt-1">{bountyData.dish.description}</p>
            </div>

            {/* Restaurant Info */}
            <div 
              className="flex items-center gap-3 p-3 bg-white rounded-xl border border-pink-100 cursor-pointer hover:border-pink-200 transition-colors"
              onClick={() => onShowRestaurantProfile?.(bountyData.restaurant.id)}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {bountyData.restaurant.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{bountyData.restaurant.name}</h3>
                  {bountyData.restaurant.verified && (
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{bountyData.restaurant.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{bountyData.restaurant.distance}</span>
                  </div>
                  <Badge variant={bountyData.restaurant.isOpen ? "default" : "secondary"}>
                    {bountyData.restaurant.isOpen ? "Open" : "Closed"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Reward & Progress */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 nav-rum-raisin">Bounty Rewards</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                    <Coins className="w-4 h-4 text-yellow-600" />
                    <span className="text-yellow-800 font-bold">+{bountyData.bounty.reward.coins}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800 font-bold">+{bountyData.bounty.reward.xp} XP</span>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-gray-900 font-medium">
                    {bountyData.bounty.completedBy}/{bountyData.bounty.totalSlots} completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dish Details */}
          <div className="bg-white rounded-xl border border-pink-100 p-4 space-y-4">
            <h3 className="font-semibold text-gray-900 nav-rum-raisin flex items-center gap-2">
              <img src={likLogoHeart} alt="Lik" className="w-5 h-5" />
              Dish Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-sm text-gray-600">Price</span>
                <p className="font-semibold text-green-600">{bountyData.dish.price}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-gray-600">Calories</span>
                <p className="font-semibold text-gray-900">{bountyData.dish.calories}</p>
              </div>
            </div>

            {/* Dietary Tags */}
            <div className="space-y-2">
              <span className="text-sm text-gray-600">Dietary Information</span>
              <div className="flex flex-wrap gap-2">
                {bountyData.dish.dietaryTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Allergens */}
            <div className="space-y-2">
              <span className="text-sm text-gray-600">Contains</span>
              <div className="flex flex-wrap gap-2">
                {bountyData.dish.allergens.map((allergen, index) => (
                  <Badge key={index} variant="outline" className="text-orange-700 border-orange-300">
                    {allergen}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-xl border border-pink-100 p-4 space-y-4">
            <h3 className="font-semibold text-gray-900 nav-rum-raisin">Bounty Requirements</h3>
            <div className="space-y-3">
              {bountyData.bounty.requirements.map((requirement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{requirement}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-xl border border-pink-100 p-4 space-y-4">
            <h3 className="font-semibold text-gray-900 nav-rum-raisin">Recent Reviews</h3>
            <div className="space-y-4">
              {bountyData.reviews.map((review) => (
                <div key={review.id} className="space-y-2">
                  <div 
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => onShowUserProfile?.(review.user.name)}
                  >
                    <img
                      src={review.user.avatar}
                      alt={review.user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{review.user.name}</span>
                        <Badge variant="outline" className="text-xs">Lv.{review.user.level}</Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3 h-3",
                              i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"
                            )}
                          />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm ml-11">{review.text}</p>
                  <div className="ml-11">
                    <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {review.helpful} found helpful
                    </button>
                  </div>
                  {review.id !== bountyData.reviews[bountyData.reviews.length - 1].id && (
                    <Separator className="ml-11" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Similar Bounties */}
          <div className="bg-white rounded-xl border border-pink-100 p-4 space-y-4">
            <h3 className="font-semibold text-gray-900 nav-rum-raisin">Similar Bounties</h3>
            <div className="space-y-3">
              {bountyData.similarBounties.map((bounty) => (
                <div key={bounty.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{bounty.title}</h4>
                    <p className="text-sm text-gray-600">{bounty.restaurant}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-bold text-yellow-800">+{bounty.reward}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {bounty.difficulty}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-pink-100 p-4">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-pink-200 text-pink-600 hover:bg-pink-50"
            onClick={() => onShowRestaurantProfile?.(bountyData.restaurant.id)}
          >
            <MapPin className="w-4 h-4 mr-2" />
            View Restaurant
          </Button>
          <Button
            className={cn(
              "flex-1 text-white font-bold",
              isAccepted
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            )}
            onClick={handleAcceptBounty}
            disabled={isAccepted}
          >
            {isAccepted ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Accepted
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4 mr-2" />
                Accept Bounty
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}