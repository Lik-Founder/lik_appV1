import React, { useState } from 'react';
import { TabType } from '@/lib/types';
import { Navigation } from '@/components/Navigation';
import { LikPage } from '@/components/LikPage';
import { HomeFeed } from '@/components/HomeFeed';
import { SearchPage } from '@/components/SearchPage';
import { TrendingPage } from '@/components/TrendingPage';
import { ProfilePage } from '@/components/ProfilePage';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeFeed />;
      case 'search':
        return <SearchPage />;
      case 'lik':
        return <LikPage onNavigate={() => {}} onSelectBounty={() => {}} />;
      case 'trending':
        return <TrendingPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomeFeed />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <div className="flex-1 overflow-hidden pb-16">
        {renderContent()}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 z-50">
        <Navigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
}

export default App;