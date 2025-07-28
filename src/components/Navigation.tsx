import { Home, Search, PlusSquare, MessageCircle, User } from '@phosphor-icons/react';
import { TabType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  className?: string;
}

export function Navigation({ activeTab, onTabChange, className }: NavigationProps) {
  const navItems = [
    { id: 'home' as TabType, icon: Home, label: 'Home' },
    { id: 'search' as TabType, icon: Search, label: 'Search' },
    { id: 'create' as TabType, icon: PlusSquare, label: 'Create' },
    { id: 'messages' as TabType, icon: MessageCircle, label: 'Messages' },
    { id: 'profile' as TabType, icon: User, label: 'Profile' },
  ];

  return (
    <nav className={cn("flex items-center justify-around bg-background border-t border-border md:flex-col md:justify-start md:gap-6 md:border-t-0 md:border-r md:p-6", className)}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 p-3 md:flex-row md:w-full md:justify-start md:gap-3",
              isActive && "text-foreground",
              !isActive && "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon 
              size={24} 
              weight={isActive ? "fill" : "regular"}
            />
            <span className="text-xs md:text-sm">{item.label}</span>
          </Button>
        );
      })}
    </nav>
  );
}