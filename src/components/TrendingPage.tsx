import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConsistentAvatar } from '@/components/ui/consistent-avatar';
import { CommentModal } from '@/components/CommentModal';
import { 
  ChatBubbleLeftIcon, 
  MapPinIcon as MapPin,
  MagnifyingGlassIcon,
  TvIcon,
  PlusIcon,
  StarIcon,
  ClockIcon,
  PuzzlePieceIcon,
  ShoppingCartIcon,
  StarIcon as MedalIcon,
  CheckCircleIcon as CheckCircle
} from '@heroicons/react/24/outline';

import { cn } from '@/lib/utils';
import { useKV } from '@github/spark/hooks';
import { useStatusBar } from '@/hooks/use-status-bar';
import { UserPost, RestaurantPost, AdPost, User, Comment } from '@/lib/types';
// Asset imports - all verified to exist
import LikLogoHeart from '@/assets/images/Lik_Logo_Heart_1.0.png';
import BookmarkIcon from '@/assets/images/bookmark_icon.svg'; // Fixed import
import CommentIcon from '@/assets/images/comment_icon.svg';
import ShareIcon from '@/assets/images/share_icon1.svg';
import HeartIcon from '@/assets/images/heart_icon.svg';
// Removed react-swipeable import - using native touch events instead

// Mock data for trending content
const mockUsers: User[] = [
  {
    id: '1',
    username: 'foodie_sarah',
    displayName: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Food explorer',
    followerCount: 1200,
    followingCount: 340,
    postCount: 89,
    isFollowing: false
  },
  {
    id: '2',
    username: 'chef_marco',
    displayName: 'Marco Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Professional chef',
    followerCount: 5600,
    followingCount: 120,
    postCount: 245,
    isFollowing: true
  }
];

const mockContent: (UserPost | RestaurantPost | AdPost)[] = [
  {
    id: '1',
    type: 'user_post',
    mediaUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop',
    mediaType: 'image',
    likes: 342,
    comments: 28,
    shares: 12,
    saves: 45,
    isLiked: false,
    isSaved: false,
    location: '123 Main St, Downtown',
    likedBy: mockUsers.slice(0, 3),
    user: { ...mockUsers[0], level: 12, isFollowing: false },
    restaurant: {
      id: 'rest6',
      name: 'Gourmet Bistro',
      rating: 4.1
    },
    review: {
      rating: 8.8,
      price: '$25',
      text: 'The salmon was perfectly flaky and the sauce complemented it beautifully. Definitely coming back!',
      tags: ['#LikPick', '#Delicious', '#Foodie', '#Salmon']
    }
  },
  {
    id: '2',
    type: 'restaurant_post',
    mediaUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=600&fit=crop',
    mediaType: 'video',
    likes: 892,
    comments: 67,
    shares: 34,
    saves: 123,
    isLiked: true,
    isSaved: false,
    location: '456 Food Ave, Midtown',
    likedBy: mockUsers.slice(1, 4),
    restaurant: {
      id: 'rest1',
      name: 'Bella Italia',
      avatar: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&h=150&fit=crop',
      rating: 4.7,
      cuisineTypes: ['Italian', 'Bistro', 'Bar'],
      isOpen: true,
      isVerified: true
    },
    dish: {
      name: 'Truffle Pasta Special',
      calories: 650,
      price: '$28',
      description: 'Fresh handmade pasta with black truffle and parmesan',
      tags: ['#LowCarb', '#EditorsPick', '#ChefsPick']
    }
  },
  {
    id: '3',
    type: 'ad',
    mediaUrl: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400&h=600&fit=crop',
    mediaType: 'image',
    likes: 156,
    comments: 12,
    shares: 8,
    saves: 23,
    isLiked: false,
    isSaved: true,
    location: '789 Pizza Street, Uptown',
    likedBy: mockUsers.slice(0, 2),
    restaurant: {
      id: 'rest2',
      name: 'Tony\'s Pizza',
      avatar: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=150&h=150&fit=crop',
      rating: 4.3,
      isVerified: true
    },
    promotion: {
      text: 'Late Night Cravings? 30% off after 9 PM',
      likCoinReward: 100,
      questAvailable: true,
      xpBonus: 50
    },
    challenge: {
      name: 'June\'s Pizza Challenge',
      description: 'Complete to unlock exclusive reward'
    },
    distance: 0.8
  },
  {
    id: '4',
    type: 'user_post',
    mediaUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=600&fit=crop',
    mediaType: 'image',
    likes: 198,
    comments: 15,
    shares: 6,
    saves: 32,
    isLiked: false,
    isSaved: false,
    location: '321 Taco Lane, Westside',
    likedBy: mockUsers.slice(0, 2),
    user: { ...mockUsers[1], level: 8, isFollowing: false },
    restaurant: {
      name: 'La Cantina',
      rating: 4.5
    },
    review: {
      rating: 9.2,
      price: '$18',
      text: 'These tacos are incredible! The carnitas were so tender and flavorful.',
      tags: ['#Tacos', '#Mexican', '#Authentic', '#MustTry']
    }
  },
  {
    id: '5',
    type: 'restaurant_post',
    mediaUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=600&fit=crop',
    mediaType: 'image',
    likes: 1205,
    comments: 89,
    shares: 45,
    saves: 234,
    isLiked: false,
    isSaved: true,
    location: '654 Burger Blvd, Central',
    likedBy: mockUsers.slice(0, 4),
    restaurant: {
      id: 'rest3',
      name: 'The Burger Joint',
      avatar: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=150&h=150&fit=crop',
      rating: 4.9,
      cuisineTypes: ['American', 'Burgers', 'Casual'],
      isOpen: true,
      isVerified: true
    },
    dish: {
      name: 'Double Stack Classic',
      calories: 890,
      price: '$16',
      description: 'Two beef patties with our signature sauce and crispy fries',
      tags: ['#Burgers', '#Classic', '#Comfort', '#Popular']
    }
  }
];

