import { useState } from 'react';
import { Story as StoryType, User } from '@/lib/types';
import { ConsistentAvatar } from '@/components/ui/consistent-avatar';
import { DeviceType } from '@/hooks/use-device';
import { StoryViewer } from '@/components/StoryViewer';
import { useSwipe } from '@/hooks/use-swipe';
import { cn } from '@/lib/utils';

interface StoryProps {
  story: StoryType;
  user: User;
  onStoryClick: (storyId: string) => void;
  onUserClick?: (userId: string) => void;
  deviceType: DeviceType;
}

export function Story({ story, user, onStoryClick, onUserClick, deviceType }: StoryProps) {
  const avatarSize = deviceType === 'tablet' ? 'xl' : 'lg';
  const textWidth = deviceType === 'tablet' ? 'w-20' : 'w-16';
  
  return (
    <div className="flex flex-col items-center gap-1 min-w-0">
      <button
        onClick={() => onStoryClick(story.id)}
        className="touch-target active:scale-95 transition-transform duration-150"
      >
        <ConsistentAvatar
          src={user.avatar}
          alt={user.username}
          fallback={user.username[0]?.toUpperCase()}
          size={avatarSize}
          variant={story.isViewed ? 'story-viewed' : 'story'}
        />
      </button>
      <button
        onClick={() => onUserClick?.(user.id)}
        className="touch-target active:opacity-70 transition-opacity duration-150"
      >
        <span className={cn(
          "text-xs text-center truncate selectable-text hover:text-primary transition-colors",
          textWidth,
          deviceType === 'tablet' && "text-sm"
        )}>
          {user.username}
        </span>
      </button>
    </div>
  );
}

interface StoriesBarProps {
  stories: StoryType[];
  users: User[];
  onStoryClick: (storyId: string) => void;
  onUserClick?: (userId: string) => void;
  currentUser: User;
  onAddStory: () => void;
  deviceType: DeviceType;
}

export function StoriesBar({ stories, users, onStoryClick, onUserClick, currentUser, onAddStory, deviceType }: StoriesBarProps) {
  const [viewerState, setViewerState] = useState<{
    isOpen: boolean;
    storyIndex: number;
  }>({ isOpen: false, storyIndex: 0 });

  const storyUsers = stories.map(story => {
    const user = users.find(u => u.id === story.userId);
    return { story, user };
  }).filter(item => item.user);

  const handleStoryClick = (storyId: string) => {
    const storyIndex = stories.findIndex(s => s.id === storyId);
    if (storyIndex !== -1) {
      setViewerState({ isOpen: true, storyIndex });
      onStoryClick(storyId);
    }
  };

  const closeViewer = () => {
    setViewerState({ isOpen: false, storyIndex: 0 });
  };

  // Swipe navigation for story bar
  const swipeRef = useSwipe({
    onSwipeLeft: () => {
      // Could implement horizontal scrolling for story bar
      const container = swipeRef.current;
      if (container) {
        container.scrollBy({ left: 200, behavior: 'smooth' });
      }
    },
    onSwipeRight: () => {
      const container = swipeRef.current;
      if (container) {
        container.scrollBy({ left: -200, behavior: 'smooth' });
      }
    }
  }, {
    threshold: 50,
    preventDefaultTouchmoveEvent: false
  });

  const avatarSize = deviceType === 'tablet' ? 'xl' : 'lg';
  const textWidth = deviceType === 'tablet' ? 'w-20' : 'w-16';
  const padding = deviceType === 'tablet' ? 'px-6 py-4' : 'px-4 py-3';
  const gap = deviceType === 'tablet' ? 'gap-6' : 'gap-4';

  return (
    <>
      <div 
        ref={swipeRef}
        className={cn(
          "flex overflow-x-auto scrollbar-hide border-b border-border bg-background",
          padding,
          gap
        )}
      >
        <button
          onClick={onAddStory}
          className="flex flex-col items-center gap-1 min-w-0 touch-target active:scale-95 transition-transform duration-150"
        >
          <ConsistentAvatar
            src={currentUser.avatar}
            alt={currentUser.username}
            fallback={currentUser.username[0]?.toUpperCase()}
            size={avatarSize}
            variant="default"
          >
            <div className={cn(
              "absolute -bottom-1 -right-1 bg-accent rounded-full border-2 border-background flex items-center justify-center",
              deviceType === 'tablet' ? "w-7 h-7" : "w-6 h-6"
            )}>
              <span className={cn(
                "text-white font-bold",
                deviceType === 'tablet' ? "text-sm" : "text-xs"
              )}>
                +
              </span>
            </div>
          </ConsistentAvatar>
          <span className={cn(
            "text-xs text-center truncate selectable-text",
            textWidth,
            deviceType === 'tablet' && "text-sm"
          )}>
            Your Story
          </span>
        </button>

        {storyUsers.map(({ story, user }) => (
          <Story
            key={story.id}
            story={story}
            user={user!}
            onStoryClick={handleStoryClick}
            onUserClick={onUserClick}
            deviceType={deviceType}
          />
        ))}
      </div>

      {/* Story Viewer */}
      {viewerState.isOpen && (
        <StoryViewer
          stories={stories}
          users={users}
          initialStoryIndex={viewerState.storyIndex}
          onClose={closeViewer}
          deviceType={deviceType}
        />
      )}
    </>
  );
}