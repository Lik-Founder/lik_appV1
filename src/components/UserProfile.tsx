import { useState, useEffect } from 'react';
import { ArrowLeft, UserPlus, MessageCircle, MoreHorizontal, Grid3X3, Heart, Bookmark, BookOpen, Send, MapPin, CheckCircle, Share, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { toast } from 'sonner';
import bronzeRankIcon from '@/assets/images/Bronze_Rank.png';

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
  xp: 7250,
  maxXp: 10000,
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div className="grid grid-cols-3 gap-1 p-1">
            {mockPosts.map((post) => (
              <div key={post.id} className="aspect-square relative group cursor-pointer overflow-hidden rounded-lg">
                <img 
                  src={post.image} 
                  alt={`Post ${post.id}`}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-between p-3">
                  <div className="flex items-center gap-3 text-white text-sm font-medium">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 fill-white" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4 fill-white" />
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
          <div className="flex flex-col items-center justify-center py-20 text-center px-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center mb-6 animate-float">
              <Heart className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 font-rum-raisin text-black">No liked posts yet</h3>
            <p className="text-black text-base max-w-xs leading-relaxed font-medium">
              When they like posts, they'll appear here! ✨
            </p>
          </div>
        );
      case 'saved':
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center px-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-6 animate-float delay-500">
              <Bookmark className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 font-rum-raisin text-black">Private saved posts</h3>
            <p className="text-black text-base max-w-xs leading-relaxed font-medium">
              Their saved posts are private! 🔒
            </p>
          </div>
        );
      case 'guides':
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center px-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mb-6 animate-float delay-1000">
              <BookOpen className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 font-rum-raisin text-black">No guides yet</h3>
            <p className="text-black text-base max-w-xs leading-relaxed font-medium">
              They haven't created any food guides yet! 🗺️
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full max-h-screen bg-background overflow-hidden">
      {/* Top Navigation Bar (Fixed) */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/20">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium text-black">Back</span>
          </button>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
              <Share className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className="px-6 py-6 text-center">
          {/* Profile Image with XP Ring */}
          <div className="relative mb-6 flex justify-center">
            <div className="relative">
              <ProfileAvatar 
                src={mockUser.avatar}
                alt={mockUser.displayName}
                level={mockUser.level}
                xp={mockUser.xp}
                maxXp={mockUser.maxXp}
                size="xl"
                className="animate-float"
              />
              {/* Bronze Rank Badge */}
              <img 
                src={bronzeRankIcon} 
                alt="Bronze Rank" 
                className="absolute -top-2 -right-2 w-8 h-8 animate-bounce"
              />
            </div>
          </div>

          {/* Display Name & Username */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-1 flex items-center justify-center gap-2 text-black">
              {mockUser.displayName}
              {mockUser.isVerified && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </h1>
            <p className="text-black font-medium text-lg">@{mockUser.username}</p>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <p className="text-base leading-relaxed whitespace-pre-line max-w-sm mx-auto text-black font-medium">
              {mockUser.bio}
            </p>
          </div>

          {/* Account Stats Row */}
          <div className="flex justify-center items-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold font-rum-raisin text-black">{mockUser.following}</div>
              <div className="text-base text-black font-medium">Following</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold font-rum-raisin text-black">{mockUser.followers}</div>
              <div className="text-base text-black font-medium">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold font-rum-raisin text-black">{mockUser.posts}</div>
              <div className="text-base text-black font-medium">Posts</div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-black" />
            <span className="text-black text-lg font-medium">{mockUser.location}</span>
          </div>

          {/* Gamification Stats */}
          <div className="flex justify-center items-center gap-6 mb-6 p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 rounded-2xl">
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600 font-rum-raisin">{mockUser.bounties}</div>
              <div className="text-sm text-purple-600 font-semibold">Bounties</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-pink-600 font-rum-raisin">{mockUser.quests}</div>
              <div className="text-sm text-pink-600 font-semibold">Quests</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600 font-rum-raisin">{mockUser.reviews}</div>
              <div className="text-sm text-red-600 font-semibold">Reviews</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6 justify-center">
            <Button 
              onClick={handleFollow}
              className={`flex-1 max-w-32 h-10 text-base font-medium font-rum-raisin ${
                isFollowing 
                  ? 'bg-muted/50 hover:bg-muted text-black border border-muted-foreground/20' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
              variant={isFollowing ? 'outline' : 'default'}
            >
              {isFollowing ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Follow
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 max-w-32 h-10 text-base font-medium font-rum-raisin bg-muted/50 hover:bg-muted border-muted-foreground/20 text-black"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
          </div>
        </div>

        {/* Stories Section */}
        <div className="px-6 mb-6">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {[
              { name: 'Highlights', emoji: '⭐', color: 'from-yellow-400 to-orange-400' },
              { name: 'Reviews', emoji: '📝', color: 'from-blue-400 to-indigo-400' },
              { name: 'Adventures', emoji: '🗺️', color: 'from-green-400 to-emerald-400' },
              { name: 'Favorites', emoji: '❤️', color: 'from-pink-400 to-red-400' }
            ].map((story, index) => (
              <div key={story.name} className="flex flex-col items-center gap-2 min-w-[68px] group cursor-pointer">
                <div className="story-ring w-16 h-16 rounded-full p-0.5 group-hover:scale-105 transition-transform duration-200">
                  <div className={`w-full h-full bg-gradient-to-br ${story.color} rounded-full flex items-center justify-center shadow-lg`}>
                    <span className="text-lg">{story.emoji}</span>
                  </div>
                </div>
                <span className="text-sm text-black font-medium">{story.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Bar (Content Categories) */}
        <div className="sticky top-16 bg-background/95 backdrop-blur-sm border-t border-b border-border/20 z-40">
          <div className="flex justify-center">
            {[
              { key: 'posts', label: 'Posts', icon: Grid3X3 },
              { key: 'likes', label: 'Likes', icon: Heart },
              { key: 'saved', label: 'Saved', icon: Bookmark },
              { key: 'guides', label: 'Guides', icon: BookOpen }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 max-w-24 py-4 flex flex-col items-center gap-1 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'text-red-500 border-b-2 border-red-500'
                    : 'text-black hover:text-red-400 border-b-2 border-transparent'
                } font-rum-raisin`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.key ? 'text-red-500' : ''}`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-screen">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}