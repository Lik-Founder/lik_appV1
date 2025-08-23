import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CurrencyDollarIcon as CoinsIcon, ArrowLeftIcon, FaceSmileIcon as PartyPopperIcon, MapPinIcon, ClockIcon, BoltIcon, StarIcon, GiftIcon, TrophyIcon, HeartIcon, FireIcon, ShoppingCartIcon, CheckIcon, UsersIcon } from '@heroicons/react/24/outline';
import { 
  BuildingStorefrontIcon as Coffee,
  BuildingStorefrontIcon as Hamburger,
  BuildingStorefrontIcon as Pizza,
  BuildingStorefrontIcon as Cookie,
  BuildingStorefrontIcon as IceCream,
  BeakerIcon as Wine,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

// Mock rewards data
const rewardCategories = [
  {
    id: 'food',
    name: 'Food & Drinks',
    icon: Hamburger,
    gradient: 'from-orange-500 to-red-500',
    rewards: [
      {
        id: '1',
        name: 'Free Coffee',
        description: 'Any coffee drink at participating cafes',
        cost: 50,
        icon: Coffee,
        rarity: 'common',
        category: 'drink',
        redeemableAt: ['Starbucks', 'Blue Bottle', 'Local Roasters'],
        expiresIn: '30 days'
      },
      {
        id: '2', 
        name: 'Pizza Slice',
        description: 'One slice of pizza from top-rated pizzerias',
        cost: 150,
        icon: Pizza,
        rarity: 'uncommon',
        category: 'food',
        redeemableAt: ['Tony\'s Pizza', 'Mama Mia', 'Slice Paradise'],
        expiresIn: '14 days'
      },
      {
        id: '3',
        name: 'Premium Dessert',
        description: 'Artisanal dessert from exclusive bakeries',
        cost: 300,
        icon: IceCream,
        rarity: 'rare',
        category: 'dessert',
        redeemableAt: ['Sweet Dreams', 'Artisan Delights'],
        expiresIn: '7 days'
      }
    ]
  },
  {
    id: 'experiences',
    name: 'Dining Experiences',
    icon: StarIcon,
    gradient: 'from-purple-500 to-pink-500',
    rewards: [
      {
        id: '4',
        name: 'Chef\'s Table',
        description: 'Exclusive 5-course tasting menu',
        cost: 1000,
        icon: StarIcon,
        rarity: 'legendary',
        category: 'experience',
        redeemableAt: ['Le Bernardin', 'Eleven Madison Park'],
        expiresIn: '90 days'
      },
      {
        id: '5',
        name: 'Wine Tasting',
        description: 'Premium wine tasting for two',
        cost: 500,
        icon: Wine,
        rarity: 'epic',
        category: 'experience',
        redeemableAt: ['Wine Bar Central', 'Vintage Cellars'],
        expiresIn: '60 days'
      }
    ]
  },
  {
    id: 'boosts',
    name: 'Lik Boosts',
    icon: BoltIcon,
    gradient: 'from-blue-500 to-cyan-500',
    rewards: [
      {
        id: '6',
        name: '2x XP Boost',
        description: 'Double XP for next 5 reviews',
        cost: 100,
        icon: BoltIcon,
        rarity: 'uncommon',
        category: 'boost',
        duration: '5 reviews'
      },
      {
        id: '7',
        name: 'Streak Shield',
        description: 'Protect your streak for 7 days',
        cost: 200,
        icon: FireIcon,
        rarity: 'rare',
        category: 'boost',
        duration: '7 days'
      }
    ]
  }
];

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  uncommon: 'from-green-400 to-green-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500'
};

const rarityGlow = {
  common: 'shadow-[0_0_15px_rgba(156,163,175,0.3)]',
  uncommon: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]',
  rare: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
  epic: 'shadow-[0_0_15px_rgba(147,51,234,0.3)]',
  legendary: 'shadow-[0_0_20px_rgba(245,158,11,0.5)]'
};

interface RewardsPageProps {
  onBack: () => void;
}

