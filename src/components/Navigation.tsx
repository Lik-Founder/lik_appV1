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
      <div className="relative px-3 pb-3">
        {/* Main navigation container - pill shaped with glossy gradient */}
        <div 
          className="relative mx-auto max-w-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 123, 170, 0.95) 0%, rgba(255, 26, 117, 0.97) 50%, rgba(179, 0, 38, 1) 100%)',
            border: '3px solid rgba(255, 255, 255, 0.95)',
            borderRadius: '32px',
            boxShadow: `
              inset 0 0 30px rgba(255, 255, 255, 0.3),
              inset 0 3px 6px rgba(255, 255, 255, 0.5),
              inset 0 -2px 4px rgba(0, 0, 0, 0.25),
              0 0 0 1px rgba(255, 255, 255, 0.4),
              0 8px 32px rgba(255, 123, 170, 0.5),
              0 4px 20px rgba(0, 0, 0, 0.3),
              0 12px 40px rgba(255, 26, 117, 0.3)
            `,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '10px 16px 18px 16px',
            minHeight: '80px',
            overflow: 'visible',
            position: 'relative'
          }}
        >
          {/* Inner glass reflection for enhanced candy effect */}
          <div 
            className="absolute inset-x-0 top-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 30%, rgba(255, 255, 255, 0.1) 60%, transparent 100%)',
              borderRadius: '29px 29px 16px 16px',
              height: '45%'
            }}
          />
          
          {/* Navigation items */}
          <div className="flex items-end justify-around relative z-10">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              const isCenter = index === 2; // LIK button is center and slightly larger
              
              return (
                <div key={tab.id} className="flex flex-col items-center relative">
                  {/* Glowing halo for active tab - yellow/orange glow */}
                  {isActive && (
                    <div 
                      className="absolute w-14 h-14 rounded-full opacity-80"
                      style={{
                        background: 'radial-gradient(circle, rgba(255, 193, 7, 0.8) 0%, rgba(255, 152, 0, 0.6) 40%, rgba(255, 87, 34, 0.3) 70%, transparent 100%)',
                        filter: 'blur(8px)',
                        transform: 'translateY(-20px)',
                        zIndex: -1
                      }}
                    />
                  )}
                  
                  {/* Breaking border icon - pops out above nav bar */}
                  <button
                    onClick={() => onTabChange(tab.id)}
                    className="relative flex flex-col items-center touch-target group"
                    style={{ 
                      transform: isActive ? 'translateY(-20px)' : 'translateY(-12px)',
                      transition: 'none' // No animations as requested
                    }}
                  >
                    {/* Icon container - exceeds top edge of nav bar */}
                    <div 
                      className="relative mb-3"
                      style={{
                        width: isCenter ? '48px' : '40px',
                        height: isCenter ? '48px' : '40px'
                      }}
                    >
                      <img 
                        src={tab.icon} 
                        alt={tab.label}
                        className="w-full h-full object-contain"
                        style={{
                          filter: `
                            drop-shadow(0 6px 12px rgba(0, 0, 0, 0.5))
                            drop-shadow(0 2px 8px rgba(255, 255, 255, 0.4))
                            ${isActive ? 'drop-shadow(0 0 24px rgba(255, 193, 7, 0.8)) drop-shadow(0 0 40px rgba(255, 152, 0, 0.5))' : 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.2))'}
                          `
                        }}
                      />
                    </div>
                    
                    {/* Candy badge label with translucent glass background */}
                    <div 
                      className="px-3 py-1.5 text-white font-rum-raisin font-bold uppercase tracking-wide"
                      style={{
                        background: isActive 
                          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0.3) 100%)'
                          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.15) 100%)',
                        border: isActive 
                          ? '2px solid rgba(255, 255, 255, 0.9)'
                          : '1.5px solid rgba(255, 255, 255, 0.6)',
                        borderRadius: '14px',
                        fontSize: '0.7rem',
                        lineHeight: '1',
                        boxShadow: `
                          inset 0 2px 4px rgba(255, 255, 255, 0.5),
                          inset 0 -1px 2px rgba(0, 0, 0, 0.25),
                          0 4px 12px rgba(0, 0, 0, 0.4),
                          ${isActive ? '0 0 16px rgba(255, 193, 7, 0.6), 0 0 32px rgba(255, 152, 0, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.3)'}
                        `,
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.9)',
                        backdropFilter: 'blur(6px)',
                        WebkitBackdropFilter: 'blur(6px)',
                        minWidth: '50px',
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