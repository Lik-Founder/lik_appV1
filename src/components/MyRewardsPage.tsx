import React, { useState } from 'react';
import { ArrowLeftIcon, GiftIcon, TicketIcon, CrownIcon, StarIcon, ClockIcon, MapPinIcon, SparklesIcon, CurrencyDollarIcon as CoinsIcon, CupIcon as CoffeeIcon, UserIcon as PizzaIcon, HeartIcon, UsersIcon, TrophyIcon, FireIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface MyRewardsPageProps {
  onBack: () => void;
}

// Mock data for rewards
const userRewards = {
  likCoins: 2480,
  likTickets: 15,
  totalSaved: '$147',
  streakDays: 12
};

const coupons = [
  {
    id: 1,
    title: '30% Off Pizza Night',
    restaurant: 'Tony\'s Pizzeria',
    value: '$12 Off',
    expiresIn: '3 days',
    description: 'Valid for any large pizza order after 6 PM',
    rarity: 'rare',
    image: '🍕',
    usedCount: 0,
    maxUses: 1,
    code: 'PIZZA30LIK'
  },
  {
    id: 2,
    title: 'Free Coffee Upgrade',
    restaurant: 'Bean There Café',
    value: '$4 Value',
    expiresIn: '1 week',
    description: 'Upgrade any coffee to premium blend',
    rarity: 'common',
    image: '☕',
    usedCount: 1,
    maxUses: 3,
    code: 'CAFFEINE22'
  },
  {
    id: 3,
    title: 'Buy 1 Get 1 Free',
    restaurant: 'Burger Junction',
    value: '$15 Value',
    expiresIn: '2 weeks',
    description: 'Free burger with purchase of any combo meal',
    rarity: 'epic',
    image: '🍔',
    usedCount: 0,
    maxUses: 1,
    code: 'BOGO15BJ'
  }
];

const loyaltyPrograms = [
  {
    id: 1,
    restaurant: 'Bella Italia',
    level: 'Gold Member',
    progress: 85,
    nextReward: 'Free Dessert',
    points: 850,
    maxPoints: 1000,
    benefits: ['10% Off All Orders', 'Priority Seating', 'Birthday Special'],
    image: '🇮🇹',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: 2,
    restaurant: 'Sushi Zen',
    level: 'Silver Member',
    progress: 60,
    nextReward: 'Free Appetizer',
    points: 300,
    maxPoints: 500,
    benefits: ['5% Off Orders', 'Member Events'],
    image: '🍣',
    color: 'from-gray-300 to-gray-500'
  },
  {
    id: 3,
    restaurant: 'Taco Fiesta',
    level: 'Bronze Member',
    progress: 30,
    nextReward: 'Free Side',
    points: 150,
    maxPoints: 500,
    benefits: ['Member Discounts'],
    image: '🌮',
    color: 'from-amber-600 to-orange-700'
  }
];

const specialRewards = [
  {
    id: 1,
    title: 'Foodie Explorer Badge',
    description: 'Visited 25+ different restaurants',
    earned: true,
    rarity: 'legendary',
    icon: '🏆',
    date: '2024-01-15'
  },
  {
    id: 2,
    title: 'Early Bird Special',
    description: 'Completed 10 morning quests',
    earned: true,
    rarity: 'rare',
    icon: '🌅',
    date: '2024-01-10'
  },
  {
    id: 3,
    title: 'Social Butterfly',
    description: 'Share 50 food posts',
    earned: false,
    rarity: 'epic',
    icon: '🦋',
    progress: 42,
    maxProgress: 50
  }
];

export function MyRewardsPage({ onBack }: MyRewardsPageProps) {
  const [activeTab, setActiveTab] = useState<'coupons' | 'loyalty' | 'rewards'>('coupons');

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-pink-50 to-orange-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-pink-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 hover:bg-pink-100 rounded-full"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
            </Button>
            <div className="flex items-center gap-2">
              <GiftIcon className="h-6 w-6 text-pink-500" />
              <h1 className="text-xl font-bold text-gray-900 nav-rum-raisin">My Rewards</h1>
            </div>
          </div>
          
          {/* Coins Display */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
              <CoinsIcon className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-bold text-yellow-700">{userRewards.likCoins}</span>
            </div>
            <div className="flex items-center gap-1 bg-purple-100 px-3 py-1 rounded-full">
              <TicketIcon className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-bold text-purple-700">{userRewards.likTickets}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="px-4 py-4 bg-gradient-to-r from-pink-100 to-orange-100">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600 nav-rum-raisin">{userRewards.totalSaved}</div>
            <div className="text-xs text-pink-500">Total Saved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 nav-rum-raisin flex items-center justify-center gap-1">
              <FireIcon className="h-5 w-5" />
              {userRewards.streakDays}
            </div>
            <div className="text-xs text-orange-500">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 nav-rum-raisin">{coupons.length + loyaltyPrograms.length}</div>
            <div className="text-xs text-purple-500">Active Rewards</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 py-3 bg-white/60">
        <div className="flex bg-white/80 rounded-2xl p-1">
          {[
            { id: 'coupons', label: 'Coupons', icon: TicketIcon },
            { id: 'loyalty', label: 'Loyalty', icon: CrownIcon },
            { id: 'rewards', label: 'Rewards', icon: TrophyIcon }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-1 gap-2 rounded-xl transition-all",
                  activeTab === tab.id 
                    ? "glossy-red-pill text-white font-semibold nav-rum-raisin" 
                    : "text-gray-600 hover:text-gray-800 nav-rum-raisin font-medium"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {activeTab === 'coupons' && (
          <div className="space-y-4">
            {coupons.map(coupon => (
              <div
                key={coupon.id}
                className={cn(
                  "bg-white rounded-3xl p-4 border-2 shadow-lg relative overflow-hidden",
                  getRarityBorder(coupon.rarity)
                )}
              >
                {/* Rarity Background */}
                <div className={cn(
                  "absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl opacity-20 rounded-bl-3xl",
                  getRarityColor(coupon.rarity)
                )} />
                
                <div className="flex items-start gap-3 relative z-10">
                  <div className="text-3xl">{coupon.image}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 nav-rum-raisin">{coupon.title}</h3>
                        <p className="text-sm text-gray-600">{coupon.restaurant}</p>
                      </div>
                      <Badge className={cn(
                        "text-white font-semibold",
                        `bg-gradient-to-r ${getRarityColor(coupon.rarity)}`
                      )}>
                        {coupon.value}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1">{coupon.description}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <ClockIcon className="h-3 w-3" />
                        <span>Expires in {coupon.expiresIn}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {coupon.usedCount}/{coupon.maxUses} used
                        </span>
                        <Button size="sm" className="h-7 px-3 bg-pink-500 hover:bg-pink-600 rounded-full">
                          <span className="text-xs font-semibold">Use</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'loyalty' && (
          <div className="space-y-4">
            {loyaltyPrograms.map(program => (
              <div key={program.id} className="bg-white rounded-3xl p-4 shadow-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{program.image}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 nav-rum-raisin">{program.restaurant}</h3>
                        <Badge className={cn(
                          "text-white font-semibold mt-1",
                          `bg-gradient-to-r ${program.color}`
                        )}>
                          {program.level}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">{program.points}/{program.maxPoints}</div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Next: {program.nextReward}</span>
                        <span>{program.progress}%</span>
                      </div>
                      <Progress value={program.progress} className="h-2" />
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-1">Benefits:</div>
                      <div className="flex flex-wrap gap-1">
                        {program.benefits.map((benefit, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-4">
            {specialRewards.map(reward => (
              <div
                key={reward.id}
                className={cn(
                  "bg-white rounded-3xl p-4 shadow-lg border-2 relative",
                  reward.earned ? getRarityBorder(reward.rarity) : "border-gray-200 opacity-75"
                )}
              >
                {/* Sparkle effect for earned rewards */}
                {reward.earned && (
                  <div className="absolute top-2 right-2">
                    <SparklesIcon className="h-4 w-4 text-yellow-500" />
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "text-3xl p-2 rounded-2xl",
                    reward.earned ? "bg-gradient-to-br from-yellow-100 to-orange-100" : "bg-gray-100"
                  )}>
                    {reward.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={cn(
                      "font-bold nav-rum-raisin",
                      reward.earned ? "text-gray-900" : "text-gray-500"
                    )}>
                      {reward.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
                    
                    {reward.earned ? (
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={cn(
                          "text-white font-semibold",
                          `bg-gradient-to-r ${getRarityColor(reward.rarity)}`
                        )}>
                          Earned
                        </Badge>
                        <span className="text-xs text-gray-500">{reward.date}</span>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{reward.progress}/{reward.maxProgress}</span>
                        </div>
                        <Progress value={(reward.progress! / reward.maxProgress!) * 100} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}