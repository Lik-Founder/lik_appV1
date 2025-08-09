import React, { useState, useRef, useEffect } from 'react';
import { X, Trophy, Target, Heart, TrendingUp, Bell, MessageCircle, Users, Play, Timer } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRect?: DOMRect | null;
  user: {
    avatar: string;
    displayName: string;
    username: string;
    tasteTitle: string;
    level: number;
    xp: number;
    maxXp: number;
    badges: Array<{ id: string; icon: string; label: string; verified?: boolean }>;
  };
  stats: {
    streak: number;
    tickets: number;
    likCoins: string;
    hearts?: string;
  };
  dailyProgress: {
    currentTime: string;
    targetTime: string;
    bonusReward: string;
    streakDays: number;
    currentStreak: number;
  };
  onNavigate: (destination: string) => void;
}

const StatChip: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  onClick?: () => void;
}> = ({ icon, label, value, onClick }) => (
  <div 
    className={cn(
      "flex items-center gap-1.5 bg-muted/50 rounded-xl px-3 py-2 min-w-0",
      "transition-all duration-150 hover:bg-muted/70 active:scale-95",
      onClick && "cursor-pointer"
    )}
    onClick={onClick}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    aria-label={`${label}: ${value}`}
  >
    <span className="text-muted-foreground text-sm">{icon}</span>
    <span className="font-semibold text-sm text-foreground truncate">{value}</span>
  </div>
);

const QuickActionButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}> = ({ icon, label, onClick, className }) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-1.5 h-auto py-3 px-2",
      "rounded-xl hover:bg-muted/70 transition-all duration-150",
      "active:scale-95 touch-feedback",
      className
    )}
  >
    <span className="text-muted-foreground">{icon}</span>
    <span className="text-xs font-medium text-foreground">{label}</span>
  </Button>
);

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
  anchorRect,
  user,
  stats,
  dailyProgress,
  onNavigate,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Animation handling
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Calculate XP percentage
  const xpPercentage = (user.xp / user.maxXp) * 100;

  // Calculate position
  const getDropdownStyle = () => {
    if (!anchorRect) return {};

    const dropdownWidth = 320;
    const dropdownHeight = 480;
    const padding = 16;

    let left = anchorRect.left + anchorRect.width / 2 - dropdownWidth / 2;
    let top = anchorRect.bottom + 8;

    // Adjust if going off screen
    if (left < padding) left = padding;
    if (left + dropdownWidth > window.innerWidth - padding) {
      left = window.innerWidth - dropdownWidth - padding;
    }

    // If too close to bottom, show above
    if (top + dropdownHeight > window.innerHeight - padding) {
      top = anchorRect.top - dropdownHeight - 8;
    }

    return {
      position: 'fixed' as const,
      left: `${left}px`,
      top: `${top}px`,
      width: `${dropdownWidth}px`,
      zIndex: 50,
    };
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        style={{ animation: isAnimating ? 'fadeIn 200ms ease-out' : undefined }}
      />

      {/* Dropdown */}
      <Card
        ref={dropdownRef}
        style={getDropdownStyle()}
        className={cn(
          "p-4 shadow-2xl border-border/50 bg-background/95 backdrop-blur-xl",
          "transform-gpu will-change-transform",
          isAnimating && "animate-in slide-in-from-top-2 zoom-in-95 duration-200"
        )}
      >
        {/* Header / Identity */}
        <div className="flex items-start gap-3 mb-4">
          {/* Avatar with XP ring */}
          <div className="relative">
            <div className="relative w-12 h-12">
              {/* XP Progress Ring */}
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-muted/30"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="url(#xpGradient)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - xpPercentage / 100)}`}
                  className="transition-all duration-500"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f09433" />
                    <stop offset="25%" stopColor="#e6683c" />
                    <stop offset="50%" stopColor="#dc2743" />
                    <stop offset="75%" stopColor="#cc2366" />
                    <stop offset="100%" stopColor="#bc1888" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Avatar */}
              <img
                src={user.avatar}
                alt={user.displayName}
                className="absolute inset-1 w-10 h-10 rounded-full object-cover"
              />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-foreground truncate nav-rum-raisin">
                {user.displayName}
              </h3>
              {user.badges.map((badge) => (
                <Badge key={badge.id} variant="secondary" className="text-xs px-1.5 py-0.5">
                  {badge.icon}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {user.tasteTitle}
            </p>
            
            {/* Level and XP */}
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                Lv {user.level}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {user.xp.toLocaleString()} / {user.maxXp.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-full"
          >
            <X size={16} />
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <StatChip
            icon="🔥"
            label="Streak"
            value={stats.streak}
          />
          <StatChip
            icon="🎟️"
            label="Tickets"
            value={stats.tickets}
          />
          <StatChip
            icon="🪙"
            label="Lik Coins"
            value={stats.likCoins}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <QuickActionButton
            icon={<Trophy size={20} />}
            label="Passport"
            onClick={() => onNavigate('passport')}
          />
          <QuickActionButton
            icon={<Target size={20} />}
            label="Quests"
            onClick={() => onNavigate('quests')}
          />
          <QuickActionButton
            icon={<Heart size={20} />}
            label="Favorites"
            onClick={() => onNavigate('favorites')}
          />
          <QuickActionButton
            icon={<TrendingUp size={20} />}
            label="Leaderboard"
            onClick={() => onNavigate('leaderboard')}
          />
          <QuickActionButton
            icon={<Bell size={20} />}
            label="Notifications"
            onClick={() => onNavigate('notifications')}
          />
          <QuickActionButton
            icon={<MessageCircle size={20} />}
            label="Messages"
            onClick={() => onNavigate('messages')}
          />
        </div>

        {/* Daily Progress Widget */}
        <Card className="p-3 bg-muted/30 border-border/50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-foreground nav-rum-raisin">Daily Play</h4>
            <Badge variant="secondary" className="text-xs">
              {dailyProgress.bonusReward}
            </Badge>
          </div>

          {/* Timer Progress */}
          <div className="flex items-center gap-2 mb-3">
            <Timer size={16} className="text-muted-foreground" />
            <span className="text-sm font-mono text-foreground">
              {dailyProgress.currentTime} / {dailyProgress.targetTime}
            </span>
            <div className="flex-1 bg-muted rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(parseInt(dailyProgress.currentTime.split(':')[1]) / 120) * 100}%` 
                }}
              />
            </div>
          </div>

          {/* Streak Dots */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {Array.from({ length: 7 }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-200",
                    i < dailyProgress.currentStreak
                      ? "bg-primary shadow-sm"
                      : "bg-muted border border-border"
                  )}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('daily-details')}
              className="text-xs h-6 px-2 text-muted-foreground hover:text-foreground"
            >
              Details
            </Button>
          </div>

          {/* CTA */}
          <Button
            onClick={() => onNavigate('daily-play')}
            className="w-full mt-3 h-8 text-xs glossy-red-pill"
          >
            <Play size={14} className="mr-1" />
            Continue Today
          </Button>
        </Card>

        {/* Social & Utility Row */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('messages')}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <MessageCircle size={16} />
            Messages
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('friends')}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Users size={16} />
            Friends
          </Button>
        </div>
      </Card>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
};