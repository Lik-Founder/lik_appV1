import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConsistentAvatar } from '@/components/ui/consistent-avatar';
import { CommentModal } from '@/components/CommentModal';
import { 
  ChatCircle, 
  MapPin,
  MagnifyingGlass,
  Television,
  Plus,
  Star,
  Timer,
  GameController,
  ShoppingCart,
  Medal,
  CheckCircle
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useKV } from '@github/spark/hooks';
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
    user: { ...mockUsers[0], level: 12 },
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
    user: { ...mockUsers[1], level: 8 },
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
  onShowRestaurantProfile?: (restaurantId: string) => void;
  onShowUserProfile?: (userId: string) => void;
  onShowSearch?: () => void;
  onShowLeaderboard?: () => void;
  onShowLikTV?: () => void;
}

export function TrendingPage({ onShowRestaurantProfile, onShowUserProfile, onShowSearch, onShowLeaderboard, onShowLikTV }: TrendingPageProps) {
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
      className="relative w-full h-full bg-black"
      onDoubleClick={() => handleDoubleTap(post.id)}
    >
      <img 
        src={post.mediaUrl} 
        alt="User post"
        className="w-full h-full object-cover"
      />

      {/* Bottom overlay with user profile and review info */}
      <div className="absolute bottom-12 left-0 right-16 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="space-y-3">
          {/* User profile section */}
          <div className="flex items-center gap-3">
            <ConsistentAvatar
              src={post.user.avatar}
              alt={post.user.displayName}
              fallback={post.user.displayName[0]}
              size="md"
              variant="xp-ring"
              level={post.user.level}
              xpProgress={0.75} // Mock XP progress
              onClick={() => onShowUserProfile?.(post.user.id)}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span 
                  className="text-white font-medium text-sm cursor-pointer hover:underline" 
                  onClick={() => onShowUserProfile?.(post.user.id)}
                >
                  {post.user.displayName}
                </span>
              </div>
              <div className="flex items-center gap-1 text-white/80 text-xs">
                <span 
                  className="cursor-pointer hover:underline" 
                  onClick={() => onShowRestaurantProfile?.(post.restaurant.id)}
                >
                  {post.restaurant.name}
                </span>
                <Star size={10} className="text-yellow-400 fill-current" />
                <span>{post.restaurant.rating}</span>
              </div>
            </div>
            {!post.user.isFollowing && (
              <Button size="sm" className="bg-white text-black hover:bg-white/90 text-xs px-2 py-1 h-7">
                <Plus size={12} className="mr-1" />
                Follow
              </Button>
            )}
          </div>
          
          {/* Review info section */}
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-white">
              <span className="text-lg font-bold">{post.review.rating}/10</span>
              <span className="text-yellow-400 font-medium">{post.review.price}</span>
            </div>
            <p className="text-white text-sm leading-relaxed">{post.review.text}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {post.review.tags.map((tag, index) => (
                <span key={index} className="text-blue-300 text-sm">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRestaurantPost = (post: RestaurantPost) => (
    <div 
      className="relative w-full h-full bg-black"
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
      <div className="absolute bottom-12 left-0 right-16 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="space-y-3">
          {/* Restaurant profile section */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <ConsistentAvatar
                src={post.restaurant.avatar}
                alt={post.restaurant.name}
                fallback={post.restaurant.name[0]}
                size="md"
                variant="default"
                onClick={() => onShowRestaurantProfile?.(post.restaurant.id)}
              />
              <div className="absolute -bottom-1 -right-1 bg-black rounded-full px-1">
                <div className="flex items-center gap-1">
                  <Star size={10} className="text-yellow-400 fill-current" />
                  <span className="text-white text-xs">{post.restaurant.rating}</span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span 
                  className="text-white font-medium text-sm cursor-pointer hover:underline" 
                  onClick={() => onShowRestaurantProfile?.(post.restaurant.id)}
                >
                  {post.restaurant.name}
                </span>
                {post.restaurant.isVerified && (
                  <CheckCircle size={14} className="text-blue-400 fill-current" />
                )}
              </div>
              <div className="flex items-center gap-2 text-white/80 text-xs">
                <span>{post.restaurant.cuisineTypes.join(' • ')}</span>
                {post.restaurant.isOpen && (
                  <Badge variant="secondary" className="text-xs bg-green-600 text-white">Open Now</Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Dish info section */}
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-white">
              <span className="text-lg font-bold">{post.dish.name}</span>
              <span className="text-yellow-400 font-medium">{post.dish.price}</span>
            </div>
            <div className="text-white/80 text-sm">
              <span>{post.dish.calories} cal • {post.dish.description}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {post.dish.tags.map((tag, index) => (
                <span key={index} className="text-blue-300 text-sm">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdPost = (post: AdPost) => (
    <div 
      className="relative w-full h-full bg-black"
      onDoubleClick={() => handleDoubleTap(post.id)}
    >
      <img 
        src={post.mediaUrl} 
        alt="Sponsored post"
        className="w-full h-full object-cover"
      />
      
      {/* Sponsored tag */}
      <div className="absolute top-4 left-4">
        <Badge className="bg-yellow-500 text-black">
          Sponsored • {post.distance} miles away
        </Badge>
      </div>

      {/* Bottom overlay with restaurant profile and promotion */}
      <div className="absolute bottom-12 left-0 right-16 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="space-y-3">
          {/* Restaurant profile section */}
          <div className="flex items-center gap-3">
            <ConsistentAvatar
              src={post.restaurant.avatar}
              alt={post.restaurant.name}
              fallback={post.restaurant.name[0]}
              size="md"
              variant="default"
              onClick={() => onShowRestaurantProfile?.(post.restaurant.id)}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span 
                  className="text-white font-medium text-sm cursor-pointer hover:underline" 
                  onClick={() => onShowRestaurantProfile?.(post.restaurant.id)}
                >
                  {post.restaurant.name}
                </span>
                {post.restaurant.isVerified && (
                  <CheckCircle size={14} className="text-blue-400 fill-current" />
                )}
              </div>
              <div className="flex items-center gap-1 text-white/80 text-xs">
                <Star size={10} className="text-yellow-400 fill-current" />
                <span>{post.restaurant.rating}</span>
              </div>
            </div>
          </div>
          
          {/* Promotion section */}
          <div className="space-y-3">
            <p className="text-white text-lg font-medium">{post.promotion.text}</p>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-500 text-black">
                +{post.promotion.likCoinReward} Lik Coins
              </Badge>
              {post.promotion.questAvailable && (
                <Badge className="bg-purple-600 text-white">
                  Quest Available (+{post.promotion.xpBonus} XP)
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-primary text-primary-foreground">
                <GameController size={16} className="mr-1" />
                Start Quest
              </Button>
              <Button size="sm" variant="secondary">
                <ShoppingCart size={16} className="mr-1" />
                Order Now
              </Button>
            </div>
            {post.challenge && (
              <div className="bg-black/50 rounded-lg p-2 mb-2">
                <p className="text-yellow-400 text-sm font-medium">{post.challenge.name}</p>
                <p className="text-white/80 text-xs">{post.challenge.description}</p>
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
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center justify-between p-2 sm:p-4">
          {/* Tab selector */}
          <div className="flex items-center gap-1 sm:gap-4">
            {['following', 'trending', 'foryou'].map((tab) => (
              <Button
                key={tab}
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "text-white text-xs sm:text-sm px-2 sm:px-4 nav-rum-raisin",
                  activeTab === tab 
                    ? "font-bold border-b-2 border-white rounded-none font-semibold" 
                    : "font-light"
                )}
              >
                {tab === 'foryou' ? 'For You' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
          
          {/* Right icons */}
          <div className="flex items-center gap-1 sm:gap-3">
            <Button variant="ghost" size="sm" className="text-white p-1 sm:p-2">
              <MapPin size={16} className="sm:w-5 sm:h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white p-1 sm:p-2" onClick={onShowLikTV}>
              <Television size={16} className="sm:w-5 sm:h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white p-1 sm:p-2" onClick={onShowSearch}>
              <MagnifyingGlass size={16} className="sm:w-5 sm:h-5" />
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
            
            {/* Right side action panel - only show on current item */}
            {index === currentIndex && (
              <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onShowLeaderboard?.()}
                    className="w-12 h-12 rounded-full touch-feedback text-white"
                  >
                    <img 
                      src={HeartIcon} 
                      alt="Heart" 
                      className="w-6 h-6"
                    />
                  </Button>
                  <span className="text-white text-xs">Rank</span>
                </div>
                
                <div className="flex flex-col items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleComment(post.id)}
                    className="w-12 h-12 rounded-full text-white touch-feedback"
                  >
                    <img 
                      src={CommentIcon} 
                      alt="Comment" 
                      className="w-6 h-6"
                    />
                  </Button>
                  <span className="text-white text-xs">{post.comments}</span>
                </div>
                
                <div className="flex flex-col items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSave(post.id)}
                    className={cn(
                      "w-12 h-12 rounded-full touch-feedback",
                      post.isSaved ? "text-yellow-400" : "text-white"
                    )}
                  >
                    <img 
                      src={BookmarkIcon} 
                      alt="Bookmark" 
                      className={cn(
                        "w-6 h-6",
                        post.isSaved ? "brightness-0 saturate-100 invert-[.65] sepia-[1] saturate-[3] hue-rotate-[20deg]" : ""
                      )}
                    />
                  </Button>
                  <span className="text-white text-xs">{post.saves}</span>
                </div>
                
                <div className="flex flex-col items-center gap-1">
                  <Button variant="ghost" size="sm" className="w-12 h-12 rounded-full text-white touch-feedback">
                    <img 
                      src={ShareIcon} 
                      alt="Share" 
                      className="w-6 h-6"
                    />
                  </Button>
                  <span className="text-white text-xs">{post.shares}</span>
                </div>
              </div>
            )}

            {/* Bottom info bar - only show on current item */}
            {index === currentIndex && (
              <div className="absolute bottom-4 left-4 right-20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <MapPin size={16} />
                    <span>{post.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={LikLogoHeart} alt="Lik Logo" className="w-4 h-4" />
                    <span className="text-white text-sm font-medium nav-rum-raisin">Liked By</span>
                    <div className="flex items-center -space-x-2 ml-2">
                      {post.likedBy.slice(0, 3).map((user, index) => (
                        <ConsistentAvatar
                          key={user.id}
                          src={user.avatar}
                          alt={user.displayName}
                          fallback={user.displayName[0]}
                          size="xs"
                          variant="default"
                          className="border-2 border-black cursor-pointer hover:scale-110 transition-transform"
                          onClick={() => onShowUserProfile?.(user.id)}
                        />
                      ))}
                      {post.likedBy.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-black/50 border-2 border-black flex items-center justify-center">
                          <span className="text-white text-xs">+{post.likedBy.length - 3}</span>
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

      {/* Content indicators */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
        {content.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-1 h-8 rounded-full transition-all duration-300",
              index === currentIndex ? "bg-white" : "bg-white/30"
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
          postAuthor={mockUsers[0]} // You could make this dynamic based on the selected post
          deviceType="phone" // TrendingPage is mobile-first
          onUserClick={onShowUserProfile}
        />
      )}
    </div>
  );
}