export function RewardsPage({ onBack }: RewardsPageProps) {
  const [userLikCoins] = useKV('user-lik-coins', 1200);
  const [redeemedRewards, setRedeemedRewards] = useKV('redeemed-rewards', []);
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [cart, setCart] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRedeem = (rewardId: string, cost: number) => {
    if (userLikCoins >= cost) {
      setRedeemedRewards((prev: string[]) => [...prev, rewardId]);
      // In real app, would deduct coins here
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const addToCart = (rewardId: string) => {
    setCart(prev => prev.includes(rewardId) ? prev : [...prev, rewardId]);
  };

  const selectedCategoryData = rewardCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Whimsical Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating coins */}
        <div className="absolute top-20 left-10 text-4xl opacity-20">🪙</div>
        <div className="absolute top-40 right-16 text-3xl opacity-25">🎁</div>
        <div className="absolute bottom-32 left-20 text-5xl opacity-15">✨</div>
        <div className="absolute top-60 left-1/3 text-2xl opacity-30">🏆</div>
        <div className="absolute bottom-40 right-1/4 text-3xl opacity-20">💎</div>
        <div className="absolute top-32 right-1/3 text-2xl opacity-25">🌟</div>
        
        {/* Floating orbs */}
        <div className="absolute top-16 right-20 w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-orange-500/15 rounded-full blur-sm"></div>
        <div className="absolute bottom-24 left-16 w-20 h-20 bg-gradient-to-br from-pink-400/15 to-red-500/10 rounded-full blur-sm"></div>
        <div className="absolute top-1/2 right-8 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-blue-500/15 rounded-full blur-sm"></div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/15 to-red-500/10 backdrop-blur-sm border-b border-orange-200/50 relative">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="rounded-full bg-white/70 hover:bg-white/90 backdrop-blur-sm shadow-md"
            >
              <ArrowLeftIcon className="h-5 w-5 text-red-600" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold font-rum-raisin bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Lik Rewards Store
              </h1>
              <p className="text-sm text-orange-700/80">Redeem your coins for amazing rewards!</p>
            </div>
          </div>
          
          {/* Coin Balance */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-4 py-2 shadow-lg">
            <div className="flex items-center gap-2">
              <CoinsIcon className="h-5 w-5 fill-current text-white" />
              <span className="font-bold text-white font-rum-raisin">{userLikCoins.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {showSuccess && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 text-center font-medium relative">
          <PartyPopperIcon className="h-4 w-4 inline mr-2" />
          Reward redeemed successfully! Check your profile for details.
          <StarIcon className="h-4 w-4 inline ml-2" />
        </div>
      )}

      {/* Category Tabs */}
      <div className="px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {rewardCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "rounded-full px-4 py-2 font-rum-raisin whitespace-nowrap transition-all duration-300",
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg font-bold`
                    : "bg-white/70 text-gray-600 hover:bg-white/90"
                )}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          {selectedCategoryData && (
            <>
              <selectedCategoryData.icon className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-bold font-rum-raisin text-gray-800">
                {selectedCategoryData.name}
              </h2>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {selectedCategoryData?.rewards.map((reward) => {
            const IconComponent = reward.icon;
            const isRedeemed = redeemedRewards.includes(reward.id);
            const canAfford = userLikCoins >= reward.cost;
            const isInCart = cart.includes(reward.id);

            return (
              <Card 
                key={reward.id} 
                className={cn(
                  "relative overflow-hidden transition-all duration-300 hover:scale-105",
                  rarityGlow[reward.rarity as keyof typeof rarityGlow],
                  isRedeemed && "opacity-60"
                )}
              >
                {/* Rarity border */}
                <div className={cn(
                  "absolute inset-0 rounded-lg opacity-30",
                  `bg-gradient-to-br ${rarityColors[reward.rarity as keyof typeof rarityColors]}`
                )} />
                
                <div className="relative p-4 bg-white/90 backdrop-blur-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-3 rounded-full bg-gradient-to-br shadow-lg",
                        rarityColors[reward.rarity as keyof typeof rarityColors]
                      )}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg font-rum-raisin text-gray-800">
                          {reward.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {reward.description}
                        </p>
                      </div>
                    </div>

                    <Badge 
                      variant="outline" 
                      className={cn(
                        "capitalize border-0 text-white font-bold",
                        `bg-gradient-to-r ${rarityColors[reward.rarity as keyof typeof rarityColors]}`
                      )}
                    >
                      {reward.rarity}
                    </Badge>
                  </div>

                  {/* Reward Details */}
                  <div className="space-y-2 mb-4">
                    {reward.redeemableAt && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPinIcon className="w-3.5 h-3.5" />
                        <span>Available at: {reward.redeemableAt.slice(0, 2).join(', ')}</span>
                        {reward.redeemableAt.length > 2 && (
                          <span className="text-orange-600">+{reward.redeemableAt.length - 2} more</span>
                        )}
                      </div>
                    )}
                    
                    {reward.expiresIn && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ClockIcon className="w-3.5 h-3.5" />
                        <span>Expires in {reward.expiresIn}</span>
                      </div>
                    )}

                    {reward.duration && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BoltIcon className="w-3.5 h-3.5" />
                        <span>Duration: {reward.duration}</span>
                      </div>
                    )}
                  </div>

                  {/* Cost and Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CoinsIcon className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-bold text-lg font-rum-raisin text-gray-800">
                        {reward.cost.toLocaleString()}
                      </span>
                      {!canAfford && (
                        <span className="text-xs text-red-500 font-medium">
                          (Need {(reward.cost - userLikCoins).toLocaleString()} more)
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {!isRedeemed && (
                        <>
                          {!isInCart ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addToCart(reward.id)}
                              disabled={!canAfford}
                              className="rounded-full border-orange-300 text-orange-600 hover:bg-orange-50"
                            >
                              <ShoppingCartIcon className="w-3.5 h-3.5 mr-1" />
                              Add
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full border-green-300 text-green-600 bg-green-50"
                            >
                              <CheckIcon className="w-3.5 h-3.5 mr-1" />
                              Added
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            onClick={() => handleRedeem(reward.id, reward.cost)}
                            disabled={!canAfford}
                            className={cn(
                              "rounded-full font-bold bg-gradient-to-r shadow-lg",
                              canAfford 
                                ? "from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white" 
                                : "from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed"
                            )}
                          >
                            <GiftIcon className="w-3.5 h-3.5 mr-1" />
                            Redeem
                          </Button>
                        </>
                      )}

                      {isRedeemed && (
                        <Button 
                          size="sm" 
                          disabled 
                          className="rounded-full bg-green-100 text-green-600 font-bold"
                        >
                          <CheckIcon className="w-3.5 h-3.5 mr-1" />
                          Redeemed
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <Card className="sticky bottom-4 bg-gradient-to-r from-orange-100 to-red-100 border-orange-300 shadow-lg">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold font-rum-raisin text-gray-800">
                  Cart ({cart.length} items)
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCart([])}
                  className="text-red-600 hover:bg-red-50"
                >
                  Clear
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CoinsIcon className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">
                    Total: {cart.reduce((total, itemId) => {
                      const reward = rewardCategories
                        .flatMap(cat => cat.rewards)
                        .find(r => r.id === itemId);
                      return total + (reward?.cost || 0);
                    }, 0).toLocaleString()} coins
                  </span>
                </div>
                
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full"
                  onClick={() => {
                    // Redeem all items in cart
                    cart.forEach(itemId => {
                      const reward = rewardCategories
                        .flatMap(cat => cat.rewards)
                        .find(r => r.id === itemId);
                      if (reward) {
                        handleRedeem(itemId, reward.cost);
                      }
                    });
                    setCart([]);
                  }}
                >
                  <GiftIcon className="w-3.5 h-3.5 mr-1" />
                  Redeem All
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}