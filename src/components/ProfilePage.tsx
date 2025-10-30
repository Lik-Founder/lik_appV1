import { useState } from 'react';
import { Settings, Grid3X3, Heart, Bookmark, BookOpen, MessageCircle, MapPin } from 'lucide-react';
import { 
  DocumentTextIcon as PassportIcon, 
  BellIcon as NotificationIcon, 
  GiftIcon as RewardIcon 
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { ProfileSwipeView } from '@/components/ProfileSwipeView';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { useStatusBar } from '@/hooks/use-status-bar';
import bronzeRankIcon from '@/assets/images/Bronze_Rank.png';
import likHeartIcon from '@/assets/images/Lik_Logo_Heart_1.0.png';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  useStatusBar('light'); // Light status bar for white background
  
  const [activeTab, setActiveTab] = useState('posts');
  const [showSwipeView, setShowSwipeView] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const mockStats = {
    posts: '127',
    followers: '2.4M',
    following: '892', 
    bounties: '45',
    quests: '23',
    reviews: '284',
    level: 124,
    xp: 18750,
    maxXp: 25000
  };

  const mockPosts = [
    { id: 1, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop', likes: '2.1K', comments: 89 },
    { id: 2, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop', likes: '1.8K', comments: 156 },
    { id: 3, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop', likes: '3.2K', comments: 234 },
    { id: 4, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop', likes: '956', comments: 67 },
    { id: 5, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop', likes: '4.1K', comments: 312 },
    { id: 6, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop', likes: '2.7K', comments: 198 },
    { id: 7, image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=400&fit=crop', likes: '1.5K', comments: 89 },
    { id: 8, image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=400&fit=crop', likes: '2.9K', comments: 145 },
    { id: 9, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop', likes: '3.6K', comments: 276 }
  ];

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
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-between p-3">
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
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 font-rum-raisin text-black">No liked posts yet</h3>
            <p className="text-black text-base max-w-xs leading-relaxed font-medium">
              When you like posts, they'll appear here like little treasures! ✨
            </p>
          </div>
        );
      case 'saved':
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center px-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-6">
              <Bookmark className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 font-rum-raisin text-black">No saved posts yet</h3>
            <p className="text-black text-base max-w-xs leading-relaxed font-medium">
              Save your favorite food adventures here for easy access! 🍽️
            </p>
          </div>
        );
      case 'guides':
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center px-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 font-rum-raisin text-black">No guides created</h3>
            <p className="text-black text-base max-w-xs leading-relaxed font-medium">
              Create your first food guide and become a culinary navigator! 🗺️
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Top Navigation Bar (Fixed) */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/20 pt-[max(48px,env(safe-area-inset-top))] flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Bronze Rank Badge */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img 
                  src={bronzeRankIcon} 
                  alt="Bronze Rank" 
                  className="w-8 h-8"
                />
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>
              {showDropdown && (
                <ProfileDropdown 
                  isOpen={showDropdown}
                  onClose={() => setShowDropdown(false)}
                  anchorRect={null}
                  user={{
                    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                    displayName: "Sarah Chen",
                    username: "@sarah_chen",
                    tasteTitle: "Flavor Explorer",
                    level: mockStats.level,
                    xp: mockStats.xp,
                    maxXp: mockStats.maxXp,
                    badges: [
                      { id: "verified", icon: "✓", label: "Verified" },
                      { id: "creator", icon: "⭐", label: "Creator" }
                    ]
                  }}
                  stats={{
                    streak: 4,
                    tickets: 2,
                    likCoins: "1.2k",
                    hearts: "3.2k"
                  }}
                  dailyProgress={{
                    currentTime: "00:00",
                    targetTime: "02:00", 
                    bonusReward: "+600 LP",
                    streakDays: 7,
                    currentStreak: 4
                  }}
                  onNavigate={onNavigate}
                />
              )}
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate('lik-passport')}
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
              title="Lik Passport"
            >
              <PassportIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onNavigate('notifications')}
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
              title="Notifications"
            >
              <NotificationIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onNavigate('my-rewards')}
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
              title="My Rewards"
            >
              <RewardIcon className="w-5 h-5" />
            </button>
            <button 
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
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
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
                alt="Sarah Chen"
                level={mockStats.level}
                xp={mockStats.xp}
                maxXp={mockStats.maxXp}
                size="xl"
              />
            </div>
          </div>

          {/* Display Name & Username */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-1 flex items-center justify-center gap-2 text-black">
              Sarah Chen
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </h1>
            <p className="text-black font-medium text-lg">@sarah_chen</p>
          </div>

          {/* Account Stats Row */}
          <div className="flex justify-center items-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold font-rum-raisin text-black">{mockStats.following}</div>
              <div className="text-xl text-black font-semibold">Following</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold font-rum-raisin text-black">{mockStats.followers}</div>
              <div className="text-xl text-black font-semibold">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold font-rum-raisin text-black">{mockStats.posts}</div>
              <div className="text-xl text-black font-semibold">Posts</div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-black" />
            <span className="text-black text-lg font-medium">Los Angeles, CA</span>
          </div>

          {/* Gamification Stats */}
          <div className="flex justify-center items-center gap-6 mb-6 p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 rounded-2xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-black font-rum-raisin">{mockStats.bounties}</div>
              <div className="text-lg text-black font-bold">Bounties</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black font-rum-raisin">{mockStats.quests}</div>
              <div className="text-lg text-black font-bold">Quests</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black font-rum-raisin">{mockStats.reviews}</div>
              <div className="text-lg text-black font-bold">Reviews</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6 justify-center">
            <Button 
              variant="outline" 
              className="flex-1 max-w-32 h-10 text-lg font-bold font-rum-raisin bg-muted/50 hover:bg-muted border-muted-foreground/20 text-black"
              onClick={() => setShowSwipeView(true)}
            >
              Edit Profile
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 max-w-32 h-10 text-lg font-bold font-rum-raisin bg-muted/50 hover:bg-muted border-muted-foreground/20 text-black"
            >
              Share Profile
            </Button>
          </div>
        </div>

        {/* Stories Section */}
        <div className="px-6 mb-6">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            <div className="flex flex-col items-center gap-2 min-w-[68px]">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer">
                <span className="text-xl text-muted-foreground">+</span>
              </div>
              <span className="text-sm text-black font-medium">New</span>
            </div>
            {[
              { name: 'Dinner', emoji: '🍽️', color: 'from-orange-400 to-red-400' },
              { name: 'Brunch', emoji: '🥐', color: 'from-yellow-400 to-orange-400' },
              { name: 'Coffee', emoji: '☕', color: 'from-amber-400 to-yellow-400' },
              { name: 'Travel', emoji: '✈️', color: 'from-blue-400 to-indigo-400' }
            ].map((story, index) => (
              <div key={story.name} className="flex flex-col items-center gap-2 min-w-[68px] group cursor-pointer">
                <div className="story-ring w-16 h-16 rounded-full p-0.5">
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
                className={`flex-1 max-w-24 py-4 flex flex-col items-center gap-1 text-lg font-bold ${
                  activeTab === tab.key
                    ? 'text-red-500 border-b-2 border-red-500'
                    : 'text-black hover:text-red-400 border-b-2 border-transparent'
                } font-rum-raisin`}
              >
                <tab.icon className={`w-6 h-6 ${activeTab === tab.key ? 'text-red-500' : ''}`} />
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

      {/* Swipe View */}
      {showSwipeView && (
        <ProfileSwipeView onClose={() => setShowSwipeView(false)} />
      )}
    </div>
  );
}