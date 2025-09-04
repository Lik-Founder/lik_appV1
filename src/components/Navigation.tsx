import { TabType } from '@/lib/types';
import { cn } from '@/lib/utils';
import homeIcon from '@/assets/images/home_icon.png';
import exploreIcon from '@/assets/images/explore_icon.png';
import mapIcon from '@/assets/images/map_icon.png';
import trendingIcon from '@/assets/images/trending_icon.png';
import profileIcon from '@/assets/images/profile_icon.png';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'home' as TabType, label: 'HOME', icon: homeIcon },
  { id: 'search' as TabType, label: 'EXPLORE', icon: exploreIcon },
  { id: 'lik' as TabType, label: 'LIK', icon: mapIcon },
  { id: 'trending' as TabType, label: 'TRENDING', icon: trendingIcon },
  { id: 'profile' as TabType, label: 'PROFILE', icon: profileIcon },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3">
      <nav className="bg-gradient-to-r from-orange-400 via-pink-500 to-red-600 rounded-2xl shadow-lg backdrop-blur-sm border border-white/20 mx-3">
        <div className="flex items-center justify-around px-4 py-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center transition-all duration-200",
                  "min-w-0 flex-1 relative"
                )}
              >
                {/* Icon Container */}
                <div className="relative mb-2">
                  {/* Active Background Glow */}
                  {isActive && (
                    <div className="absolute inset-0 -inset-1 bg-yellow-300/30 rounded-lg blur-sm" />
                  )}
                  
                  {/* Icon */}
                  <img
                    src={tab.icon}
                    alt={tab.label}
                    className={cn(
                      "relative z-10 w-7 h-7 transition-all duration-200",
                      isActive ? "brightness-110 scale-110" : "brightness-90"
                    )}
                  />
                </div>

                {/* Label */}
                <span className={cn(
                  "font-rum-raisin font-bold uppercase text-xs leading-tight",
                  "text-white drop-shadow-lg",
                  isActive ? "opacity-100" : "opacity-80"
                )}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}