interface TrendingPageProps {
  onNavigate: (page: string) => void;
  onSelectUser: (userId: string) => void;
  onSelectRestaurant: (restaurantId: string) => void;
}

export function TrendingPage({ onNavigate, onSelectUser, onSelectRestaurant }: TrendingPageProps) {
  useStatusBar('dark'); // Dark status bar for black background
  
  const [activeTab, setActiveTab] = useState<'following' | 'trending' | 'foryou'>('trending');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [content, setContent] = useKV('trending-content', mockContent);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle like toggle
  const handleLike = (postId: string) => {
    setContent(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
    // Simulate haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(25);
    }
  };

  // Handle save toggle
  const handleSave = (postId: string) => {
    setContent(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isSaved: !post.isSaved,
            saves: post.isSaved ? post.saves - 1 : post.saves + 1
          }
        : post
    ));
  };

  // Handle comment modal opening
  const handleComment = (postId: string) => {
    setSelectedPostId(postId);
    setShowCommentModal(true);
  };

  // Handle double tap to like
  const handleDoubleTap = (postId: string) => {
    const post = content.find(p => p.id === postId);
    if (post && !post.isLiked) {
      handleLike(postId);
    }
  };

  // Handle touch events for swiping
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum distance to trigger swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe && currentIndex < content.length - 1) {
      setCurrentIndex(currentIndex + 1);
      // Simulate haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    } else if (isDownSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      // Simulate haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    }
  };

  // Auto-scroll to current content
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const targetElement = container.children[currentIndex] as HTMLElement;
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [currentIndex]);

  const currentContent = content[currentIndex];

  const renderUserPost = (post: UserPost) => (
    <div 
      className="relative w-full h-full bg-black overflow-hidden"
      onDoubleClick={() => handleDoubleTap(post.id)}
    >
      <img 
        src={post.mediaUrl} 
        alt="User post"
        className="w-full h-full object-cover"
      />

      {/* Bottom overlay with user profile and review info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-20">
        <div className="space-y-3 max-w-full">
          {/* User profile section */}
          <div className="flex items-center gap-2 mb-3">
            <ConsistentAvatar
              src={post.user.avatar}
              alt={post.user.displayName}
              fallback={post.user.displayName[0]}
              size="sm"
              variant="xp-ring"
              level={post.user.level}
              xpProgress={0.75}
              onClick={() => {
                onSelectUser?.(post.user.id);
                onNavigate('user-profile');
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span 
                  className="text-white font-semibold text-sm cursor-pointer hover:underline truncate" 
                  onClick={() => {
                    onSelectUser?.(post.user.id);
                    onNavigate('user-profile');
                  }}
                >
                  {post.user.displayName}
                </span>
                {!post.user.isFollowing && (
                  <Button size="sm" className="glossy-red-pill text-white text-xs px-3 py-1 h-7 font-rum-raisin">
                    <PlusIcon className="w-2.5 h-2.5 mr-1" />
                    Follow
                  </Button>
                )}
                <div className="bg-black/60 px-2 py-1 rounded-full">
                  <span className="text-white text-xs font-rum-raisin">Level {post.user.level}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-white/90 text-xs mt-1">
                <span 
                  className="cursor-pointer hover:underline font-rum-raisin" 
                  onClick={() => onSelectRestaurant?.(post.restaurant.id)}
                >
                  {post.restaurant.name}
                </span>
                <StarIcon className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                <span className="font-rum-raisin">{post.restaurant.rating}</span>
              </div>
            </div>
          </div>
          
          {/* Review info section */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-white">
              <div className="bg-red-600/80 px-3 py-1 rounded-full">
                <span className="text-lg font-bold font-rum-raisin">{post.review.rating}/10</span>
              </div>
              <div className="bg-yellow-500/80 px-3 py-1 rounded-full">
                <span className="text-black font-bold font-rum-raisin">{post.review.price}</span>
              </div>
            </div>
            <p className="text-white text-sm leading-relaxed line-clamp-2">{post.review.text}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {post.review.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-blue-300 text-xs bg-blue-900/30 px-2 py-1 rounded-full font-rum-raisin">
                  {tag}
                </span>
              ))}
              {post.review.tags.length > 3 && (
                <span className="text-white/60 text-xs font-rum-raisin">+{post.review.tags.length - 3} more</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRestaurantPost = (post: RestaurantPost) => (
    <div 
      className="relative w-full h-full bg-black overflow-hidden"
      onDoubleClick={() => handleDoubleTap(post.id)}
    >
      {post.mediaType === 'video' ? (
        <video 
          src={post.mediaUrl} 
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <img 
          src={post.mediaUrl} 
          alt="Restaurant post"
          className="w-full h-full object-cover"
        />
      )}

      {/* Bottom overlay with restaurant profile and dish info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-20">
        <div className="space-y-3 max-w-full">
          {/* Restaurant profile section */}
          <div className="flex items-center gap-2 mb-3">
            <div className="relative">
              <ConsistentAvatar
                src={post.restaurant.avatar}
                alt={post.restaurant.name}
                fallback={post.restaurant.name[0]}
                size="sm"
                variant="default"
                onClick={() => onSelectRestaurant?.(post.restaurant.id)}
              />
              <div className="absolute -bottom-1 -right-1 bg-red-600 rounded-full px-2 py-0.5">
                <div className="flex items-center gap-1">
                  <StarIcon className="w-2 h-2 text-yellow-400 fill-current" />
                  <span className="text-white text-xs font-bold font-rum-raisin">{post.restaurant.rating}</span>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span 
                  className="text-white font-semibold text-sm cursor-pointer hover:underline truncate" 
                  onClick={() => onSelectRestaurant?.(post.restaurant.id)}
                >
                  {post.restaurant.name}
                </span>
                {post.restaurant.isVerified && (
                  <CheckCircle className="w-3 h-3 text-blue-400 fill-current flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-1 text-white/90 text-xs mt-1">
                <span className="font-rum-raisin truncate">{post.restaurant.cuisineTypes.join(' • ')}</span>
                {post.restaurant.isOpen && (
                  <Badge variant="secondary" className="text-xs bg-green-600 text-white ml-1 font-rum-raisin">
                    Open
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Dish info section */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-white">
              <div className="bg-black/60 px-3 py-1 rounded-full">
                <span className="text-lg font-bold font-rum-raisin">{post.dish.name}</span>
              </div>
              <div className="bg-yellow-500/80 px-3 py-1 rounded-full">
                <span className="text-black font-bold font-rum-raisin">{post.dish.price}</span>
              </div>
            </div>
            <div className="text-white/90 text-sm">
              <span className="">{post.dish.calories} cal • {post.dish.description}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {post.dish.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-blue-300 text-xs bg-blue-900/30 px-2 py-1 rounded-full font-rum-raisin">
                  {tag}
                </span>
              ))}
              {post.dish.tags.length > 3 && (
                <span className="text-white/60 text-xs font-rum-raisin">+{post.dish.tags.length - 3} more</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdPost = (post: AdPost) => (
    <div 
      className="relative w-full h-full bg-black overflow-hidden"
      onDoubleClick={() => handleDoubleTap(post.id)}
    >
      <img 
        src={post.mediaUrl} 
        alt="Sponsored post"
        className="w-full h-full object-cover"
      />
      
      {/* Sponsored tag */}
      <div className="absolute top-4 left-3">
        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold font-rum-raisin">
          Sponsored • {post.distance} mi
        </Badge>
      </div>

      {/* Bottom overlay with restaurant profile and promotion */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-20">
        <div className="space-y-3 max-w-full">
          {/* Restaurant profile section */}
          <div className="flex items-center gap-2 mb-3">
            <ConsistentAvatar
              src={post.restaurant.avatar}
              alt={post.restaurant.name}
              fallback={post.restaurant.name[0]}
              size="sm"
              variant="default"
              onClick={() => onSelectRestaurant?.(post.restaurant.id)}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span 
                  className="text-white font-semibold text-sm cursor-pointer hover:underline truncate" 
                  onClick={() => onSelectRestaurant?.(post.restaurant.id)}
                >
                  {post.restaurant.name}
                </span>
                {post.restaurant.isVerified && (
                  <CheckCircle className="w-3 h-3 text-blue-400 fill-current flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-1 text-white/90 text-xs mt-1">
                <StarIcon className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                <span className="font-rum-raisin">{post.restaurant.rating}</span>
              </div>
            </div>
          </div>
          
          {/* Promotion section */}
          <div className="space-y-3">
            <p className="text-white text-base font-bold">{post.promotion.text}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold font-rum-raisin">
                +{post.promotion.likCoinReward} Lik Coins
              </Badge>
              {post.promotion.questAvailable && (
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold font-rum-raisin">
                  Quest Available (+{post.promotion.xpBonus} XP)
                </Badge>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" className="glossy-red-pill text-white font-rum-raisin">
                <PuzzlePieceIcon className="w-3.5 h-3.5 mr-1" />
                Start Quest
              </Button>
              <Button size="sm" className="bg-white/90 hover:bg-white text-black font-rum-raisin">
                <ShoppingCartIcon className="w-3.5 h-3.5 mr-1" />
                Order Now
              </Button>
            </div>
            {post.challenge && (
              <div className="bg-gradient-to-r from-red-600/80 to-pink-600/80 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-yellow-300 text-sm font-bold font-rum-raisin">{post.challenge.name}</p>
                <p className="text-white/90 text-xs font-rum-raisin mt-1">{post.challenge.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = (post: UserPost | RestaurantPost | AdPost) => {
    switch (post.type) {
      case 'user_post':
        return renderUserPost(post);
      case 'restaurant_post':
        return renderRestaurantPost(post);
      case 'ad':
        return renderAdPost(post);
      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-black relative overflow-hidden">
      {/* Fixed top navigation */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent pt-[max(48px,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between p-3">
          {/* Tab selector */}
          <div className="flex items-center gap-4">
            {['following', 'trending', 'foryou'].map((tab) => (
              <Button
                key={tab}
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "text-white text-sm px-3 py-2 font-rum-raisin transition-all duration-200",
                  activeTab === tab 
                    ? "font-bold border-b-2 border-white rounded-none bg-white/10" 
                    : "font-normal hover:bg-white/5"
                )}
              >
                {tab === 'foryou' ? 'For You' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
          
          {/* Right icons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white p-2 hover:bg-white/10 rounded-full" onClick={() => onNavigate('map')}>
              <MapPin className="w-4.5 h-4.5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white p-2 hover:bg-white/10 rounded-full" onClick={() => onNavigate('liktv')}>
              <TvIcon className="h-[18px] w-[18px]" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white p-2 hover:bg-white/10 rounded-full" onClick={() => onNavigate('trending-search')}>
              <MagnifyingGlassIcon className="h-[18px] w-[18px]" />
            </Button>
          </div>
        </div>
      </div>
      {/* Scrollable content container */}
      <div 
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
      >
        {content.map((post, index) => (
          <div key={post.id} className="w-full h-full snap-start relative">
            {renderContent(post)}
            
            {/* Right side action panel - optimized for mobile */}
            {index === currentIndex && (
              <div className="absolute right-2 bottom-16 flex flex-col items-center gap-4 z-10">
                <div className="flex flex-col items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onNavigate('leaderboard')}
                    className="w-11 h-11 rounded-full touch-feedback text-white bg-black/40 backdrop-blur-sm hover:bg-black/60"
                  >
                    <img 
                      src={HeartIcon} 
                      alt="Heart" 
                      className="w-5 h-5"
                    />
                  </Button>
                  <span className="text-white text-xs font-rum-raisin bg-black/40 px-1 rounded">200</span>
                </div>
                
                <div className="flex flex-col items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleComment(post.id)}
                    className="w-11 h-11 rounded-full text-white touch-feedback bg-black/40 backdrop-blur-sm hover:bg-black/60"
                  >
                    <img 
                      src={CommentIcon} 
                      alt="Comment" 
                      className="w-5 h-5"
                    />
                  </Button>
                  <span className="text-white text-xs font-rum-raisin bg-black/40 px-1 rounded">{post.comments}</span>
                </div>
                
                <div className="flex flex-col items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSave(post.id)}
                    className={cn(
                      "w-11 h-11 rounded-full touch-feedback bg-black/40 backdrop-blur-sm hover:bg-black/60",
                      post.isSaved ? "text-yellow-400" : "text-white"
                    )}
                  >
                    <img 
                      src={BookmarkIcon} 
                      alt="Bookmark" 
                      className={cn(
                        "w-5 h-5",
                        post.isSaved ? "brightness-0 saturate-100 invert-[.65] sepia-[1] saturate-[3] hue-rotate-[20deg]" : ""
                      )}
                    />
                  </Button>
                  <span className="text-white text-xs font-rum-raisin bg-black/40 px-1 rounded">{post.saves}</span>
                </div>
                
                <div className="flex flex-col items-center gap-1">
                  <Button variant="ghost" size="sm" className="w-11 h-11 rounded-full text-white touch-feedback bg-black/40 backdrop-blur-sm hover:bg-black/60">
                    <img 
                      src={ShareIcon} 
                      alt="Share" 
                      className="w-5 h-5"
                    />
                  </Button>
                  <span className="text-white text-xs font-rum-raisin bg-black/40 px-1 rounded">{post.shares}</span>
                </div>
              </div>
            )}

            {/* Bottom info bar - positioned to not overlap content */}
            {index === currentIndex && (
              <div className="absolute bottom-2 left-3 right-16 z-10">
                <div className="flex items-center justify-between bg-black/40 backdrop-blur-sm rounded-full px-3 py-2">
                  <div className="flex items-center gap-2 text-white/90 text-xs min-w-0">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate font-rum-raisin">{post.location}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <img src={LikLogoHeart} alt="Lik Logo" className="w-3 h-3" />
                    <span className="text-white text-xs font-rum-raisin">Liked By</span>
                    <div className="flex items-center -space-x-1">
                      {post.likedBy.slice(0, 2).map((user, index) => (
                        <ConsistentAvatar
                          key={user.id}
                          src={user.avatar}
                          alt={user.displayName}
                          fallback={user.displayName[0]}
                          size="xs"
                          variant="default"
                          className="border border-white cursor-pointer hover:scale-110 transition-transform"
                          onClick={() => {
                            onSelectUser?.(user.id);
                            onNavigate('user-profile');
                          }}
                        />
                      ))}
                      {post.likedBy.length > 2 && (
                        <div className="w-5 h-5 rounded-full bg-black/60 border border-white flex items-center justify-center">
                          <span className="text-white text-xs font-rum-raisin">+{post.likedBy.length - 2}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Content indicators - repositioned for mobile */}
      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex flex-col gap-1 z-10">
        {content.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-0.5 h-6 rounded-full transition-all duration-300",
              index === currentIndex ? "bg-white shadow-lg" : "bg-white/40"
            )}
          />
        ))}
      </div>
      {/* Comment Modal */}
      {selectedPostId && (
        <CommentModal
          isOpen={showCommentModal}
          onClose={() => {
            setShowCommentModal(false);
            setSelectedPostId(null);
          }}
          postId={selectedPostId}
          postAuthor={mockUsers[0]}
          deviceType="phone"
          onUserClick={onSelectUser}
        />
      )}
    </div>
  );
}