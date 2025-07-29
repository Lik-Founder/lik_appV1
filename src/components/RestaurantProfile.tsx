import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { useDevice } from '@/hooks/use-device';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Trophy,
  Share,
  Heart,
  Eye,
  MapPin,
  Star,
  Phone,
  MessageCircle,
  Calendar,
  Play,
  DotsThree,
  Camera,
  Plus
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface RestaurantProfileProps {
  restaurantId: string;
  onBack: () => void;
}

interface Restaurant {
  id: string;
  name: string;
  coverImage: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  views: number;
  likes: number;
  mealsServed: number;
  location: string;
  ranking: {
    position: number;
    category: string;
    location: string;
  };
  awards: Award[];
  isFollowing: boolean;
  followerCount: number;
}

interface Award {
  id: string;
  name: string;
  icon: string;
  year?: number;
  description: string;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userLevel: number;
  rating: number;
  price: string;
  text: string;
  tags: string[];
  images: string[];
  videos: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  timestamp: number;
  location: string;
  likedBy: { id: string; avatar: string; name: string }[];
}

interface RestaurantPost {
  id: string;
  type: 'promotion' | 'behind_scenes' | 'new_dish' | 'special';
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  likes: number;
  comments: number;
  shares: number;
  timestamp: number;
  isLiked: boolean;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  image: string;
  category: string;
  hasArPreview: boolean;
  isPopular: boolean;
  tags: string[];
}

