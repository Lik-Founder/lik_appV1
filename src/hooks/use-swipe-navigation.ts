/**
 * Enhanced swipe navigation hook for mobile app tab switching
 * 
 * Features:
 * - Horizontal swipe gestures to navigate between tabs
 * - Visual feedback with directional indicators
 * - Haptic feedback for better user experience
 * - Accessibility support with screen reader announcements
 * - Device-specific threshold adjustments
 * - Reduced motion support
 * 
 * Usage:
 * ```tsx
 * const { swipeRef, swipeDirection, isSwipeIndicatorVisible } = useSwipeNavigation({
 *   currentTab: activeTab,
 *   onTabChange: setActiveTab,
 *   enabled: true,
 *   threshold: 100
 * });
 * 
 * return (
 *   <div ref={swipeRef} className="swipe-navigation-container">
 *     {content}
 *   </div>
 * );
 * ```
 */

import { useCallback, useState } from 'react';
import { useSwipe, SwipeEventData } from './use-swipe';
import { useHaptic } from './use-haptic';
import { TabType } from '@/lib/types';

// Tab order for navigation
const TAB_ORDER: TabType[] = ['home', 'search', 'lik', 'trending', 'profile'];

interface SwipeNavigationConfig {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  enabled?: boolean;
  threshold?: number;
}

export function useSwipeNavigation({
  currentTab,
  onTabChange,
  enabled = true,
  threshold = 80
}: SwipeNavigationConfig) {
  const { triggerHaptic } = useHaptic();
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isSwipeIndicatorVisible, setIsSwipeIndicatorVisible] = useState(false);

  const handleSwipeStart = useCallback(() => {
    if (!enabled) return;
    setIsSwipeIndicatorVisible(false);
    setSwipeDirection(null);
  }, [enabled]);

  const handleSwiping = useCallback((data: SwipeEventData) => {
    if (!enabled) return;
    
    const currentIndex = TAB_ORDER.indexOf(currentTab);
    
    // Show indicator when swipe distance is significant but below threshold
    if (Math.abs(data.deltaX) > 30 && Math.abs(data.deltaX) < threshold) {
      const direction = data.deltaX < 0 ? 'left' : 'right';
      
      // Only show indicator if there's a valid target tab
      const canSwipeLeft = direction === 'left' && currentIndex < TAB_ORDER.length - 1;
      const canSwipeRight = direction === 'right' && currentIndex > 0;
      
      if (canSwipeLeft || canSwipeRight) {
        setSwipeDirection(direction);
        setIsSwipeIndicatorVisible(true);
        
        // Light haptic feedback when entering swipe zone
        if (!isSwipeIndicatorVisible) {
          triggerHaptic('selection');
        }
      }
    } else {
      setIsSwipeIndicatorVisible(false);
    }
  }, [enabled, currentTab, threshold, isSwipeIndicatorVisible, triggerHaptic]);

  const handleSwipeLeft = useCallback((data: SwipeEventData) => {
    if (!enabled) return;
    
    const currentIndex = TAB_ORDER.indexOf(currentTab);
    
    // Swipe left goes to next tab (right in the tab bar)
    if (currentIndex < TAB_ORDER.length - 1) {
      const nextTab = TAB_ORDER[currentIndex + 1];
      onTabChange(nextTab);
      triggerHaptic('light');
      
      // Announce tab change for screen readers
      if ('speechSynthesis' in window) {
        const tabNames = {
          home: 'Home',
          search: 'Search', 
          lik: 'Lik',
          trending: 'Trending',
          profile: 'Profile'
        };
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(`Switched to ${tabNames[nextTab]} tab`);
          utterance.volume = 0.1;
          speechSynthesis.speak(utterance);
        }, 100);
      }
    } else {
      // Bounce feedback when at end
      triggerHaptic('error');
    }
    
    setIsSwipeIndicatorVisible(false);
    setSwipeDirection(null);
  }, [currentTab, onTabChange, enabled, triggerHaptic]);

  const handleSwipeRight = useCallback((data: SwipeEventData) => {
    if (!enabled) return;
    
    const currentIndex = TAB_ORDER.indexOf(currentTab);
    
    // Swipe right goes to previous tab (left in the tab bar)
    if (currentIndex > 0) {
      const prevTab = TAB_ORDER[currentIndex - 1];
      onTabChange(prevTab);
      triggerHaptic('light');
      
      // Announce tab change for screen readers
      if ('speechSynthesis' in window) {
        const tabNames = {
          home: 'Home',
          search: 'Search',
          lik: 'Lik', 
          trending: 'Trending',
          profile: 'Profile'
        };
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(`Switched to ${tabNames[prevTab]} tab`);
          utterance.volume = 0.1;
          speechSynthesis.speak(utterance);
        }, 100);
      }
    } else {
      // Bounce feedback when at beginning
      triggerHaptic('error');
    }
    
    setIsSwipeIndicatorVisible(false);
    setSwipeDirection(null);
  }, [currentTab, onTabChange, enabled, triggerHaptic]);

  const handleSwipeEnd = useCallback(() => {
    setIsSwipeIndicatorVisible(false);
    setSwipeDirection(null);
  }, []);

  const swipeRef = useSwipe({
    onSwipeStart: handleSwipeStart,
    onSwiping: handleSwiping,
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    onSwipeEnd: handleSwipeEnd,
  }, {
    threshold,
    preventDefaultTouchmoveEvent: false,
    trackTouch: true,
    trackMouse: false,
    delta: 20,
  });

  return {
    swipeRef,
    swipeDirection,
    isSwipeIndicatorVisible
  };
}