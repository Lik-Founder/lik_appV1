import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Users, Mail, Timer, Play } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

const MenuButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}> = ({ icon, label, onClick, className }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl",
      "menu-button-whimsical transition-all duration-200",
      "border border-slate-700/30 group",
      className
    )}
  >
    <span className="text-xl sm:text-2xl emoji-bounce">{icon}</span>
    <span className="flex-1 text-left text-white font-medium text-base sm:text-lg nav-rum-raisin">
      {label}
    </span>
    <ChevronRight 
      size={18} 
      className="text-slate-400 group-hover:text-white transition-colors sm:w-5 sm:h-5" 
    />
  </button>
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

    // Responsive sizing
    const isMobile = window.innerWidth < 480;
    const dropdownWidth = isMobile ? Math.min(320, window.innerWidth - 32) : 340;
    const dropdownHeight = isMobile ? Math.min(520, window.innerHeight - 80) : 560;
    const padding = isMobile ? 16 : 20;

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

    // Ensure it doesn't go above screen
    if (top < padding) {
      top = padding;
    }

    return {
      position: 'fixed' as const,
      left: `${left}px`,
      top: `${top}px`,
      width: `${dropdownWidth}px`,
      maxHeight: `${dropdownHeight}px`,
      zIndex: 50,
    };
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        style={{ animation: isAnimating ? 'fadeIn 200ms ease-out' : undefined }}
      />

      {/* Dropdown */}
      <Card
        ref={dropdownRef}
        style={getDropdownStyle()}
        className={cn(
          "shadow-2xl profile-dropdown-whimsical backdrop-blur-xl overflow-y-auto",
          "transform-gpu will-change-transform rounded-3xl",
          "p-4 sm:p-6",
          isAnimating && "animate-in slide-in-from-top-2 zoom-in-95 duration-200"
        )}
      >
        {/* Header with XP Ring and Stats */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          {/* XP Ring with Level */}
          <div className="relative xp-ring-animated">
            <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
              {/* Outer Progress Ring */}
              <svg className="w-16 h-16 sm:w-20 sm:h-20 transform -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="rgb(51 65 85)"
                  strokeWidth="3"
                  fill="none"
                />
                {/* Orange/Pink gradient progress */}
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="url(#orangePinkGradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 35}`}
                  strokeDashoffset={`${2 * Math.PI * 35 * (1 - xpPercentage / 100)}`}
                  className="transition-all duration-500"
                  strokeLinecap="round"
                />
                {/* Purple progress overlay */}
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke="url(#purpleGradient)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 30}`}
                  strokeDashoffset={`${2 * Math.PI * 30 * (1 - (xpPercentage * 0.8) / 100)}`}
                  className="transition-all duration-500"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="orangePinkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                  <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Level Number */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-xl sm:text-2xl nav-rum-raisin">{user.level}</span>
              </div>
            </div>
            
            {/* Level badge at bottom */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-slate-800 rounded-full px-2 py-0.5 border border-slate-600 level-badge-sparkle">
              <span className="text-white text-xs sm:text-sm font-medium">{user.level}</span>
            </div>
          </div>

          {/* Title and Stats */}
          <div className="flex-1 ml-3 sm:ml-4">
            <h2 className="text-white text-lg sm:text-2xl font-bold nav-rum-raisin mb-1">Grand Master</h2>
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Streak */}
              <div className="flex items-center gap-1">
                <span className="text-lg sm:text-2xl emoji-bounce">🔥</span>
                <span className="text-white text-sm sm:text-xl font-bold">{stats.streak}</span>
              </div>
              {/* Tickets */}
              <div className="flex items-center gap-1">
                <span className="text-lg sm:text-2xl emoji-bounce" style={{ animationDelay: '0.5s' }}>🎫</span>
                <span className="text-white text-sm sm:text-xl font-bold">{stats.tickets}</span>
              </div>
              {/* Lik Coins */}
              <div className="flex items-center gap-1">
                <span className="text-lg sm:text-2xl emoji-bounce" style={{ animationDelay: '1s' }}>🪙</span>
                <span className="text-white text-sm sm:text-xl font-bold">{stats.likCoins}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Buttons */}
        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
          <MenuButton
            icon="📱"
            label="View Passport"
            onClick={() => onNavigate('passport')}
          />
          <MenuButton
            icon="🎯"
            label="My Bounties & Quests"
            onClick={() => onNavigate('quests')}
          />
          <MenuButton
            icon="❤️"
            label="Favorites"
            onClick={() => onNavigate('favorites')}
          />
          <MenuButton
            icon="👤"
            label="Recent Activity"
            onClick={() => onNavigate('activity')}
          />
        </div>

        {/* Daily Challenge Widget */}
        <div className="mb-4 sm:mb-6 daily-challenge-widget rounded-xl sm:rounded-2xl p-3 sm:p-4">
          <p className="text-slate-300 text-center mb-3 sm:mb-4 text-xs sm:text-sm">
            Play 2 minutes to earn your daily bonus
          </p>
          
          <div className="flex items-center justify-between">
            {/* Timer Circle */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 timer-circle-glow">
              <svg className="w-20 h-20 sm:w-24 sm:h-24 transform -rotate-90" viewBox="0 0 96 96">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="rgb(51 65 85)"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#f97316"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * 0.95}`}
                  className="transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Timer Display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-mono text-base sm:text-lg">0:00</span>
              </div>
              
              {/* Small flame icon */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-orange-500 rounded-full flex items-center justify-center flame-glow">
                <span className="text-xs sm:text-sm">🔥</span>
              </div>
            </div>

            {/* Level Progress */}
            <div className="flex-1 ml-4 sm:ml-6">
              <div className="text-white text-right mb-2">
                <span className="text-xs sm:text-sm text-slate-300">Level</span>
                <div className="text-2xl sm:text-3xl font-bold text-cyan-400 nav-rum-raisin">+600</div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-2.5 sm:h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full progress-bar-animated w-3/4 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-700/50">
          <button
            onClick={() => onNavigate('friends')}
            className="flex items-center gap-1.5 sm:gap-2 text-slate-300 hover:text-white transition-colors social-button-whimsical rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2"
          >
            <Users size={18} className="sm:w-5 sm:h-5" />
            <span className="nav-rum-raisin text-sm sm:text-base">Friends</span>
          </button>
          
          <button
            onClick={() => onNavigate('messages')}
            className="flex items-center gap-1.5 sm:gap-2 text-slate-300 hover:text-white transition-colors social-button-whimsical rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2"
          >
            <Mail size={18} className="sm:w-5 sm:h-5" />
            <span className="nav-rum-raisin text-sm sm:text-base">Messages</span>
          </button>
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