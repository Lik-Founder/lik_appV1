import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Post as PostType, User, Order, CartItem } from '@/lib/types';
import { generateMockPosts, getCurrentUser } from '@/lib/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Grid3X3, 
  Heart, 
  MessageCircle, 
  Settings, 
  Plus, 
  Camera, 
  ClockCounterClockwise, 
  ShoppingCart, 
  Star, 
  ArrowsClockwise,
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
  Trophy,
  Certificate,
  UserPlus,
  DotsThree,
  Share
} from '@phosphor-icons/react';
import { CreatePostModal } from '@/components/CreatePostModal';
import { CreateStoryModal } from '@/components/CreateStoryModal';
import { OrderHistory } from '@/components/OrderHistory';
import { FavoritesPage } from '@/components/FavoritesPage';
import { useDevice } from '@/hooks/use-device';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function ProfilePage() {
  const [currentUser, setCurrentUser] = useKV<User>('currentUser', getCurrentUser());
  const [posts] = useKV<PostType[]>('posts', generateMockPosts());
  const [cartItemsDetailed, setCartItemsDetailed] = useKV<CartItem[]>('cart-items-detailed', []);
  const [favoriteRestaurants] = useKV<any[]>('favorite-restaurants', []);
  const [favoriteDishes] = useKV<any[]>('favorite-dishes', []);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
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

  const mockStats = {
    totalLikes: '124K',
    totalViews: '2.1M', 
    totalPosts: userPosts.length
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
    toast.info('Lik Passport coming soon!');
  };

  const handleShareProfile = () => {
    toast.info('Profile sharing coming soon!');
  };

  const handlePostClick = (postId: string) => {
    toast.info('Post detail view coming soon!');
  };

  return (
    <div className="h-full bg-background">
      {/* Top Navigation Bar (Fixed) */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Rank/Level Badge */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Medal size={24} className="text-primary" weight="duotone" />
              <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {mockLevel}
              </div>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handlePassport}>
              <Certificate size={20} />
              <span className="text-xs ml-1 font-medium">Lik Passport</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleNotifications}>
              <Bell size={20} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSettings}>
              <DotsThree size={20} />
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="h-full">
        <div className="relative">
          {/* Swipeable Profile Header Container */}
          <div 
            className="relative overflow-hidden"
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
            <div className="w-full min-w-full px-6 py-6">
              {/* Profile Header */}
              <div className="flex flex-col items-center mb-6">
                {/* Profile Image with XP Ring */}
                <div className="relative mb-4">
                  <div className="relative">
                    {/* XP Progress Ring */}
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="58"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="58"
                        stroke="url(#xpGradient)"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        className="transition-all duration-500"
                        strokeDasharray={`${2 * Math.PI * 58}`}
                        strokeDashoffset={`${2 * Math.PI * 58 * (1 - (mockXP / mockXPToNext))}`}
                      />
                      <defs>
                        <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f09433" />
                          <stop offset="25%" stopColor="#e6683c" />
                          <stop offset="50%" stopColor="#dc2743" />
                          <stop offset="75%" stopColor="#cc2366" />
                          <stop offset="100%" stopColor="#bc1888" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    {/* Profile Image */}
                    <div className="absolute inset-2">
                      <Avatar className="w-full h-full">
                        <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
                        <AvatarFallback className="text-3xl">
                          {currentUser.username[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  
                  {/* Level Badge */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <div className="bg-primary text-primary-foreground rounded-full w-12 h-6 flex items-center justify-center">
                      <span className="text-sm font-bold">{mockLevel}</span>
                    </div>
                  </div>
                </div>

                {/* Display Name & Username */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h1 className="text-xl font-bold">DisplayName</h1>
                    <CheckCircle size={20} className="text-blue-500" weight="fill" />
                  </div>
                  <p className="text-muted-foreground">@username</p>
                </div>

                {/* Account Stats */}
                <div className="flex justify-center gap-8 mb-4">
                  <div className="text-center">
                    <p className="text-xl font-bold">{mockFollowing}</p>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{mockFollowers}</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{mockLikes}</p>
                    <p className="text-sm text-muted-foreground">Likes</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 mb-6">
                  <MapPin size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{mockLocation}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full max-w-sm">
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
                    onClick={handleShareProfile}
                  >
                    Share Profile
                  </Button>
                  <Button 
                    variant="secondary"
                    size="sm"
                    onClick={() => {}}
                  >
                    <UserPlus size={16} />
                  </Button>
                </div>
              </div>

              {/* Swipe Indicator */}
              <div className="flex justify-center gap-1 mb-6">
                <div className={cn("w-2 h-2 rounded-full transition-colors", swipeIndex === 0 ? "bg-primary" : "bg-muted")} />
                <div className={cn("w-2 h-2 rounded-full transition-colors", swipeIndex === 1 ? "bg-primary" : "bg-muted")} />
              </div>
            </div>

            {/* Bio/Achievements View (Index 1) */}
            <div className="w-full min-w-full px-6 py-6 absolute top-0 left-full">
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold mb-4">About & Achievements</h2>
                
                {/* Bio Section */}
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-4">{mockBio}</p>
                </div>

                {/* Favorite Achievement */}
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 mb-6">
                  <div className="text-4xl mb-2">{mockFavoriteAchievement.icon}</div>
                  <h3 className="font-bold mb-1">{mockFavoriteAchievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{mockFavoriteAchievement.description}</p>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-lg font-bold">{mockStats.totalLikes}</p>
                    <p className="text-xs text-muted-foreground">Total Likes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{mockStats.totalViews}</p>
                    <p className="text-xs text-muted-foreground">Total Views</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{mockStats.totalPosts}</p>
                    <p className="text-xs text-muted-foreground">Total Posts</p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="sm">TikTok</Button>
                  <Button variant="outline" size="sm">YouTube</Button>
                  <Button variant="outline" size="sm">Instagram</Button>
                  <Button variant="outline" size="sm">Twitter</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stories Section */}
          <div className="px-6 mb-6">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              {/* Story 1 */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-16 h-16 rounded-full border-2 border-primary p-1">
                  <div className="w-full h-full rounded-full bg-muted" />
                </div>
                <span className="text-xs text-muted-foreground">Story</span>
              </div>
              {/* Story 2 */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-16 h-16 rounded-full border-2 border-primary p-1">
                  <div className="w-full h-full rounded-full bg-muted" />
                </div>
                <span className="text-xs text-muted-foreground">Story</span>
              </div>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="sticky top-[73px] z-10 bg-background/95 backdrop-blur-sm border-b border-border">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-transparent border-0 h-12">
                <TabsTrigger value="posts" className="flex flex-col items-center gap-1 h-full data-[state=active]:bg-transparent">
                  <ForkKnife size={18} />
                </TabsTrigger>
                <TabsTrigger value="likes" className="flex flex-col items-center gap-1 h-full data-[state=active]:bg-transparent">
                  <Heart size={18} />
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex flex-col items-center gap-1 h-full data-[state=active]:bg-transparent">
                  <BookBookmark size={18} />
                </TabsTrigger>
                <TabsTrigger value="reposts" className="flex flex-col items-center gap-1 h-full data-[state=active]:bg-transparent">
                  <Share size={18} />
                </TabsTrigger>
                <TabsTrigger value="guides" className="flex flex-col items-center gap-1 h-full data-[state=active]:bg-transparent">
                  <Export size={18} />
                </TabsTrigger>
              </TabsList>

              {/* Search & Filter Bar */}
              <div className="px-4 py-3 border-b border-border">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MagnifyingGlass size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Search for Posts"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-muted border-0"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal size={16} />
                  </Button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                <TabsContent value="posts" className="mt-0">
                  {userPosts.length === 0 ? (
                    <div className="p-12 text-center">
                      <ForkKnife size={48} className="mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                      <p className="text-muted-foreground mb-4">Start sharing your food adventures!</p>
                      <Button 
                        className="instagram-gradient text-white border-0"
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
                          className="aspect-square bg-muted overflow-hidden rounded-lg"
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
                  <div className="p-12 text-center">
                    <Heart size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No liked posts</h3>
                    <p className="text-muted-foreground">Posts you like will appear here</p>
                  </div>
                </TabsContent>

                <TabsContent value="favorites" className="mt-0">
                  <div className="p-12 text-center">
                    <BookBookmark size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                    <p className="text-muted-foreground">Save your favorite restaurants and dishes</p>
                  </div>
                </TabsContent>

                <TabsContent value="reposts" className="mt-0">
                  <div className="p-12 text-center">
                    <Share size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No reposts</h3>
                    <p className="text-muted-foreground">Content you share will appear here</p>
                  </div>
                </TabsContent>

                <TabsContent value="guides" className="mt-0">
                  <div className="p-12 text-center">
                    <Export size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No guides created</h3>
                    <p className="text-muted-foreground">Create food guides and itineraries</p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </ScrollArea>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 right-0 p-4 z-20" style={{ 
        bottom: device.hasNotch ? 'calc(env(safe-area-inset-bottom) + 80px)' : '80px',
        right: '16px'
      }}>
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

      {/* Order History Modal */}
      <OrderHistory 
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
      />

      {/* Favorites Modal */}
      <FavoritesPage
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
      />
    </div>
  );
}