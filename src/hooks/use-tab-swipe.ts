import { useSwipe } from './use-swipe';
import { TabType } from '@/lib/types';
import { useCallback, useState } from 'react';

const TAB_ORDER: TabType[] = ['home', 'search', 'lik', 'trending', 'profile'];

interface UseTabSwipeProps {
  tabs: TabType[];
  onTabChange: (tab: TabType) => void;
  currentTab: TabType;
  onShowCreatePost?: () => void;
  disabled?: boolean;
}

export function useTabSwipe({ tabs, onTabChange, currentTab, onShowCreatePost, disabled }: UseTabSwipeProps) {
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'none'>('none');
  const [isSwipeIndicatorVisible, setIsSwipeIndicatorVisible] = useState(false);
  const getCurrentIndex = useCallback(() => {
    return tabs.indexOf(currentTab);
  }, [currentTab, tabs]);

  const goToNextTab = useCallback(() => {
    const currentIndex = getCurrentIndex();
    const nextIndex = (currentIndex + 1) % tabs.length;
    onTabChange(tabs[nextIndex]);
  }, [getCurrentIndex, onTabChange, tabs]);

  const goToPreviousTab = useCallback(() => {
    const currentIndex = getCurrentIndex();
    
    // If we're on home page and swipe right, open CreatePost
    if (currentIndex === 0 && onShowCreatePost) {
      onShowCreatePost();
      return;
    }
    
    const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    onTabChange(tabs[prevIndex]);
  }, [getCurrentIndex, onTabChange, onShowCreatePost, tabs]);

  const swipeHandlers = useSwipe({
    onSwipedLeft: () => {
      if (!disabled) {
        setSwipeDirection('left');
        setIsSwipeIndicatorVisible(true);
        goToNextTab();
        setTimeout(() => {
          setSwipeDirection('none');
          setIsSwipeIndicatorVisible(false);
        }, 300);
      }
    },
    onSwipedRight: () => {
      if (!disabled) {
        setSwipeDirection('right');
        setIsSwipeIndicatorVisible(true);
        goToPreviousTab();
        setTimeout(() => {
          setSwipeDirection('none');
          setIsSwipeIndicatorVisible(false);
        }, 300);
      }
    },
  }, {
    threshold: 50, // Require at least 50px swipe
    preventDefaultTouchmoveEvent: false,
    trackTouch: true,
    trackMouse: false,
  });

  return {
    currentIndex: getCurrentIndex(),
    swipeHandlers,
    swipeProgress,
    swipeDirection,
    isSwipeIndicatorVisible,
    goToNextTab,
    goToPreviousTab,
    currentTabIndex: getCurrentIndex(),
    totalTabs: tabs.length,
  };
}