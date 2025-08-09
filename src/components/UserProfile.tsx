import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Post as PostType, User } from '@/lib/types';
import { generateMockPosts } from '@/lib/mockData';
import { ConsistentAvatar } from '@/components/ui/consistent-avatar';
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
    }
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
    }
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
    }
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
    }
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
    }
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

  const ProfileStats = () => (
    <div className="flex justify-center space-x-8 py-4">
      <div className="text-center">
        <div className="font-semibold text-lg">{user.followingCount.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground">Following</div>
      </div>
      <div className="text-center">
        <div className="font-semibold text-lg">{user.followerCount.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground">Followers</div>
      </div>
      <div className="text-center">
        <div className="font-semibold text-lg">{user.postCount}</div>
        <div className="text-sm text-muted-foreground">Posts</div>
      </div>
    </div>
  );

  const EmptyState = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-muted-foreground/50">{icon}</div>
      <p className="text-muted-foreground font-medium">{text}</p>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center space-x-2">
          <span className="font-medium">{user.username}</span>
          {user.isVerified && (
            <CheckCircle className="w-4 h-4 text-blue-500" weight="fill" />
          )}
        </div>
        <Button variant="ghost" size="sm">
          <DotsThree className="w-5 h-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-4">
          {/* Profile Header */}
          <div className="py-6 space-y-4" {...(showBio ? {} : {
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
          })}>
            <div className="flex items-start space-x-4">
              {/* Profile Image with XP Ring */}
              <div className="relative">
                <div className="story-ring w-20 h-20 rounded-full flex items-center justify-center">
                  <ConsistentAvatar
                    src={user.avatar}
                    alt={user.displayName}
                    fallback={user.displayName.split(' ').map(n => n[0]).join('')}
                    size="2xl"
                    variant="xp-ring"
                    level={user.level}
                    xpProgress={0.7}
                  />
                </div>
                <Badge 
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-0.5"
                >
                  {user.level}
                </Badge>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-2">
                <div>
                  <h1 className="text-xl font-bold">{user.displayName}</h1>
                  <p className="text-muted-foreground">@{user.username}</p>
                </div>
                
                {user.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {user.location}
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-3">
              <p className="text-sm leading-relaxed whitespace-pre-line selectable-text">
                {user.bio}
              </p>
              
              {user.favoriteAchievement && (
                <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded-lg">
                  <span className="text-lg">{user.favoriteAchievement.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{user.favoriteAchievement.title}</p>
                    <p className="text-xs text-muted-foreground">{user.favoriteAchievement.description}</p>
                  </div>
                  <Badge variant={user.favoriteAchievement.rarity === 'legendary' ? 'default' : 'secondary'} className="ml-auto">
                    {user.favoriteAchievement.rarity}
                  </Badge>
                </div>
              )}
            </div>

            {/* Stats */}
            <ProfileStats />

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button 
                onClick={handleFollow}
                className={cn(
                  "flex-1",
                  user.isFollowing 
                    ? "bg-muted text-muted-foreground hover:bg-muted/80" 
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {user.isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <ShareNetwork className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Bio View (Swipe) */}
          {showBio && (
            <div className="fixed inset-0 bg-background z-50 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <Button variant="ghost" size="sm" onClick={() => setShowBio(false)}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <span className="font-medium">About</span>
                <div className="w-10" />
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                  <div className="text-center">
                    <ConsistentAvatar
                      src={user.avatar}
                      alt={user.displayName}
                      fallback={user.displayName.split(' ').map(n => n[0]).join('')}
                      size="2xl"
                      variant="default"
                    />
                    <h2 className="text-2xl font-bold">{user.displayName}</h2>
                    <p className="text-muted-foreground">@{user.username}</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Biography</h3>
                    <p className="text-sm leading-relaxed whitespace-pre-line selectable-text">
                      {user.bio}
                    </p>
                  </div>

                  {user.favoriteAchievement && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Featured Achievement</h3>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{user.favoriteAchievement.icon}</span>
                          <div>
                            <h4 className="font-medium">{user.favoriteAchievement.title}</h4>
                            <p className="text-sm text-muted-foreground">{user.favoriteAchievement.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {user.socialLinks && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Social Links</h3>
                      <div className="space-y-2">
                        {user.socialLinks.instagram && (
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="font-medium">Instagram</span>
                            <span className="text-muted-foreground">@{user.socialLinks.instagram}</span>
                          </div>
                        )}
                        {user.socialLinks.tiktok && (
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="font-medium">TikTok</span>
                            <span className="text-muted-foreground">@{user.socialLinks.tiktok}</span>
                          </div>
                        )}
                        {user.socialLinks.youtube && (
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="font-medium">YouTube</span>
                            <span className="text-muted-foreground">{user.socialLinks.youtube}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="posts" className="text-xs">
                <Grid3X3 className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="likes" className="text-xs">
                <Heart className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="favorites" className="text-xs">
                <BookBookmark className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="guides" className="text-xs">
                <Medal className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>

            {/* Search and Filter */}
            <div className="flex space-x-2 mb-4">
              <div className="relative flex-1">
                <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>

            <TabsContent value="posts" className="mt-0">
              {userPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-1">
                  {userPosts.map((post) => (
                    <div key={post.id} className="aspect-square bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt="Post" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon={<Grid3X3 className="w-12 h-12" />}
                  text="No posts yet"
                />
              )}
            </TabsContent>

            <TabsContent value="likes" className="mt-0">
              {likedPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-1">
                  {likedPosts.map((post) => (
                    <div key={`liked-${post.id}`} className="aspect-square bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt="Liked post" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon={<Heart className="w-12 h-12" />}
                  text="No liked posts"
                />
              )}
            </TabsContent>

            <TabsContent value="favorites" className="mt-0">
              <EmptyState 
                icon={<BookBookmark className="w-12 h-12" />}
                text="No saved favorites"
              />
            </TabsContent>

            <TabsContent value="guides" className="mt-0">
              <EmptyState 
                icon={<Medal className="w-12 h-12" />}
                text="No guides created"
              />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}