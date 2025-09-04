import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Post as PostType, User } from '@/lib/types';
import { generateMockPosts, getCurrentUser } from '@/lib/mockData';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  HeartIcon, 
  Cog6ToothIcon, 
  PlusIcon as Plus, 
  BellIcon,
  MapPinIcon as MapPin,
  CheckCircleIcon,
  ShareIcon,
  BookmarkIcon,
  StarIcon as SparklesIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon as SlidersHorizontal,
  ArrowUpTrayIcon,
  StarIcon,
  DocumentCheckIcon,
  EllipsisHorizontalIcon,
  GiftIcon,
  AcademicCapIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { CreateStoryModal } from '@/components/CreateStoryModal';
import { useDevice } from '@/hooks/use-device';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import bronzeRankIcon from '@/assets/images/Bronze_Rank.png';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const [currentUser, setCurrentUser] = useKV<User>('currentUser', getCurrentUser());
  const [posts] = useKV<PostType[]>('posts', generateMockPosts());
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [searchTerm, setSearchTerm] = useState('');
  const [swipeIndex, setSwipeIndex] = useState(0); // 0 = main profile, 1 = bio/achievements
  const device = useDevice();
  
  const userPosts = posts.filter(post => post.userId === currentUser.id);

  // Mock user data with enhanced gamification
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
    onNavigate('notifications');
  };

  const handlePassport = () => {
    onNavigate('lik-passport');
  };

  const handleRewards = () => {
    onNavigate('my-rewards');
  };

  const handleLeaderboard = () => {
    onNavigate('leaderboard');
  };

  const handleShareProfile = () => {
    toast.info('Profile sharing coming soon!');
  };

  const handlePostClick = (postId: string) => {
    toast.info('Post detail view coming soon!');
  };

  return (
    <div className="h-full bg-gradient-to-br from-purple-100/40 via-pink-50/30 to-orange-100/40 flex flex-col relative overflow-hidden">
      {/* Whimsical Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-8 text-2xl opacity-10 animate-float">🌟</div>
        <div className="absolute top-40 right-12 text-xl opacity-10 animate-float delay-1000">🍔</div>
        <div className="absolute bottom-32 left-16 text-lg opacity-10 animate-float delay-2000">✨</div>
        <div className="absolute top-60 left-6 text-sm opacity-10 animate-float delay-3000">🍕</div>
        <div className="absolute bottom-20 right-8 text-xl opacity-10 animate-float delay-500">🎯</div>
        <div className="absolute top-80 right-6 text-sm opacity-10 animate-float">🌈</div>
      </div>

      {/* Innovative Curved Top Header */}
      <div className="flex-none relative">
        {/* Curved Background */}
        <div className="absolute inset-0">
          <svg viewBox="0 0 400 120" className="w-full h-full">
            <defs>
              <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF7BAA" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#FF1A75" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#B30026" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path 
              d="M0,0 L400,0 L400,80 Q200,120 0,80 Z" 
              fill="url(#headerGradient)"
              className="drop-shadow-lg"
            />
          </svg>
        </div>
        
        {/* Header Content */}
        <div className="relative z-10 px-6 py-4 safe-top">
          <div className="flex items-center justify-between">
            {/* Left: Rank Badge with Glow */}
            <div className="flex items-center">
              <div className="relative">
                <img 
                  src={bronzeRankIcon} 
                  alt="Bronze Rank" 
                  className="w-10 h-10 drop-shadow-lg"
                />
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full w-4 h-4 flex items-center justify-center">
                  <span className="text-xs text-white font-bold">3</span>
                </div>
              </div>
            </div>

            {/* Right: Action Icons with Candy Glass Style */}
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handlePassport} 
                className="p-2 h-9 w-9 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all duration-300 hover:scale-110"
              >
                <AcademicCapIcon className="h-4 w-4 text-white drop-shadow-sm" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRewards} 
                className="p-2 h-9 w-9 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all duration-300 hover:scale-110"
              >
                <GiftIcon className="h-4 w-4 text-white drop-shadow-sm" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleNotifications} 
                className="p-2 h-9 w-9 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all duration-300 hover:scale-110"
              >
                <BellIcon className="h-4 w-4 text-white drop-shadow-sm" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSettings} 
                className="p-2 h-9 w-9 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all duration-300 hover:scale-110"
              >
                <EllipsisHorizontalIcon className="h-4 w-4 text-white drop-shadow-sm" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto">
        <div className="relative">
          {/* Revolutionary Profile Container with Magic Cards */}
          <div 
            className="relative w-full flex perspective-1000"
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
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Main Profile Magic Card (Index 0) */}
            <div className="w-full min-w-full flex-shrink-0 relative">
              {/* Innovative Profile Hero Card */}
              <div className="relative mx-4 mt-6 mb-6">
                {/* Magical Glowing Card Container */}
                <div className="relative bg-gradient-to-br from-white/80 via-white/90 to-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/40 overflow-hidden">
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-4 left-6 text-3xl animate-spin-slow">⭐</div>
                    <div className="absolute bottom-6 right-8 text-2xl animate-bounce">🎨</div>
                    <div className="absolute top-1/2 right-4 text-xl animate-pulse">✨</div>
                  </div>

                  {/* Profile Content with Revolutionary Layout */}
                  <div className="relative z-10 space-y-6">
                    {/* Enhanced Profile Avatar Section */}
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        {/* Magical Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-full p-1 animate-pulse">
                          <div className="bg-white rounded-full p-1">
                            <ProfileAvatar
                              src={currentUser.avatar}
                              alt={currentUser.username}
                              level={mockLevel}
                              xp={mockXP}
                              maxXp={mockXPToNext}
                              size="xl"
                            />
                          </div>
                        </div>
                        {/* Floating XP Particles */}
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-2 py-1 shadow-lg animate-bounce">
                          <span className="text-xs text-white font-bold">+{(mockXPToNext - mockXP).toLocaleString()} XP</span>
                        </div>
                      </div>

                      {/* Dynamic Name & Title */}
                      <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent font-rum-raisin">
                          {currentUser.displayName}
                        </h1>
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-gray-600 font-rum-raisin">@{currentUser.username}</p>
                          <CheckCircleIcon className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-4 py-1 inline-block">
                          <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-rum-raisin">
                            🏆 Master Food Explorer
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Revolutionary Stats Grid with Glass Morphism */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Following', value: mockFollowing, icon: '👥', gradient: 'from-blue-500 to-cyan-500' },
                        { label: 'Followers', value: mockFollowers, icon: '❤️', gradient: 'from-pink-500 to-red-500' },
                        { label: 'Likes', value: mockLikes, icon: '🔥', gradient: 'from-orange-500 to-yellow-500' }
                      ].map((stat, index) => (
                        <div key={index} className="relative group">
                          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:bg-white/70">
                            <div className="text-lg mb-1">{stat.icon}</div>
                            <p className="text-lg font-bold text-gray-800 font-rum-raisin">{stat.value}</p>
                            <p className="text-xs text-gray-600 font-rum-raisin">{stat.label}</p>
                          </div>
                          <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                        </div>
                      ))}
                    </div>

                    {/* Gamified Activity Stats with Enhanced Visuals */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                      <h3 className="text-center text-sm font-bold text-gray-700 mb-3 font-rum-raisin">🎮 Adventure Stats</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Bounties', value: mockBounties, icon: '🎯', color: 'bg-gradient-to-br from-orange-400 to-red-500' },
                          { label: 'Quests', value: mockQuests, icon: '⚔️', color: 'bg-gradient-to-br from-blue-400 to-purple-500' },
                          { label: 'Reviews', value: mockReviews, icon: '📝', color: 'bg-gradient-to-br from-green-400 to-emerald-500' }
                        ].map((stat, index) => (
                          <div key={index} className="text-center">
                            <div className={`${stat.color} rounded-xl p-3 mb-2 shadow-lg hover:scale-110 transition-transform duration-300`}>
                              <div className="text-xl text-white drop-shadow-sm">{stat.icon}</div>
                            </div>
                            <p className="text-sm font-bold text-gray-800 font-rum-raisin">{stat.value}</p>
                            <p className="text-xs text-gray-600 font-rum-raisin">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Location & Action Section */}
                    <div className="space-y-4">
                      {/* Location with Style */}
                      <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full px-4 py-2 border border-green-200">
                        <div className="bg-gradient-to-r from-green-400 to-blue-500 p-1.5 rounded-full">
                          <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 font-rum-raisin font-medium">{mockLocation}</span>
                      </div>

                      {/* Revolutionary Action Buttons */}
                      <div className="flex gap-3">
                        <Button 
                          variant="secondary" 
                          className="flex-1 h-12 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 border-0 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-rum-raisin"
                          onClick={handleEditProfile}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">✏️</span>
                            <span>Edit Profile</span>
                          </div>
                        </Button>
                        <Button 
                          variant="secondary" 
                          className="flex-1 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 border-0 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-rum-raisin"
                          onClick={handleShareProfile}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🚀</span>
                            <span>Share</span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Magical Swipe Indicator */}
                  <div className="flex justify-center gap-2 mt-6">
                    <div className={cn(
                      "w-3 h-3 rounded-full transition-all duration-500", 
                      swipeIndex === 0 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg scale-125 animate-pulse" 
                        : "bg-gray-300"
                    )} />
                    <div className={cn(
                      "w-3 h-3 rounded-full transition-all duration-500", 
                      swipeIndex === 1 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg scale-125 animate-pulse" 
                        : "bg-gray-300"
                    )} />
                  </div>
                </div>
              </div>

              {/* Innovative Stories Section */}
              <div className="px-4 mb-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-lg">
                  <h3 className="text-center text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 font-rum-raisin">
                    ✨ Story Highlights ✨
                  </h3>
                  <div className="flex gap-6 justify-center">
                    {[
                      { emoji: '🍕', label: 'Pizza Quest', gradient: 'from-orange-400 to-red-500' },
                      { emoji: '🍔', label: 'Burger Hunt', gradient: 'from-yellow-400 to-orange-500' },
                      { emoji: '🍰', label: 'Sweet Treats', gradient: 'from-pink-400 to-purple-500' }
                    ].map((story, index) => (
                      <div key={index} className="flex flex-col items-center gap-2 group">
                        <div className="relative">
                          <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${story.gradient} p-1 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                              <span className="text-2xl">{story.emoji}</span>
                            </div>
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                            <Plus className="w-3 h-3 text-purple-500" />
                          </div>
                        </div>
                        <span className="text-xs text-gray-600 font-rum-raisin font-medium text-center">{story.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Revolutionary Tab System */}
              <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-50/95 via-pink-50/95 to-orange-50/95 backdrop-blur-xl">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="bg-white/60 backdrop-blur-sm mx-4 rounded-2xl shadow-lg border border-white/40 p-2 mb-4">
                    <TabsList className="grid w-full grid-cols-4 bg-transparent border-0 h-12 gap-2">
                      {[
                        { value: 'posts', icon: DocumentCheckIcon, label: 'Posts', gradient: 'from-blue-400 to-purple-500' },
                        { value: 'likes', icon: HeartIcon, label: 'Likes', gradient: 'from-pink-400 to-red-500' },
                        { value: 'favorites', icon: BookmarkIcon, label: 'Saved', gradient: 'from-yellow-400 to-orange-500' },
                        { value: 'guides', icon: ArrowUpTrayIcon, label: 'Guides', gradient: 'from-green-400 to-emerald-500' }
                      ].map((tab) => (
                        <TabsTrigger 
                          key={tab.value}
                          value={tab.value} 
                          className={cn(
                            "flex flex-col items-center gap-1 h-full rounded-xl transition-all duration-300 font-rum-raisin font-bold text-gray-600 text-xs",
                            activeTab === tab.value 
                              ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg scale-105` 
                              : "hover:bg-white/50"
                          )}
                        >
                          <tab.icon className="h-4 w-4" />
                          <span>{tab.label}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>

                  {/* Enhanced Search Bar */}
                  <div className="px-4 pb-4">
                    <div className="relative">
                      <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <Input 
                        placeholder="🔍 Discover your content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 bg-white/80 backdrop-blur-sm border-white/40 h-12 text-sm rounded-2xl shadow-lg font-rum-raisin placeholder:text-gray-500 border-2 focus:border-purple-300"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
                      >
                        <SlidersHorizontal className="w-4 h-4 text-white" />
                      </Button>
                    </div>
                  </div>

                  {/* Revolutionary Tab Content */}
                  <div className="min-h-[300px] px-4 pb-20">
                    {['posts', 'likes', 'favorites', 'guides'].map((tabValue) => (
                      <TabsContent key={tabValue} value={tabValue} className="mt-0">
                        {tabValue === 'posts' && userPosts.length === 0 ? (
                          <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 rounded-3xl p-8 text-center border border-purple-200 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                              <div className="absolute top-4 left-6 text-3xl animate-spin-slow">🎨</div>
                              <div className="absolute bottom-6 right-8 text-2xl animate-bounce">📸</div>
                            </div>
                            <div className="relative z-10">
                              <div className="text-6xl mb-4 animate-bounce">🍽️</div>
                              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-rum-raisin">Ready to Share?</h3>
                              <p className="text-sm text-gray-600 mb-6 font-rum-raisin">Your foodie adventure starts with your first post!</p>
                              <Button 
                                className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white border-0 h-12 px-8 text-sm rounded-2xl shadow-xl hover:shadow-2xl font-rum-raisin font-bold transition-all duration-300 hover:scale-105"
                                onClick={() => onNavigate('create-post')}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">✨</span>
                                  <span>Create Your First Post</span>
                                </div>
                              </Button>
                            </div>
                          </div>
                        ) : tabValue === 'posts' && userPosts.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2 pb-6">
                            {userPosts.map(post => (
                              <button
                                key={post.id}
                                onClick={() => handlePostClick(post.id)}
                                className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/40"
                              >
                                <img
                                  src={post.imageUrl}
                                  alt={post.caption}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 text-center border border-gray-200">
                            <div className="text-4xl mb-4">
                              {tabValue === 'likes' ? '💖' : tabValue === 'favorites' ? '⭐' : '📚'}
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-gray-800 font-rum-raisin">
                              {tabValue === 'likes' ? 'No liked posts yet' : 
                               tabValue === 'favorites' ? 'No favorites saved' : 
                               'No guides created'}
                            </h3>
                            <p className="text-sm text-gray-600 font-rum-raisin">
                              {tabValue === 'likes' ? 'Show some love to amazing food posts!' : 
                               tabValue === 'favorites' ? 'Save restaurants and dishes you love!' : 
                               'Create magical food guides for others!'}
                            </p>
                          </div>
                        )}
                      </TabsContent>
                    ))}
                  </div>
                </Tabs>
              </div>
            </div>

            {/* Bio/Achievements Magic Card (Index 1) */}
            <div className="w-full min-w-full flex-shrink-0">
              <div className="px-4 py-6 min-h-[500px]">
                {/* Revolutionary Bio Container */}
                <div className="bg-gradient-to-br from-indigo-100 via-white to-purple-100 rounded-3xl p-8 shadow-2xl border border-indigo-200/50 relative overflow-hidden">
                  {/* Animated Background Elements */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 left-6 text-2xl opacity-15 animate-float">🎭</div>
                    <div className="absolute bottom-8 right-8 text-xl opacity-15 animate-float delay-1000">🌟</div>
                    <div className="absolute top-1/2 right-6 text-lg opacity-15 animate-float delay-2000">✨</div>
                    <div className="absolute bottom-4 left-8 text-sm opacity-15 animate-float delay-500">🎨</div>
                  </div>

                  {/* Enhanced Profile Avatar for Bio */}
                  <div className="flex justify-center mb-8 relative z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 rounded-full p-1 animate-pulse shadow-2xl">
                        <div className="bg-white rounded-full p-2">
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.username}
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full shadow-lg animate-bounce">
                        <span className="text-xs font-bold">Bio ✨</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mb-8 relative z-10">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-rum-raisin mb-2">
                      ✨ About My Journey ✨
                    </h2>
                    <p className="text-gray-600 font-rum-raisin">Discover the story behind the flavors</p>
                  </div>
                  
                  {/* Revolutionary Bio Content */}
                  <div className="space-y-6 relative z-10">
                    {/* Food Passion Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:bg-white/90 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gradient-to-r from-red-400 to-pink-500 p-3 rounded-2xl shadow-lg">
                          <span className="text-white text-xl">🍕</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 font-rum-raisin">Food Passion</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed font-rum-raisin">
                        Pizza enthusiast with a deep love for authentic Margherita. Always hunting for the perfect cheese pull! 🧀✨
                      </p>
                    </div>

                    {/* Achievement Showcase Card */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-lg border border-yellow-200 relative overflow-hidden hover:scale-105 transition-transform duration-300">
                      <div className="absolute top-2 right-2 text-3xl opacity-20">🏆</div>
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-2 rounded-xl shadow-lg">
                              <span className="text-white text-lg">⭐</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 font-rum-raisin">Legendary Achievement</h3>
                          </div>
                          <p className="text-gray-800 font-bold font-rum-raisin text-lg mb-1">Pizza Conqueror 🍕</p>
                          <p className="text-sm text-gray-600 font-rum-raisin">Conquered 50+ pizza places across NYC</p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl animate-bounce">
                          <span className="text-3xl">🍕</span>
                        </div>
                      </div>
                    </div>

                    {/* Personal Touch Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 hover:bg-white/90 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-3 rounded-2xl shadow-lg">
                          <span className="text-white text-xl">🌟</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 font-rum-raisin">Superpower</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed font-rum-raisin">
                        I can identify pizza styles just by looking at the crust! My friends call me the Pizza Whisperer 🕵️‍♂️✨
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Social Links */}
                  <div className="flex justify-center gap-4 mt-8 relative z-10">
                    {[
                      { icon: '🎵', gradient: 'from-pink-400 to-red-500' },
                      { icon: '📺', gradient: 'from-red-400 to-pink-500' },
                      { icon: '📸', gradient: 'from-purple-400 to-pink-500' }
                    ].map((social, index) => (
                      <Button 
                        key={index}
                        variant="ghost" 
                        className={`p-3 w-12 h-12 rounded-2xl bg-gradient-to-r ${social.gradient} hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}
                      >
                        <span className="text-xl">{social.icon}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Enhanced Page Indicator */}
                <div className="flex justify-center gap-3 mt-8">
                  <div className={cn(
                    "w-3 h-3 rounded-full transition-all duration-500", 
                    swipeIndex === 0 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg scale-125 animate-pulse" 
                      : "bg-gray-300"
                  )} />
                  <div className={cn(
                    "w-3 h-3 rounded-full transition-all duration-500", 
                    swipeIndex === 1 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg scale-125 animate-pulse" 
                      : "bg-gray-300"
                  )} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revolutionary Floating Action Button */}
      <div className="fixed bottom-0 right-0 p-6 z-20" style={{ 
        bottom: device.hasNotch ? 'calc(env(safe-area-inset-bottom) + 80px)' : '80px',
        right: '20px'
      }}>
        <Button
          size="lg"
          className="w-18 h-18 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white border-0 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 group relative overflow-hidden"
          onClick={() => onNavigate('create-post')}
        >
          {/* Magical Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-3xl" />
          <div className="relative z-10 flex flex-col items-center">
            <Plus className="w-7 h-7 mb-1 drop-shadow-sm" />
            <span className="text-xs font-bold drop-shadow-sm font-rum-raisin">Create</span>
          </div>
        </Button>
      </div>

      {/* Create Story Modal */}
      <CreateStoryModal 
        open={isCreateStoryOpen} 
        onOpenChange={setIsCreateStoryOpen}
      />
    </div>
  );
}