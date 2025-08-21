import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Post as PostType, User } from '@/lib/types';
import { generateMockPosts } from '@/lib/mockData';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Grid3X3, 
  Heart, 
  MessageCircle, 
  ArrowLeft,
  Plus, 
  CheckCircle,
  ShareNetwork,
  BookBookmark,
  MagnifyingGlass,
  SlidersHorizontal,
  Medal,
  UserPlus,
  DotsThree,
  MapPin
} from '@phosphor-icons/react';
import { useDevice } from '@/hooks/use-device';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface UserProfileProps {
  userId: string;
  onBack: () => void;
}

// Mock user data - in a real app this would come from an API
const mockUsers: Record<string, User> = {
  '1': {
    id: '1',
    username: 'foodieexplorer',
    displayName: 'FoodieExplorer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    bio: '🍕 Food explorer & taste adventurer\n📍 NYC | Level 47 Foodie\n🏆 Top reviewer across all cuisines',
    followerCount: 45000,
    followingCount: 1200,
    postCount: 450,
    isFollowing: false,
    location: 'New York, NY',
    level: 47,
    xp: 25500,
    streakCount: 18,
    likCoins: 4200,
    likTickets: 8,
    joinDate: '2022-10-15',
    isVerified: true,
    favoriteAchievement: {
      id: 'global_foodie',
      title: 'Global Foodie',
      description: 'Reviewed restaurants in 25+ countries',
      icon: '🌍',
      rarity: 'legendary'
    },
    socialLinks: {
      instagram: 'foodieexplorer_nyc',
      tiktok: 'foodieexplorer',
      youtube: 'FoodieExplorerChannel'
    },
    // Activity stats
    bountiesCompleted: 187,
    questsCompleted: 64,
    reviewsWritten: 425
  },
  '2': {
    id: '2',
    username: 'chefmaster',
    displayName: 'ChefMaster',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face',
    bio: '👨‍🍳 Professional Chef & Food Critic\n🥘 Culinary Institute graduate\n🌟 Michelin-starred experience',
    followerCount: 38000,
    followingCount: 980,
    postCount: 320,
    isFollowing: true,
    location: 'New York, NY',
    level: 42,
    xp: 22100,
    streakCount: 25,
    likCoins: 3800,
    likTickets: 6,
    joinDate: '2022-08-10',
    isVerified: true,
    favoriteAchievement: {
      id: 'master_chef',
      title: 'Master Chef',
      description: 'Verified professional chef',
      icon: '👨‍🍳',
      rarity: 'legendary'
    },
    socialLinks: {
      instagram: 'chefmaster_nyc',
      youtube: 'ChefMasterCooking'
    },
    // Activity stats
    bountiesCompleted: 156,
    questsCompleted: 52,
    reviewsWritten: 312
  },
  '3': {
    id: '3',
    username: 'tasteadventurer',
    displayName: 'TasteAdventurer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: '🌮 Always hunting for the next great bite\n📍 Brooklyn | Level 38 Explorer\n🎯 Specialty: Street Food & Hidden Gems',
    followerCount: 28500,
    followingCount: 850,
    postCount: 280,
    isFollowing: false,
    location: 'Brooklyn, NY',
    level: 38,
    xp: 19800,
    streakCount: 14,
    likCoins: 3200,
    likTickets: 4,
    joinDate: '2023-01-20',
    isVerified: false,
    favoriteAchievement: {
      id: 'street_food_master',
      title: 'Street Food Master',
      description: 'Discovered 100+ street food vendors',
      icon: '🌮',
      rarity: 'rare'
    },
    socialLinks: {
      instagram: 'tasteadventurer',
      tiktok: 'tasteadventurer'
    },
    // Activity stats
    bountiesCompleted: 143,
    questsCompleted: 37,
    reviewsWritten: 289
  },
  '4': {
    id: '4',
    username: 'gourmetguru',
    displayName: 'GourmetGuru',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: '🍷 Wine & Fine Dining Enthusiast\n📍 Manhattan | Level 35 Connoisseur\n🏅 Sommelier Level 2 Certified',
    followerCount: 22000,
    followingCount: 720,
    postCount: 195,
    isFollowing: true,
    location: 'Manhattan, NY',
    level: 35,
    xp: 17400,
    streakCount: 9,
    likCoins: 2800,
    likTickets: 3,
    joinDate: '2023-03-05',
    isVerified: true,
    favoriteAchievement: {
      id: 'wine_expert',
      title: 'Wine Expert',
      description: 'Certified sommelier and wine critic',
      icon: '🍷',
      rarity: 'epic'
    },
    socialLinks: {
      instagram: 'gourmetguru_nyc'
    },
    // Activity stats
    bountiesCompleted: 89,
    questsCompleted: 31,
    reviewsWritten: 198
  },
  '5': {
    id: '5',
    username: 'culinaryqueen',
    displayName: 'CulinaryQueen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: '👑 Dessert & Pastry Specialist\n📍 Queens | Level 31 Baker\n🧁 Featured in Food & Wine Magazine',
    followerCount: 18500,
    followingCount: 650,
    postCount: 165,
    isFollowing: false,
    location: 'Queens, NY',
    level: 31,
    xp: 15200,
    streakCount: 7,
    likCoins: 2400,
    likTickets: 2,
    joinDate: '2023-05-12',
    isVerified: false,
    favoriteAchievement: {
      id: 'dessert_master',
      title: 'Dessert Master',
      description: 'Expert in pastries and desserts',
      icon: '🧁',
      rarity: 'epic'
    },
    socialLinks: {
      instagram: 'culinaryqueen',
      youtube: 'CulinaryQueenBakes'
    },
    // Activity stats
    bountiesCompleted: 76,
    questsCompleted: 28,
    reviewsWritten: 167
  }
};

