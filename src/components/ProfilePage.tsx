import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Post as PostType, User } from '@/lib/types';
import { generateMockPosts, getCurrentUser } from '@/lib/mockData';
import { ConsistentAvatar } from '@/components/ui/consistent-avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Heart, 
  Settings, 
  Plus, 
  Bell,
  MapPin,
  CheckCircle,
  ShareNetwork,
  BookBookmark,
  ForkKnife,
  MagnifyingGlass,
  SlidersHorizontal,
  Export,
  Medal,
  Certificate,
  DotsThree,
  Gift
} from '@phosphor-icons/react';
import { CreatePostModal } from '@/components/CreatePostModal';
import { CreateStoryModal } from '@/components/CreateStoryModal';
import { useDevice } from '@/hooks/use-device';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProfilePageProps {
  onShowLeaderboard?: () => void;
  onShowLikPassport?: () => void;
}

export function ProfilePage({ onShowLeaderboard, onShowLikPassport }: ProfilePageProps = {}) {
  const [currentUser, setCurrentUser] = useKV<User>('currentUser', getCurrentUser());
  const [posts] = useKV<PostType[]>('posts', generateMockPosts());
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [searchTerm, setSearchTerm] = useState('');
  const [swipeIndex, setSwipeIndex] = useState(0); // 0 = main profile, 1 = bio/achievements
  const device = useDevice();
  
  const userPosts = posts.filter(post => post.userId === currentUser.id);

  // Mock user data with gamification
  const mockLevel = 124;
  const mockXP = 89750;
  const mockXPToNext = 100000;
  const mockFollowing = '10K';
  const mockFollowers = '400K';
  const mockLikes = '4K';
  const mockLocation = 'New York, NY';

  // Mock achievements and social links
  const mockBio = 'Food explorer 🍕 Level 124 Lik Master Chef 👨‍🍳 NYC finest eats';
  const mockFavoriteAchievement = {
    title: 'Pizza Conqueror',
    description: 'Tried 50+ pizza places',
    icon: '🍕'
  };

  const handleEditProfile = () => {
    toast.info('Profile editing coming soon!');
  };

  const handleSettings = () => {
    toast.info('Settings coming soon!');
  };

  const handleNotifications = () => {
    toast.info('Notifications coming soon!');
  };

  const handlePassport = () => {
    if (onShowLikPassport) {
      onShowLikPassport();
    } else {
      toast.info('Lik Passport coming soon!');
    }
  };

  const handleRewards = () => {
    toast.info('Rewards coming soon!');
  };

  const handleLeaderboard = () => {
    if (onShowLeaderboard) {
      onShowLeaderboard();
    } else {
      toast.info('Leaderboard coming soon!');
    }
  };

  const handleShareProfile = () => {
    toast.info('Profile sharing coming soon!');
  };

  const handlePostClick = (postId: string) => {
    toast.info('Post detail view coming soon!');
  };

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Top Navigation Bar (Fixed) */}
      <div className="flex-none sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Rank/Level Badge */}
          <div className="flex items-center">
            <div className="relative">
              <Medal size={20} className="text-primary" weight="duotone" />
              <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">
                {mockLevel}
              </div>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-0.5">
            <Button variant="ghost" size="sm" onClick={handlePassport} className="px-1.5 py-2 h-8 w-8 touch-target">
              <Certificate size={14} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRewards} className="px-1.5 py-2 h-8 w-8 touch-target">
              <Gift size={14} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleNotifications} className="px-1.5 py-2 h-8 w-8 touch-target">
              <Bell size={14} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSettings} className="px-1.5 py-2 h-8 w-8 touch-target">
              <DotsThree size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto">
        <div className="relative">
          {/* Swipeable Profile Header Container */}
          <div 
            className="relative overflow-hidden w-full flex"
            onTouchStart={(e) => {
              const touch = e.touches[0];
              const startX = touch.clientX;
              
              const handleTouchMove = (e: TouchEvent) => {
                const touch = e.touches[0];
                const deltaX = touch.clientX - startX;
                
                if (Math.abs(deltaX) > 50) {
                  if (deltaX > 0 && swipeIndex === 1) {
                    setSwipeIndex(0);
                  } else if (deltaX < 0 && swipeIndex === 0) {
                    setSwipeIndex(1);
                  }
                  document.removeEventListener('touchmove', handleTouchMove);
                  document.removeEventListener('touchend', handleTouchEnd);
                }
              };
              
              const handleTouchEnd = () => {
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
              };
              
              document.addEventListener('touchmove', handleTouchMove);
              document.addEventListener('touchend', handleTouchEnd);
            }}
            style={{
              transform: `translateX(-${swipeIndex * 100}%)`,
              transition: 'transform 0.3s ease'
            }}
          >
            {/* Main Profile View (Index 0) */}
            <div className="w-full min-w-full flex-shrink-0">
              {/* Profile Header */}
              <div className="flex flex-col items-center px-4 py-4 max-w-md mx-auto w-full">
                {/* Profile Image with XP Ring */}
                <div className="mb-4">
                  <ConsistentAvatar
                    src={currentUser.avatar}
                    alt={currentUser.username}
                    fallback={currentUser.username[0]?.toUpperCase()}
                    size="2xl"
                    variant="xp-ring"
                    level={mockLevel}
                    xpProgress={mockXP / mockXPToNext}
                  />
                </div>

                {/* Display Name & Username */}
                <div className="text-center mb-4 w-full max-w-sm mx-auto px-2">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h1 className="text-xl font-bold truncate">DisplayName</h1>
                    <CheckCircle size={20} className="text-blue-500 flex-shrink-0" weight="fill" />
                  </div>
                  <p className="text-base text-muted-foreground truncate">@username</p>
                </div>

                {/* Account Stats */}
                <div className="flex justify-center w-full mb-4 max-w-sm mx-auto">
                  <div className="text-center flex-1 px-1">
                    <p className="text-lg font-bold">{mockFollowing}</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                  <div className="text-center flex-1 px-1">
                    <p className="text-lg font-bold">{mockFollowers}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center flex-1 px-1">
                    <p className="text-lg font-bold">{mockLikes}</p>
                    <p className="text-xs text-muted-foreground">Likes</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <MapPin size={16} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{mockLocation}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 w-full max-w-sm justify-center px-4">
                  <Button 
                    variant="secondary" 
                    className="flex-1 h-10 text-sm font-medium rounded-lg min-w-0 whitespace-nowrap nav-rum-raisin font-light"
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="flex-1 h-10 text-sm font-medium rounded-lg min-w-0 whitespace-nowrap nav-rum-raisin font-light"
                    onClick={handleShareProfile}
                  >
                    Share Profile
                  </Button>
                </div>

                {/* Swipe Indicator */}
                <div className="flex justify-center gap-2 mt-4">
                  <div className={cn("w-2 h-2 rounded-full transition-colors", swipeIndex === 0 ? "bg-primary" : "bg-muted-foreground/30")} />
                  <div className={cn("w-2 h-2 rounded-full transition-colors", swipeIndex === 1 ? "bg-primary" : "bg-muted-foreground/30")} />
                </div>
              </div>

              {/* Stories Section */}
              <div className="px-4 mb-6">
                <div className="flex gap-4 overflow-x-auto scrollbar-hide justify-center">
                  {/* Story 1 */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className="w-16 h-16 rounded-full border-2 border-primary p-0.5 touch-target">
                      <div className="w-full h-full rounded-full bg-muted" />
                    </div>
                    <span className="text-xs text-muted-foreground">Story</span>
                  </div>
                  {/* Story 2 */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className="w-16 h-16 rounded-full border-2 border-primary p-0.5 touch-target">
                      <div className="w-full h-full rounded-full bg-muted" />
                    </div>
                    <span className="text-xs text-muted-foreground">Story</span>
                  </div>
                </div>
              </div>

              {/* Tab Bar */}
              <div className="sticky top-[57px] z-10 bg-background/95 backdrop-blur-sm border-b border-border">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-transparent border-0 h-12 px-4">
                    <TabsTrigger value="posts" className="flex flex-col items-center gap-1 h-full data-[state=active]:bg-transparent p-2 touch-target nav-rum-raisin">
                      <ForkKnife size={18} />
                    </TabsTrigger>
                    <TabsTrigger value="likes" className="flex flex-col items-center gap-1 h-full data-[state=active]:bg-transparent p-2 touch-target nav-rum-raisin">
                      <Heart size={18} />
                    </TabsTrigger>
                    <TabsTrigger value="favorites" className="flex flex-col items-center gap-1 h-full data-[state=active]:bg-transparent p-2 touch-target nav-rum-raisin">
                      <BookBookmark size={18} />
                    </TabsTrigger>
                    <TabsTrigger value="guides" className="flex flex-col items-center gap-1 h-full data-[state=active]:bg-transparent p-2 touch-target nav-rum-raisin">
                      <Export size={18} />
                    </TabsTrigger>
                  </TabsList>

                  {/* Search & Filter Bar */}
                  <div className="px-4 py-3 border-b border-border">
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <MagnifyingGlass size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input 
                          placeholder="Search for Posts"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-muted border-0 h-10 text-sm rounded-lg touch-target"
                        />
                      </div>
                      <Button variant="outline" size="sm" className="h-10 px-3 rounded-lg flex-shrink-0 touch-target nav-rum-raisin font-light">
                        <SlidersHorizontal size={16} />
                      </Button>
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-[300px]">
                    <TabsContent value="posts" className="mt-0">
                      {userPosts.length === 0 ? (
                        <div className="p-8 text-center">
                          <ForkKnife size={48} className="mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-lg font-semibold mb-3">No posts yet</h3>
                          <p className="text-sm text-muted-foreground mb-6">Start sharing your food adventures!</p>
                          <Button 
                            className="instagram-gradient text-white border-0 h-10 px-6 text-sm touch-target"
                            onClick={() => setIsCreatePostOpen(true)}
                          >
                            Create your first post
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-1 p-4">
                          {userPosts.map(post => (
                            <button
                              key={post.id}
                              onClick={() => handlePostClick(post.id)}
                              className="aspect-square bg-muted overflow-hidden rounded-lg touch-feedback"
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

                    <TabsContent value="likes" className="mt-0">
                      <div className="p-8 text-center">
                        <Heart size={48} className="mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-3">No liked posts</h3>
                        <p className="text-sm text-muted-foreground">Posts you like will appear here</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="favorites" className="mt-0">
                      <div className="p-8 text-center">
                        <BookBookmark size={48} className="mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-3">No favorites yet</h3>
                        <p className="text-sm text-muted-foreground">Save your favorite restaurants and dishes</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="guides" className="mt-0">
                      <div className="p-8 text-center">
                        <Export size={48} className="mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-3">No guides created</h3>
                        <p className="text-sm text-muted-foreground">Create food guides and itineraries</p>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>

            {/* Bio/Achievements View (Index 1) */}
            <div className="w-full min-w-full flex-shrink-0">
              <div className="flex flex-col px-4 py-6 min-h-[600px]">
                {/* Profile Avatar */}
                <div className="flex justify-center mb-6">
                  <ConsistentAvatar
                    src={currentUser.avatar}
                    alt={currentUser.username}
                    fallback={currentUser.username[0]?.toUpperCase()}
                    size="xl"
                    variant="default"
                  />
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold nav-rum-raisin">Bio</h2>
                </div>
                
                {/* Bio Questions */}
                <div className="flex-1 flex flex-col justify-center space-y-6">
                  <div className="bg-muted/50 rounded-xl p-4">
                    <p className="text-base font-semibold mb-3">What is your favorite food?</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Pizza, especially Margherita with fresh basil</p>
                  </div>

                  {/* Favorite Achievement Card */}
                  <div className="bg-muted rounded-xl p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-3">
                      <h3 className="text-base font-semibold mb-1">Favorite Achievement</h3>
                      <p className="text-sm text-muted-foreground">Pizza Conqueror</p>
                    </div>
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🍕</span>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-3 mt-8 mb-4">
                  <Button variant="ghost" size="sm" className="p-2 w-10 h-10 rounded-lg touch-target">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-2.84v5.79a2.1 2.1 0 01-2.09 2.09 2.1 2.1 0 01-2.09-2.09V2H6.96v5.79a4.83 4.83 0 01-3.77 4.25 4.83 4.83 0 013.77 4.25V22h2.84v-5.79a2.1 2.1 0 012.09-2.09 2.1 2.1 0 012.09 2.09V22h2.84v-5.79a4.83 4.83 0 013.77-4.25z"/>
                    </svg>
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2 w-10 h-10 rounded-lg touch-target">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2 w-10 h-10 rounded-lg touch-target">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2 w-10 h-10 rounded-lg touch-target">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </Button>
                </div>

                {/* Page Indicator */}
                <div className="flex justify-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full transition-colors", swipeIndex === 0 ? "bg-primary" : "bg-muted-foreground/30")} />
                  <div className={cn("w-2 h-2 rounded-full transition-colors", swipeIndex === 1 ? "bg-primary" : "bg-muted-foreground/30")} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 right-0 p-4 z-20" style={{ 
        bottom: device.hasNotch ? 'calc(env(safe-area-inset-bottom) + 120px)' : '120px',
        right: '56px'
      }}>
        <Button
          size="lg"
          className={cn(
            "fab w-14 h-14 text-white border-0 touch-feedback",
            "active:scale-95 shadow-lg"
          )}
          onClick={() => setIsCreatePostOpen(true)}
        >
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
    </div>
  );
}