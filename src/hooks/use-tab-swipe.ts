import { useSwipe } from './use-swipe';
import { TabType } from '@/lib/types';
import { useCallback } from 'react';

const TAB_ORDER: TabType[] = ['home', 'search', 'lik', 'trending', 'profile'];

interface UseTabSwipeProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  disabled?: boolean;
}

export function useTabSwipe({ activeTab, onTabChange, disabled }: UseTabSwipeProps) {
  const getCurrentIndex = useCallback(() => {
    return TAB_ORDER.indexOf(activeTab);
  }, [activeTab]);

  const goToNextTab = useCallback(() => {
    const currentIndex = getCurrentIndex();
    const nextIndex = (currentIndex + 1) % TAB_ORDER.length;
    onTabChange(TAB_ORDER[nextIndex]);
  }, [getCurrentIndex, onTabChange]);

  const goToPreviousTab = useCallback(() => {
    const currentIndex = getCurrentIndex();
    const prevIndex = currentIndex === 0 ? TAB_ORDER.length - 1 : currentIndex - 1;
    onTabChange(TAB_ORDER[prevIndex]);
  }, [getCurrentIndex, onTabChange]);

  const swipeHandlers = useSwipe({
    onSwipedLeft: () => {
      if (!disabled) {
        goToNextTab();
      }
    },
    onSwipedRight: () => {
      if (!disabled) {
        goToPreviousTab();
      }
    },
  }, {
    threshold: 50, // Require at least 50px swipe
    preventDefaultTouchmoveEvent: false,
    trackTouch: true,
    trackMouse: false,
  });

  return {
    ...swipeHandlers,
    goToNextTab,
    goToPreviousTab,
    currentTabIndex: getCurrentIndex(),
    totalTabs: TAB_ORDER.length,
  };
}