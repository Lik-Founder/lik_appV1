import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { useDevice } from '@/hooks/use-device';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ConsistentAvatar } from '@/components/ui/consistent-avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AwardsPage } from '@/components/AwardsPage';
import { ReservationSystem } from '@/components/ReservationSystem';
import { AvailabilityWidget } from '@/components/AvailabilityWidget';
import { 
  ArrowLeftIcon, 
  BuildingStorefrontIcon, 
  TrophyIcon as Trophy, 
  ShareIcon as Share, 
  EllipsisHorizontalIcon, 
  HeartIcon as Heart, 
  EyeIcon as Eye, 
  ChatBubbleLeftIcon, 
  PlusIcon, 
  CalendarIcon, 
  PhoneIcon as Phone, 
  PlayIcon, 
  XMarkIcon, 
  ArrowRightIcon, 
  CameraIcon, 
  PhotoIcon,
  MapPinIcon as MapPin,
  StarIcon,
  ChatBubbleOvalLeftIcon
} from '@heroicons/react/24/outline';
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

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  category: 'food' | 'interior' | 'exterior' | 'staff' | 'events';
  timestamp: number;
  likes: number;
  isLiked: boolean;
}

export function RestaurantProfile({ restaurantId, onBack }: RestaurantProfileProps) {
  const [restaurant, setRestaurant] = useKV<Restaurant>(`restaurant-${restaurantId}`, generateMockRestaurant(restaurantId));
  const [reviews, setReviews] = useKV<Review[]>(`restaurant-reviews-${restaurantId}`, generateMockReviews());
  const [posts, setPosts] = useKV<RestaurantPost[]>(`restaurant-posts-${restaurantId}`, generateMockPosts());
  const [menuItems, setMenuItems] = useKV<MenuItem[]>(`restaurant-menu-${restaurantId}`, generateMockMenu());
  const [galleryImages, setGalleryImages] = useKV<GalleryImage[]>(`restaurant-gallery-${restaurantId}`, generateMockGallery());
  const [activeTab, setActiveTab] = useState<'reviews' | 'posts' | 'menu' | 'gallery'>('reviews');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showAwardsPage, setShowAwardsPage] = useState(false);
  const [showDeliveryPage, setShowDeliveryPage] = useState(false);
  const [showReservationSystem, setShowReservationSystem] = useState(false);
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

  const handleLikeGalleryImage = (imageId: string) => {
    setGalleryImages(current =>
      current.map(image =>
        image.id === imageId
          ? { ...image, isLiked: !image.isLiked, likes: image.isLiked ? image.likes - 1 : image.likes + 1 }
          : image
      )
    );
  };

  const openImageViewer = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImageViewer = () => {
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return;
    
    if (direction === 'prev') {
      setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : galleryImages.length - 1);
    } else {
      setSelectedImageIndex(selectedImageIndex < galleryImages.length - 1 ? selectedImageIndex + 1 : 0);
    }
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
    setShowReservationSystem(true);
  };

  const handleCall = () => {
    toast.info('Calling restaurant...');
  };

  const handleMessage = () => {
    toast.info('Opening message...');
  };

  const handleShowAwards = () => {
    setShowAwardsPage(true);
  };

  const handleBackFromAwards = () => {
    setShowAwardsPage(false);
  };

  const handleShowDelivery = () => {
    setShowDeliveryPage(true);
  };

  const handleBackFromDelivery = () => {
    setShowDeliveryPage(false);
  };

  const padding = device.type === 'tablet' ? 'p-6' : 'p-4';

  // Show delivery page if requested
  if (showDeliveryPage) {
    return (
      <RestaurantDeliveryPage 
        restaurantId={restaurantId}
        restaurant={restaurant}
        onBack={handleBackFromDelivery}
      />
    );
  }

  // Show reservation system if requested
  if (showReservationSystem) {
    return (
      <ReservationSystem 
        restaurantId={restaurantId}
        restaurantName={restaurant.name}
        onBack={() => setShowReservationSystem(false)}
        onReservationComplete={() => {
          setShowReservationSystem(false);
          // Could navigate to reservation manager here
        }}
      />
    );
  }

  // Show awards page if requested
  if (showAwardsPage) {
    return (
      <AwardsPage 
        restaurantId={restaurantId}
        onBack={handleBackFromAwards}
      />
    );
  }

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
              onClick={handleShowDelivery}
              variant="ghost"
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white h-10 w-10 p-0 rounded-full backdrop-blur-sm"
            >
              <Store size={18} />
            </Button>
            <Button
              onClick={handleShowAwards}
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
          <ConsistentAvatar
            src={restaurant.avatar}
            alt={restaurant.name}
            fallback={restaurant.name[0]}
            size="xl"
            variant="default"
          />
          
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold truncate">{restaurant.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={cn(
                    "h-4 w-4",
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

            {/* Follow and Favorite Buttons */}
            <div className="flex gap-3 mt-3">
              <Button
                onClick={handleFollow}
                variant={restaurant.isFollowing ? "outline" : "default"}
                size="sm"
                className="flex-1"
              >
                <PlusIcon className="h-3.5 w-3.5 mr-2" />
                {restaurant.isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <HeartIcon className="h-3.5 w-3.5 mr-2" />
                Favorite
              </Button>
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
            <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
            Message
          </Button>
          <Button
            onClick={handleReserve}
            variant="outline"
            className="flex-1"
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Reserve
          </Button>
          <Button
            onClick={handleCall}
            variant="outline"
            className="flex-1"
          >
            <PhoneIcon className="h-4 w-4 mr-2" />
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
              value="gallery"
              className="flex-1 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Gallery
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
        {activeTab === 'gallery' && (
          <GallerySection
            images={galleryImages}
            onLikeImage={handleLikeGalleryImage}
            onImageClick={openImageViewer}
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

      {/* Image Viewer Modal */}
      {selectedImageIndex !== null && (
        <ImageViewer
          images={galleryImages}
          currentIndex={selectedImageIndex}
          onClose={closeImageViewer}
          onNavigate={navigateImage}
          onLike={handleLikeGalleryImage}
        />
      )}
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
    <div className={cn("space-y-4", padding, "pb-4")}>
      {/* Live Availability Widget */}
      <AvailabilityWidget restaurantId="bella-italia" className="mx-4" />
      
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
                      <PlayIcon className="h-6 w-6 fill-current" />
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
              <ConsistentAvatar
                src={review.userAvatar}
                alt={review.userName}
                fallback={review.userName[0]}
                size="md"
                variant="xp-ring"
                level={Math.floor(Math.random() * 40) + 10} // Mock levels for reviewers
                xpProgress={Math.random() * 0.8 + 0.2}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{review.userName}</span>
                  <Badge variant="secondary" className="text-xs">
                    Level {review.userLevel}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={cn(
                        "h-3 w-3",
                        i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                      )}
                    />
                  ))}
                  <span className="ml-2 text-sm font-semibold">{review.rating}/10</span>
                  <span className="text-sm text-muted-foreground">• {review.price}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal size={16} />
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
                      <ConsistentAvatar
                        key={user.id}
                        src={user.avatar}
                        alt={user.name}
                        fallback={user.name[0]}
                        size="xs"
                        variant="default"
                        className="border-2 border-background"
                      />
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
    <div className={cn("space-y-4", padding, "pb-4")}>
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
                    <PlayIcon className="h-6 w-6 fill-current" />
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

