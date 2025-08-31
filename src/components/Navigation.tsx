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
    { id: 'home' as TabType, label: 'HOME', icon: homeIcon },
    { id: 'search' as TabType, label: 'SEARCH', icon: exploreIcon },
    { id: 'lik' as TabType, label: 'MAP', icon: mapIcon },
    { id: 'trending' as TabType, label: 'FLAME', icon: trendingIcon },
    { id: 'profile' as TabType, label: 'PROFILE', icon: profileIcon },
  ];

  return (
    <div className={cn("relative", className)}>
      {/* Breaking Border Container */}
      <div className={cn(
        "relative mx-2 mb-2 md:mx-4",
        "bg-gradient-to-r from-pink-400/90 via-purple-400/90 to-pink-400/90",
        "rounded-3xl p-1",
        "backdrop-blur-md",
        "border-4 border-white/30",
        "shadow-2xl shadow-pink-500/30"
      )}>
        {/* Inner Container with Rounded Background */}
        <div className="bg-white/20 rounded-2xl backdrop-blur-lg">
          <nav className="flex items-end justify-around relative px-1 py-2 md:px-2 md:py-3">
            {navItems.map((item, index) => {
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "relative flex flex-col items-center transition-all duration-300",
                    "touch-target group min-w-0 flex-1",
                    isActive ? "z-10" : "z-0"
                  )}
                >
                  {/* Pop-out Icon Container */}
                  <div className={cn(
                    "relative flex items-center justify-center transition-all duration-300",
                    "mb-1",
                    isActive 
                      ? "transform md:-translate-y-6 -translate-y-5 scale-105 md:scale-110" 
                      : "transform translate-y-0 scale-100 group-active:scale-95"
                  )}>
                    {/* Glow Background for Active Icon */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full blur-lg scale-150 opacity-60" />
                    )}
                    
                    {/* Icon Background Circle */}
                    <div className={cn(
                      "relative rounded-full border-3 transition-all duration-300",
                      "p-2 md:p-3",
                      isActive 
                        ? "bg-gradient-to-br from-yellow-300 to-orange-400 border-white shadow-xl scale-105 md:scale-110" 
                        : "bg-gradient-to-br from-white/40 to-white/20 border-white/50 shadow-md hover:scale-105"
                    )}>
                      <img 
                        src={item.icon} 
                        alt={item.label}
                        className={cn(
                          "transition-all duration-300",
                          "w-6 h-6 md:w-8 md:h-8",
                          isActive 
                            ? "filter brightness-110 drop-shadow-lg" 
                            : "filter brightness-90"
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Label */}
                  <span className={cn(
                    "font-bold tracking-wider transition-all duration-300 font-rum-raisin",
                    "text-center leading-tight whitespace-nowrap",
                    "text-xs md:text-xs",
                    isActive 
                      ? "text-white text-shadow-lg scale-105 drop-shadow-md" 
                      : "text-white/80 text-shadow"
                  )}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}