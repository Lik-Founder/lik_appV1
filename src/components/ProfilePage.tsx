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
  onShowNotifications?: () => void;
  onShowRewards?: () => void;
}

export function ProfilePage({ onShowLeaderboard, onShowLikPassport, onShowNotifications, onShowRewards }: ProfilePageProps = {}) {
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
  
  // Mock activity counts
  const mockBounties = 127;
  const mockQuests = 43;
  const mockReviews = 298;

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
    if (onShowNotifications) {
      onShowNotifications();
    } else {
      toast.info('Notifications coming soon!');
    }
  };

  const handlePassport = () => {
    if (onShowLikPassport) {
      onShowLikPassport();
    } else {
      toast.info('Lik Passport coming soon!');
    }
  };

  const handleRewards = () => {
    if (onShowRewards) {
      onShowRewards();
    } else {
      toast.info('Rewards coming soon!');
    }
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
    <div className="h-full bg-gradient-to-br from-pink-50 via-background to-purple-50 flex flex-col">
      {/* Top Navigation Bar (Fixed) */}
      <div className="flex-none sticky top-0 z-20 bg-gradient-to-r from-pink-100/90 via-background/95 to-purple-100/90 backdrop-blur-sm border-b border-pink-200/30 safe-top">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left: Whimsical Level Badge */}
          <div className="flex items-center">
            <div className="relative bg-gradient-to-r from-orange-400 to-pink-500 p-2 rounded-full shadow-lg">
              <Medal size={24} className="text-white" weight="duotone" />
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold text-[10px] shadow-md border-2 border-white">
                {mockLevel}
              </div>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handlePassport} className="p-2.5 h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 shadow-sm">
              <Certificate size={16} className="text-blue-600" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRewards} className="p-2.5 h-10 w-10 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 shadow-sm">
              <Gift size={16} className="text-purple-600" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleNotifications} className="p-2.5 h-10 w-10 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 shadow-sm">
              <Bell size={16} className="text-green-600" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSettings} className="p-2.5 h-10 w-10 rounded-full bg-gradient-to-r from-gray-100 to-slate-100 hover:from-gray-200 hover:to-slate-200 shadow-sm">
              <DotsThree size={16} className="text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto">
        <div className="relative">
          {/* Whimsical Profile Container */}
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
              {/* Whimsical Profile Header */}
              <div className="relative bg-gradient-to-br from-pink-100 via-white to-purple-100 mx-4 mt-6 mb-8 rounded-3xl p-8 shadow-lg border border-pink-200/50">
                {/* Floating Elements Background */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  <div className="absolute top-4 right-6 text-2xl opacity-20">🌟</div>
                  <div className="absolute bottom-8 left-6 text-xl opacity-20">🍕</div>
                  <div className="absolute top-1/2 right-4 text-lg opacity-20">✨</div>
                </div>
                
                {/* Profile Content */}
                <div className="relative z-10 flex flex-col items-center space-y-6">
                  {/* Clean Profile Avatar with Simple XP Ring */}
                  <div className="relative">
                    {/* XP Progress Ring - Simplified */}
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full transform -rotate-90 absolute inset-0" viewBox="0 0 96 96">
                        {/* Background Ring */}
                        <circle
                          cx="48"
                          cy="48"
                          r="44"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          className="text-pink-200"
                        />
                        {/* Progress Ring */}
                        <circle
                          cx="48"
                          cy="48"
                          r="44"
                          stroke="url(#xpGradient)"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          className="transition-all duration-700"
                          style={{
                            strokeDasharray: 276.46, // 2 * π * 44
                            strokeDashoffset: 276.46 * (1 - (mockXP / mockXPToNext)),
                          }}
                        />
                        <defs>
                          <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="50%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      
                      {/* Profile Picture - Centered */}
                      <div className="absolute inset-3">
                        <div className="w-full h-full rounded-full overflow-hidden bg-white shadow-lg border-2 border-white">
                          <ConsistentAvatar
                            src={currentUser.avatar}
                            alt={currentUser.username}
                            fallback={currentUser.username[0]?.toUpperCase()}
                            size="xl"
                            variant="default"
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Clean Level Badge */}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full shadow-md border-2 border-white font-bold text-xs">
                      Level {mockLevel}
                    </div>
                  </div>

                  {/* Name & Username - Playful Styling */}
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-3">
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent nav-rum-raisin">
                        4K
                      </h1>
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-1.5 rounded-full">
                        <CheckCircle size={20} className="text-white" weight="fill" />
                      </div>
                    </div>
                    <p className="text-lg text-gray-600 nav-rum-raisin">@username</p>
                  </div>

                  {/* Fun Stats Grid */}
                  <div className="grid grid-cols-3 gap-6 w-full max-w-sm">
                    <div className="text-center bg-white/60 rounded-2xl p-4 shadow-sm border border-pink-100">
                      <p className="text-xl font-bold text-gray-800">{mockFollowing}</p>
                      <p className="text-sm text-gray-600 nav-rum-raisin">Following</p>
                    </div>
                    <div className="text-center bg-white/60 rounded-2xl p-4 shadow-sm border border-purple-100">
                      <p className="text-xl font-bold text-gray-800">{mockFollowers}</p>
                      <p className="text-sm text-gray-600 nav-rum-raisin">Followers</p>
                    </div>
                    <div className="text-center bg-white/60 rounded-2xl p-4 shadow-sm border border-pink-100">
                      <p className="text-xl font-bold text-gray-800">{mockLikes}</p>
                      <p className="text-sm text-gray-600 nav-rum-raisin">Likes</p>
                    </div>
                  </div>

                  {/* Activity Stats with Icons */}
                  <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                    <div className="text-center bg-gradient-to-br from-orange-100 to-red-100 rounded-xl p-3 shadow-sm">
                      <div className="text-lg mb-1">🎯</div>
                      <p className="text-lg font-bold text-gray-800 nav-rum-raisin">{mockBounties}</p>
                      <p className="text-xs text-gray-600 nav-rum-raisin">Bounties</p>
                    </div>
                    <div className="text-center bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-3 shadow-sm">
                      <div className="text-lg mb-1">⚔️</div>
                      <p className="text-lg font-bold text-gray-800 nav-rum-raisin">{mockQuests}</p>
                      <p className="text-xs text-gray-600 nav-rum-raisin">Quests</p>
                    </div>
                    <div className="text-center bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-3 shadow-sm">
                      <div className="text-lg mb-1">📝</div>
                      <p className="text-lg font-bold text-gray-800 nav-rum-raisin">{mockReviews}</p>
                      <p className="text-xs text-gray-600 nav-rum-raisin">Reviews</p>
                    </div>
                  </div>

                  {/* Whimsical Location */}
                  <div className="flex items-center gap-3 bg-white/60 rounded-full px-6 py-3 shadow-sm border border-gray-200">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 p-1.5 rounded-full">
                      <MapPin size={16} className="text-white" />
                    </div>
                    <span className="text-sm text-gray-700 nav-rum-raisin">{mockLocation}</span>
                  </div>

                  {/* Fun Action Buttons */}
                  <div className="flex gap-4 w-full max-w-sm">
                    <Button 
                      variant="secondary" 
                      className="flex-1 h-12 bg-gradient-to-r from-pink-200 to-purple-200 hover:from-pink-300 hover:to-purple-300 border-0 text-gray-700 font-medium rounded-full nav-rum-raisin shadow-sm"
                      onClick={handleEditProfile}
                    >
                      ✏️ Edit Profile
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="flex-1 h-12 bg-gradient-to-r from-blue-200 to-cyan-200 hover:from-blue-300 hover:to-cyan-300 border-0 text-gray-700 font-medium rounded-full nav-rum-raisin shadow-sm"
                      onClick={handleShareProfile}
                    >
                      📤 Share
                    </Button>
                  </div>
                </div>

                {/* Playful Swipe Indicator */}
                <div className="flex justify-center gap-3 mt-8">
                  <div className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300", 
                    swipeIndex === 0 
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg scale-110" 
                      : "bg-gray-300"
                  )} />
                  <div className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300", 
                    swipeIndex === 1 
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg scale-110" 
                      : "bg-gray-300"
                  )} />
                </div>
              </div>

              {/* Whimsical Stories Section */}
              <div className="px-6 mb-8">
                <h3 className="text-lg font-bold text-gray-700 mb-4 nav-rum-raisin text-center">🌟 My Stories</h3>
                <div className="flex gap-6 justify-center">
                  {/* Story 1 */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 p-1 shadow-lg">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-200 to-pink-200 flex items-center justify-center text-2xl">
                          🍕
                        </div>
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                        <Plus size={12} className="text-pink-500" />
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 nav-rum-raisin font-medium">Pizza Quest</span>
                  </div>
                  {/* Story 2 */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 p-1 shadow-lg">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-200 to-cyan-200 flex items-center justify-center text-2xl">
                          🍔
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 nav-rum-raisin font-medium">Burger Hunt</span>
                  </div>
                </div>
              </div>

              {/* Tab Bar with Whimsical Design */}
              <div className="sticky top-[73px] z-10 bg-gradient-to-r from-pink-50/95 via-background/95 to-purple-50/95 backdrop-blur-sm">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="bg-white/50 mx-4 rounded-2xl shadow-sm border border-pink-100/50 p-2 mb-4">
                    <TabsList className="grid w-full grid-cols-4 bg-transparent border-0 h-14 gap-1">
                      <TabsTrigger 
                        value="posts" 
                        className="flex flex-col items-center gap-1 h-full rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-pink-200 data-[state=active]:to-purple-200 data-[state=active]:shadow-sm nav-rum-raisin font-medium text-gray-600 data-[state=active]:text-gray-800"
                      >
                        <ForkKnife size={20} />
                        <span className="text-xs">Posts</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="likes" 
                        className="flex flex-col items-center gap-1 h-full rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-red-200 data-[state=active]:to-pink-200 data-[state=active]:shadow-sm nav-rum-raisin font-medium text-gray-600 data-[state=active]:text-gray-800"
                      >
                        <Heart size={20} />
                        <span className="text-xs">Likes</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="favorites" 
                        className="flex flex-col items-center gap-1 h-full rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-yellow-200 data-[state=active]:to-orange-200 data-[state=active]:shadow-sm nav-rum-raisin font-medium text-gray-600 data-[state=active]:text-gray-800"
                      >
                        <BookBookmark size={20} />
                        <span className="text-xs">Saved</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="guides" 
                        className="flex flex-col items-center gap-1 h-full rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-200 data-[state=active]:to-emerald-200 data-[state=active]:shadow-sm nav-rum-raisin font-medium text-gray-600 data-[state=active]:text-gray-800"
                      >
                        <Export size={20} />
                        <span className="text-xs">Guides</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Whimsical Search Bar */}
                  <div className="px-6 pb-4">
                    <div className="relative">
                      <MagnifyingGlass size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <Input 
                        placeholder="🔍 Search for magical posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 bg-white/80 border-pink-200 h-12 text-sm rounded-full shadow-sm nav-rum-raisin placeholder:text-gray-500"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-gradient-to-r from-pink-200 to-purple-200 hover:from-pink-300 hover:to-purple-300"
                      >
                        <SlidersHorizontal size={16} className="text-gray-600" />
                      </Button>
                    </div>
                  </div>

                  {/* Tab Content with Playful Empty States */}
                  <div className="min-h-[300px] px-4">
                    <TabsContent value="posts" className="mt-0">
                      {userPosts.length === 0 ? (
                        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-12 text-center mx-2 border border-pink-100">
                          <div className="text-6xl mb-6">🍽️</div>
                          <h3 className="text-xl font-bold mb-4 text-gray-800 nav-rum-raisin">No culinary adventures yet!</h3>
                          <p className="text-sm text-gray-600 mb-8 nav-rum-raisin">Start sharing your foodie journey with the world!</p>
                          <Button 
                            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 h-12 px-8 text-sm rounded-full shadow-lg nav-rum-raisin font-medium"
                            onClick={() => setIsCreatePostOpen(true)}
                          >
                            ✨ Create your first post
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 pb-8">
                          {userPosts.map(post => (
                            <button
                              key={post.id}
                              onClick={() => handlePostClick(post.id)}
                              className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all"
                            >
                              <img
                                src={post.imageUrl}
                                alt={post.caption}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="likes" className="mt-0">
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl p-12 text-center mx-2 border border-red-100">
                        <div className="text-6xl mb-6">💖</div>
                        <h3 className="text-xl font-bold mb-4 text-gray-800 nav-rum-raisin">No liked posts yet</h3>
                        <p className="text-sm text-gray-600 nav-rum-raisin">Show some love to amazing food posts!</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="favorites" className="mt-0">
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-12 text-center mx-2 border border-yellow-100">
                        <div className="text-6xl mb-6">⭐</div>
                        <h3 className="text-xl font-bold mb-4 text-gray-800 nav-rum-raisin">No favorites saved</h3>
                        <p className="text-sm text-gray-600 nav-rum-raisin">Save restaurants and dishes you love!</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="guides" className="mt-0">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-12 text-center mx-2 border border-green-100">
                        <div className="text-6xl mb-6">📚</div>
                        <h3 className="text-xl font-bold mb-4 text-gray-800 nav-rum-raisin">No guides created</h3>
                        <p className="text-sm text-gray-600 nav-rum-raisin">Create magical food guides for others!</p>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>

            {/* Bio/Achievements View (Index 1) - Whimsical Design */}
            <div className="w-full min-w-full flex-shrink-0">
              <div className="px-6 py-8 min-h-[600px]">
                {/* Whimsical Bio Container */}
                <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-3xl p-8 shadow-lg border border-blue-200/50 relative overflow-hidden">
                  {/* Floating Decorative Elements */}
                  <div className="absolute inset-0">
                    <div className="absolute top-4 left-6 text-2xl opacity-20">🎨</div>
                    <div className="absolute bottom-6 right-8 text-xl opacity-20">🌈</div>
                    <div className="absolute top-1/3 right-6 text-lg opacity-20">✨</div>
                    <div className="absolute bottom-1/3 left-4 text-lg opacity-20">🦄</div>
                  </div>

                  {/* Profile Avatar */}
                  <div className="flex justify-center mb-8 relative z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full p-1 shadow-xl">
                        <div className="bg-white rounded-full p-2">
                          <ConsistentAvatar
                            src={currentUser.avatar}
                            alt={currentUser.username}
                            fallback={currentUser.username[0]?.toUpperCase()}
                            size="xl"
                            variant="default"
                          />
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-2 rounded-full shadow-lg">
                        <span className="text-xs font-bold">Bio</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mb-8 relative z-10">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent nav-rum-raisin mb-2">
                      ✨ About Me ✨
                    </h2>
                    <p className="text-gray-600 nav-rum-raisin">Discover my culinary story</p>
                  </div>
                  
                  {/* Whimsical Bio Content */}
                  <div className="space-y-8 relative z-10">
                    <div className="bg-white/80 rounded-2xl p-6 shadow-sm border border-blue-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gradient-to-r from-pink-400 to-red-500 p-2 rounded-full">
                          <span className="text-white text-sm">🍕</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 nav-rum-raisin">Favorite Food</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed nav-rum-raisin">
                        Pizza, especially Margherita with fresh basil and that perfect cheese stretch! 🧀
                      </p>
                    </div>

                    {/* Enhanced Achievement Card */}
                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 shadow-sm border border-yellow-200 relative overflow-hidden">
                      <div className="absolute top-2 right-2 text-2xl opacity-30">🏆</div>
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-2 rounded-full">
                              <span className="text-white text-sm">⭐</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 nav-rum-raisin">Favorite Achievement</h3>
                          </div>
                          <p className="text-gray-700 font-medium nav-rum-raisin mb-1">Pizza Conqueror</p>
                          <p className="text-sm text-gray-600 nav-rum-raisin">Tried 50+ pizza places across the city</p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-2xl">🍕</span>
                        </div>
                      </div>
                    </div>

                    {/* Fun Facts Section */}
                    <div className="bg-white/80 rounded-2xl p-6 shadow-sm border border-purple-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-2 rounded-full">
                          <span className="text-white text-sm">🌟</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 nav-rum-raisin">Fun Fact</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed nav-rum-raisin">
                        I can identify different pizza styles just by looking at the crust! 🕵️‍♂️
                      </p>
                    </div>
                  </div>

                  {/* Whimsical Social Links */}
                  <div className="flex justify-center gap-4 mt-10 relative z-10">
                    <Button variant="ghost" className="p-3 w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-100 to-red-100 hover:from-pink-200 hover:to-red-200 shadow-sm">
                      <svg className="w-6 h-6 text-pink-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-2.84v5.79a2.1 2.1 0 01-2.09 2.09 2.1 2.1 0 01-2.09-2.09V2H6.96v5.79a4.83 4.83 0 01-3.77 4.25 4.83 4.83 0 013.77 4.25V22h2.84v-5.79a2.1 2.1 0 012.09-2.09 2.1 2.1 0 012.09 2.09V22h2.84v-5.79a4.83 4.83 0 013.77-4.25z"/>
                      </svg>
                    </Button>
                    <Button variant="ghost" className="p-3 w-12 h-12 rounded-2xl bg-gradient-to-r from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200 shadow-sm">
                      <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </Button>
                    <Button variant="ghost" className="p-3 w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 shadow-sm">
                      <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </Button>
                    <Button variant="ghost" className="p-3 w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 shadow-sm">
                      <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </Button>
                  </div>
                </div>

                {/* Enhanced Page Indicator */}
                <div className="flex justify-center gap-3 mt-8">
                  <div className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300", 
                    swipeIndex === 0 
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg scale-110" 
                      : "bg-gray-300"
                  )} />
                  <div className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300", 
                    swipeIndex === 1 
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg scale-110" 
                      : "bg-gray-300"
                  )} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Whimsical Floating Action Button */}
      <div className="fixed bottom-0 right-0 p-6 z-20" style={{ 
        bottom: device.hasNotch ? 'calc(env(safe-area-inset-bottom) + 120px)' : '120px',
        right: '20px'
      }}>
        <Button
          size="lg"
          className="w-16 h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-700 text-white border-0 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
          onClick={() => setIsCreatePostOpen(true)}
        >
          <div className="flex flex-col items-center">
            <Plus size={24} className="mb-0.5" />
            <span className="text-xs font-medium">Post</span>
          </div>
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