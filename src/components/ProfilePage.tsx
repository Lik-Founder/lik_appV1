import { useState } from 'react';
import { ArrowLeft, Edit, Share, MoreHorizontal, Settings, Grid3X3, Heart, Bookmark, BookOpen, MessageCircle, Send } from 'lucide-react';
import { 
  DocumentTextIcon as PassportIcon, 
  BellIcon as NotificationIcon, 
  GiftIcon as RewardIcon 
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CreatePostFAB } from '@/components/CreatePostFAB';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { ProfileSwipeView } from '@/components/ProfileSwipeView';
import { ProfileDropdown } from '@/components/ProfileDropdown';
// Using existing assets in images folder
import bronzeRankIcon from '@/assets/images/Bronze_Rank.png';
import { FloatingAppBar } from '@/components/FloatingAppBar';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState('posts');
  const [showSwipeView, setShowSwipeView] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const mockStats = {
    posts: '127',
    followers: '2.4M',
    following: '892', 
    bounties: '45',
    quests: '23',
    reviews: '284'
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
              When you like posts, they'll appear here.
            </p>
          </div>
        );
      case 'saved':
        return (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bookmark className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No saved posts yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Save posts you want to see again here.
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
              Create your first food guide to share your favorite spots.
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
      <FloatingAppBar title="Profile" />
      
      <div className="flex flex-col h-full max-h-screen bg-background overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {/* Header Section */}
          <div className="px-4 pt-4 pb-0">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <h1 className="text-xl font-semibold">sarah_chen</h1>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </button>
                  {showDropdown && (
                    <ProfileDropdown 
                      onClose={() => setShowDropdown(false)}
                      onNavigate={onNavigate}
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onNavigate('create-post')}
                  className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button 
                  onClick={() => onNavigate('lik-passport')}
                  className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <PassportIcon className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => onNavigate('notifications')}
                  className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <NotificationIcon className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => onNavigate('my-rewards')}
                  className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <RewardIcon className="w-6 h-6" />
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
                  level={124}
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
                />
                <img 
                  src={bronzeRankIcon} 
                  alt="Bronze Rank" 
                  className="absolute -top-1 -right-1 w-7 h-7"
                />
              </div>

              {/* Stats */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold">{mockStats.posts}</div>
                    <div className="text-sm text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">{mockStats.followers}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">{mockStats.following}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mb-4">
              <h2 className="font-semibold text-base mb-1">Sarah Chen</h2>
              <p className="text-sm text-muted-foreground mb-2">🍕 Food Explorer | 📍 Los Angeles</p>
              <p className="text-sm leading-relaxed">
                Exploring the best eats in LA one bite at a time ✨<br/>
                Currently on a mission to find the perfect ramen 🍜
              </p>
            </div>

            {/* Secondary Stats */}
            <div className="flex items-center justify-between text-center mb-6 p-3 bg-muted/30 rounded-lg">
              <div>
                <div className="font-semibold text-sm font-rum-raisin">{mockStats.bounties}</div>
                <div className="text-xs text-muted-foreground">Bounties</div>
              </div>
              <div>
                <div className="font-semibold text-sm font-rum-raisin">{mockStats.quests}</div>
                <div className="text-xs text-muted-foreground">Quests</div>
              </div>
              <div>
                <div className="font-semibold text-sm font-rum-raisin">{mockStats.reviews}</div>
                <div className="text-xs text-muted-foreground">Reviews</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-6">
              <Button 
                variant="outline" 
                className="flex-1 h-9 text-sm font-medium bg-muted/50 hover:bg-muted border-muted-foreground/20"
                onClick={() => setShowSwipeView(true)}
              >
                Edit Profile
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 h-9 text-sm font-medium bg-muted/50 hover:bg-muted border-muted-foreground/20"
              >
                Share Profile
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="px-3 h-9 bg-muted/50 hover:bg-muted border-muted-foreground/20"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Stories Section */}
            <div className="mb-6">
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                <div className="flex flex-col items-center gap-2 min-w-[64px]">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/30">
                    <span className="text-xl text-muted-foreground">+</span>
                  </div>
                  <span className="text-xs text-muted-foreground">New</span>
                </div>
                {['Dinner', 'Brunch', 'Coffee', 'Travel'].map((story, index) => (
                  <div key={story} className="flex flex-col items-center gap-2 min-w-[64px]">
                    <div className="story-ring w-16 h-16 rounded-full p-0.5">
                      <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                        <span className="text-lg">
                          {index === 0 ? '🍽️' : index === 1 ? '🥐' : index === 2 ? '☕' : '✈️'}
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

        {/* Swipe View */}
        {showSwipeView && (
          <ProfileSwipeView onClose={() => setShowSwipeView(false)} />
        )}

        {/* FAB */}
        <CreatePostFAB 
          onClick={() => onNavigate('create-post')}
          style={{ bottom: '100px', right: '20px' }}
        />
      </div>
    </>
  );
}