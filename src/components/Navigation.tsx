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
    { id: 'search' as TabType, label: 'EXPLORE', icon: exploreIcon },
    { id: 'lik' as TabType, label: 'LIK', icon: mapIcon, isCenter: true },
    { id: 'trending' as TabType, label: 'TRENDING', icon: trendingIcon },
    { id: 'profile' as TabType, label: 'PROFILE', icon: profileIcon },
  ];

  return (
    <div className={cn("relative overflow-visible", className)}>
      {/* Navigation Container - Glossy Translucent Gradient Background */}
      <div className={cn(
        "relative w-full overflow-visible",
        // Apply the glossy gradient background
        "nav-glossy-gradient",
        // Ensure proper positioning and glass effect
        "relative z-10"
      )}>
        {/* Navigation Content - Reduced height by 50px */}
        <nav className="flex items-center justify-around relative px-3 py-3 overflow-visible h-16 z-10">
          {navItems.map((item, index) => {
            const isActive = activeTab === item.id;
            const isCenter = item.isCenter;
            
            return (
              <div key={item.id} className="relative flex flex-col items-center flex-1 overflow-visible">
                {/* Breaking Border Icon - Exceeds Container */}
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "relative flex items-center justify-center overflow-visible z-20",
                    "touch-target transform transition-transform duration-200",
                    // Icons exceed the top edge (breaking border effect)
                    "translate-y-[-28px]",
                    // Center icon is slightly larger
                    isCenter ? "scale-110" : "scale-100",
                    // Mobile responsive sizing
                    "mobile-sm:scale-90"
                  )}
                >
                  {/* Active Glow Halo */}
                  {isActive && (
                    <div className={cn(
                      "absolute inset-0 rounded-2xl blur-lg opacity-80 -z-10",
                      "bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500",
                      "scale-150 animate-pulse"
                    )} />
                  )}
                  
                  {/* Clean Icon - No Container */}
                  <img 
                    src={item.icon} 
                    alt={item.label}
                    className={cn(
                      "relative z-10",
                      // Bigger icon sizes - matching reference image
                      isCenter ? "w-12 h-12" : "w-10 h-10",
                      // Mobile sizing
                      "mobile-sm:w-8 mobile-sm:h-8",
                      isCenter && "mobile-sm:w-10 mobile-sm:h-10",
                      // Clean look with subtle shadow
                      "filter drop-shadow-lg"
                    )}
                  />
                </button>
                
                {/* Clean Text Label - Enhanced visibility on glossy background */}
                <div className={cn(
                  "relative mt-[-24px] z-10",
                  "mobile-sm:mt-[-20px]"
                )}>
                  <span className={cn(
                    "font-rum-raisin text-sm font-bold leading-none",
                    "text-center whitespace-nowrap",
                    // All caps styling
                    "uppercase tracking-wide",
                    // Enhanced text visibility on glossy background
                    "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]",
                    "font-extrabold",
                    // Mobile sizing
                    "mobile-sm:text-xs",
                    // Active state styling with better contrast
                    isActive 
                      ? "text-yellow-100 drop-shadow-[0_2px_6px_rgba(0,0,0,1)] font-black" 
                      : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                  )}>
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}