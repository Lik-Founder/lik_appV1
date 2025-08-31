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
    <div className={cn("relative overflow-visible pb-2", className)}>
      {/* Breaking Border Navigation Container */}
      <div className={cn(
        "relative mx-3 mb-2",
        "bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800",
        "rounded-3xl border-2 border-slate-600",
        "shadow-2xl shadow-slate-900/50 backdrop-blur-sm",
        "overflow-visible"
      )}>
        {/* Navigation Content */}
        <nav className="flex items-center justify-around relative px-2 py-3 overflow-visible">
          {navItems.map((item, index) => {
            const isActive = activeTab === item.id;
            
            return (
              <div key={item.id} className="relative flex flex-col items-center flex-1 overflow-visible">
                {/* Breaking Border Icon Container */}
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "relative flex items-center justify-center touch-target",
                    "overflow-visible z-20 mb-1",
                    // Active icons exceed the container boundary - breaking border effect
                    isActive 
                      ? "transform -translate-y-5" 
                      : "transform translate-y-0"
                  )}
                >
                  {/* Glow Background for Active State */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl blur-lg scale-150 opacity-50 -z-10" />
                  )}
                  
                  {/* Icon Container with Breaking Border Design */}
                  <div className={cn(
                    "relative rounded-2xl border-2 p-2.5",
                    "shadow-lg backdrop-blur-sm",
                    isActive 
                      ? "bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-200 shadow-yellow-500/70" 
                      : "bg-slate-700/90 border-slate-500 shadow-slate-800/70"
                  )}>
                    <img 
                      src={item.icon} 
                      alt={item.label}
                      className={cn(
                        "w-6 h-6",
                        isActive ? "filter brightness-110 contrast-110" : "filter brightness-90"
                      )}
                    />
                  </div>
                </button>
                
                {/* Navigation Label with Rum Raisin Font */}
                <span className={cn(
                  "font-rum-raisin text-xs font-medium leading-none",
                  "text-center whitespace-nowrap mt-1 px-1",
                  isActive 
                    ? "text-white font-bold text-shadow" 
                    : "text-slate-300"
                )}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}