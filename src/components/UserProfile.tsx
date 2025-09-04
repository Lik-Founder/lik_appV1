import { useState, useEffect } from 'react';
import { ArrowLeft, UserPlus, MessageCircle, MoreHorizontal, Grid3X3, Heart, Bookmark, BookOpen, Send, MapPin, CheckCircle, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { FloatingAppBar } from '@/components/FloatingAppBar';
import { toast } from 'sonner';

interface UserProfileProps {
  userId: string;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

const mockUser = {
  id: '1',
  username: 'foodie_sarah',
  displayName: 'Sarah Chen',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  bio: 'Food explorer & taste adventurer 🍕\nSan Francisco | Level 12 Foodie\nDiscovering the best local eats',
  posts: '89',
  followers: '1.2K',
  following: '340',
  bounties: '23',
  quests: '14',
  reviews: '156',
  isFollowing: false,
  location: 'San Francisco, CA',
  level: 12,
  isVerified: true
};

const mockPosts = [
  { id: 1, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop', likes: '2.1K', comments: 89 },
  { id: 2, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop', likes: '1.8K', comments: 156 },
  { id: 3, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop', likes: '3.2K', comments: 234 },
  { id: 4, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop', likes: '956', comments: 67 },
  { id: 5, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop', likes: '4.1K', comments: 312 },
  { id: 6, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop', likes: '2.7K', comments: 198 }
];

export function UserProfile({ userId, onBack, onNavigate }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(mockUser.isFollowing);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? 'Unfollowed' : 'Following');
  };

  const handleMessage = () => {
    toast.info('Message feature coming soon!');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div className="grid grid-cols-3 gap-1">
            {mockPosts.map((post) => (
              <div key={post.id} className="aspect-square relative group cursor-pointer">
                <img 
                  src={post.image} 
                  alt={`Post ${post.id}`}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="flex items-center gap-6 text-white font-semibold">
                    <div className="flex items-center gap-1">
                      <Heart className="w-5 h-5 fill-white" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-5 h-5 fill-white" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'likes':
        return (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No liked posts yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              When this user likes posts, they'll appear here.
            </p>
          </div>
        );
      case 'saved':
        return (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bookmark className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No saved posts</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Saved posts are private to the user.
            </p>
          </div>
        );
      case 'guides':
        return (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No guides created</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              This user hasn't created any food guides yet.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Floating App Bar */}
      <FloatingAppBar 
        title={mockUser.username}
        showBack={true}
        onBack={onBack}
      />
      
      <div className="flex flex-col h-full max-h-screen bg-background overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {/* Header Section */}
          <div className="px-4 pt-4 pb-0">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-semibold">{mockUser.username}</h1>
                {mockUser.isVerified && (
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                )}
              </div>

              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
                  <Share className="w-6 h-6" />
                </button>
                <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
                  <MoreHorizontal className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex items-start gap-4 mb-6">
              {/* Profile Picture */}
              <div className="relative">
                <ProfileAvatar 
                  size="lg"
                  level={mockUser.level}
                  src={mockUser.avatar}
                />
              </div>

              {/* Stats */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold">{mockUser.posts}</div>
                    <div className="text-sm text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">{mockUser.followers}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">{mockUser.following}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mb-4">
              <h2 className="font-semibold text-base mb-1">{mockUser.displayName}</h2>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{mockUser.location}</span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {mockUser.bio}
              </p>
            </div>

            {/* Secondary Stats */}
            <div className="flex items-center justify-between text-center mb-6 p-3 bg-muted/30 rounded-lg">
              <div>
                <div className="font-semibold text-sm font-rum-raisin">{mockUser.bounties}</div>
                <div className="text-xs text-muted-foreground">Bounties</div>
              </div>
              <div>
                <div className="font-semibold text-sm font-rum-raisin">{mockUser.quests}</div>
                <div className="text-xs text-muted-foreground">Quests</div>
              </div>
              <div>
                <div className="font-semibold text-sm font-rum-raisin">{mockUser.reviews}</div>
                <div className="text-xs text-muted-foreground">Reviews</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-6">
              <Button 
                variant={isFollowing ? "outline" : "default"}
                className="flex-1 h-9 text-sm font-medium"
                onClick={handleFollow}
              >
                {isFollowing ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Following</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    <span>Follow</span>
                  </div>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 h-9 text-sm font-medium"
                onClick={handleMessage}
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Message</span>
                </div>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="px-3 h-9"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Stories Section */}
            <div className="mb-6">
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {['Favorites', 'Reviews', 'Adventures', 'Local'].map((story, index) => (
                  <div key={story} className="flex flex-col items-center gap-2 min-w-[64px]">
                    <div className="story-ring w-16 h-16 rounded-full p-0.5">
                      <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                        <span className="text-lg">
                          {index === 0 ? '❤️' : index === 1 ? '⭐' : index === 2 ? '🗺️' : '📍'}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{story}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="sticky top-0 bg-background/90 backdrop-blur-sm border-t border-border/20 z-10">
            <div className="flex">
              {[
                { key: 'posts', label: 'Posts', icon: Grid3X3 },
                { key: 'likes', label: 'Likes', icon: Heart },
                { key: 'saved', label: 'Saved', icon: Bookmark },
                { key: 'guides', label: 'Guides', icon: BookOpen }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium border-b-2 transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'border-foreground text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="px-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </>
  );
}