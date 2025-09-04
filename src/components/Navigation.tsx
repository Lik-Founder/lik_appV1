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
    <nav className="fixed bottom-0 left-0 right-0 z-50 mobile-nav-safe-area">
      <div className="relative px-2 pb-2">
        {/* Gamified candy-glass container */}
        <div 
          className="relative mx-auto overflow-visible"
          style={{
            height: '52px',
            background: `
              linear-gradient(to bottom,
                rgba(255, 123, 170, 0.9) 0%,
                rgba(255, 26, 117, 0.95) 50%,
                rgba(179, 0, 38, 1) 100%
              )
            `,
            borderRadius: '0 0 32px 32px',
            boxShadow: `
              0 8px 32px rgba(255, 123, 170, 0.4),
              0 4px 16px rgba(0, 0, 0, 0.2)
            `,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}
        >
          {/* Glass reflection effect */}
          <div 
            className="absolute pointer-events-none"
            style={{
              top: '0%',
              left: '12px',
              right: '12px',
              height: '40%',
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
              borderRadius: '28px 28px 16px 16px'
            }}
          />
          
          {/* Navigation items */}
          <div className="flex items-end justify-around px-4 py-2 relative h-full">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              const isCenter = index === 2; // LIK is center
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "flex flex-col items-center relative touch-target",
                    "focus:outline-none"
                  )}
                >
                  {/* Active yellow/orange glow halo */}
                  {isActive && (
                    <div 
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        width: isCenter ? '80px' : '72px',
                        height: isCenter ? '80px' : '72px',
                        background: 'radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, rgba(255, 193, 7, 0.6) 40%, rgba(255, 152, 0, 0.4) 70%, transparent 100%)',
                        filter: 'blur(8px)',
                        top: '-40px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 0
                      }}
                    />
                  )}
                  
                  {/* Icon - breaking border effect (exceeds nav bar) */}
                  <div 
                    className="relative mb-2"
                    style={{
                      transform: 'translateY(-20px)',
                      zIndex: 10
                    }}
                  >
                    {/* Icon */}
                    <img 
                      src={tab.icon} 
                      alt={`${tab.label} icon`}
                      className="relative z-10 object-contain"
                      style={{
                        width: isCenter ? '48px' : '40px',
                        height: isCenter ? '48px' : '40px',
                        filter: isActive 
                          ? 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 12px rgba(255, 215, 0, 0.6)) brightness(1.1)'
                          : 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5)) brightness(0.95)'
                      }}
                    />
                  </div>
                  
                  {/* Text label */}
                  <div 
                    className="font-rum-raisin font-bold text-white uppercase tracking-wide"
                    style={{
                      fontSize: '0.65rem',
                      lineHeight: '1',
                      fontWeight: '700',
                      textShadow: isActive
                        ? '0 1px 3px rgba(0, 0, 0, 0.8), 0 0 12px rgba(255, 215, 0, 0.4)'
                        : '0 1px 3px rgba(0, 0, 0, 0.8)',
                      transform: 'translateY(-4px)'
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
    </nav>
  );
}