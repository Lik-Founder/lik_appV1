import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Post as PostType, User } from '@/lib/types';
import { generateMockPosts, getCurrentUser } from '@/lib/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid3X3, Heart, MessageCircle, Settings, Plus, Camera } from '@phosphor-icons/react';
import { CreatePostModal } from '@/components/CreatePostModal';
import { CreateStoryModal } from '@/components/CreateStoryModal';
import { useDevice } from '@/hooks/use-device';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function ProfilePage() {
  const [currentUser, setCurrentUser] = useKV<User>('currentUser', getCurrentUser());
  const [posts] = useKV<PostType[]>('posts', generateMockPosts());
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const device = useDevice();
  
  const userPosts = posts.filter(post => post.userId === currentUser.id);

  const handleEditProfile = () => {
    toast.info('Profile editing coming soon!');
  };

  const handleSettings = () => {
    toast.info('Settings coming soon!');
  };

  const handlePostClick = (postId: string) => {
    toast.info('Post detail view coming soon!');
  };

  return (
    <ScrollArea className="h-full">
      <div className="max-w-lg mx-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">{currentUser.username}</h1>
            <Button variant="ghost" size="sm" onClick={handleSettings}>
              <Settings size={20} />
            </Button>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
              <AvatarFallback className="text-2xl">
                {currentUser.username[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex gap-6 mb-2">
                <div className="text-center">
                  <p className="font-semibold text-lg">{currentUser.postCount}</p>
                  <p className="text-sm text-muted-foreground">Posts</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-lg">{currentUser.followerCount}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-lg">{currentUser.followingCount}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="font-semibold mb-1">{currentUser.displayName}</p>
            <p className="text-sm text-muted-foreground">{currentUser.bio}</p>
          </div>

          <div className="flex gap-2 mb-6">
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={handleEditProfile}
            >
              Edit Profile
            </Button>
            <Button 
              variant="secondary" 
              className="flex-1"
            >
              Share Profile
            </Button>
          </div>
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <Grid3X3 size={16} />
              Posts
            </TabsTrigger>
            <TabsTrigger value="tagged" className="flex items-center gap-2">
              <Heart size={16} />
              Tagged
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <MessageCircle size={16} />
              Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-0">
            {userPosts.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-foreground flex items-center justify-center">
                  <Grid3X3 size={24} />
                </div>
                <h3 className="text-xl font-light mb-2">Share your first photo</h3>
                <p className="text-muted-foreground mb-4">When you share photos, they will appear on your profile.</p>
                <Button 
                  className="instagram-gradient text-white border-0"
                  onClick={() => setIsCreatePostOpen(true)}
                >
                  Share your first photo
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {userPosts.map(post => (
                  <button
                    key={post.id}
                    onClick={() => handlePostClick(post.id)}
                    className="aspect-square bg-muted overflow-hidden"
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.caption}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </button>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tagged" className="mt-0">
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-foreground flex items-center justify-center">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-light mb-2">Photos of you</h3>
              <p className="text-muted-foreground">When people tag you in photos, they'll appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-foreground flex items-center justify-center">
                <MessageCircle size={24} />
              </div>
              <h3 className="text-xl font-light mb-2">Save posts for later</h3>
              <p className="text-muted-foreground">Bookmark posts to easily find them again in the future.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-0 right-0 p-4 z-10 flex flex-col gap-3" style={{ 
        bottom: device.hasNotch ? 'calc(env(safe-area-inset-bottom) + 80px)' : '80px',
        right: '16px'
      }}>
        {/* Story Creation Button */}
        <Button
          size="lg"
          variant="secondary"
          className={cn(
            "w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-border touch-feedback shadow-lg",
            "active:scale-95"
          )}
          onClick={() => setIsCreateStoryOpen(true)}
        >
          <Camera size={20} />
        </Button>
        
        {/* Post Creation Button */}
        <Button
          size="lg"
          className={cn(
            "fab w-14 h-14 text-white border-0 touch-feedback",
            "active:scale-95"
          )}
          onClick={() => setIsCreatePostOpen(true)}
        >
          <Plus size={24} weight="bold" />
        </Button>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal 
        open={isCreatePostOpen} 
        onOpenChange={setIsCreatePostOpen}
      />
      
      {/* Create Story Modal */}
      <CreateStoryModal 
        open={isCreateStoryOpen} 
        onOpenChange={setIsCreateStoryOpen}
      />
    </ScrollArea>
  );
}