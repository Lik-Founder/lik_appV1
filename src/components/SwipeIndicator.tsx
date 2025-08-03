import { useState, useEffect } from 'react';
import { TabType } from '@/lib/types';

interface SwipeIndicatorProps {
  activeTab: TabType;
  isVisible: boolean;
}

const TAB_ORDER: TabType[] = ['home', 'search', 'lik', 'trending', 'profile'];

const TAB_NAMES = {
  home: 'Home',
  search: 'Explore', 
  lik: 'Lik',
  trending: 'Trending',
  profile: 'Profile',
};

export function SwipeIndicator({ activeTab, isVisible }: SwipeIndicatorProps) {
  const [showIndicator, setShowIndicator] = useState(false);
  
  useEffect(() => {
    if (isVisible) {
      setShowIndicator(true);
      const timer = setTimeout(() => {
        setShowIndicator(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const currentIndex = TAB_ORDER.indexOf(activeTab);

  return (
    <>
      {/* Tab indicator dots */}
      <div className={`swipe-indicator-dots ${showIndicator ? 'active' : ''}`}>
        {TAB_ORDER.map((tab, index) => (
          <div
            key={tab}
            className={`swipe-indicator-dot ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* Current tab name indicator */}
      {showIndicator && (
        <div className="swipe-feedback-indicator active" style={{ 
          left: '50%', 
          transform: 'translateX(-50%) translateY(-50%)',
          top: '45%'
        }}>
          {TAB_NAMES[activeTab]}
        </div>
      )}
    </>
  );
}