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
import { useDevice, useSafeArea } from '@/hooks/use-device';
import { useTabSwipe } from '@/hooks/use-tab-swipe';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

function App() {
  return (
    <div className="h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Lik App</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export default App;