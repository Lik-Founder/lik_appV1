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
        {/* Main navigation container - pill shaped with glossy gradient */}
        <div 
          className="relative mx-auto max-w-sm"
          style={{
            background: 'linear-gradient(135deg, #FF7BAA 0%, #FF1A75 50%, #B30026 100%)',
            border: '3px solid rgba(255, 255, 255, 0.9)',
            borderRadius: '40px',
            boxShadow: `
              inset 0 0 30px rgba(255, 255, 255, 0.25),
              inset 0 2px 4px rgba(255, 255, 255, 0.4),
              inset 0 -2px 4px rgba(0, 0, 0, 0.2),
              0 8px 32px rgba(255, 123, 170, 0.4),
              0 4px 16px rgba(0, 0, 0, 0.25),
              0 0 0 1px rgba(255, 255, 255, 0.2)
            `,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            padding: '8px 12px 16px 12px',
            minHeight: '72px',
            overflow: 'visible',
            position: 'relative'
          }}
        >
          {/* Inner glass reflection for candy effect */}
          <div 
            className="absolute inset-x-0 top-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 40%, transparent 100%)',
              borderRadius: '37px 37px 20px 20px',
              height: '50%'
            }}
          />
          
          {/* Navigation items */}
          <div className="flex items-end justify-around relative z-10">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              const isCenter = index === 2; // LIK button is center and slightly larger
              
              return (
                <div key={tab.id} className="flex flex-col items-center relative">
                  {/* Glowing halo for active tab */}
                  {isActive && (
                    <div 
                      className="absolute -top-2 w-12 h-12 rounded-full opacity-70 blur-lg"
                      style={{
                        background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
                        transform: 'translateY(-12px)'
                      }}
                    />
                  )}
                  
                  {/* Breaking border icon - pops out above nav bar */}
                  <button
                    onClick={() => onTabChange(tab.id)}
                    className="relative flex flex-col items-center touch-target group"
                    style={{ 
                      transform: isActive ? 'translateY(-16px)' : 'translateY(-8px)',
                      transition: 'none' // No animations as requested
                    }}
                  >
                    {/* Icon container */}
                    <div 
                      className="relative mb-2"
                      style={{
                        width: isCenter ? '44px' : '36px',
                        height: isCenter ? '44px' : '36px'
                      }}
                    >
                      <img 
                        src={tab.icon} 
                        alt={tab.label}
                        className="w-full h-full object-contain"
                        style={{
                          filter: `
                            drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))
                            drop-shadow(0 0 12px rgba(255, 255, 255, 0.3))
                            ${isActive ? 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.6))' : ''}
                          `
                        }}
                      />
                    </div>
                    
                    {/* Candy badge label */}
                    <div 
                      className="px-2.5 py-1 text-white font-rum-raisin font-bold uppercase tracking-wide"
                      style={{
                        background: isActive 
                          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.2) 100%)'
                          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 100%)',
                        border: isActive 
                          ? '1.5px solid rgba(255, 255, 255, 0.8)'
                          : '1px solid rgba(255, 255, 255, 0.5)',
                        borderRadius: '12px',
                        fontSize: '0.65rem',
                        lineHeight: '1',
                        boxShadow: `
                          inset 0 1px 2px rgba(255, 255, 255, 0.4),
                          inset 0 -1px 1px rgba(0, 0, 0, 0.2),
                          0 2px 8px rgba(0, 0, 0, 0.3),
                          ${isActive ? '0 0 12px rgba(251, 191, 36, 0.4)' : '0 1px 3px rgba(0, 0, 0, 0.2)'}
                        `,
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        minWidth: '44px',
                        textAlign: 'center'
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