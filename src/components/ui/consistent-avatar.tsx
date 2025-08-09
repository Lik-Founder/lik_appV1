import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ConsistentAvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'default' | 'story' | 'story-viewed' | 'xp-ring' | 'level-badge';
  level?: number;
  xpProgress?: number; // 0-1 for XP ring progress
  className?: string;
  onClick?: () => void;
  isOnline?: boolean;
  hasNotification?: boolean;
  notificationCount?: number;
  children?: React.ReactNode;
}

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8', 
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-20 h-20',
};

const fallbackSizeClasses = {
  xs: 'text-xs',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
  '2xl': 'text-xl',
};

export function ConsistentAvatar({
  src,
  alt,
  fallback,
  size = 'md',
  variant = 'default',
  level,
  xpProgress = 0,
  className,
  onClick,
  isOnline,
  hasNotification,
  notificationCount,
  children,
}: ConsistentAvatarProps) {
  const sizeClass = sizeClasses[size];
  const fallbackSizeClass = fallbackSizeClasses[size];
  
  // Calculate ring dimensions based on size
  const ringPadding = size === 'xs' ? 1 : size === 'sm' ? 1.5 : 2;
  const ringWidth = size === 'xs' ? 1 : size === 'sm' ? 1.5 : 2;
  
  if (variant === 'xp-ring') {
    const numericSize = size === 'xs' ? 24 : size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 48 : size === 'xl' ? 64 : 80;
    const centerX = numericSize / 2;
    const centerY = numericSize / 2;
    const radius = (numericSize / 2) - ringWidth;
    const circumference = 2 * Math.PI * radius;
    
    return (
      <div className={cn("relative", className)}>
        <div className={cn("relative", sizeClass)}>
          {/* XP Progress Ring */}
          <svg className="w-full h-full transform -rotate-90 absolute inset-0">
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              stroke="currentColor"
              strokeWidth={ringWidth}
              fill="none"
              className="text-muted"
            />
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              stroke="url(#xpGradient)"
              strokeWidth={ringWidth}
              fill="none"
              strokeLinecap="round"
              className="transition-all duration-500"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: circumference * (1 - xpProgress),
              }}
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
          <div className={cn("absolute", size === 'xs' ? "inset-0.5" : size === 'sm' ? "inset-1" : "inset-2")}>
            <Avatar className={cn("w-full h-full", onClick && "cursor-pointer")} onClick={onClick}>
              <AvatarImage src={src} alt={alt} />
              <AvatarFallback className={fallbackSizeClass}>
                {fallback}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        {/* Level Badge */}
        {level && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
            <Badge className="text-xs px-2 py-0.5 h-5 bg-primary text-primary-foreground font-bold">
              {level}
            </Badge>
          </div>
        )}
        
        {children}
      </div>
    );
  }

  if (variant === 'story' || variant === 'story-viewed') {
    const ringClass = variant === 'story' ? 'story-ring' : 'story-ring-viewed';
    
    return (
      <div className={cn("relative", className)}>
        <div className={ringClass}>
          <Avatar className={cn(sizeClass, "border-2 border-background", onClick && "cursor-pointer")} onClick={onClick}>
            <AvatarImage src={src} alt={alt} />
            <AvatarFallback className={fallbackSizeClass}>
              {fallback}
            </AvatarFallback>
          </Avatar>
        </div>
        
        {/* Online Status */}
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
        )}
        
        {/* Notification Indicator */}
        {hasNotification && (
          <div className="absolute -top-1 -right-1">
            <Badge className="w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white">
              {notificationCount && notificationCount > 0 ? (notificationCount > 99 ? '99+' : notificationCount) : ''}
            </Badge>
          </div>
        )}
        
        {children}
      </div>
    );
  }

  if (variant === 'level-badge') {
    return (
      <div className={cn("relative", className)}>
        {/* XP Ring Background */}
        <div className="relative">
          <div className="w-full h-full rounded-full bg-background p-0.5">
            <div className={cn(
              "w-full h-full rounded-full bg-gradient-to-br from-orange-500 to-red-500",
              sizeClass
            )}>
              <Avatar className={cn("w-full h-full", onClick && "cursor-pointer")} onClick={onClick}>
                <AvatarImage src={src} alt={alt} />
                <AvatarFallback className={fallbackSizeClass}>
                  {fallback}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
        
        {/* Level Badge */}
        {level && (
          <div className="absolute -bottom-1 -right-1 bg-background border-2 border-background rounded-full px-1.5 py-0.5">
            <span className="text-xs font-bold text-primary">
              {level}
            </span>
          </div>
        )}
        
        {/* Online Status */}
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
        )}
        
        {children}
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("relative", className)}>
      <Avatar className={cn(sizeClass, onClick && "cursor-pointer")} onClick={onClick}>
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback className={fallbackSizeClass}>
          {fallback}
        </AvatarFallback>
      </Avatar>
      
      {/* Online Status */}
      {isOnline && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
      )}
      
      {/* Notification Indicator */}
      {hasNotification && (
        <div className="absolute -top-1 -right-1">
          <Badge className="w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white">
            {notificationCount && notificationCount > 0 ? (notificationCount > 99 ? '99+' : notificationCount) : ''}
          </Badge>
        </div>
      )}
      
      {/* Level Badge */}
      {level && (
        <Badge className="absolute -bottom-1 -right-1 text-xs px-1 py-0 h-5 bg-primary text-primary-foreground">
          {level}
        </Badge>
      )}
      
      {children}
    </div>
  );
}