import { TabType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { DeviceType, Orientation } from '@/hooks/use-device';
import homeIcon from '@/assets/images/home_icon.png';
import exploreIcon from '@/assets/images/explore_icon.png';
import mapIcon from '@/assets/images/map_icon.png';
import trendingIcon from '@/assets/images/trending_icon.png';
import profileIcon from '@/assets/images/profile_icon.png';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  deviceType?: DeviceType;
  orientation?: Orientation;
  className?: string;
}

export function Navigation({ 
  activeTab, 
  onTabChange, 
  deviceType = 'phone', 
  orientation = 'portrait',
  className 
}: NavigationProps) {
  const navItems = [
    { id: 'home' as TabType, label: 'Home', icon: homeIcon },
    { id: 'search' as TabType, label: 'Explore', icon: exploreIcon },
    { id: 'lik' as TabType, label: 'Lik', icon: mapIcon },
    { id: 'trending' as TabType, label: 'Trending', icon: trendingIcon },
    { id: 'profile' as TabType, label: 'Profile', icon: profileIcon },
  ];

  return (
    <nav className={cn(
      "flex items-center justify-around",
      "bg-background border-t border-border",
      "px-4 py-2 safe-bottom",
      className
    )}>
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg",
              "transition-colors duration-200 touch-target",
              isActive 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <img 
              src={item.icon} 
              alt={item.label}
              className="w-6 h-6"
            />
            <span className={cn(
              "text-xs font-medium font-rum-raisin",
              isActive ? "text-primary" : "text-muted-foreground"
            )}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}