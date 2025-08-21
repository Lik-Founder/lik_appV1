import { GameController, TrendUp, User } from '@phosphor-icons/react';
import { TabType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DeviceType, Orientation } from '@/hooks/use-device';
import unselectedFireIcon from '@/assets/images/unselected_fire_icon.png';
import selectedTrendingIcon from '@/assets/images/selected_trending_icon.png';
import likLogoHeart from '@/assets/images/Lik_Logo_Heart_1.0.png';
import searchIcon from '@/assets/images/search_icon.png';
import selectedIcon from '@/assets/images/selected_icon.png';
import unselectedHomeIcon from '@/assets/images/unselected_home_icon.png';
import selectedHomeIcon from '@/assets/images/selected_home.png';
import searchPng from '@/assets/images/search.png';
import home3Icon from '@/assets/images/home_(3).png';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  deviceType: DeviceType;
  orientation: Orientation;
}

export function Navigation({ activeTab, onTabChange, deviceType, orientation }: NavigationProps) {
  const navItems = [
    { id: 'home' as TabType, label: 'Home' },
    { id: 'search' as TabType, label: 'Explore' },
    { id: 'lik' as TabType, icon: GameController, label: 'Lik' },
    { id: 'trending' as TabType, icon: TrendUp, label: 'Trending' },
    { id: 'profile' as TabType, icon: User, label: 'Profile' },
  ];

  // Icon size based on device type
  const iconSize = deviceType === 'tablet' ? 28 : 24;
  
  // Show labels on tablets or landscape phones
  const showLabels = deviceType === 'tablet' || 
    (deviceType === 'phone' && orientation === 'landscape');

  // Determine if we're on trending page for styling
  const isOnTrendingPage = activeTab === 'trending';

  return (
    <nav className={cn(
      "flex items-center justify-around backdrop-blur-sm",
      "touch-target safe-bottom",
      isOnTrendingPage ? "bg-black/95" : "bg-background/95",
      orientation === 'landscape' && deviceType === 'phone' ? "px-2 py-1" : "px-4 py-2"
    )}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 touch-target transition-all duration-200",
              "active:scale-95",
              showLabels ? "p-3" : "p-2",
              isOnTrendingPage 
                ? cn(
                    "active:bg-white/10",
                    isActive && "text-white",
                    !isActive && "text-white/60 hover:text-white"
                  )
                : cn(
                    "active:bg-muted/50",
                    isActive && "text-foreground",
                    !isActive && "text-muted-foreground hover:text-foreground"
                  )
            )}
          >
            {item.id === 'home' ? (
              <img 
                src={isActive ? selectedHomeIcon : (isOnTrendingPage ? home3Icon : unselectedHomeIcon)} 
                alt="Home" 
                className="transition-transform duration-200"
                style={{ width: iconSize, height: iconSize }}
              />
            ) : item.id === 'search' ? (
              <img 
                src={isOnTrendingPage ? searchPng : (isActive ? selectedIcon : searchIcon)} 
                alt="Explore" 
                className="transition-transform duration-200"
                style={{ width: iconSize, height: iconSize }}
              />
            ) : item.id === 'trending' ? (
              <img 
                src={isActive ? selectedTrendingIcon : unselectedFireIcon} 
                alt="Trending" 
                className="transition-transform duration-200"
                style={{ width: iconSize, height: iconSize }}
              />
            ) : item.id === 'lik' ? (
              <img 
                src={likLogoHeart} 
                alt="Lik" 
                className={cn(
                  "transition-transform duration-200",
                  isActive && "brightness-110"
                )}
                style={{ width: iconSize, height: iconSize }}
              />
            ) : Icon ? (
              <Icon 
                size={iconSize} 
                weight={isActive ? "fill" : "regular"}
                className="transition-transform duration-200"
              />
            ) : null}
            {showLabels && (
              <span className={cn(
                "transition-opacity duration-200 nav-rum-raisin",
                deviceType === 'tablet' ? "text-sm" : "text-xs"
              )}>
                {item.label}
              </span>
            )}
          </Button>
        );
      })}
    </nav>
  );
}