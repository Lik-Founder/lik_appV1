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
                  
                  {/* Chunky Candy-Glass Icon Container */}
                  <div className={cn(
                    "relative rounded-2xl overflow-hidden",
                    // Candy-glass style with beveled edges
                    "bg-gradient-to-br from-white/40 via-white/20 to-white/10",
                    // White enamel outline
                    "border-2 border-white/80",
                    // Soft reflections and glass effect
                    "shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(0,0,0,0.2)]",
                    // Outer shadow for depth
                    "drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]",
                    // Backdrop blur for glass effect
                    "backdrop-blur-sm",
                    // Padding for chunky look
                    isCenter ? "p-3.5" : "p-3"
                  )}>
                    {/* Top highlight for glass effect */}
                    <div className={cn(
                      "absolute top-0 left-0 right-0 h-1/3 rounded-t-xl",
                      "bg-gradient-to-b from-white/60 to-transparent"
                    )} />
                    
                    <img 
                      src={item.icon} 
                      alt={item.label}
                      className={cn(
                        "relative z-10",
                        // Icon sizes
                        isCenter ? "w-8 h-8" : "w-7 h-7",
                        // Enhanced brightness for chunky look
                        "filter brightness-110 contrast-120 drop-shadow-sm"
                      )}
                    />
                  </div>
                </button>
                
                {/* Candy Badge Label */}
                <div className={cn(
                  "relative mt-[-12px] z-10",
                  // Translucent glass background
                  "bg-gradient-to-br from-white/30 via-white/20 to-white/10",
                  // Rounded candy badge shape
                  "rounded-full px-2.5 py-1",
                  // Outline stroke for gamified feel
                  "border border-white/60",
                  // Glass effect
                  "backdrop-blur-sm",
                  // Soft shadow
                  "drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]",
                  // Inner glow
                  "shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]"
                )}>
                  <span className={cn(
                    "font-rum-raisin text-xs font-bold leading-none",
                    "text-center whitespace-nowrap",
                    // All caps styling
                    "uppercase tracking-wide",
                    // White text with shadow for readability
                    "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
                    // Active state styling
                    isActive 
                      ? "text-yellow-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" 
                      : "text-white/90"
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