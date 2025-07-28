import { useKV } from '@github/spark/hooks';
import { useState, useRef, useCallback } from 'react';
import { Post as PostType, Story as StoryType, User } from '@/lib/types';
import { generateMockPosts, generateMockStories, generateMockUsers, getCurrentUser } from '@/lib/mockData';
import { Post } from '@/components/Post';
import { StoriesBar } from '@/components/StoriesBar';
import { CreateStoryModal } from '@/components/CreateStoryModal';
import { useDevice } from '@/hooks/use-device';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function HomeFeed() {
  const [posts, setPosts] = useKV<PostType[]>('posts', generateMockPosts());
  const [stories, setStories] = useKV<StoryType[]>('stories', generateMockStories());
  const [users, setUsers] = useKV<User[]>('users', generateMockUsers());
  const [currentUser] = useKV<User>('currentUser', getCurrentUser());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  
  const device = useDevice();
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const handleLike = (postId: string) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked, 
              likes: post.isLiked ? post.likes - 1 : post.likes + 1 
            }
          : post
      )
    );
  };

  const handleComment = (postId: string) => {
    toast.info('Comment feature coming soon!');
  };

  const handleUserClick = (userId: string) => {
    toast.info('Profile view coming soon!');
  };

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

  // Pull-to-refresh functionality
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network request
    toast.success('Feed refreshed!');
    setIsRefreshing(false);
    setPullDistance(0);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      isDragging.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || containerRef.current?.scrollTop !== 0) return;
    
    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, (currentY - startY.current) * 0.5);
    setPullDistance(Math.min(distance, 80));
  };

  const handleTouchEnd = () => {
    if (pullDistance > 60) {
      handleRefresh();
    } else {
      setPullDistance(0);
    }
    isDragging.current = false;
  };

  return (
    <div className="h-full relative pull-to-refresh">
      {/* Pull to refresh indicator */}
      {pullDistance > 0 && (
        <div 
          className="absolute top-0 left-0 right-0 flex items-center justify-center z-20 bg-background/80 backdrop-blur-sm transition-opacity"
          style={{ 
            height: `${pullDistance}px`,
            opacity: pullDistance / 80 
          }}
        >
          <div className={cn(
            "text-sm text-muted-foreground transition-all duration-200",
            pullDistance > 60 && "text-accent font-medium"
          )}>
            {pullDistance > 60 ? 'Release to refresh' : 'Pull to refresh'}
          </div>
        </div>
      )}

      <div 
        ref={containerRef}
        className={cn(
          "h-full overflow-y-auto scrollbar-hide transition-transform duration-200",
          isRefreshing && "pointer-events-none"
        )}
        style={{ 
          transform: `translateY(${pullDistance}px)`,
          paddingTop: device.hasNotch ? '10px' : '0'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={cn(
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
          
          <div className="space-y-0">
            {posts.map(post => {
              const user = users.find(u => u.id === post.userId);
              if (!user) return null;
              
              return (
                <Post
                  key={post.id}
                  post={post}
                  user={user}
                  onLike={handleLike}
                  onComment={handleComment}
                  onUserClick={handleUserClick}
                  deviceType={device.type}
                  orientation={device.orientation}
                />
              );
            })}
          </div>

          {/* Loading indicator for refresh */}
          {isRefreshing && (
            <div className="flex justify-center py-4">
              <div className="animate-spin h-6 w-6 border-2 border-accent border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Create Story Modal */}
      <CreateStoryModal 
        open={isCreateStoryOpen} 
        onOpenChange={setIsCreateStoryOpen}
      />
    </div>
  );
}