import { useState, useEffect } from 'react';
import LikLogo from '@/assets/images/Lik_Logo_Heart_1.0.png';
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
import { AuthPage } from '@/components/AuthPage';
import { OnboardingPage } from '@/components/OnboardingPage';
import { PreferencesPage } from '@/components/PreferencesPage';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useDevice, useSafeArea } from '@/hooks/use-device';
import { useTabSwipe } from '@/hooks/use-tab-swipe';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

function AppContent() {
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
  const [showAuth, setShowAuth] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  
  // Always call hooks at the top level - never conditionally
  const { user, loading } = useAuth();
  const device = useDevice();
  const safeArea = useSafeArea();

  // Check if Supabase is properly configured
  const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== 'placeholder_anon_key';

  // Set up swipe gestures for tab navigation (disabled when showing modals)
  const swipeDisabled = !!(showRestaurantProfile || showUserProfile || showLeaderboard || showLikTV || showLikPassport || showGuidePage || showEventsPage || showEventDetails || showMessagesPage || showMessageThread || showTrendingSearch || showSwipeDiscovery || showNotifications || showBountyDetails || showRewards || showReservationManager || showOnboarding || showPreferences);
  
  const tabSwipeHandlers = useTabSwipe({
    activeTab,
    onTabChange: (newTab) => {
      setActiveTab(newTab);
      setShowSwipeIndicator(true);
    },
    disabled: swipeDisabled,
  });

  // Use useEffect to handle auth state changes
  useEffect(() => {
    // If Supabase is not configured, skip auth flow and just show the app
    if (!isSupabaseConfigured) {
      console.log('Supabase not configured, showing app directly');
      return;
    }

    // Show onboarding for new users (only if Supabase is configured)
    if (!loading && !user && !showAuth && !showOnboarding) {
      setShowOnboarding(true);
    }

    // Show preferences page after successful authentication for new users
    if (user && showAuth && !showPreferences) {
      setShowAuth(false);
      // Check if user has completed preferences (you could store this in user metadata)
      const hasCompletedPreferences = user.user_metadata?.preferences_completed;
      if (!hasCompletedPreferences) {
        setShowPreferences(true);
      }
    }

    // Hide auth/onboarding pages if user is authenticated
    if (user && (showAuth || showOnboarding)) {
      setShowAuth(false);
      setShowOnboarding(false);
    }
  }, [loading, user, showAuth, showOnboarding, showPreferences, isSupabaseConfigured]);

  // Early returns only after all hooks are called
  // If Supabase is not configured, skip auth flow and show the app directly
  if (!isSupabaseConfigured) {
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
        {!showRestaurantProfile && !showUserProfile && !showLeaderboard && !showLikTV && !showLikPassport && !showGuidePage && !showEventsPage && !showEventDetails && !showMessagesPage && !showMessageThread && !showTrendingSearch && !showSwipeDiscovery && !showNotifications && !showBountyDetails && !showRewards && !showReservationManager && !showOnboarding && !showPreferences && (
          <SwipeIndicator 
            activeTab={activeTab} 
            isVisible={showSwipeIndicator}
          />
        )}

        {/* Bottom Navigation */}
        {!showRestaurantProfile && !showUserProfile && !showLeaderboard && !showLikTV && !showLikPassport && !showGuidePage && !showEventsPage && !showEventDetails && !showMessagesPage && !showMessageThread && !showTrendingSearch && !showSwipeDiscovery && !showNotifications && !showBountyDetails && !showRewards && !showReservationManager && !showOnboarding && !showPreferences && (
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

  // Show onboarding page (only if Supabase is configured)
  if (showOnboarding && isSupabaseConfigured) {
    return (
      <OnboardingPage 
        onGetStarted={() => {
          setShowOnboarding(false);
          setShowAuth(true);
        }} 
      />
    );
  }

  // Show preferences page
  if (showPreferences) {
    return (
      <PreferencesPage 
        onComplete={() => {
          setShowPreferences(false);
          // Update user metadata to mark preferences as completed
          // This would typically be done through your auth service
        }} 
      />
    );
  }

  // Show auth page (only if Supabase is configured)
  if (showAuth && isSupabaseConfigured) {
    return <AuthPage onBack={() => setShowAuth(false)} />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <img 
            src={LikLogo} 
            alt="Lik" 
            className="w-16 h-16 mx-auto mb-4 animate-pulse"
          />
          <p className="text-muted-foreground">Loading your food journey...</p>
        </div>
      </div>
    );
  }

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
          />
        );
      case 'search':
        return (
          <SearchPage 
            onShowUserProfile={(userId) => setShowUserProfile(userId)}
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
        return <ProfilePage onShowLeaderboard={() => setShowLeaderboard(true)} onShowLikPassport={() => setShowLikPassport(true)} onShowNotifications={() => setShowNotifications(true)} onShowRewards={() => setShowRewards(true)} onShowReservationManager={() => setShowReservationManager(true)} />;
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
        height: device.orientation === 'landscape' ? '100vh' : '100dvh' // Use dynamic viewport height
      }}
      {...tabSwipeHandlers} // Add swipe handlers to the main container
    >


      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {renderActiveTab()}
      </div>

      {/* Swipe Indicator */}
      {!showRestaurantProfile && !showUserProfile && !showLeaderboard && !showLikTV && !showLikPassport && !showGuidePage && !showEventsPage && !showEventDetails && !showMessagesPage && !showMessageThread && !showTrendingSearch && !showSwipeDiscovery && !showNotifications && !showBountyDetails && !showRewards && !showReservationManager && !showOnboarding && !showPreferences && (
        <SwipeIndicator 
          activeTab={activeTab} 
          isVisible={showSwipeIndicator}
        />
      )}

      {/* Bottom Navigation - Hide when viewing restaurant profile */}
      {!showRestaurantProfile && !showUserProfile && !showLeaderboard && !showLikTV && !showLikPassport && !showGuidePage && !showEventsPage && !showEventDetails && !showMessagesPage && !showMessageThread && !showTrendingSearch && !showSwipeDiscovery && !showNotifications && !showBountyDetails && !showRewards && !showReservationManager && !showOnboarding && !showPreferences && (
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;