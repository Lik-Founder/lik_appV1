import { useState } from 'react';
import { TabType } from '@/lib/types';
import { Navigation } from '@/components/Navigation';
import { HomeFeed } from '@/components/HomeFeed';
import { SearchPage } from '@/components/SearchPage';
import { LikPage } from '@/components/LikPage';
import { TrendingPage } from '@/components/TrendingPage';
import { ProfilePage } from '@/components/ProfilePage';
import { RestaurantProfile } from '@/components/RestaurantProfile';
import { SwipeIndicator } from '@/components/SwipeIndicator';
import { useDevice, useSafeArea } from '@/hooks/use-device';
import { useTabSwipe } from '@/hooks/use-tab-swipe';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showRestaurantProfile, setShowRestaurantProfile] = useState<string | null>(null);
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(false);
  const device = useDevice();
  const safeArea = useSafeArea();

  // Set up swipe gestures for tab navigation (disabled when showing restaurant profile)
  const tabSwipeHandlers = useTabSwipe({
    activeTab,
    onTabChange: (newTab) => {
      setActiveTab(newTab);
      setShowSwipeIndicator(true);
    },
    disabled: !!showRestaurantProfile,
  });

  const renderActiveTab = () => {
    // Show restaurant profile if requested
    if (showRestaurantProfile) {
      return (
        <RestaurantProfile 
          restaurantId={showRestaurantProfile}
          onBack={() => setShowRestaurantProfile(null)}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return <HomeFeed />;
      case 'search':
        return <SearchPage />;
      case 'lik':
        return <LikPage />;
      case 'trending':
        return (
          <TrendingPage 
            onShowRestaurantProfile={(restaurantId) => setShowRestaurantProfile(restaurantId)}
          />
        );
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomeFeed />;
    }
  };

  return (
    <div 
      className={cn(
        "h-screen bg-background flex flex-col tab-navigation-container no-select-on-swipe",
        device.hasNotch && "safe-area"
      )}
      style={{
        height: device.orientation === 'landscape' ? '100vh' : '100dvh' // Use dynamic viewport height
      }}
      {...tabSwipeHandlers} // Add swipe handlers to the main container
    >


      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {renderActiveTab()}
      </div>

      {/* Swipe Indicator */}
      {!showRestaurantProfile && (
        <SwipeIndicator 
          activeTab={activeTab} 
          isVisible={showSwipeIndicator}
        />
      )}

      {/* Bottom Navigation - Hide when viewing restaurant profile */}
      {!showRestaurantProfile && (
        <div 
          className={cn(
            "border-t backdrop-blur-sm",
            activeTab === 'trending' 
              ? "bg-black border-black/20" 
              : "border-border bg-background/95",
            device.hasNotch && "safe-bottom"
          )}
          style={{ paddingBottom: device.hasNotch ? safeArea.bottom : 0 }}
        >
          <Navigation 
            activeTab={activeTab} 
            onTabChange={(tab) => {
              setActiveTab(tab);
              setShowSwipeIndicator(false); // Hide indicator when using nav buttons
            }}
            deviceType={device.type}
            orientation={device.orientation}
          />
        </div>
      )}

      <Toaster 
        position="top-center"
        richColors
        closeButton
        offset={device.hasNotch ? safeArea.top + 60 : 60}
      />
    </div>
  );
}

export default App;