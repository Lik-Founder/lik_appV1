import React from 'react';
import { cn } from '@/lib/utils';

interface ProfileAvatarProps {
  src: string;
  alt: string;
  level: number;
  xp: number;
  maxXp: number;
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
    container: 'w-24 h-24',
    image: 'w-[5.5rem] h-[5.5rem]',
    ring: 'w-24 h-24',
    levelBadge: 'w-12 h-7 text-base',
    strokeWidth: 4,
  },
};

export function ProfileAvatar({ 
  src, 
  alt, 
  level, 
  xp, 
  maxXp, 
  size = 'lg', 
  className, 
  showLevel = true,
  onClick 
}: ProfileAvatarProps) {
  const config = sizeConfig[size];
  const progressPercentage = (xp / maxXp) * 100;
  const circumference = 2 * Math.PI * 50;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div 
      className={cn("relative flex items-center justify-center", config.container, className)}
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
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={config.strokeWidth}
          fill="transparent"
        />
        {/* Progress Ring */}
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
          className="transition-all duration-500 ease-out"
        />
        <defs>
          <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF7BAA" />
            <stop offset="50%" stopColor="#FF1A75" />
            <stop offset="100%" stopColor="#B30026" />
          </linearGradient>
        </defs>
      </svg>

      {/* Profile Image */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "rounded-full object-cover border-2 border-white/20",
          config.image
        )}
      />

      {/* Level Badge */}
      {showLevel && (
        <div 
          className={cn(
            "absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#FF7BAA] via-[#FF1A75] to-[#B30026] text-white font-bold rounded-full flex items-center justify-center border-2 border-white/30",
            config.levelBadge
          )}
        >
          {level}
        </div>
      )}
    </div>
  );
}