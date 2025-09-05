import React from 'react';
import { cn } from '@/lib/utils';

interface ProfileAvatarProps {
  src: string;
  alt?: string;
  level?: number;
  xp?: number;
  maxXp?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showLevel?: boolean;
  onClick?: () => void;
}

const sizeConfig = {
  sm: {
    container: 'w-12 h-12',
    image: 'w-10 h-10',
    ring: 'w-12 h-12',
    levelBadge: 'w-6 h-4 text-[10px]',
    strokeWidth: 2,
  },
  md: {
    container: 'w-16 h-16',
    image: 'w-14 h-14',
    ring: 'w-16 h-16',
    levelBadge: 'w-8 h-5 text-xs',
    strokeWidth: 3,
  },
  lg: {
    container: 'w-20 h-20',
    image: 'w-[4.5rem] h-[4.5rem]',
    ring: 'w-20 h-20',
    levelBadge: 'w-10 h-6 text-sm',
    strokeWidth: 3,
  },
  xl: {
    container: 'w-28 h-28',
    image: 'w-24 h-24',
    ring: 'w-28 h-28',
    levelBadge: 'w-12 h-7 text-sm',
    strokeWidth: 4,
  },
};

export function ProfileAvatar({ 
  src, 
  alt = 'Profile', 
  level = 1, 
  xp = 0, 
  maxXp = 100, 
  size = 'lg', 
  className, 
  showLevel = true,
  onClick 
}: ProfileAvatarProps) {
  const config = sizeConfig[size];
  
  // Ensure we have valid numbers for calculation
  const safeXp = typeof xp === 'number' ? xp : 0;
  const safeMaxXp = typeof maxXp === 'number' && maxXp > 0 ? maxXp : 100;
  const progressPercentage = Math.min((safeXp / safeMaxXp) * 100, 100);
  
  const circumference = 2 * Math.PI * 46;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div 
      className={cn("relative flex items-center justify-center cursor-pointer", config.container, className)}
      onClick={onClick}
    >
      {/* XP Progress Ring */}
      <svg 
        className={cn("absolute inset-0 transform -rotate-90", config.ring)}
        viewBox="0 0 100 100"
      >
        {/* Background Ring */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="rgba(220, 20, 60, 0.15)"
          strokeWidth={config.strokeWidth}
          fill="transparent"
        />
        {/* Progress Ring with red glow */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="url(#xpGradient)"
          strokeWidth={config.strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out drop-shadow-[0_0_6px_rgba(220,20,60,0.4)]"
        />
        <defs>
          <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF7BAA" />
            <stop offset="50%" stopColor="#FF1A75" />
            <stop offset="100%" stopColor="#DC143C" />
          </linearGradient>
        </defs>
      </svg>

      {/* Profile Image */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "rounded-full object-cover border-3 border-white/30 shadow-lg",
          config.image
        )}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face';
        }}
      />

      {/* Level Badge */}
      {showLevel && level && (
        <div 
          className={cn(
            "absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#FF7BAA] via-[#FF1A75] to-[#DC143C] text-white font-bold rounded-full flex items-center justify-center border-2 border-white/50 shadow-md font-rum-raisin",
            config.levelBadge
          )}
        >
          {level}
        </div>
      )}
    </div>
  );
}