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
      {/* Game HUD Container with candy-glass gradient */}
      <div className="relative px-2 pb-2">
        {/* Main navigation container - rounded candy pill with game-like gradient */}
        <div 
          className="relative mx-auto"
          style={{
            background: 'linear-gradient(135deg, #FF6B8A 0%, #FF1A5B 25%, #E91E63 50%, #C2185B 75%, #AD1457 100%)',
            border: '4px solid rgba(255, 255, 255, 0.9)',
            borderRadius: '28px',
            boxShadow: `
              inset 0 0 40px rgba(255, 255, 255, 0.25),
              inset 0 4px 8px rgba(255, 255, 255, 0.4),
              inset 0 -3px 6px rgba(0, 0, 0, 0.3),
              0 0 0 2px rgba(255, 255, 255, 0.3),
              0 12px 40px rgba(233, 30, 99, 0.4),
              0 6px 24px rgba(0, 0, 0, 0.4),
              0 20px 60px rgba(255, 26, 91, 0.25)
            `,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            padding: '8px 12px 16px 12px',
            minHeight: '72px',
            overflow: 'visible',
            position: 'relative',
            maxWidth: '420px'
          }}
        >
          {/* Enhanced glass reflection overlay */}
          <div 
            className="absolute inset-x-0 top-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 25%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.05) 75%, transparent 100%)',
              borderRadius: '24px 24px 12px 12px',
              height: '50%'
            }}
          />
          
          {/* Navigation items */}
          <div className="flex items-end justify-around relative z-10" style={{ gap: '8px' }}>
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              const isCenter = index === 2; // LIK button is center and slightly larger
              
              return (
                <div key={tab.id} className="flex flex-col items-center relative">
                  {/* Enhanced glowing halo for active tab - yellow/orange glow */}
                  {isActive && (
                    <div 
                      className="absolute rounded-full opacity-90"
                      style={{
                        width: isCenter ? '60px' : '52px',
                        height: isCenter ? '60px' : '52px',
                        background: 'radial-gradient(circle, rgba(255, 215, 0, 0.9) 0%, rgba(255, 193, 7, 0.7) 30%, rgba(255, 152, 0, 0.5) 60%, rgba(255, 87, 34, 0.2) 80%, transparent 100%)',
                        filter: 'blur(10px)',
                        transform: isCenter ? 'translateY(-24px)' : 'translateY(-22px)',
                        zIndex: -1
                      }}
                    />
                  )}
                  
                  {/* Breaking border icon - pops out above nav bar */}
                  <button
                    onClick={() => onTabChange(tab.id)}
                    className="relative flex flex-col items-center touch-target group"
                    style={{ 
                      transform: isActive 
                        ? (isCenter ? 'translateY(-24px)' : 'translateY(-22px)')
                        : (isCenter ? 'translateY(-16px)' : 'translateY(-14px)'
                      ),
                      transition: 'none' // No animations as requested
                    }}
                  >
                    {/* Icon container - exceeds top edge of nav bar with enhanced styling */}
                    <div 
                      className="relative mb-2"
                      style={{
                        width: isCenter ? '52px' : '44px',
                        height: isCenter ? '52px' : '44px'
                      }}
                    >
                      <img 
                        src={tab.icon} 
                        alt={tab.label}
                        className="w-full h-full object-contain"
                        style={{
                          filter: isActive 
                            ? `
                                drop-shadow(0 8px 16px rgba(0, 0, 0, 0.6))
                                drop-shadow(0 4px 12px rgba(255, 255, 255, 0.5))
                                drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))
                                drop-shadow(0 0 40px rgba(255, 193, 7, 0.6))
                                drop-shadow(0 0 60px rgba(255, 152, 0, 0.4))
                                brightness(1.1)
                                saturate(1.2)
                              `
                            : `
                                drop-shadow(0 6px 12px rgba(0, 0, 0, 0.5))
                                drop-shadow(0 2px 6px rgba(255, 255, 255, 0.3))
                                drop-shadow(0 0 12px rgba(255, 255, 255, 0.15))
                                brightness(0.95)
                              `
                        }}
                      />
                    </div>
                    
                    {/* Enhanced candy badge label */}
                    <div 
                      className="px-2.5 py-1 text-white font-rum-raisin font-bold uppercase tracking-wider"
                      style={{
                        background: isActive 
                          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.4) 100%)'
                          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.2) 100%)',
                        border: isActive 
                          ? '2.5px solid rgba(255, 255, 255, 0.95)'
                          : '1.5px solid rgba(255, 255, 255, 0.7)',
                        borderRadius: '12px',
                        fontSize: '0.65rem',
                        lineHeight: '1',
                        fontWeight: '700',
                        boxShadow: isActive
                          ? `
                              inset 0 3px 6px rgba(255, 255, 255, 0.6),
                              inset 0 -2px 4px rgba(0, 0, 0, 0.3),
                              0 6px 16px rgba(0, 0, 0, 0.5),
                              0 0 20px rgba(255, 215, 0, 0.7),
                              0 0 40px rgba(255, 193, 7, 0.4),
                              0 0 60px rgba(255, 152, 0, 0.2)
                            `
                          : `
                              inset 0 2px 4px rgba(255, 255, 255, 0.4),
                              inset 0 -1px 2px rgba(0, 0, 0, 0.25),
                              0 4px 12px rgba(0, 0, 0, 0.4),
                              0 2px 8px rgba(0, 0, 0, 0.3)
                            `,
                        textShadow: isActive 
                          ? '0 2px 6px rgba(0, 0, 0, 0.9), 0 0 12px rgba(255, 215, 0, 0.5)'
                          : '0 2px 4px rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        minWidth: '48px',
                        textAlign: 'center',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {tab.label}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}