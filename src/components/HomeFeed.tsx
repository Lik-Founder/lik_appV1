import { useKV } from '@github/spark/hooks';
import { useState } from 'react';
import { Story as StoryType, User } from '@/lib/types';
import { generateMockStories, generateMockUsers, getCurrentUser } from '@/lib/mockData';
import { StoriesBar } from '@/components/StoriesBar';
import { CreateStoryModal } from '@/components/CreateStoryModal';
import { useDevice } from '@/hooks/use-device';
import { cn } from '@/lib/utils';

export function HomeFeed() {
  const [stories, setStories] = useKV<StoryType[]>('stories', generateMockStories());
  const [users, setUsers] = useKV<User[]>('users', generateMockUsers());
  const [currentUser] = useKV<User>('currentUser', getCurrentUser());
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  
  const device = useDevice();

  const handleStoryClick = (storyId: string) => {
    setStories(currentStories => 
      currentStories.map(story => 
        story.id === storyId ? { ...story, isViewed: true } : story
      )
    );
  };

  const handleAddStory = () => {
    setIsCreateStoryOpen(true);
  };

  return (
    <div className="h-full">
      <div className={cn(
        "h-full overflow-y-auto scrollbar-hide",
        "mx-auto",
        device.type === 'tablet' ? "max-w-2xl" : "w-full"
      )}>
        <StoriesBar
          stories={stories}
          users={users}
          currentUser={currentUser}
          onStoryClick={handleStoryClick}
          onAddStory={handleAddStory}
          deviceType={device.type}
        />
      </div>
      
      {/* Create Story Modal */}
      <CreateStoryModal 
        open={isCreateStoryOpen} 
        onOpenChange={setIsCreateStoryOpen}
      />
    </div>
  );
}