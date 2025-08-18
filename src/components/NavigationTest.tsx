import { useState } from 'react';
import { TabType } from '@/lib/types';
import { Navigation } from '@/components/Navigation';
import { HomeFeed } from '@/components/HomeFeed';
import { SearchPage } from '@/components/SearchPage';
import { LikPage } from '@/components/LikPage';
import { TrendingPage } from '@/components/TrendingPage';
import { ProfilePage } from '@/components/ProfilePage';
import { useDevice } from '@/hooks/use-device';

export function NavigationTest() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const device = useDevice();

  const renderContent = () => {
    try {
      switch (activeTab) {
        case 'home':
          return <HomeFeed />;
        case 'search':
          return <SearchPage />;
        case 'lik':
          return <LikPage />;
        case 'trending':
          return <TrendingPage />;
        case 'profile':
          return <ProfilePage />;
        default:
          return <div>Unknown tab: {activeTab}</div>;
      }
    } catch (error) {
      return <div>Error rendering {activeTab}: {error instanceof Error ? error.message : 'Unknown error'}</div>;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 bg-muted">
        <h1 className="text-xl font-bold">Navigation Test</h1>
        <p>Current tab: {activeTab}</p>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      <div className="border-t bg-background">
        <Navigation 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            console.log('Tab changed to:', tab);
            setActiveTab(tab);
          }}
          deviceType={device.type}
          orientation={device.orientation}
        />
      </div>
    </div>
  );
}