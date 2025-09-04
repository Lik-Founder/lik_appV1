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
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      {/* Game HUD Container with candy-glass gradient and translucent top for icon overflow */}
      <div className="relative px-3 pb-3">
        {/* Background container with gradient and glass effect */}
        <div 
          className="relative rounded-2xl overflow-visible"
          style={{
            background: 'linear-gradient(135deg, #FF7BAA 0%, #FF1A75 50%, #B30026 100%)',
            border: '3px solid rgba(255, 255, 255, 0.9)',
            boxShadow: `
              inset 0 0 30px rgba(255, 255, 255, 0.3),
              0 8px 32px rgba(255, 123, 170, 0.4),
              0 4px 16px rgba(0, 0, 0, 0.2)
            `,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            minHeight: '80px',
            paddingTop: '24px' // Space for overhanging icons
          }}
        >
          {/* Inner glass reflection effect */}
          <div 
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
              height: '40%',
              top: '25%'
            }}
          />
          
          {/* Navigation content */}
          <div className="flex items-center justify-around px-4 pb-4 relative z-10">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="flex flex-col items-center justify-center relative group touch-target"
                >
                  {/* Active glow halo behind icon */}
                  {isActive && (
                    <div 
                      className="absolute -top-8 w-16 h-16 rounded-full opacity-80 blur-xl"
                      style={{
                        background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #fbbf24)',
                      }}
                    />
                  )}
                  
                  {/* Icon container - exceeds nav bar boundary */}
                  <div className="relative flex items-center justify-center w-14 h-14 -mt-8 mb-3">
                    <img 
                      src={tab.icon} 
                      alt={tab.label}
                      className={cn(
                        "w-12 h-12 object-contain transition-all duration-200",
                        "filter drop-shadow-lg",
                        isActive ? "scale-110" : "group-hover:scale-105"
                      )}
                      style={{
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                      }}
                    />
                  </div>
                  
                  {/* Candy badge label */}
                  <div 
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-bold font-rum-raisin",
                      "text-white transition-all duration-200",
                      isActive ? "scale-105" : "group-hover:scale-102"
                    )}
                    style={{
                      background: isActive 
                        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.15) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.6)',
                      boxShadow: `
                        inset 0 1px 2px rgba(255, 255, 255, 0.4),
                        0 2px 6px rgba(0, 0, 0, 0.25)
                      `,
                      backdropFilter: 'blur(4px)',
                      WebkitBackdropFilter: 'blur(4px)',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
                    }}
                  >
                    {tab.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}