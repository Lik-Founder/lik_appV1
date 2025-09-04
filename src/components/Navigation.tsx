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
  { id: 'home' as TabType, label: 'Home', icon: homeIcon },
  { id: 'search' as TabType, label: 'Explore', icon: exploreIcon },
  { id: 'lik' as TabType, label: 'Lik', icon: mapIcon },
  { id: 'trending' as TabType, label: 'Trending', icon: trendingIcon },
  { id: 'profile' as TabType, label: 'Profile', icon: profileIcon },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 mobile-nav-safe-area overflow-visible"
      style={{
        background: `
          linear-gradient(to bottom,
            rgba(255, 123, 170, 0.9) 0%,
            rgba(255, 26, 117, 0.95) 50%,
            rgba(179, 0, 38, 1) 100%
          )
        `,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        minHeight: '49px'
      }}
    >
      {/* Glass reflection effect */}
      <div 
        className="absolute pointer-events-none"
        style={{
          top: '0%',
          left: '0',
          right: '0',
          height: '40%',
          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)'
        }}
      />
      
      {/* Navigation items */}
      <div className="flex items-end justify-around px-4 py-2 relative">
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
                    width: isCenter ? '77px' : '69px',
                    height: isCenter ? '77px' : '69px',
                    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, rgba(255, 193, 7, 0.2) 40%, rgba(255, 152, 0, 0.1) 70%, transparent 100%)',
                    filter: 'blur(6px)',
                    top: '-40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 0
                  }}
                />
              )}
              
              {/* Icon - breaking border effect (exceeds nav bar) */}
              <div 
                className="relative"
                style={{
                  transform: 'translateY(-23px)',
                  zIndex: 10,
                  marginBottom: '-12px' // Moved icons 2px higher and adjusted spacing
                }}
              >
                {/* Icon */}
                <img 
                  src={tab.icon} 
                  alt={`${tab.label} icon`}
                  className="relative z-10 object-contain"
                  style={{
                    width: isCenter ? '45px' : '37px', // Reduced by 3px
                    height: isCenter ? '45px' : '37px', // Reduced by 3px
                    filter: isActive 
                      ? 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 6px rgba(255, 215, 0, 0.3)) brightness(1.05)'
                      : 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5)) brightness(0.95)'
                  }}
                />
              </div>
              
              {/* Text label */}
              <div 
                className="font-rum-raisin font-bold text-white tracking-wide"
                style={{
                  fontSize: '0.65rem',
                  lineHeight: '1',
                  fontWeight: '700',
                  textShadow: isActive
                    ? '0 1px 3px rgba(0, 0, 0, 0.8), 0 0 6px rgba(255, 215, 0, 0.2)'
                    : '0 1px 3px rgba(0, 0, 0, 0.8)',
                  transform: 'translateY(-6px)' // Moved labels 2px further from icons
                }}
              >
                {tab.label}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}