export function RestaurantProfile({ restaurantId, onBack }: RestaurantProfileProps) {
  const [restaurant, setRestaurant] = useKV<Restaurant>(`restaurant-${restaurantId}`, generateMockRestaurant(restaurantId));
  const [reviews, setReviews] = useKV<Review[]>(`restaurant-reviews-${restaurantId}`, generateMockReviews());
  const [posts, setPosts] = useKV<RestaurantPost[]>(`restaurant-posts-${restaurantId}`, generateMockPosts());
  const [menuItems, setMenuItems] = useKV<MenuItem[]>(`restaurant-menu-${restaurantId}`, generateMockMenu());
  const [activeTab, setActiveTab] = useState<'reviews' | 'posts' | 'menu'>('reviews');
  const device = useDevice();

  const handleLikeReview = (reviewId: string) => {
    setReviews(current =>
      current.map(review =>
        review.id === reviewId
          ? { ...review, isLiked: !review.isLiked, likes: review.isLiked ? review.likes - 1 : review.likes + 1 }
          : review
      )
    );
  };

  const handleLikePost = (postId: string) => {
    setPosts(current =>
      current.map(post =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const handleFollow = () => {
    setRestaurant(current => ({
      ...current,
      isFollowing: !current.isFollowing,
      followerCount: current.isFollowing ? current.followerCount - 1 : current.followerCount + 1
    }));
    toast.success(restaurant.isFollowing ? 'Unfollowed' : 'Following!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: restaurant.name,
        text: `Check out ${restaurant.name} on Lik!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleReserve = () => {
    toast.info('Opening reservation system...');
  };

  const handleCall = () => {
    toast.info('Calling restaurant...');
  };

  const handleMessage = () => {
    toast.info('Opening message...');
  };

  const padding = device.type === 'tablet' ? 'p-6' : 'p-4';

  return (
    <div className="h-full bg-background overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
        
        {/* Top Overlay */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 safe-top">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="bg-black/50 hover:bg-black/70 text-white h-10 w-10 p-0 rounded-full backdrop-blur-sm"
          >
            <ArrowLeft size={18} />
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white h-10 w-10 p-0 rounded-full backdrop-blur-sm"
            >
              <Trophy size={18} />
            </Button>
            <Button
              onClick={handleShare}
              variant="ghost"
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white h-10 w-10 p-0 rounded-full backdrop-blur-sm"
            >
              <Share size={18} />
            </Button>
          </div>
        </div>

        {/* Ranking Badge */}
        <div className="absolute top-16 left-4 right-4 safe-top">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 font-medium">
            #{restaurant.ranking.position} {restaurant.ranking.category} in {restaurant.ranking.location}
          </Badge>
        </div>

        {/* Awards Row */}
        <div className="absolute top-28 left-4 right-4 safe-top">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {restaurant.awards.map((award) => (
              <div
                key={award.id}
                className="flex-shrink-0 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2"
              >
                <span className="text-white text-xs">{award.icon}</span>
                <span className="text-white text-xs font-medium">{award.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Restaurant Summary Panel */}
      <div className={cn("bg-background border-b border-border", padding)}>
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 border-2 border-border">
            <AvatarImage src={restaurant.avatar} />
            <AvatarFallback>{restaurant.name[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold truncate">{restaurant.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={cn(
                    i < Math.floor(restaurant.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  )}
                />
              ))}
              <span className="ml-2 font-semibold">{restaurant.rating}</span>
              <span className="text-muted-foreground">({restaurant.reviewCount})</span>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye size={16} />
                <span>{restaurant.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart size={16} />
                <span>{restaurant.likes.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🍽️</span>
                <span>{restaurant.mealsServed.toLocaleString()}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
              <MapPin size={16} />
              <span>{restaurant.location}</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3 mt-4">
          <Button
            onClick={handleMessage}
            variant="outline"
            className="flex-1"
          >
            <MessageCircle size={16} className="mr-2" />
            Message
          </Button>
          <Button
            onClick={handleReserve}
            variant="outline"
            className="flex-1"
          >
            <Calendar size={16} className="mr-2" />
            Reserve
          </Button>
          <Button
            onClick={handleCall}
            variant="outline"
            className="flex-1"
          >
            <Phone size={16} className="mr-2" />
            Call
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="w-full justify-start h-12 bg-transparent p-0">
            <TabsTrigger
              value="reviews"
              className="flex-1 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="posts"
              className="flex-1 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="menu"
              className="flex-1 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Menu
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {activeTab === 'reviews' && (
          <ReviewsSection
            reviews={reviews}
            onLikeReview={handleLikeReview}
            padding={padding}
          />
        )}
        {activeTab === 'posts' && (
          <PostsSection
            posts={posts}
            onLikePost={handleLikePost}
            padding={padding}
          />
        )}
        {activeTab === 'menu' && (
          <MenuSection
            menuItems={menuItems}
            padding={padding}
          />
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border safe-bottom">
        <div className={cn("flex gap-3", padding, "py-3")}>
          <Button
            onClick={handleFollow}
            variant={restaurant.isFollowing ? "outline" : "default"}
            className="flex-1"
          >
            <Plus size={16} className="mr-2" />
            {restaurant.isFollowing ? 'Following' : 'Follow'}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
          >
            <Star size={16} className="mr-2" />
            Review
          </Button>
          <Button
            variant="outline"
            className="flex-1"
          >
            <Heart size={16} className="mr-2" />
            Favorite
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ReviewsSectionProps {
  reviews: Review[];
  onLikeReview: (reviewId: string) => void;
  padding: string;
}

function ReviewsSection({ reviews, onLikeReview, padding }: ReviewsSectionProps) {
  return (
    <div className={cn("space-y-4", padding, "pb-20")}>
      {reviews.map((review) => (
        <div key={review.id} className="bg-card rounded-lg border border-border overflow-hidden">
          {/* Media */}
          {(review.images.length > 0 || review.videos.length > 0) && (
            <div className="aspect-video bg-muted relative">
              {review.videos.length > 0 ? (
                <div className="relative w-full h-full">
                  <img
                    src={review.images[0] || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop'}
                    alt="Review"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="bg-black/50 hover:bg-black/70 text-white rounded-full w-16 h-16"
                    >
                      <Play size={24} className="fill-current" />
                    </Button>
                  </div>
                </div>
              ) : (
                <img
                  src={review.images[0]}
                  alt="Review"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}

          <div className="p-4">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={review.userAvatar} />
                <AvatarFallback>{review.userName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{review.userName}</span>
                  <Badge variant="secondary" className="text-xs">
                    Level {review.userLevel}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={cn(
                        i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                      )}
                    />
                  ))}
                  <span className="ml-2 text-sm font-semibold">{review.rating}/10</span>
                  <span className="text-sm text-muted-foreground">• {review.price}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <DotsThree size={16} />
              </Button>
            </div>

            {/* Review Text */}
            <p className="text-sm mb-3">{review.text}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {review.tags.map((tag, index) => (
                <span key={index} className="text-blue-500 text-sm">{tag}</span>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin size={12} />
                <span>{review.location}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-1">
                    {review.likedBy.slice(0, 3).map((user, i) => (
                      <Avatar key={user.id} className="w-6 h-6 border-2 border-background">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xs">{user.name[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">Liked By</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLikeReview(review.id)}
                  className="h-8 p-2"
                >
                  <Heart
                    size={16}
                    className={cn(
                      "transition-colors",
                      review.isLiked ? "text-red-500 fill-current" : "text-muted-foreground"
                    )}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface PostsSectionProps {
  posts: RestaurantPost[];
  onLikePost: (postId: string) => void;
  padding: string;
}

function PostsSection({ posts, onLikePost, padding }: PostsSectionProps) {
  return (
    <div className={cn("space-y-4", padding, "pb-20")}>
      {posts.map((post) => (
        <div key={post.id} className="bg-card rounded-lg border border-border overflow-hidden">
          {/* Media */}
          <div className="aspect-video bg-muted relative">
            {post.mediaType === 'video' ? (
              <div className="relative w-full h-full">
                <img
                  src={post.mediaUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="bg-black/50 hover:bg-black/70 text-white rounded-full w-16 h-16"
                  >
                    <Play size={24} className="fill-current" />
                  </Button>
                </div>
              </div>
            ) : (
              <img
                src={post.mediaUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{post.description}</p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "ml-2",
                  post.type === 'promotion' && "border-orange-500 text-orange-500",
                  post.type === 'new_dish' && "border-green-500 text-green-500",
                  post.type === 'special' && "border-purple-500 text-purple-500",
                  post.type === 'behind_scenes' && "border-blue-500 text-blue-500"
                )}
              >
                {post.type.replace('_', ' ')}
              </Badge>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground">
                {new Date(post.timestamp).toLocaleDateString()}
              </span>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLikePost(post.id)}
                  className="h-8 p-2 flex items-center gap-1"
                >
                  <Heart
                    size={16}
                    className={cn(
                      "transition-colors",
                      post.isLiked ? "text-red-500 fill-current" : "text-muted-foreground"
                    )}
                  />
                  <span className="text-sm">{post.likes}</span>
                </Button>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MessageCircle size={16} />
                  <span>{post.comments}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface MenuSectionProps {
  menuItems: MenuItem[];
  padding: string;
}

function MenuSection({ menuItems, padding }: MenuSectionProps) {
  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className={cn("pb-20", padding)}>
      {categories.map((category) => (
        <div key={category} className="mb-6">
          <h3 className="text-lg font-semibold mb-3">{category}</h3>
          <div className="space-y-3">
            {menuItems
              .filter(item => item.category === category)
              .map((item) => (
                <div key={item.id} className="bg-card rounded-lg border border-border overflow-hidden">
                  <div className="flex">
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{item.name}</h4>
                            {item.isPopular && (
                              <Badge variant="secondary" className="text-xs">Popular</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-lg font-bold">${item.price}</span>
                            <span className="text-sm text-muted-foreground">{item.calories} cal</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.map((tag, index) => (
                              <span key={index} className="text-xs text-blue-500">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {item.hasArPreview && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                        >
                          <Camera size={14} className="mr-2" />
                          AR Preview
                        </Button>
                      )}
                    </div>
                    
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Mock data generators
function generateMockRestaurant(id: string): Restaurant {
  return {
    id,
    name: 'Bella Italia',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&h=150&fit=crop',
    rating: 4.7,
    reviewCount: 1247,
    views: 15420,
    likes: 3829,
    mealsServed: 12450,
    location: '456 Food Ave, Midtown',
    ranking: {
      position: 3,
      category: 'Italian',
      location: 'NYC'
    },
    awards: [
      { id: '1', name: 'Michelin Star', icon: '⭐', year: 2023, description: 'Michelin starred restaurant' },
      { id: '2', name: 'Lik Award 2024', icon: '🏆', year: 2024, description: 'Best Italian cuisine' },
      { id: '3', name: 'Eco Certified', icon: '🌱', description: 'Sustainable practices' }
    ],
    isFollowing: false,
    followerCount: 15420
  };
}

function generateMockReviews(): Review[] {
  const reviews = [
    {
      id: '1',
      userId: 'user1',
      userName: 'Marco_Foodie',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      userLevel: 12,
      rating: 9,
      price: '$25',
      text: 'The salmon was perfectly flaky and the risotto was creamy perfection. The atmosphere is cozy and romantic, perfect for date night!',
      tags: ['#LikPick', '#Romantic', '#Seafood', '#DateNight'],
      images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop'],
      videos: [],
      likes: 42,
      comments: 8,
      isLiked: false,
      timestamp: Date.now() - 86400000,
      location: 'Bella Italia, Midtown',
      likedBy: [
        { id: '1', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=50&h=50&fit=crop', name: 'Sarah' },
        { id: '2', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop', name: 'Mike' },
        { id: '3', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop', name: 'Lisa' }
      ]
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'ItalianLover',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=150&h=150&fit=crop',
      userLevel: 8,
      rating: 8,
      price: '$35',
      text: 'Authentic Italian flavors! The pasta is handmade and you can taste the difference. Service was excellent too.',
      tags: ['#Authentic', '#Pasta', '#Handmade'],
      images: ['https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop'],
      videos: [],
      likes: 28,
      comments: 5,
      isLiked: true,
      timestamp: Date.now() - 172800000,
      location: 'Bella Italia, Midtown',
      likedBy: [
        { id: '1', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop', name: 'Tom' },
        { id: '2', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop', name: 'Emma' }
      ]
    }
  ];

  return reviews;
}

function generateMockPosts(): RestaurantPost[] {
  return [
    {
      id: '1',
      type: 'promotion',
      title: 'Late Night Cravings Special',
      description: '30% off all pasta dishes after 9 PM. Perfect for your late night food adventures!',
      mediaUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop',
      mediaType: 'image',
      likes: 156,
      comments: 23,
      shares: 45,
      timestamp: Date.now() - 43200000,
      isLiked: false
    },
    {
      id: '2',
      type: 'new_dish',
      title: 'Introducing Our New Truffle Risotto',
      description: 'Made with premium black truffles from Italy. A limited time delicacy that will transport your taste buds.',
      mediaUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
      mediaType: 'video',
      likes: 203,
      comments: 34,
      shares: 67,
      timestamp: Date.now() - 259200000,
      isLiked: true
    },
    {
      id: '3',
      type: 'behind_scenes',
      title: 'Behind the Scenes: Making Fresh Pasta',
      description: 'Watch our chef Antonio create magic with flour, eggs, and decades of experience.',
      mediaUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&h=400&fit=crop',
      mediaType: 'video',
      likes: 89,
      comments: 12,
      shares: 28,
      timestamp: Date.now() - 432000000,
      isLiked: false
    }
  ];
}

function generateMockMenu(): MenuItem[] {
  return [
    {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Fresh mozzarella, basil, and San Marzano tomatoes on our wood-fired crust',
      price: 18.99,
      calories: 650,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop',
      category: 'Pizza',
      hasArPreview: true,
      isPopular: true,
      tags: ['#Vegetarian', '#Classic']
    },
    {
      id: '2',
      name: 'Truffle Risotto',
      description: 'Creamy Arborio rice with black truffle shavings and Parmigiano-Reggiano',
      price: 32.99,
      calories: 780,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop',
      category: 'Mains',
      hasArPreview: false,
      isPopular: true,
      tags: ['#Truffle', '#Premium', '#Vegetarian']
    },
    {
      id: '3',
      name: 'Osso Buco',
      description: 'Braised veal shanks with saffron risotto and gremolata',
      price: 45.99,
      calories: 920,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop',
      category: 'Mains',
      hasArPreview: true,
      isPopular: false,
      tags: ['#Signature', '#Braised']
    },
    {
      id: '4',
      name: 'Burrata Caprese',
      description: 'Fresh burrata with heirloom tomatoes, basil, and aged balsamic',
      price: 16.99,
      calories: 340,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop',
      category: 'Appetizers',
      hasArPreview: false,
      isPopular: true,
      tags: ['#Fresh', '#Vegetarian']
    },
    {
      id: '5',
      name: 'Tiramisu',
      description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone',
      price: 12.99,
      calories: 420,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=200&h=200&fit=crop',
      category: 'Desserts',
      hasArPreview: false,
      isPopular: true,
      tags: ['#Classic', '#Espresso']
    }
  ];
}