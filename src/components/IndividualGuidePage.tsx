import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Heart, Bookmark, Share, MapPin, Clock, Star, Plus, ChevronDown, ChevronUp, Map, Users, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  heartCount: number;
  address: string;
  hours: string;
  description: string;
  tags: string[];
  images: string[];
  distance: string;
}

interface Guide {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  coverImages: string[];
  description: string;
  location: string;
  likeCount: number;
  favoriteCount: number;
  viewCount: number;
  lastUpdated: string;
  badge?: string;
  restaurantCount: number;
  visitedCount: number;
  restaurants: Restaurant[];
}

interface IndividualGuidePageProps {
  guideId: string;
  onBack: () => void;
  onShowRestaurantProfile?: (restaurantId: string) => void;
  onShowUserProfile?: (userId: string) => void;
}

export function IndividualGuidePage({ 
  guideId, 
  onBack, 
  onShowRestaurantProfile, 
  onShowUserProfile 
}: IndividualGuidePageProps) {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Mock data for the guide
  useEffect(() => {
    const mockGuide: Guide = {
      id: guideId,
      title: "Best Late Night Food Spots: LA",
      author: {
        name: "Bon à Petite",
        avatar: "/api/placeholder/60/60",
        verified: true
      },
      coverImages: [
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300"
      ],
      description: "New late night spots we checked out and loved. From authentic street tacos to gourmet burgers, these spots will satisfy your midnight cravings. Perfect for night owls, students, and anyone looking for quality food after hours.",
      location: "Los Angeles",
      likeCount: 3200,
      favoriteCount: 3200,
      viewCount: 12500,
      lastUpdated: "Updated last week",
      badge: "Editor's Pick",
      restaurantCount: 4,
      visitedCount: 2,
      restaurants: [
        {
          id: "1",
          name: "Kebab Shop",
          cuisine: "Afghani Cuisine",
          priceRange: "$$",
          rating: 4.3,
          heartCount: 11400,
          address: "123 Main St, New York",
          hours: "11:00am - 11:00pm",
          description: "Kebab Shop serves authentic Afghani cuisine with tender, flavorful meats and perfectly spiced rice. The naan is fresh and complements the savory kebabs beautifully. While the ambiance is modest, the quality of the food makes it a worthwhile visit for a satisfying and hearty meal.",
          tags: ["🌶️ Spicy", "🥩 Halal", "🚗 2.3 mi away"],
          images: ["/api/placeholder/400/200", "/api/placeholder/400/200"],
          distance: "2.3 mi"
        },
        {
          id: "2", 
          name: "Night Owl Diner",
          cuisine: "American Comfort",
          priceRange: "$",
          rating: 4.1,
          heartCount: 8900,
          address: "456 Sunset Blvd, Los Angeles",
          hours: "24 hours",
          description: "Classic American diner serving comfort food all night long. Their pancakes are legendary and the coffee keeps flowing. A true LA institution for late night dining.",
          tags: ["🥞 Breakfast", "☕ Coffee", "🌙 24/7"],
          images: ["/api/placeholder/400/200"],
          distance: "1.8 mi"
        },
        {
          id: "3",
          name: "Taco Libre",
          cuisine: "Mexican Street Food", 
          priceRange: "$",
          rating: 4.6,
          heartCount: 15200,
          address: "789 Venice Beach, Los Angeles",
          hours: "10:00pm - 3:00am",
          description: "Authentic street tacos with handmade tortillas and fresh ingredients. The al pastor is incredible and the salsas pack serious heat. Cash only but worth every penny.",
          tags: ["🌮 Tacos", "🌶️ Spicy", "💰 Cash Only"],
          images: ["/api/placeholder/400/200", "/api/placeholder/400/200"],
          distance: "3.1 mi"
        },
        {
          id: "4",
          name: "Gourmet Burger Co",
          cuisine: "American Gourmet",
          priceRange: "$$$",
          rating: 4.4,
          heartCount: 9800,
          address: "321 Hollywood Blvd, Los Angeles", 
          hours: "6:00pm - 2:00am",
          description: "Upscale burger joint with creative combinations and high-quality ingredients. The truffle fries are a must-try. Perfect for a late night splurge.",
          tags: ["🍔 Burgers", "🍟 Truffle Fries", "✨ Upscale"],
          images: ["/api/placeholder/400/200"],
          distance: "2.7 mi"
        }
      ]
    };
    setGuide(mockGuide);
  }, [guideId]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (guide) {
      setGuide({
        ...guide,
        likeCount: isLiked ? guide.likeCount - 1 : guide.likeCount + 1
      });
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    if (guide) {
      setGuide({
        ...guide,
        favoriteCount: isFavorited ? guide.favoriteCount - 1 : guide.favoriteCount + 1
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: guide?.title,
        text: guide?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const scrollToContent = () => {
    if (heroRef.current) {
      const heroHeight = heroRef.current.offsetHeight;
      window.scrollTo({
        top: heroHeight - 100,
        behavior: 'smooth'
      });
    }
  };

  if (!guide) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading guide...</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background overflow-y-auto scrollbar-hide">
      {/* Hero Section */}
      <div ref={heroRef} className="relative h-screen max-h-[600px] overflow-hidden">
        {/* Cover Image Carousel */}
        <div className="absolute inset-0">
          <img
            src={guide.coverImages[currentImageIndex]}
            alt={guide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Header Controls */}
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 pt-12">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMap(!showMap)}
              className="bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
            >
              <Map className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
            >
              <Share className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onShowUserProfile?.(guide.author.name)}
              className="bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
            >
              <img
                src={guide.author.avatar}
                alt={guide.author.name}
                className="w-6 h-6 rounded-full object-cover"
              />
            </Button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
          {/* Author Badge */}
          <div className="flex items-center gap-2 mb-3">
            <img
              src={guide.author.avatar}
              alt={guide.author.name}
              className="w-8 h-8 rounded-full border-2 border-white/20"
            />
            <span className="text-sm font-medium">{guide.author.name}</span>
            {guide.author.verified && (
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </div>

          {/* Title and Location */}
          <h1 className="text-3xl font-bold mb-2 leading-tight">{guide.title}</h1>
          <div className="flex items-center gap-4 text-sm opacity-90">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{guide.location}</span>
            </div>
            {guide.badge && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {guide.badge}
              </Badge>
            )}
          </div>

          {/* Scroll Indicator */}
          <div 
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer animate-bounce"
            onClick={scrollToContent}
          >
            <ChevronDown className="h-6 w-6 text-white/80" />
          </div>
        </div>

        {/* Image Indicator Dots */}
        {guide.coverImages.length > 1 && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2">
            {guide.coverImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentImageIndex 
                    ? "bg-white w-6" 
                    : "bg-white/50"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="bg-background">
        {/* Guide Description */}
        <div className="p-6 border-b">
          <p className={cn(
            "text-muted-foreground leading-relaxed",
            !isDescriptionExpanded && "line-clamp-3"
          )}>
            {guide.description}
          </p>
          
          {guide.description.length > 150 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="mt-2 p-0 h-auto text-primary"
            >
              {isDescriptionExpanded ? (
                <>Show less <ChevronUp className="h-4 w-4 ml-1" /></>
              ) : (
                <>Read more <ChevronDown className="h-4 w-4 ml-1" /></>
              )}
            </Button>
          )}

          {/* Engagement Stats */}
          <div className="flex items-center gap-4 mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "flex items-center gap-2 text-sm",
                isLiked && "text-red-500"
              )}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
              <span>{guide.likeCount.toLocaleString()}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavorite}
              className={cn(
                "flex items-center gap-2 text-sm",
                isFavorited && "text-primary"
              )}
            >
              <Bookmark className={cn("h-4 w-4", isFavorited && "fill-current")} />
              <span>{guide.favoriteCount.toLocaleString()}</span>
            </Button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{guide.viewCount.toLocaleString()}</span>
            </div>
          </div>

          {/* Author Info */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-3">
              <img
                src={guide.author.avatar}
                alt={guide.author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{guide.author.name}</span>
                  {guide.author.verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {guide.restaurantCount} Restaurants • {guide.lastUpdated}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>1.1m</span>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Your Progress</span>
              <span className="text-sm text-muted-foreground">
                {guide.visitedCount}/{guide.restaurantCount} visited
              </span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(guide.visitedCount / guide.restaurantCount) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Featured Restaurants */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Featured Restaurants</h2>
          
          <div className="space-y-6">
            {guide.restaurants.map((restaurant) => (
              <Card 
                key={restaurant.id} 
                className="overflow-hidden cursor-pointer transition-all hover:shadow-lg"
                onClick={() => onShowRestaurantProfile?.(restaurant.id)}
              >
                {/* Restaurant Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={restaurant.images[0]}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <div className="bg-black/50 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                      {restaurant.distance}
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                      📍 {restaurant.distance}
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Restaurant Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{restaurant.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{restaurant.cuisine}</span>
                        <span>•</span>
                        <span>{restaurant.priceRange}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Rating and Stats */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-4 w-4",
                            star <= Math.floor(restaurant.rating) 
                              ? "fill-yellow-400 text-yellow-400" 
                              : "text-gray-300"
                          )}
                        />
                      ))}
                      <span className="text-sm font-medium ml-1">
                        {restaurant.rating}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-red-500">
                      <Heart className="h-4 w-4 fill-current" />
                      <span>{restaurant.heartCount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Address and Hours */}
                  <div className="space-y-1 mb-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{restaurant.address}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{restaurant.hours}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                    {restaurant.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {restaurant.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Plus className="h-4 w-4 mr-1" />
                      Add to List
                    </Button>
                    <Button variant="outline" size="sm">
                      Start Quest
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Similar Guides Section */}
        <div className="p-6 border-t bg-muted/30">
          <h2 className="text-xl font-bold mb-4">Similar Guides</h2>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((item) => (
              <Card key={item} className="overflow-hidden">
                <div className="relative h-24">
                  <img
                    src="/api/placeholder/200/100"
                    alt="Similar guide"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-3">
                  <h4 className="font-medium text-sm line-clamp-2">
                    Best Coffee Shops in LA
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    By Coffee Lover • 6 spots
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
}