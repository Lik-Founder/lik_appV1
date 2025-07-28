import { useState } from 'react';
import { TabType } from '@/lib/types';
import { Navigation } from '@/components/Navigation';
import { HomeFeed } from '@/components/HomeFeed';
import { SearchPage } from '@/components/SearchPage';
import { LikPage } from '@/components/LikPage';
import { MessagesPage } from '@/components/MessagesPage';
import { ProfilePage } from '@/components/ProfilePage';
import { useDevice, useSafeArea } from '@/hooks/use-device';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const device = useDevice();
  const safeArea = useSafeArea();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeFeed />;
      case 'search':
        return <SearchPage />;
      case 'lik':
        return <LikPage />;
      case 'messages':
        return <MessagesPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomeFeed />;
    }
  };

  return (
    <div 
      className={cn(
        "h-screen bg-background flex flex-col",
        device.hasNotch && "safe-area"
      )}
      style={{
        height: device.orientation === 'landscape' ? '100vh' : '100dvh' // Use dynamic viewport height
      }}
    >
      {/* Mobile Header */}
      <div 
        className={cn(
          "border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10",
          device.hasNotch && "safe-top"
        )}
        style={{ paddingTop: device.hasNotch ? safeArea.top : 16 }}
      >
        <div className="px-4 py-3">
          <h1 className={cn(
            "font-bold instagram-gradient bg-clip-text text-transparent",
            device.type === 'phone' ? 'text-xl' : 'text-2xl'
          )}>
            Instagram
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {renderActiveTab()}
      </div>

      {/* Bottom Navigation */}
      <div 
        className={cn(
          "border-t border-border bg-background/95 backdrop-blur-sm",
          device.hasNotch && "safe-bottom"
        )}
        style={{ paddingBottom: device.hasNotch ? safeArea.bottom : 0 }}
      >
        <Navigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          deviceType={device.type}
          orientation={device.orientation}
        />
      </div>

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