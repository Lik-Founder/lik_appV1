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
      {/* Gamified Candy-Glass Navigation Container */}
      <div className="relative px-4 pb-4">
        {/* Main nav bar with breaking-border effect */}
        <div 
          className="relative mx-auto max-w-md overflow-visible"
          style={{
            background: 'linear-gradient(135deg, #FF7BAA 0%, #FF1A75 50%, #B30026 100%)',
            border: '3px solid rgba(255, 255, 255, 0.9)',
            borderRadius: '32px',
            boxShadow: `
              inset 0 0 30px rgba(255, 255, 255, 0.3),
              inset 0 4px 12px rgba(255, 255, 255, 0.5),
              inset 0 -4px 8px rgba(0, 0, 0, 0.2),
              0 0 0 1px rgba(255, 255, 255, 0.4),
              0 8px 32px rgba(0, 0, 0, 0.3),
              0 16px 48px rgba(255, 123, 170, 0.3)
            `,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '12px 16px 20px 16px',
            minHeight: '80px',
            position: 'relative'
          }}
        >
          {/* Glass reflection overlay */}
          <div 
            className="absolute inset-x-3 top-3 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.3) 40%, rgba(255, 255, 255, 0.1) 70%, transparent 100%)',
              borderRadius: '28px 28px 16px 16px',
              height: '60%'
            }}
          />
          
          {/* Inner glow */}
          <div 
            className="absolute inset-2 pointer-events-none rounded-[28px]"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.15) 0%, transparent 70%)'
            }}
          />
          
          {/* Navigation items with breaking border */}
          <div className="flex items-end justify-around relative z-10" style={{ gap: '4px' }}>
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              const isCenter = index === 2; // LIK button is center and primary CTA
              
              return (
                <div key={tab.id} className="flex flex-col items-center relative">
                  {/* Active tab glowing halo - yellow/orange glow */}
                  {isActive && (
                    <div 
                      className="absolute rounded-full"
                      style={{
                        width: isCenter ? '70px' : '60px',
                        height: isCenter ? '70px' : '60px',
                        background: 'radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, rgba(255, 193, 7, 0.6) 40%, rgba(255, 152, 0, 0.4) 70%, transparent 100%)',
                        filter: 'blur(8px)',
                        transform: isCenter ? 'translateY(-32px)' : 'translateY(-28px)',
                        zIndex: -1
                      }}
                    />
                  )}
                  
                  {/* Breaking border button - icons exceed nav bar edge */}
                  <button
                    onClick={() => onTabChange(tab.id)}
                    className="relative flex flex-col items-center touch-target"
                    style={{ 
                      transform: isCenter ? 'translateY(-28px)' : 'translateY(-24px)'
                    }}
                  >
                    {/* Chunky candy-glass icon container */}
                    <div 
                      className="relative mb-3"
                      style={{
                        width: isCenter ? '56px' : '48px',
                        height: isCenter ? '56px' : '48px',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 100%)',
                        border: '3px solid rgba(255, 255, 255, 0.8)',
                        borderRadius: isCenter ? '18px' : '16px',
                        boxShadow: `
                          inset 0 3px 8px rgba(255, 255, 255, 0.6),
                          inset 0 -3px 6px rgba(0, 0, 0, 0.2),
                          0 6px 20px rgba(0, 0, 0, 0.4),
                          0 2px 8px rgba(0, 0, 0, 0.3),
                          ${isActive ? '0 0 24px rgba(255, 215, 0, 0.6)' : ''}
                        `,
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        padding: isCenter ? '10px' : '8px'
                      }}
                    >
                      {/* Beveled glass reflection */}
                      <div 
                        className="absolute inset-1 pointer-events-none"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.2) 30%, transparent 60%)',
                          borderRadius: isCenter ? '14px' : '12px'
                        }}
                      />
                      
                      {/* Icon with enhanced effects */}
                      <img 
                        src={tab.icon} 
                        alt={tab.label}
                        className="w-full h-full object-contain relative z-10"
                        style={{
                          filter: isActive 
                            ? `
                                drop-shadow(0 4px 12px rgba(0, 0, 0, 0.7))
                                drop-shadow(0 2px 6px rgba(255, 255, 255, 0.4))
                                drop-shadow(0 0 16px rgba(255, 215, 0, 0.6))
                                brightness(1.15)
                                saturate(1.3)
                              `
                            : `
                                drop-shadow(0 3px 8px rgba(0, 0, 0, 0.6))
                                drop-shadow(0 1px 4px rgba(255, 255, 255, 0.3))
                                brightness(0.9)
                              `
                        }}
                      />
                    </div>
                    
                    {/* Rounded candy badge label */}
                    <div 
                      className="text-white font-rum-raisin font-bold uppercase tracking-wide"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.15) 100%)',
                        border: '2px solid rgba(255, 255, 255, 0.6)',
                        borderRadius: '14px',
                        fontSize: '0.6rem',
                        lineHeight: '1',
                        fontWeight: '700',
                        padding: '4px 8px',
                        boxShadow: isActive
                          ? `
                              inset 0 2px 4px rgba(255, 255, 255, 0.4),
                              inset 0 -2px 3px rgba(0, 0, 0, 0.3),
                              0 4px 12px rgba(0, 0, 0, 0.5),
                              0 0 16px rgba(255, 215, 0, 0.5)
                            `
                          : `
                              inset 0 2px 4px rgba(255, 255, 255, 0.3),
                              inset 0 -1px 2px rgba(0, 0, 0, 0.25),
                              0 3px 8px rgba(0, 0, 0, 0.4)
                            `,
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        minWidth: isCenter ? '40px' : '36px',
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