export function UserProfile({ userId, onBack }: UserProfileProps) {
  const [posts] = useKV<PostType[]>('posts', generateMockPosts());
  const [activeTab, setActiveTab] = useState<'posts' | 'likes' | 'favorites' | 'guides'>('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBio, setShowBio] = useState(false);
  const device = useDevice();

  const user = mockUsers[userId];
  
  if (!user) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="font-medium">User Not Found</span>
          <div className="w-10" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">User not found</p>
        </div>
      </div>
    );
  }

  const userPosts = posts.filter(post => post.userId === userId);
  const likedPosts = posts.filter(post => post.isLiked);

  const handleFollow = () => {
    // Toggle follow status
    if (user.isFollowing) {
      toast.success(`Unfollowed ${user.displayName}`);
    } else {
      toast.success(`Following ${user.displayName}`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${user.displayName} on Lik`,
        text: `Check out ${user.displayName}'s profile on Lik!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Profile link copied to clipboard');
    }
  };

  const EmptyState = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-muted-foreground/50">{icon}</div>
      <p className="text-muted-foreground font-medium">{text}</p>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-pink-50 via-background to-purple-50">
      {/* Whimsical Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-pink-100/90 via-background/95 to-purple-100/90 backdrop-blur-sm border-b border-pink-200/30">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2.5 h-10 w-10 rounded-full bg-gradient-to-r from-gray-100 to-slate-100 hover:from-gray-200 hover:to-slate-200 shadow-sm">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Button>
        <div className="flex items-center space-x-3">
          <span className="font-bold text-gray-800 nav-rum-raisin text-lg">{user.username}</span>
          {user.isVerified && (
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-1 rounded-full">
              <CheckCircle className="w-4 h-4 text-white" weight="fill" />
            </div>
          )}
        </div>
        <Button variant="ghost" size="sm" className="p-2.5 h-10 w-10 rounded-full bg-gradient-to-r from-gray-100 to-slate-100 hover:from-gray-200 hover:to-slate-200 shadow-sm">
          <DotsThree className="w-5 h-5 text-gray-600" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          {/* Compact Profile Header */}
          <div 
            className="relative bg-gradient-to-br from-blue-100 via-white to-purple-100 rounded-2xl p-6 shadow-lg border border-blue-200/50 mb-6 overflow-hidden"
            {...(showBio ? {} : {
              onTouchStart: (e) => {
                const startX = e.touches[0].clientX;
                const startY = e.touches[0].clientY;
                
                const handleTouchMove = (e: TouchEvent) => {
                  const deltaX = e.touches[0].clientX - startX;
                  const deltaY = e.touches[0].clientY - startY;
                  
                  // Check for horizontal swipe with minimal vertical movement
                  if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 30) {
                    setShowBio(true);
                    document.removeEventListener('touchmove', handleTouchMove);
                  }
                };
                
                document.addEventListener('touchmove', handleTouchMove);
                setTimeout(() => document.removeEventListener('touchmove', handleTouchMove), 500);
              }
            })}
          >
            {/* Floating Background Elements */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute top-2 right-4 text-lg opacity-20">🌟</div>
              <div className="absolute bottom-4 left-4 text-sm opacity-20">🎨</div>
              <div className="absolute top-1/2 right-2 text-sm opacity-20">✨</div>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-start space-x-4">
                {/* Compact Profile Image with Simple XP Ring */}
                <div className="relative">
                  <ProfileAvatar
                    src={user.avatar}
                    alt={user.displayName}
                    level={user.level}
                    xp={user.xp}
                    maxXp={user.xp + 3000} // Mock max XP for this level
                    size="md"
                  />
                </div>

                {/* Profile Info */}
                <div className="flex-1 space-y-2">
                  <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent nav-rum-raisin">{user.displayName}</h1>
                    <p className="text-gray-600 nav-rum-raisin text-sm">@{user.username}</p>
                  </div>
                  
                  {user.location && (
                    <div className="flex items-center gap-2 bg-white/60 rounded-full px-3 py-1 w-fit shadow-sm">
                      <div className="bg-gradient-to-r from-green-400 to-blue-500 p-0.5 rounded-full">
                        <MapPin className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-xs text-gray-700 nav-rum-raisin">{user.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Compact Bio */}
              <div className="bg-white/60 rounded-xl p-4 shadow-sm border border-blue-100">
                <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line selectable-text nav-rum-raisin line-clamp-2">
                  {user.bio}
                </p>
                
                {user.favoriteAchievement && (
                  <div className="flex items-center space-x-2 mt-3 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border border-yellow-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-sm">{user.favoriteAchievement.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 nav-rum-raisin text-sm">{user.favoriteAchievement.title}</p>
                      <p className="text-xs text-gray-600 nav-rum-raisin line-clamp-1">{user.favoriteAchievement.description}</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">
                      {user.favoriteAchievement.rarity}
                    </div>
                  </div>
                )}
              </div>

              {/* Compact Stats */}
              <div className="space-y-3">
                {/* Main Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center bg-white/60 rounded-xl p-2 shadow-sm border border-pink-100">
                    <div className="text-sm font-bold text-gray-800">{user.followingCount.toLocaleString()}</div>
                    <div className="text-xs text-gray-600 nav-rum-raisin">Following</div>
                  </div>
                  <div className="text-center bg-white/60 rounded-xl p-2 shadow-sm border border-purple-100">
                    <div className="text-sm font-bold text-gray-800">{user.followerCount.toLocaleString()}</div>
                    <div className="text-xs text-gray-600 nav-rum-raisin">Followers</div>
                  </div>
                  <div className="text-center bg-white/60 rounded-xl p-2 shadow-sm border border-blue-100">
                    <div className="text-sm font-bold text-gray-800">{user.postCount}</div>
                    <div className="text-xs text-gray-600 nav-rum-raisin">Posts</div>
                  </div>
                </div>
                
                {/* Activity Stats with Icons */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center bg-gradient-to-br from-orange-100 to-red-100 rounded-lg p-2 shadow-sm">
                    <div className="text-sm mb-0.5">🎯</div>
                    <div className="text-sm font-bold text-gray-800 nav-rum-raisin">{user.bountiesCompleted || 0}</div>
                    <div className="text-xs text-gray-600 nav-rum-raisin">Bounties</div>
                  </div>
                  <div className="text-center bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-2 shadow-sm">
                    <div className="text-sm mb-0.5">⚔️</div>
                    <div className="text-sm font-bold text-gray-800 nav-rum-raisin">{user.questsCompleted || 0}</div>
                    <div className="text-xs text-gray-600 nav-rum-raisin">Quests</div>
                  </div>
                  <div className="text-center bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-2 shadow-sm">
                    <div className="text-sm mb-0.5">📝</div>
                    <div className="text-sm font-bold text-gray-800 nav-rum-raisin">{user.reviewsWritten || 0}</div>
                    <div className="text-xs text-gray-600 nav-rum-raisin">Reviews</div>
                  </div>
                </div>
              </div>

              {/* Compact Action Buttons */}
              <div className="flex space-x-3">
                <Button 
                  onClick={handleFollow}
                  className={cn(
                    "flex-1 h-9 rounded-full font-medium nav-rum-raisin shadow-sm text-sm",
                    user.isFollowing 
                      ? "bg-gradient-to-r from-gray-200 to-slate-200 hover:from-gray-300 hover:to-slate-300 text-gray-700" 
                      : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  )}
                >
                  <UserPlus className="w-3 h-3 mr-1.5" />
                  {user.isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleShare}
                  className="p-2 h-9 w-9 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 border-blue-200 shadow-sm"
                >
                  <ShareNetwork className="w-4 h-4 text-blue-600" />
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Bio View (Swipe) */}
          {showBio && (
            <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-background to-purple-50 z-50 flex flex-col">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-100/90 via-background/95 to-purple-100/90 backdrop-blur-sm border-b border-pink-200/30">
                <Button variant="ghost" size="sm" onClick={() => setShowBio(false)} className="p-2 h-8 w-8 rounded-full bg-gradient-to-r from-gray-100 to-slate-100 hover:from-gray-200 hover:to-slate-200 shadow-sm">
                  <ArrowLeft className="w-4 h-4 text-gray-600" />
                </Button>
                <span className="font-bold text-gray-800 nav-rum-raisin text-lg">About</span>
                <div className="w-8" />
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-200/50 relative overflow-hidden">
                  {/* Floating Decorative Elements */}
                  <div className="absolute inset-0">
                    <div className="absolute top-2 left-4 text-lg opacity-20">🎨</div>
                    <div className="absolute bottom-4 right-6 text-sm opacity-20">🌈</div>
                    <div className="absolute top-1/3 right-4 text-sm opacity-20">✨</div>
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div className="text-center">
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full p-0.5 shadow-xl">
                          <div className="bg-white rounded-full p-1.5">
                            <img
                              src={user.avatar}
                              alt={user.displayName}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent nav-rum-raisin mb-1">{user.displayName}</h2>
                      <p className="text-gray-600 nav-rum-raisin">@{user.username}</p>
                    </div>

                    <div className="bg-white/80 rounded-xl p-4 shadow-sm border border-blue-100">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-1.5 rounded-full">
                          <span className="text-white text-xs">📖</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 nav-rum-raisin">Biography</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line selectable-text nav-rum-raisin">
                        {user.bio}
                      </p>
                    </div>

                    {user.favoriteAchievement && (
                      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 shadow-sm border border-yellow-200 relative overflow-hidden">
                        <div className="absolute top-1 right-1 text-lg opacity-30">🏆</div>
                        <div className="flex items-center gap-2 mb-3 relative z-10">
                          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-1.5 rounded-full">
                            <span className="text-white text-xs">⭐</span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800 nav-rum-raisin">Featured Achievement</h3>
                        </div>
                        <div className="flex items-center space-x-3 relative z-10">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-xl">{user.favoriteAchievement.icon}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-800 nav-rum-raisin">{user.favoriteAchievement.title}</h4>
                            <p className="text-sm text-gray-600 nav-rum-raisin">{user.favoriteAchievement.description}</p>
                            <div className="mt-1">
                              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">
                                {user.favoriteAchievement.rarity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {user.socialLinks && (
                      <div className="bg-white/80 rounded-xl p-4 shadow-sm border border-purple-100">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-1.5 rounded-full">
                            <span className="text-white text-xs">🔗</span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800 nav-rum-raisin">Social Links</h3>
                        </div>
                        <div className="space-y-2">
                          {user.socialLinks.instagram && (
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg border border-pink-200">
                              <span className="font-medium text-gray-800 nav-rum-raisin text-sm">Instagram</span>
                              <span className="text-gray-600 nav-rum-raisin text-sm">@{user.socialLinks.instagram}</span>
                            </div>
                          )}
                          {user.socialLinks.tiktok && (
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-lg border border-red-200">
                              <span className="font-medium text-gray-800 nav-rum-raisin text-sm">TikTok</span>
                              <span className="text-gray-600 nav-rum-raisin text-sm">@{user.socialLinks.tiktok}</span>
                            </div>
                          )}
                          {user.socialLinks.youtube && (
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg border border-red-200">
                              <span className="font-medium text-gray-800 nav-rum-raisin text-sm">YouTube</span>
                              <span className="text-gray-600 nav-rum-raisin text-sm">{user.socialLinks.youtube}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Compact Tabs */}
          <div className="bg-white/50 mx-4 rounded-xl shadow-sm border border-pink-100/50 p-1.5 mb-4">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-transparent border-0 h-10 gap-1">
                <TabsTrigger 
                  value="posts" 
                  className="flex flex-col items-center gap-0.5 h-full rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-pink-200 data-[state=active]:to-purple-200 data-[state=active]:shadow-sm nav-rum-raisin font-medium text-gray-600 data-[state=active]:text-gray-800 text-xs"
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span className="text-xs">Posts</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="likes" 
                  className="flex flex-col items-center gap-0.5 h-full rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-red-200 data-[state=active]:to-pink-200 data-[state=active]:shadow-sm nav-rum-raisin font-medium text-gray-600 data-[state=active]:text-gray-800 text-xs"
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-xs">Likes</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="favorites" 
                  className="flex flex-col items-center gap-0.5 h-full rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-yellow-200 data-[state=active]:to-orange-200 data-[state=active]:shadow-sm nav-rum-raisin font-medium text-gray-600 data-[state=active]:text-gray-800 text-xs"
                >
                  <BookBookmark className="w-4 h-4" />
                  <span className="text-xs">Saved</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="guides" 
                  className="flex flex-col items-center gap-0.5 h-full rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-200 data-[state=active]:to-emerald-200 data-[state=active]:shadow-sm nav-rum-raisin font-medium text-gray-600 data-[state=active]:text-gray-800 text-xs"
                >
                  <Medal className="w-4 h-4" />
                  <span className="text-xs">Guides</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Compact Search and Filter */}
          <div className="px-4 mb-4">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder={`🔍 Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/80 border-pink-200 h-9 text-sm rounded-full shadow-sm nav-rum-raisin placeholder:text-gray-500"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 rounded-full bg-gradient-to-r from-pink-200 to-purple-200 hover:from-pink-300 hover:to-purple-300"
              >
                <SlidersHorizontal size={12} className="text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Compact Tab Content */}
          <div className="px-4 pb-6">
            <TabsContent value="posts" className="mt-0">
              {userPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-1.5">
                  {userPosts.map((post) => (
                    <div key={post.id} className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                      <img 
                        src={post.imageUrl} 
                        alt="Post" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 text-center border border-pink-100">
                  <div className="text-4xl mb-4">📸</div>
                  <h3 className="text-lg font-bold mb-3 text-gray-800 nav-rum-raisin">No posts yet</h3>
                  <p className="text-sm text-gray-600 nav-rum-raisin">This user hasn't shared any posts</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="likes" className="mt-0">
              {likedPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-1.5">
                  {likedPosts.map((post) => (
                    <div key={`liked-${post.id}`} className="aspect-square bg-gradient-to-br from-red-100 to-pink-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                      <img 
                        src={post.imageUrl} 
                        alt="Liked post" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 text-center border border-red-100">
                  <div className="text-4xl mb-4">💖</div>
                  <h3 className="text-lg font-bold mb-3 text-gray-800 nav-rum-raisin">No liked posts</h3>
                  <p className="text-sm text-gray-600 nav-rum-raisin">This user hasn't liked any posts yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="mt-0">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 text-center border border-yellow-100">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-lg font-bold mb-3 text-gray-800 nav-rum-raisin">No saved favorites</h3>
                <p className="text-sm text-gray-600 nav-rum-raisin">This user hasn't saved any favorites</p>
              </div>
            </TabsContent>

            <TabsContent value="guides" className="mt-0">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center border border-green-100">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-lg font-bold mb-3 text-gray-800 nav-rum-raisin">No guides created</h3>
                <p className="text-sm text-gray-600 nav-rum-raisin">This user hasn't created any guides</p>
              </div>
            </TabsContent>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}