interface GallerySectionProps {
  images: GalleryImage[];
  onLikeImage: (imageId: string) => void;
  onImageClick: (index: number) => void;
  padding: string;
}

interface ImageViewerProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onLike: (imageId: string) => void;
}

function GallerySection({ images, onLikeImage, onImageClick, padding }: GallerySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = ['all', ...new Set(images.map(img => img.category))];
  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      all: 'All',
      food: 'Food',
      interior: 'Interior',
      exterior: 'Exterior',
      staff: 'Staff',
      events: 'Events'
    };
    return labels[category] || category;
  };

  return (
    <div className={cn("pb-4", padding)}>
      {/* Category Filter */}
      <div className="mb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="flex-shrink-0 capitalize"
            >
              {getCategoryLabel(category)}
            </Button>
          ))}
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {filteredImages.map((image, index) => (
          <div 
            key={image.id}
            className="relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => onImageClick(images.indexOf(image))}
          >
            <img
              src={image.url}
              alt={image.caption}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
              <div className="p-3 w-full">
                <p className="text-white text-sm font-medium line-clamp-2">
                  {image.caption}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-white/20 text-white border-white/30"
                  >
                    {getCategoryLabel(image.category)}
                  </Badge>
                  <div className="flex items-center gap-1 text-white">
                    <Heart 
                      size={14} 
                      className={cn(
                        image.isLiked ? "fill-current text-red-400" : ""
                      )}
                    />
                    <span className="text-xs">{image.likes}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Like indicator */}
            {image.isLiked && (
              <div className="absolute top-2 right-2">
                <HeartIcon className="h-4 w-4 text-red-500 fill-current" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <PhotoIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No images found</h3>
          <p className="text-muted-foreground">
            No images in this category yet.
          </p>
        </div>
      )}
    </div>
  );
}

