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
import { RewardsPage } from '@/components/RewardsPage';
import { ReservationManager } from '@/components/ReservationManager';
import { CreatePostPage } from '@/components/CreatePostPage';
import { MapPage } from '@/components/MapPage';
import { BountyQuestMap } from '@/components/BountyQuestMap';
import { IndividualGuidePage } from '@/components/IndividualGuidePage';
import { useDevice, useSafeArea } from '@/hooks/use-device';
import { useTabSwipe } from '@/hooks/use-tab-swipe';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [currentPage, setCurrentPage] = useState<string>('main');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const [selectedBounty, setSelectedBounty] = useState<any>(null);
  const [selectedGuide, setSelectedGuide] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [selectedMessage, setSelectedMessage] = useState<string>('');
  const { isMobile } = useDevice();
  const { top, bottom } = useSafeArea();

  // Tab swipe functionality
  const {
    currentIndex,
    swipeHandlers,
    swipeProgress,
    swipeDirection,
    isSwipeIndicatorVisible
  } = useTabSwipe({
    tabs: ['home', 'search', 'lik', 'trending', 'profile'] as TabType[],
    onTabChange: setActiveTab,
    currentTab: activeTab
  });

  const renderPage = () => {
    switch (currentPage) {
      case 'trending-search':
        return <TrendingSearchPage onBack={() => setCurrentPage('main')} />;
      case 'user-profile':
        return <UserProfile userId={selectedUser} onBack={() => setCurrentPage('main')} onNavigate={setCurrentPage} />;
      case 'restaurant-profile':
        return <RestaurantProfile restaurantId={selectedRestaurant} onBack={() => setCurrentPage('main')} onNavigate={setCurrentPage} />;
      case 'leaderboard':
        return <LeaderboardPage onBack={() => setCurrentPage('main')} onNavigate={setCurrentPage} />;
      case 'liktv':
        return <LikTVPage onBack={() => setCurrentPage('main')} />;
      case 'lik-passport':
        return <LikPassportPage onBack={() => setCurrentPage('main')} />;
      case 'swipe-discovery':
        return <SwipeDiscoveryPage onBack={() => setCurrentPage('main')} />;
      case 'notifications':
        return <NotificationsPage onBack={() => setCurrentPage('main')} />;
      case 'bounty-details':
        return <BountyDetailsPage bounty={selectedBounty} onBack={() => setCurrentPage('main')} />;
      case 'my-rewards':
        return <MyRewardsPage onBack={() => setCurrentPage('main')} />;
      case 'rewards':
        return <RewardsPage onBack={() => setCurrentPage('main')} />;
      case 'guide':
        return <GuidePage onBack={() => setCurrentPage('main')} onNavigate={setCurrentPage} onSelectGuide={setSelectedGuide} />;
      case 'individual-guide':
        return <IndividualGuidePage guideId={selectedGuide} onBack={() => setCurrentPage('guide')} />;
      case 'events':
        return <EventsPage onBack={() => setCurrentPage('main')} onNavigate={setCurrentPage} onSelectEvent={setSelectedEvent} />;
      case 'food-event':
        return <FoodEventPage eventId={selectedEvent} onBack={() => setCurrentPage('events')} />;
      case 'messages':
        return <MessagesPage onBack={() => setCurrentPage('main')} onNavigate={setCurrentPage} onSelectMessage={setSelectedMessage} />;
      case 'message-thread':
        return <MessageThread messageId={selectedMessage} onBack={() => setCurrentPage('messages')} />;
      case 'reservation-manager':
        return <ReservationManager onBack={() => setCurrentPage('main')} />;
      case 'create-post':
        return <CreatePostPage onBack={() => setCurrentPage('main')} />;
      case 'map':
        return <MapPage onBack={() => setCurrentPage('main')} />;
      case 'bounty-quest-map':
        return <BountyQuestMap onBack={() => setCurrentPage('main')} />;
      default:
        return renderMainContent();
    }
  };

  const renderMainContent = () => {
    const tabContent = (() => {
      switch (activeTab) {
        case 'home':
          return <HomeFeed onNavigate={setCurrentPage} onSelectUser={setSelectedUser} onSelectRestaurant={setSelectedRestaurant} />;
        case 'search':
          return <SearchPage onNavigate={setCurrentPage} onSelectUser={setSelectedUser} onSelectRestaurant={setSelectedRestaurant} />;
        case 'lik':
          return <LikPage onNavigate={setCurrentPage} onSelectBounty={setSelectedBounty} />;
        case 'trending':
          return <TrendingPage onNavigate={setCurrentPage} onSelectUser={setSelectedUser} onSelectRestaurant={setSelectedRestaurant} />;
        case 'profile':
          return <ProfilePage onNavigate={setCurrentPage} />;
        default:
          return <HomeFeed onNavigate={setCurrentPage} onSelectUser={setSelectedUser} onSelectRestaurant={setSelectedRestaurant} />;
      }
    })();

    return (
      <div 
        className="relative flex flex-col h-full overflow-hidden"
        {...swipeHandlers}
        style={{
          transform: `translateX(${swipeProgress}px)`,
          transition: swipeDirection === 'none' ? 'transform 0.3s ease-out' : 'none'
        }}
      >
        {tabContent}
      </div>
    );
  };

  return (
    <div 
      className={cn(
        "flex flex-col h-full max-h-screen bg-background overflow-hidden",
        "safe-area"
      )}
      style={{
        paddingTop: top,
        paddingBottom: bottom,
        height: '100vh',
        maxHeight: '100vh'
      }}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderPage()}
      </div>
      
      {currentPage === 'main' && (
        <Navigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          className="flex-shrink-0"
        />
      )}

      {isSwipeIndicatorVisible && (
        <SwipeIndicator
          direction={swipeDirection}
          progress={Math.abs(swipeProgress) / 100}
        />
      )}

      <Toaster position="top-center" />
    </div>
  );
}

export default App;