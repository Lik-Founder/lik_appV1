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
    <div className={cn("relative overflow-visible pb-2", className)}>
      {/* Gamified Candy-Glass Navigation Container */}
      <div className={cn(
        "relative mx-3 mb-2 rounded-full overflow-visible",
        // Pill-shaped container with candy-glass gradient
        "bg-gradient-to-r from-[#FF7BAA] via-[#FF1A75] to-[#B30026]",
        // Bright white outline with soft inner glow
        "border-3 border-white/90 shadow-2xl",
        // Inner glow effect
        "shadow-[inset_0_0_30px_rgba(255,255,255,0.3)]",
        // Outer glow
        "drop-shadow-[0_8px_32px_rgba(255,123,170,0.4)]",
        // Glass effect
        "backdrop-blur-sm"
      )}>
        {/* Navigation Content */}
        <nav className="flex items-center justify-around relative px-3 py-4 overflow-visible">
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
                    isCenter ? "scale-110" : "scale-100"
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
                      // Clean look with subtle shadow
                      "filter drop-shadow-lg"
                    )}
                  />
                </button>
                
                {/* Clean Text Label - No Background */}
                <div className={cn(
                  "relative mt-[-12px] z-10"
                )}>
                  <span className={cn(
                    "font-rum-raisin text-sm font-bold leading-none",
                    "text-center whitespace-nowrap",
                    // All caps styling
                    "uppercase tracking-wide",
                    // White text with strong shadow for readability on the candy background
                    "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]",
                    // Active state styling
                    isActive 
                      ? "text-yellow-100 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]" 
                      : "text-white"
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