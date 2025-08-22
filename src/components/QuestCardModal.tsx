import React, { useEffect, useState } from 'react';
import { XMarkIcon as X, MapPinIcon as MapPin, ClockIcon as Clock, UsersIcon as Users, StarIcon as Star, TrophyIcon as Trophy, CurrencyDollarIcon as Coins, FlagIcon as Flag } from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface QuestCardModalProps {
  quest: {
    id: string;
    title: string;
    description: string;
    image: string;
    reward: string;
    xp: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
    timeLeft: string;
    locations: number;
    category: string;
    type: 'solo' | 'team' | 'community';
    progress?: {
      current: number;
      total: number;
    };
    requirements: string[];
    locations_list?: {
      name: string;
      address: string;
      completed: boolean;
    }[];
    participants?: number;
    leaderboard?: {
      position: number;
      total: number;
    };
    tips?: string[];
    questGiver?: {
      name: string;
      avatar: string;
      title: string;
    };
  };
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  onShowRestaurantProfile?: (restaurantId: string) => void;
}

export function QuestCardModal({ 
  quest, 
  isOpen, 
  onClose, 
  onAccept,
  onShowRestaurantProfile 
}: QuestCardModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200); // Match the animation duration
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
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
  }, [isOpen]);

  if (!isOpen) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'extreme': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'solo': return <Users className="h-4 w-4" />;
      case 'team': return <Users className="h-4 w-4" />;
      case 'community': return <Flag className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'solo': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'team': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'community': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm",
        isClosing ? "animate-fadeOut" : "modal-backdrop"
      )}
      onClick={handleClose}
    >
      <div 
        className={cn(
          "w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide",
          isClosing ? "modal-closing" : "detail-card-enter"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="quest-card-modal overflow-hidden bg-card border border-border/20 shadow-2xl">
          {/* Header Image */}
          <div className="relative h-64 overflow-hidden">
            <img 
              src={quest.image}
              alt={quest.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white border-0"
              onClick={handleClose}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge 
                className={cn(
                  "border",
                  getDifficultyColor(quest.difficulty)
                )}
              >
                {quest.difficulty.toUpperCase()}
              </Badge>
              <Badge 
                className={cn(
                  "border flex items-center gap-1",
                  getTypeColor(quest.type)
                )}
              >
                {getTypeIcon(quest.type)}
                {quest.type.toUpperCase()}
              </Badge>
            </div>

            {/* Quest Title */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="text-2xl font-bold text-shadow-lg mb-1">
                {quest.title}
              </h2>
              <p className="text-lg opacity-90">
                {quest.category}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Quest Giver */}
            {quest.questGiver && (
              <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                  {quest.questGiver.avatar || quest.questGiver.name[0]}
                </div>
                <div>
                  <p className="font-semibold">{quest.questGiver.name}</p>
                  <p className="text-sm text-muted-foreground">{quest.questGiver.title}</p>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Coins className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Reward</p>
                  <p className="font-semibold">{quest.reward}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Time Left</p>
                  <p className="font-semibold">{quest.timeLeft}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <MapPin className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Locations</p>
                  <p className="font-semibold">{quest.locations}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">XP Reward</p>
                  <p className="font-semibold">{quest.xp}</p>
                </div>
              </div>
            </div>

            {/* Progress */}
            {quest.progress && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Progress</h4>
                  <span className="text-sm text-muted-foreground">
                    {quest.progress.current}/{quest.progress.total}
                  </span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full progress-bar-smooth"
                    style={{ width: `${(quest.progress.current / quest.progress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Quest Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {quest.description}
              </p>
            </div>

            {/* Requirements */}
            <div>
              <h4 className="font-semibold mb-3">Requirements</h4>
              <div className="space-y-2">
                {quest.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    <span className="text-sm">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Locations List */}
            {quest.locations_list && (
              <div>
                <h4 className="font-semibold mb-3">Quest Locations</h4>
                <div className="space-y-3">
                  {quest.locations_list.map((location, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border",
                        location.completed 
                          ? "bg-green-500/10 border-green-500/30" 
                          : "bg-muted/20 border-border"
                      )}
                    >
                      <div>
                        <p className="font-medium">{location.name}</p>
                        <p className="text-sm text-muted-foreground">{location.address}</p>
                      </div>
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center",
                        location.completed 
                          ? "bg-green-500 text-white" 
                          : "bg-muted border border-border"
                      )}>
                        {location.completed && <span className="text-xs">✓</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quest Stats */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Participants */}
              {quest.participants && (
                <div>
                  <h4 className="font-semibold mb-3">Community</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Participants:</span>
                      <span className="font-medium">{quest.participants}</span>
                    </div>
                    {quest.leaderboard && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Your Rank:</span>
                        <span className="font-medium">#{quest.leaderboard.position} of {quest.leaderboard.total}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quest Tips */}
              {quest.tips && (
                <div>
                  <h4 className="font-semibold mb-3">💡 Quest Tips</h4>
                  <div className="space-y-2">
                    {quest.tips.map((tip, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        • {tip}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold"
                onClick={onAccept}
              >
                <Trophy className="h-4 w-4 mr-2" />
                Accept Quest
              </Button>
              <Button variant="outline" className="flex-1">
                <Users className="h-4 w-4 mr-2" />
                View Leaderboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}