import { useKV } from '@github/spark/hooks';
import { Post as PostType, Story as StoryType, User } from '@/lib/types';
import { generateMockPosts, generateMockStories, generateMockUsers, getCurrentUser } from '@/lib/mockData';
import { Post } from '@/components/Post';
import { StoriesBar } from '@/components/StoriesBar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

export function HomeFeed() {
  const [posts, setPosts] = useKV<PostType[]>('posts', generateMockPosts());
  const [stories, setStories] = useKV<StoryType[]>('stories', generateMockStories());
  const [users, setUsers] = useKV<User[]>('users', generateMockUsers());
  const [currentUser] = useKV<User>('currentUser', getCurrentUser());

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
    toast.info('Story viewer coming soon!');
  };

  const handleAddStory = () => {
    toast.info('Story creation coming soon!');
  };

  return (
    <ScrollArea className="h-full">
      <div className="max-w-lg mx-auto">
        <StoriesBar
          stories={stories}
          users={users}
          currentUser={currentUser}
          onStoryClick={handleStoryClick}
          onAddStory={handleAddStory}
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
              />
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}