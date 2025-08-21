import { useState } from 'react';
import { TabType } from '@/lib/types';
import { Navigation } from '@/components/Navigation';
import { HomeFeed } from '@/components/HomeFeed';
import { SearchPage } from '@/components/SearchPage';
import { LikPage } from '@/components/LikPage';
import { TrendingPage } from '@/components/TrendingPage';
import { TrendingSearchPage } from '@/components/TrendingSearchPage';
import { ProfilePage } from '@/components/ProfilePage';
import { RestaurantProfile } from '@/components/RestaurantProfile';
import { UserProfile } from '@/components/UserProfile';
import { LeaderboardPage } from '@/components/LeaderboardPage';
import { LikTVPage } from '@/components/LikTVPage';
import { LikPassportPage } from '@/components/LikPassportPage';
import { GuidePage } from '@/components/GuidePage';
import { FoodEventPage } from '@/components/FoodEventPage';
import { EventsPage } from '@/components/EventsPage';
import { MessagesPage } from '@/components/MessagesPage';
import { MessageThread } from '@/components/MessageThread';
import { SwipeIndicator } from '@/components/SwipeIndicator';
import { SwipeDiscoveryPage } from '@/components/SwipeDiscoveryPage';
import { NotificationsPage } from '@/components/NotificationsPage';
import { BountyDetailsPage } from '@/components/BountyDetailsPage';
import { MyRewardsPage } from '@/components/MyRewardsPage';
import { ReservationManager } from '@/components/ReservationManager';
import { useDevice, useSafeArea } from '@/hooks/use-device';
import { useTabSwipe } from '@/hooks/use-tab-swipe';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showRestaurantProfile, setShowRestaurantProfile] = useState<string | null>(null);
  const [showUserProfile, setShowUserProfile] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showLikTV, setShowLikTV] = useState(false);
  const [showLikPassport, setShowLikPassport] = useState(false);
  const [showGuidePage, setShowGuidePage] = useState(false);
  const [showEventsPage, setShowEventsPage] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState<string | null>(null);
  const [showMessagesPage, setShowMessagesPage] = useState(false);
  const [showMessageThread, setShowMessageThread] = useState<string | null>(null);
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(false);
  const [showTrendingSearch, setShowTrendingSearch] = useState(false);
  const [showSwipeDiscovery, setShowSwipeDiscovery] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBountyDetails, setShowBountyDetails] = useState<string | null>(null);
  const [showRewards, setShowRewards] = useState(false);
  const [showReservationManager, setShowReservationManager] = useState(false);
  
  const device = useDevice();
  const safeArea = useSafeArea();

  // Set up swipe gestures for tab navigation (disabled when showing modals)
  const swipeDisabled = !!(showRestaurantProfile || showUserProfile || showLeaderboard || showLikTV || showLikPassport || showGuidePage || showEventsPage || showEventDetails || showMessagesPage || showMessageThread || showTrendingSearch || showSwipeDiscovery || showNotifications || showBountyDetails || showRewards || showReservationManager);
  
  const tabSwipeHandlers = useTabSwipe({
    activeTab,
    onTabChange: (newTab) => {
      setActiveTab(newTab);
      setShowSwipeIndicator(true);
    },
    disabled: swipeDisabled,
  });

  // Define renderActiveTab function
  const renderActiveTab = () => {
    // Show Reservation Manager if requested
    if (showReservationManager) {
      return (
        <ReservationManager 
          onBack={() => setShowReservationManager(false)}
          onShowReservationSystem={(restaurantId) => {
            setShowReservationManager(false);
            setShowRestaurantProfile(restaurantId);
          }}
        />
      );
    }

    // Show Rewards if requested
    if (showRewards) {
      return (
        <MyRewardsPage 
          onBack={() => setShowRewards(false)}
        />
      );
    }

    // Show Bounty Details if requested
    if (showBountyDetails) {
      return (
        <BountyDetailsPage 
          bountyId={showBountyDetails}
          onBack={() => setShowBountyDetails(null)}
          onShowRestaurantProfile={(restaurantId) => {
            setShowBountyDetails(null);
            setShowRestaurantProfile(restaurantId);
          }}
          onShowUserProfile={(userId) => {
            setShowBountyDetails(null);
            setShowUserProfile(userId);
          }}
        />
      );
    }

    // Show Notifications if requested
    if (showNotifications) {
      return (
        <NotificationsPage 
          onBack={() => setShowNotifications(false)}
        />
      );
    }

    // Show Swipe Discovery if requested
    if (showSwipeDiscovery) {
      return (
        <SwipeDiscoveryPage 
          onBack={() => setShowSwipeDiscovery(false)}
          onShowRestaurantProfile={(restaurantId) => {
            setShowSwipeDiscovery(false);
            setShowRestaurantProfile(restaurantId);
          }}
        />
      );
    }

    // Show Trending Search if requested
    if (showTrendingSearch) {
      return (
        <TrendingSearchPage 
          onBack={() => setShowTrendingSearch(false)}
          onShowUserProfile={(userId) => {
            setShowTrendingSearch(false);
            setShowUserProfile(userId);
          }}
          onShowRestaurantProfile={(restaurantId) => {
            setShowTrendingSearch(false);
            setShowRestaurantProfile(restaurantId);
          }}
          onShowVideoDetails={(videoId) => {
            setShowTrendingSearch(false);
            // Could add video details page navigation here
          }}
        />
      );
    }

    // Show Message Thread if requested
    if (showMessageThread) {
      return (
        <MessageThread 
          chatId={showMessageThread}
          onBack={() => setShowMessageThread(null)}
          onShowRestaurantProfile={(restaurantId) => {
            setShowMessageThread(null);
            setShowRestaurantProfile(restaurantId);
          }}
          onShowUserProfile={(userId) => {
            setShowMessageThread(null);
            setShowUserProfile(userId);
          }}
        />
      );
    }

    // Show Messages page if requested
    if (showMessagesPage) {
      return (
        <MessagesPage 
          onBack={() => setShowMessagesPage(false)}
          onOpenChat={(chatId) => {
            setShowMessagesPage(false);
            setShowMessageThread(chatId);
          }}
          onShowRestaurantProfile={(restaurantId) => {
            setShowMessagesPage(false);
            setShowRestaurantProfile(restaurantId);
          }}
          onShowUserProfile={(userId) => {
            setShowMessagesPage(false);
            setShowUserProfile(userId);
          }}
        />
      );
    }

    // Show Event Details if requested
    if (showEventDetails) {
      return (
        <FoodEventPage 
          eventId={showEventDetails}
          onBack={() => setShowEventDetails(null)}
          onShowRestaurantProfile={(restaurantId) => {
            setShowEventDetails(null);
            setShowRestaurantProfile(restaurantId);
          }}
          onShowUserProfile={(userId) => {
            setShowEventDetails(null);
            setShowUserProfile(userId);
          }}
        />
      );
    }

    // Show Events page if requested
    if (showEventsPage) {
      return (
        <EventsPage 
          onBack={() => setShowEventsPage(false)}
          onShowEventDetails={(eventId) => {
            setShowEventsPage(false);
            setShowEventDetails(eventId);
          }}
          onShowRestaurantProfile={(restaurantId) => {
            setShowEventsPage(false);
            setShowRestaurantProfile(restaurantId);
          }}
          onShowUserProfile={(userId) => {
            setShowEventsPage(false);
            setShowUserProfile(userId);
          }}
        />
      );
    }

    // Show Guide page if requested
    if (showGuidePage) {
      return (
        <GuidePage 
          onBack={() => setShowGuidePage(false)}
          onShowUserProfile={(userId) => {
            setShowGuidePage(false);
            setShowUserProfile(userId);
          }}
          onShowRestaurantProfile={(restaurantId) => {
            setShowGuidePage(false);
            setShowRestaurantProfile(restaurantId);
          }}
        />
      );
    }

    // Show LikPassport if requested
    if (showLikPassport) {
      return (
        <LikPassportPage 
          onBack={() => setShowLikPassport(false)}
        />
      );
    }

    // Show LikTV if requested
    if (showLikTV) {
      return (
        <LikTVPage 
          onBack={() => setShowLikTV(false)}
        />
      );
    }

    // Show leaderboard if requested
    if (showLeaderboard) {
      return (
        <LeaderboardPage 
          onBack={() => setShowLeaderboard(false)}
          onShowRestaurantProfile={(restaurantId) => {
            setShowLeaderboard(false);
            setShowRestaurantProfile(restaurantId);
          }}
          onShowUserProfile={(userId) => {
            setShowLeaderboard(false);
            setShowUserProfile(userId);
          }}
        />
      );
    }

    // Show restaurant profile if requested
    if (showRestaurantProfile) {
      return (
        <RestaurantProfile 
          restaurantId={showRestaurantProfile}
          onBack={() => setShowRestaurantProfile(null)}
        />
      );
    }

    // Show user profile if requested
    if (showUserProfile) {
      return (
        <UserProfile 
          userId={showUserProfile}
          onBack={() => setShowUserProfile(null)}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeFeed 
            onShowUserProfile={(userId) => setShowUserProfile(userId)}
            onShowRestaurantProfile={(restaurantId) => setShowRestaurantProfile(restaurantId)}
            onShowLeaderboard={() => setShowLeaderboard(true)}
            onShowLikTV={() => setShowLikTV(true)}
            onShowGuidePage={() => setShowGuidePage(true)}
            onShowEventsPage={() => setShowEventsPage(true)}
            onShowMessagesPage={() => setShowMessagesPage(true)}
            onShowLikPassport={() => setShowLikPassport(true)}
            onShowNotifications={() => setShowNotifications(true)}
            onShowReservationManager={() => setShowReservationManager(true)}
          />
        );
      case 'search':
        return (
          <SearchPage 
            onShowRestaurantProfile={(restaurantId) => setShowRestaurantProfile(restaurantId)}
            onShowSwipeDiscovery={() => setShowSwipeDiscovery(true)}
            onShowLikPassport={() => setShowLikPassport(true)}
            onShowLeaderboard={() => setShowLeaderboard(true)}
            onShowLikTV={() => setShowLikTV(true)}
            onShowMessagesPage={() => setShowMessagesPage(true)}
          />
        );
      case 'lik':
        return (
          <LikPage 
            onShowRestaurantProfile={(restaurantId) => setShowRestaurantProfile(restaurantId)}
            onShowLikPassport={() => setShowLikPassport(true)}
            onShowMessagesPage={() => setShowMessagesPage(true)}
            onShowNotifications={() => setShowNotifications(true)}
            onShowBountyDetails={(bountyId) => setShowBountyDetails(bountyId)}
            onShowReservationManager={() => setShowReservationManager(true)}
          />
        );
      case 'trending':
        return (
          <TrendingPage 
            onShowRestaurantProfile={(restaurantId) => setShowRestaurantProfile(restaurantId)}
            onShowUserProfile={(userId) => setShowUserProfile(userId)}
            onShowSearch={() => setShowTrendingSearch(true)}
            onShowLeaderboard={() => setShowLeaderboard(true)}
            onShowLikTV={() => setShowLikTV(true)}
          />
        );
      case 'profile':
        return <ProfilePage onShowLeaderboard={() => setShowLeaderboard(true)} onShowLikPassport={() => setShowLikPassport(true)} onShowNotifications={() => setShowNotifications(true)} onShowRewards={() => setShowRewards(true)} />;
      default:
        return <HomeFeed onShowUserProfile={(userId) => setShowUserProfile(userId)} />;
    }
  };

  return (
    <div 
      className={cn(
        "h-screen bg-background flex flex-col tab-navigation-container no-select-on-swipe",
        device.hasNotch && "safe-area"
      )}
      style={{
        height: device.orientation === 'landscape' ? '100vh' : '100dvh'
      }}
      {...tabSwipeHandlers}
    >
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {renderActiveTab()}
      </div>

      {/* Swipe Indicator */}
      {!showRestaurantProfile && !showUserProfile && !showLeaderboard && !showLikTV && !showLikPassport && !showGuidePage && !showEventsPage && !showEventDetails && !showMessagesPage && !showMessageThread && !showTrendingSearch && !showSwipeDiscovery && !showNotifications && !showBountyDetails && !showRewards && !showReservationManager && (
        <SwipeIndicator 
          activeTab={activeTab} 
          isVisible={showSwipeIndicator}
        />
      )}

      {/* Bottom Navigation */}
      {!showRestaurantProfile && !showUserProfile && !showLeaderboard && !showLikTV && !showLikPassport && !showGuidePage && !showEventsPage && !showEventDetails && !showMessagesPage && !showMessageThread && !showTrendingSearch && !showSwipeDiscovery && !showNotifications && !showBountyDetails && !showRewards && !showReservationManager && (
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
              setShowSwipeIndicator(false);
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