function ImageViewer({ images, currentIndex, onClose, onNavigate, onLike }: ImageViewerProps) {
  const currentImage = images[currentIndex];

  if (!currentImage) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent safe-top">
        <div className="flex items-center justify-between">
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 h-10 w-10 p-0 rounded-full"
          >
            <X size={20} />
          </Button>
          
          <div className="text-center text-white">
            <span className="text-sm">
              {currentIndex + 1} of {images.length}
            </span>
          </div>
          
          <Button
            onClick={() => onLike(currentImage.id)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 h-10 w-10 p-0 rounded-full"
          >
            <Heart 
              size={20} 
              className={cn(
                currentImage.isLiked ? "fill-current text-red-400" : ""
              )}
            />
          </Button>
        </div>
      </div>

      {/* Main Image */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <img
          src={currentImage.url}
          alt={currentImage.caption}
          className="max-w-full max-h-full object-contain"
        />
        
        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <Button
              onClick={() => onNavigate('prev')}
              variant="ghost"
              size="lg"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 p-0 rounded-full"
            >
              <ArrowLeft size={24} />
            </Button>
            
            <Button
              onClick={() => onNavigate('next')}
              variant="ghost"
              size="lg"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 p-0 rounded-full"
            >
              <ArrowRight size={24} />
            </Button>
          </>
        )}
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/80 to-transparent safe-bottom">
        <div className="text-center text-white">
          <h3 className="font-medium mb-1">{currentImage.caption}</h3>
          <div className="flex items-center justify-center gap-4 text-sm text-white/80">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {currentImage.category}
            </Badge>
            <div className="flex items-center gap-1">
              <Heart size={14} />
              <span>{currentImage.likes} likes</span>
            </div>
            <span>{new Date(currentImage.timestamp).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuSection({ menuItems, padding }: MenuSectionProps) {
  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className={cn("pb-4", padding)}>
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
                          <CameraIcon className="h-3.5 w-3.5 mr-2" />
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

function generateMockGallery(): GalleryImage[] {
  return [
    // Food Images
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=600&fit=crop',
      caption: 'Fresh seafood risotto with perfectly cooked prawns',
      category: 'food',
      timestamp: Date.now() - 86400000,
      likes: 45,
      isLiked: false
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=600&fit=crop',
      caption: 'Handmade pasta with truffle oil and parmesan',
      category: 'food',
      timestamp: Date.now() - 172800000,
      likes: 67,
      isLiked: true
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&h=600&fit=crop',
      caption: 'Wood-fired Margherita pizza with fresh basil',
      category: 'food',
      timestamp: Date.now() - 259200000,
      likes: 89,
      isLiked: false
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=600&fit=crop',
      caption: 'Classic tiramisu with espresso and mascarpone',
      category: 'food',
      timestamp: Date.now() - 345600000,
      likes: 34,
      isLiked: true
    },
    {
      id: '5',
      url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=600&fit=crop',
      caption: 'Braised osso buco with saffron risotto',
      category: 'food',
      timestamp: Date.now() - 432000000,
      likes: 56,
      isLiked: false
    },
    
    // Interior Images
    {
      id: '6',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=600&fit=crop',
      caption: 'Elegant dining room with warm ambient lighting',
      category: 'interior',
      timestamp: Date.now() - 518400000,
      likes: 123,
      isLiked: true
    },
    {
      id: '7',
      url: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&h=600&fit=crop',
      caption: 'Cozy booth seating perfect for intimate dinners',
      category: 'interior',
      timestamp: Date.now() - 604800000,
      likes: 78,
      isLiked: false
    },
    {
      id: '8',
      url: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&h=600&fit=crop',
      caption: 'Open kitchen showcasing our culinary artistry',
      category: 'interior',
      timestamp: Date.now() - 691200000,
      likes: 92,
      isLiked: true
    },
    
    // Exterior Images
    {
      id: '9',
      url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=600&fit=crop',
      caption: 'Beautiful outdoor terrace with garden views',
      category: 'exterior',
      timestamp: Date.now() - 777600000,
      likes: 156,
      isLiked: false
    },
    {
      id: '10',
      url: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=600&h=600&fit=crop',
      caption: 'Charming entrance with traditional Italian architecture',
      category: 'exterior',
      timestamp: Date.now() - 864000000,
      likes: 87,
      isLiked: true
    },
    
    // Staff Images
    {
      id: '11',
      url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&h=600&fit=crop',
      caption: 'Chef Antonio preparing fresh pasta in the kitchen',
      category: 'staff',
      timestamp: Date.now() - 950400000,
      likes: 234,
      isLiked: true
    },
    {
      id: '12',
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop',
      caption: 'Our dedicated team ready to serve you',
      category: 'staff',
      timestamp: Date.now() - 1036800000,
      likes: 145,
      isLiked: false
    },
    
    // Events Images
    {
      id: '13',
      url: 'https://images.unsplash.com/photo-1530062845289-9109b2ca2b35?w=600&h=600&fit=crop',
      caption: 'Wine tasting event featuring local Italian vintages',
      category: 'events',
      timestamp: Date.now() - 1123200000,
      likes: 198,
      isLiked: true
    },
    {
      id: '14',
      url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=600&fit=crop',
      caption: 'Live cooking demonstration with Chef Antonio',
      category: 'events',
      timestamp: Date.now() - 1209600000,
      likes: 167,
      isLiked: false
    },
    {
      id: '15',
      url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&h=600&fit=crop',
      caption: 'Private dining event in our exclusive wine cellar',
      category: 'events',
      timestamp: Date.now() - 1296000000,
      likes: 289,
      isLiked: true
    }
  ];
}

// Restaurant Delivery Page Component
interface RestaurantDeliveryPageProps {
  restaurantId: string;
  restaurant: Restaurant;
  onBack: () => void;
}

interface DeliveryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  cookingTime: string;
  rating: number;
  reviewCount: number;
  isPopular: boolean;
  customizations: string[];
  tags: string[];
}

function RestaurantDeliveryPage({ restaurantId, restaurant, onBack }: RestaurantDeliveryPageProps) {
  const [deliveryItems] = useKV<DeliveryItem[]>(`delivery-items-${restaurantId}`, generateDeliveryItems());
  const [cart, setCart] = useKV<{id: string, quantity: number, customizations: string[]}[]>('delivery-cart', []);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const device = useDevice();

  const categories = ['all', ...new Set(deliveryItems.map(item => item.category))];
  const filteredItems = selectedCategory === 'all' 
    ? deliveryItems 
    : deliveryItems.filter(item => item.category === selectedCategory);

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, cartItem) => {
      const item = deliveryItems.find(i => i.id === cartItem.id);
      return total + (item ? item.price * cartItem.quantity : 0);
    }, 0);
  };

  const addToCart = (itemId: string) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === itemId);
      if (existingItem) {
        return currentCart.map(item =>
          item.id === itemId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...currentCart, { id: itemId, quantity: 1, customizations: [] }];
      }
    });
    toast.success('Added to cart!');
  };

  const removeFromCart = (itemId: string) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return currentCart.map(item =>
          item.id === itemId 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return currentCart.filter(item => item.id !== itemId);
      }
    });
  };

  const getItemQuantity = (itemId: string) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const padding = device.type === 'tablet' ? 'p-6' : 'p-4';

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-border safe-top">
        <div className="flex items-center justify-between p-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 rounded-full"
          >
            <ArrowLeft size={18} />
          </Button>
          
          <div className="text-center">
            <h1 className="font-bold text-lg">{restaurant.name}</h1>
            <p className="text-sm text-muted-foreground">Delivery • 25-35 min</p>
          </div>

          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Restaurant Info Bar */}
        <div className="flex items-center gap-4 px-4 pb-4">
          <ConsistentAvatar
            src={restaurant.avatar}
            alt={restaurant.name}
            fallback={restaurant.name[0]}
            size="lg"
            variant="default"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <StarIcon className="h-3.5 w-3.5 text-yellow-400 fill-current" />
                <span className="font-semibold text-sm">{restaurant.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">$2.99 delivery</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">$15 min</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{restaurant.location}</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex-shrink-0 capitalize"
              >
                {category === 'all' ? 'All Items' : category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className={cn("space-y-4", padding, "pb-24")}>
          {/* Popular Items */}
          {selectedCategory === 'all' && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 nav-rum-raisin">Popular Items</h2>
              <div className="space-y-3">
                {deliveryItems.filter(item => item.isPopular).slice(0, 3).map((item) => (
                  <DeliveryItemCard 
                    key={item.id}
                    item={item}
                    quantity={getItemQuantity(item.id)}
                    onAdd={() => addToCart(item.id)}
                    onRemove={() => removeFromCart(item.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Items by Category */}
          {categories.filter(cat => cat !== 'all').map(category => {
            const categoryItems = filteredItems.filter(item => item.category === category);
            if (categoryItems.length === 0) return null;

            return (
              <div key={category} className="mb-6">
                <h2 className="text-lg font-semibold mb-3 capitalize nav-rum-raisin">{category}</h2>
                <div className="space-y-3">
                  {categoryItems.map((item) => (
                    <DeliveryItemCard 
                      key={item.id}
                      item={item}
                      quantity={getItemQuantity(item.id)}
                      onAdd={() => addToCart(item.id)}
                      onRemove={() => removeFromCart(item.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart Summary - Fixed Bottom */}
      {getCartItemCount() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground p-4 safe-bottom">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold">
                {getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'items'}
              </span>
              <span className="text-primary-foreground/80 ml-2">in cart</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg">
                ${getCartTotal().toFixed(2)}
              </span>
              <Button 
                variant="secondary"
                size="sm"
                className="bg-white text-primary hover:bg-white/90"
              >
                View Cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface DeliveryItemCardProps {
  item: DeliveryItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

function DeliveryItemCard({ item, quantity, onAdd, onRemove }: DeliveryItemCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="flex">
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{item.name}</h3>
                {item.isPopular && (
                  <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-600">
                    Popular
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {item.description}
              </p>
              
              {/* Rating & Cook Time */}
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1">
                  <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{item.rating}</span>
                  <span className="text-xs text-muted-foreground">({item.reviewCount})</span>
                </div>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{item.cookingTime}</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold">${item.price}</span>
                {item.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${item.originalPrice}
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className="text-xs text-blue-500">{tag}</span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Add/Remove Controls */}
          {quantity > 0 ? (
            <div className="flex items-center gap-3">
              <Button
                onClick={onRemove}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
              >
                -
              </Button>
              <span className="font-semibold min-w-[2ch] text-center">{quantity}</span>
              <Button
                onClick={onAdd}
                variant="default"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
              >
                +
              </Button>
            </div>
          ) : (
            <Button
              onClick={onAdd}
              size="sm"
              className="w-full"
            >
              Add to Cart
            </Button>
          )}
        </div>
        
        {/* Item Image */}
        <div className="w-24 h-24 flex-shrink-0 relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          {quantity > 0 && (
            <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {quantity}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function generateDeliveryItems(): DeliveryItem[] {
  return [
    {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Fresh mozzarella, basil, and San Marzano tomatoes on our signature wood-fired crust',
      price: 18.99,
      originalPrice: 21.99,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop',
      category: 'Pizza',
      cookingTime: '15-20 min',
      rating: 4.8,
      reviewCount: 124,
      isPopular: true,
      customizations: ['Extra Cheese', 'Gluten-Free Crust', 'Extra Basil'],
      tags: ['#Vegetarian', '#Classic', '#Wood-Fired']
    },
    {
      id: '2',
      name: 'Truffle Risotto',
      description: 'Creamy Arborio rice with black truffle shavings and aged Parmigiano-Reggiano',
      price: 32.99,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop',
      category: 'Mains',
      cookingTime: '25-30 min',
      rating: 4.9,
      reviewCount: 89,
      isPopular: true,
      customizations: ['Extra Truffle', 'Vegetarian Option'],
      tags: ['#Truffle', '#Premium', '#Vegetarian']
    },
    {
      id: '3',
      name: 'Prosciutto & Arugula Pizza',
      description: 'San Daniele prosciutto, fresh arugula, and shaved parmesan on white sauce base',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=200&h=200&fit=crop',
      category: 'Pizza',
      cookingTime: '15-20 min',
      rating: 4.7,
      reviewCount: 156,
      isPopular: true,
      customizations: ['Extra Prosciutto', 'No Arugula', 'Gluten-Free Crust'],
      tags: ['#Prosciutto', '#Arugula', '#White Sauce']
    },
    {
      id: '4',
      name: 'Burrata Caprese',
      description: 'Fresh burrata with heirloom tomatoes, basil, and aged balsamic reduction',
      price: 16.99,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop',
      category: 'Appetizers',
      cookingTime: '5-10 min',
      rating: 4.6,
      reviewCount: 98,
      isPopular: false,
      customizations: ['Extra Burrata', 'No Balsamic'],
      tags: ['#Fresh', '#Vegetarian', '#Caprese']
    },
    {
      id: '5',
      name: 'Osso Buco',
      description: 'Slow-braised veal shanks with saffron risotto and gremolata',
      price: 45.99,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop',
      category: 'Mains',
      cookingTime: '35-40 min',
      rating: 4.8,
      reviewCount: 67,
      isPopular: false,
      customizations: ['Extra Sauce', 'No Gremolata'],
      tags: ['#Signature', '#Braised', '#Traditional']
    },
    {
      id: '6',
      name: 'Tiramisu',
      description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=200&h=200&fit=crop',
      category: 'Desserts',
      cookingTime: 'Ready now',
      rating: 4.9,
      reviewCount: 203,
      isPopular: true,
      customizations: ['Extra Cocoa', 'Decaf Version'],
      tags: ['#Classic', '#Espresso', '#Mascarpone']
    },
    {
      id: '7',
      name: 'Caesar Salad',
      description: 'Crisp romaine lettuce with parmesan, croutons, and our house-made Caesar dressing',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1512852939750-1305098529bf?w=200&h=200&fit=crop',
      category: 'Salads',
      cookingTime: '5-10 min',
      rating: 4.4,
      reviewCount: 87,
      isPopular: false,
      customizations: ['Add Chicken', 'Add Shrimp', 'No Croutons'],
      tags: ['#Classic', '#Crispy', '#Fresh']
    },
    {
      id: '8',
      name: 'Gelato Trio',
      description: 'Three scoops of our artisanal gelato: pistachio, stracciatella, and limoncello',
      price: 9.99,
      image: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=200&h=200&fit=crop',
      category: 'Desserts',
      cookingTime: 'Ready now',
      rating: 4.7,
      reviewCount: 142,
      isPopular: false,
      customizations: ['Different Flavors', 'Extra Scoop'],
      tags: ['#Artisanal', '#Italian', '#Fresh']
    }
  ];
}