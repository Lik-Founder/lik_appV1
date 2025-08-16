import React, { useEffect } from 'react';
import { X, MapPin, Clock, Users, Star, Heart, Coins } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BountyCardModalProps {
  bounty: {
    id: string;
    title: string;
    restaurant: string;
    description: string;
    image: string;
    reward: string;
    xp: string;
    difficulty: 'easy' | 'medium' | 'hard';
    timeLeft: string;
    distance: string;
    rating: number;
    likes: number;
    completedBy: string[];
    category: string;
    price: string;
    calories?: string;
    ingredients?: string[];
    allergens?: string[];
    nutritionFacts?: {
      protein: string;
      carbs: string;
      fat: string;
      fiber: string;
    };
  };
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  onShowRestaurantProfile?: (restaurantId: string) => void;
}

export function BountyCardModal({ 
  bounty, 
  isOpen, 
  onClose, 
  onAccept,
  onShowRestaurantProfile 
}: BountyCardModalProps) {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-backdrop"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide detail-card-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bounty-card-modal overflow-hidden bg-card border border-border/20 shadow-2xl">
          {/* Header Image */}
          <div className="relative h-64 overflow-hidden">
            <img 
              src={bounty.image}
              alt={bounty.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white border-0"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Difficulty Badge */}
            <Badge 
              className={cn(
                "absolute top-4 left-4 border",
                getDifficultyColor(bounty.difficulty)
              )}
            >
              {bounty.difficulty.toUpperCase()}
            </Badge>

            {/* Bounty Title & Restaurant */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="text-2xl font-bold text-shadow-lg mb-1">
                {bounty.title}
              </h2>
              <p 
                className="text-lg opacity-90 cursor-pointer hover:opacity-100 transition-opacity"
                onClick={() => onShowRestaurantProfile?.(bounty.restaurant)}
              >
                {bounty.restaurant}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Coins className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Reward</p>
                  <p className="font-semibold">{bounty.reward}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Time Left</p>
                  <p className="font-semibold">{bounty.timeLeft}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <MapPin className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Distance</p>
                  <p className="font-semibold">{bounty.distance}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Star className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="font-semibold">{bounty.rating}★</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">About This Bounty</h3>
              <p className="text-muted-foreground leading-relaxed">
                {bounty.description}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Dish Details */}
              <div>
                <h4 className="font-semibold mb-3">Dish Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">{bounty.price}</span>
                  </div>
                  {bounty.calories && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Calories:</span>
                      <span className="font-medium">{bounty.calories}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">{bounty.category}</span>
                  </div>
                </div>
              </div>

              {/* Social Stats */}
              <div>
                <h4 className="font-semibold mb-3">Community</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Likes:</span>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="font-medium">{bounty.likes}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed by:</span>
                    <span className="font-medium">{bounty.completedBy.length} users</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            {bounty.ingredients && (
              <div>
                <h4 className="font-semibold mb-3">Ingredients</h4>
                <div className="flex flex-wrap gap-2">
                  {bounty.ingredients.map((ingredient, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Allergens */}
            {bounty.allergens && bounty.allergens.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-yellow-600">⚠️ Allergens</h4>
                <div className="flex flex-wrap gap-2">
                  {bounty.allergens.map((allergen, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrition Facts */}
            {bounty.nutritionFacts && (
              <div>
                <h4 className="font-semibold mb-3">Nutrition Facts</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Protein</p>
                    <p className="font-semibold">{bounty.nutritionFacts.protein}</p>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Carbs</p>
                    <p className="font-semibold">{bounty.nutritionFacts.carbs}</p>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Fat</p>
                    <p className="font-semibold">{bounty.nutritionFacts.fat}</p>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Fiber</p>
                    <p className="font-semibold">{bounty.nutritionFacts.fiber}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Completed By Avatars */}
            {bounty.completedBy.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Recently Completed By</h4>
                <div className="flex -space-x-2">
                  {bounty.completedBy.slice(0, 5).map((user, index) => (
                    <div 
                      key={index}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background flex items-center justify-center text-xs font-semibold text-white"
                    >
                      {user[0]}
                    </div>
                  ))}
                  {bounty.completedBy.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-semibold">
                      +{bounty.completedBy.length - 5}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold"
                onClick={onAccept}
              >
                <Users className="h-4 w-4 mr-2" />
                Accept Bounty
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onShowRestaurantProfile?.(bounty.restaurant)}
              >
                View Restaurant
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}