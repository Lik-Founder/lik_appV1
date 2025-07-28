import { useState } from 'react';
import { TabType } from '@/lib/types';
import { Navigation } from '@/components/Navigation';
import { HomeFeed } from '@/components/HomeFeed';
import { SearchPage } from '@/components/SearchPage';
import { CreatePost } from '@/components/CreatePost';
import { MessagesPage } from '@/components/MessagesPage';
import { ProfilePage } from '@/components/ProfilePage';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const isMobile = useIsMobile();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeFeed />;
      case 'search':
        return <SearchPage />;
      case 'create':
        return <CreatePost />;
      case 'messages':
        return <MessagesPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomeFeed />;
    }
  };

  return (
    <div className="h-screen bg-background">
      <div className="h-full flex flex-col md:flex-row">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="w-64 border-r border-border bg-background">
            <div className="p-6 border-b border-border">
              <h1 className="text-2xl font-bold instagram-gradient bg-clip-text text-transparent">
                Instagram
              </h1>
            </div>
            <Navigation 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              className="flex-col items-start"
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Mobile Header */}
          {isMobile && (
            <div className="border-b border-border bg-background p-4">
              <h1 className="text-xl font-bold instagram-gradient bg-clip-text text-transparent">
                Instagram
              </h1>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {renderActiveTab()}
          </div>

          {/* Mobile Bottom Navigation */}
          {isMobile && (
            <Navigation 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              className="border-t"
            />
          )}
        </div>
      </div>

      <Toaster 
        position={isMobile ? "top-center" : "bottom-right"}
        richColors
        closeButton
      />
    </div>
  );
}

export default App;