import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { useDevice } from '@/hooks/use-device';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cart } from '@/components/Cart';
import { Checkout } from '@/components/Checkout';
import { FavoritesPage } from '@/components/FavoritesPage';
import { OrderHistory } from '@/components/OrderHistory';
import { MapView } from '@/components/MapView';
import { getCurrentUser } from '@/lib/mockData';
import { 
  MagnifyingGlassIcon as SearchIcon, 
  AdjustmentsHorizontalIcon as FilterIcon,
  ArrowPathIcon as SwipeIcon,
  HeartIcon as FavoritesIcon,
  HeartIcon,
  StarIcon,
  EllipsisHorizontalIcon,
  MapPinIcon as MapPin,
  ClockIcon as Clock,
  TruckIcon as Truck,
  BoltIcon as LightningIcon,
  PlusIcon as Plus,
  MinusIcon as Minus,
  ShoppingCartIcon,
  ArrowPathIcon as ClockCounterClockwise
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import LikLogoHeart from '@/assets/images/Lik_Logo_Heart_1.0.png';
import { CartItem, FavoriteRestaurant, FavoriteDish } from '@/lib/types';

interface FoodPost {
  id: string;
  type: 'restaurant' | 'dish' | 'sponsored';
  image: string;
  rating?: number; // For restaurant posts (out of 5)
  dishScore?: number; // For dish posts (out of 10)
  displayName: string;
  restaurantName?: string; // For dish posts
  isVerified?: boolean;
  description: string;
  likedBy: string[];
  isLiked: boolean;
  likes: number;
  height?: number; // For staggered layout
}

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  categories: string[];
  promo?: string;
  distance: string;
  isPartner: boolean;
  latitude: number;
  longitude: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isPopular?: boolean;
  customizations?: string[];
}

interface SearchPageProps {
  onNavigate: (page: string) => void;
  onSelectUser: (userId: string) => void;
  onSelectRestaurant: (restaurantId: string) => void;
}

export function SearchPage({ onNavigate, onSelectUser, onSelectRestaurant }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeliveryMode, setIsDeliveryMode] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [activePreferences, setActivePreferences] = useKV<string[]>('food-preferences', ['Vegan']);
  const [posts, setPosts] = useKV<FoodPost[]>('food-posts', generateMockFoodPosts());
  const [restaurants, setRestaurants] = useKV<Restaurant[]>('restaurants', generateMockRestaurants());
  const [cartItems, setCartItems] = useKV<{[key: string]: number}>('cart-items', {});
  const [cartItemsDetailed, setCartItemsDetailed] = useKV<CartItem[]>('cart-items-detailed', []);
  const [favoriteRestaurants, setFavoriteRestaurants] = useKV<FavoriteRestaurant[]>('favorite-restaurants', []);
  const [favoriteDishes, setFavoriteDishes] = useKV<FavoriteDish[]>('favorite-dishes', []);
  const [currentUser] = useKV('currentUser', getCurrentUser());
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  
  const device = useDevice();

  const preferences = ['Vegan', 'Halal', 'Mexican', 'Asian', 'Coffee', 'Pizza', 'Burgers', 'Healthy'];
  const deliveryFilters = ['All', 'Fast Delivery', 'Free Delivery', 'Highly Rated', 'New'];

  const togglePreference = (pref: string) => {
    setActivePreferences(current => 
      current.includes(pref) 
        ? current.filter(p => p !== pref)
        : [...current, pref]
    );
  };

  const handleLike = (postId: string) => {
    setPosts(current =>
      current.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const addToCart = (restaurantId: string, itemId: string) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    const menuItems = generateMenuItems(restaurantId);
    const item = menuItems.find(i => i.id === itemId);
    
    if (!restaurant || !item) return;

    const cartItemId = `${restaurantId}-${itemId}`;
    
    // Update simple cart count
    const key = `${restaurantId}-${itemId}`;
    setCartItems(current => ({
      ...current,
      [key]: (current[key] || 0) + 1
    }));

    // Update detailed cart items
    setCartItemsDetailed(current => {
      const existingItemIndex = current.findIndex(i => i.id === cartItemId);
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        return current.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item to cart
        const newCartItem: CartItem = {
          id: cartItemId,
          restaurantId,
          restaurantName: restaurant.name,
          itemId,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          quantity: 1,
          customizations: item.customizations
        };
        return [...current, newCartItem];
      }
    });

    toast.success('Added to cart!');
  };

  const removeFromCart = (restaurantId: string, itemId: string) => {
    const cartItemId = `${restaurantId}-${itemId}`;
    const key = `${restaurantId}-${itemId}`;
    
    // Update simple cart count
    setCartItems(current => {
      const newCart = { ...current };
      if (newCart[key] > 1) {
        newCart[key] -= 1;
      } else {
        delete newCart[key];
      }
      return newCart;
    });

    // Update detailed cart items
    setCartItemsDetailed(current => {
      const existingItemIndex = current.findIndex(i => i.id === cartItemId);
      
      if (existingItemIndex >= 0) {
        const item = current[existingItemIndex];
        if (item.quantity > 1) {
          // Decrease quantity
          return current.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );
        } else {
          // Remove item completely
          return current.filter((_, index) => index !== existingItemIndex);
        }
      }
      return current;
    });
  };

  const getCartItemCount = (restaurantId: string, itemId: string) => {
    const key = `${restaurantId}-${itemId}`;
    return cartItems[key] || 0;
  };

  const openMap = () => {
    setShowMapView(true);
  };

  const openSwipeMode = () => {
    onNavigate('swipe-discovery');
  };

  const openFavorites = () => {
    setShowFavorites(true);
  };

  const openOrderHistory = () => {
    setShowOrderHistory(true);
  };

  const addToFavorites = (restaurant: Restaurant, dish?: MenuItem) => {
    if (dish) {
      // Add dish to favorites
      const favoriteDish: FavoriteDish = {
        id: dish.id,
        name: dish.name,
        description: dish.description,
        price: dish.price,
        image: dish.image,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        dateAdded: Date.now()
      };

      setFavoriteDishes(current => {
        if (current.some(fav => fav.id === dish.id)) {
          toast.info('Dish already in favorites!');
          return current;
        }
        toast.success('Dish added to favorites!');
        return [...current, favoriteDish];
      });
    } else {
      // Add restaurant to favorites
      const favoriteRestaurant: FavoriteRestaurant = {
        id: restaurant.id,
        name: restaurant.name,
        image: restaurant.image,
        rating: restaurant.rating,
        reviewCount: restaurant.reviewCount,
        deliveryTime: restaurant.deliveryTime,
        deliveryFee: restaurant.deliveryFee,
        categories: restaurant.categories,
        distance: restaurant.distance,
        isPartner: restaurant.isPartner,
        dateAdded: Date.now()
      };

      setFavoriteRestaurants(current => {
        if (current.some(fav => fav.id === restaurant.id)) {
          toast.info('Restaurant already in favorites!');
          return current;
        }
        toast.success('Restaurant added to favorites!');
        return [...current, favoriteRestaurant];
      });
    }
  };

  const handleCartOpen = () => {
    setShowCart(true);
  };

  const handleCartClose = () => {
    setShowCart(false);
  };

  const handleCheckoutOpen = (items: CartItem[]) => {
    setShowCart(false);
    setShowCheckout(true);
  };

  const handleCheckoutClose = () => {
    setShowCheckout(false);
    // Clear cart after successful checkout
    setCartItems({});
    setCartItemsDetailed([]);
  };

  const handleCheckoutBack = () => {
    setShowCheckout(false);
    setShowCart(true);
  };

  const totalCartItems = cartItemsDetailed.reduce((sum, item) => sum + item.quantity, 0);

  // Grid columns based on device type
  const gridCols = device.type === 'tablet' ? 'grid-cols-3' : 'grid-cols-2';
  const padding = device.type === 'tablet' ? 'p-4' : 'p-3';

  // Show map view if requested
  if (showMapView) {
    return (
      <MapView
        restaurants={restaurants}
        onBack={() => setShowMapView(false)}
        onSelectRestaurant={onSelectRestaurant}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* Fixed Header */}
      <div className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-20">
        {/* Top Navigation */}
        <div className={cn("flex items-center gap-3", padding, "pb-3")}>
          {/* Switch Component */}
          <Button
            variant={isDeliveryMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsDeliveryMode(!isDeliveryMode)}
            className={cn(
              "rounded-full flex-shrink-0 h-8 px-3 nav-rum-raisin",
              isDeliveryMode ? "bg-primary text-primary-foreground font-semibold" : "bg-muted font-light"
            )}
          >
            <div className="w-4 h-2 bg-current rounded-full relative">
              <div className={cn(
                "absolute w-2 h-2 bg-background rounded-full transition-transform duration-200",
                isDeliveryMode ? "translate-x-2" : "translate-x-0"
              )} />
            </div>
          </Button>

          {/* Search Bar */}
          <div className="relative flex-1">
            <SearchIcon 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" 
            />
            <Input
              placeholder={isDeliveryMode ? "Search restaurants & cuisines" : "Search for restaurants, dishes, or tags"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-10 h-9 text-sm rounded-full bg-muted/50"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 rounded-full"
            >
              <FilterIcon className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Right Icons */}
          {!isDeliveryMode ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={openSwipeMode}
                className="h-8 w-8 p-0 rounded-full"
              >
                <SwipeIcon className="w-4.5 h-4.5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={openFavorites}
                className="h-8 w-8 p-0 rounded-full"
              >
                <FavoritesIcon className="w-4.5 h-4.5" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCartOpen}
              className="h-8 w-8 p-0 rounded-full relative"
            >
              <ShoppingCartIcon className="w-4.5 h-4.5" />
              {totalCartItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                >
                  {totalCartItems}
                </Badge>
              )}
            </Button>
          )}
        </div>

        {/* Additional delivery mode buttons */}
        {isDeliveryMode && (
          <div className="flex items-center gap-2 px-4 pb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={openOrderHistory}
              className="h-8 px-3 rounded-full text-xs"
            >
              <ClockCounterClockwise className="mr-1 w-3.5 h-3.5" />
              Orders
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openFavorites}
              className="h-8 px-3 rounded-full text-xs"
            >
              <FavoritesIcon className="w-3.5 h-3.5 mr-1" />
              Favorites
            </Button>
          </div>
        )}

        {/* Preference/Filter Chips */}
        <div className={cn("pb-3", padding, "pt-0")}>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {(isDeliveryMode ? deliveryFilters : preferences).map((pref) => (
              <Badge
                key={pref}
                variant={activePreferences.includes(pref) ? "default" : "secondary"}
                onClick={() => togglePreference(pref)}
                className={cn(
                  "cursor-pointer whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium nav-rum-raisin",
                  "touch-target transition-all duration-200",
                  activePreferences.includes(pref) 
                    ? "bg-foreground text-background font-semibold" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80 font-light"
                )}
              >
                {pref}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      {isDeliveryMode ? (
        <DeliveryView 
          restaurants={restaurants}
          searchQuery={searchQuery}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          getCartItemCount={getCartItemCount}
          onAddToFavorites={addToFavorites}
          deviceType={device.type}
          padding={padding}
        />
      ) : (
        /* Pinterest-Style Staggered Grid */
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className={cn("pb-20", padding, "pt-2")}>
            <div className="columns-2 gap-3 space-y-3">
              {posts.map((post) => (
                <FoodCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onSelectRestaurant={onSelectRestaurant}
                  deviceType={device.type}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Map Button - Only show in explore mode */}
      {!isDeliveryMode && (
        <Button
          onClick={openMap}
          className={cn(
            "fixed z-10 rounded-full shadow-lg bg-background border border-border text-foreground",
            "hover:bg-muted transition-all duration-200",
            "bottom-20 left-1/2 transform -translate-x-1/2",
            device.type === 'tablet' ? "h-12 px-6" : "h-10 px-4"
          )}
        >
          <MapPin className="mr-2 w-4 h-4" />
          <span className="text-sm font-medium">Map</span>
        </Button>
      )}

      {/* Floating Cart Button - Only show in delivery mode with items */}
      {isDeliveryMode && totalCartItems > 0 && (
        <Button
          onClick={handleCartOpen}
          className={cn(
            "fixed z-10 rounded-full shadow-lg bg-primary text-primary-foreground",
            "hover:bg-primary/90 transition-all duration-200",
            "bottom-20 left-1/2 transform -translate-x-1/2",
            device.type === 'tablet' ? "h-12 px-6" : "h-10 px-4"
          )}
        >
          <ShoppingCartIcon className="mr-2 w-4 h-4" />
          <span className="text-sm font-medium">
            {totalCartItems} items • ${cartItemsDetailed.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
          </span>
        </Button>
      )}

      {/* Cart, Checkout, Favorites, and Order History Modals */}
      <Cart
        isOpen={showCart}
        onClose={handleCartClose}
        onCheckout={handleCheckoutOpen}
        onSelectRestaurant={onSelectRestaurant}
      />
      
      <Checkout
        isOpen={showCheckout}
        onClose={handleCheckoutClose}
        onBack={handleCheckoutBack}
        cartItems={cartItemsDetailed}
      />

      <FavoritesPage
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
        onSelectRestaurant={onSelectRestaurant}
      />

      <OrderHistory
        isOpen={showOrderHistory}
        onClose={() => setShowOrderHistory(false)}
        onSelectRestaurant={onSelectRestaurant}
      />
    </div>
  );
}

interface FoodCardProps {
  post: FoodPost;
  onLike: (postId: string) => void;
  onSelectRestaurant?: (restaurantId: string) => void;
  deviceType: 'phone' | 'tablet';
}

function FoodCard({ post, onLike, onSelectRestaurant, deviceType }: FoodCardProps) {
  // Random heights for staggered effect
  const heights = ['h-64', 'h-72', 'h-80', 'h-96', 'h-[22rem]', 'h-[26rem]'];
  const randomHeight = heights[Math.floor(Math.random() * heights.length)];
  
  return (
    <div className={cn(
      "bg-card rounded-lg overflow-hidden border border-border relative mb-3",
      "touch-feedback cursor-pointer break-inside-avoid",
      randomHeight
    )}>
      {/* Image */}
      <div className="relative h-full">
        <img
          src={post.image}
          alt={post.description}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Overlay Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        
        {/* Top Elements */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {/* Rating/Score */}
          {post.type === 'restaurant' && post.rating && (
            <div className="flex items-center gap-1 bg-black/60 rounded-full px-3 py-1.5 backdrop-blur-sm">
              <StarIcon className="h-3.5 w-3.5 text-yellow-400 fill-current" />
              <span className="text-white text-sm font-semibold">{post.rating}</span>
            </div>
          )}
          
          {post.type === 'dish' && post.dishScore && (
            <div className="bg-black/60 rounded-full px-3 py-1.5 backdrop-blur-sm">
              <span className="text-white text-sm font-bold">{post.dishScore}/10</span>
            </div>
          )}
          
          {post.type === 'sponsored' && (
            <div className="bg-black/40 rounded-full px-3 py-1.5 backdrop-blur-sm">
              {/* Empty for sponsored posts */}
            </div>
          )}
          
          {/* Options Menu */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm"
          >
            <EllipsisHorizontalIcon className="h-4 w-4 text-white" />
          </Button>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Profile Section */}
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-600 rounded-full flex-shrink-0 cursor-pointer hover:scale-110 transition-transform" 
              onClick={() => post.type === 'restaurant' && onSelectRestaurant?.(post.id)}
            />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span 
                className="text-white text-sm font-semibold truncate cursor-pointer hover:underline"
                onClick={() => post.type === 'restaurant' && onSelectRestaurant?.(post.id)}
              >
                {post.displayName}
              </span>
              {post.isVerified && (
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
          </div>

          {post.type === 'dish' && post.restaurantName && (
            <div className="mb-2">
              <span className="text-white/80 text-xs font-medium">{post.restaurantName}</span>
            </div>
          )}

          {/* Description */}
          <p className="text-white/90 text-sm mb-3 line-clamp-2 leading-relaxed">{post.description}</p>

          {/* Bottom Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <img 
                  src={LikLogoHeart} 
                  alt="Lik Logo" 
                  className="w-4 h-4"
                />
                <span className="text-white/80 text-xs font-rum-raisin font-medium">Liked By</span>
              </div>
              <div className="flex -space-x-1">
                {post.likedBy.slice(0, 3).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 border-white flex-shrink-0",
                      i === 0 && "bg-green-500",
                      i === 1 && "bg-blue-500", 
                      i === 2 && "bg-red-500"
                    )}
                  />
                ))}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onLike(post.id);
              }}
              className="h-8 w-8 p-0 hover:scale-110 transition-transform"
            >
              <HeartIcon 
                className={cn(
                  "h-4.5 w-4.5 transition-colors",
                  post.isLiked ? "text-red-500 fill-current" : "text-white"
                )} 
              />
            </Button>
          </div>

          {/* Sponsored Label */}
          {post.type === 'sponsored' && (
            <div className="mt-2 text-center">
              <span className="text-white/50 text-xs font-light">Sponsored</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Mock data generator
function generateMockFoodPosts(): FoodPost[] {
  const foodImages = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop', // Pizza
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=500&fit=crop', // Burger
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=600&fit=crop', // Pasta
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=500&fit=crop', // Grilled food
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=600&fit=crop', // Salad
    'https://images.unsplash.com/photo-1563379091339-03246963d321?w=400&h=500&fit=crop', // Asian food
    'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=600&fit=crop', // Sandwich
    'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=500&fit=crop', // Breakfast
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=550&fit=crop', // Pancakes
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=650&fit=crop', // Soup
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=580&fit=crop', // Fried rice
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=620&fit=crop', // Dessert
  ];

  const restaurantDescriptions = [
    "Award-winning Italian restaurant featuring authentic wood-fired pizzas and handmade pasta",
    "Modern Asian fusion cuisine with bold flavors and stunning presentation",
    "Farm-to-table restaurant serving organic, locally-sourced ingredients",
    "Traditional BBQ smokehouse with 12-hour smoked meats and house-made sauces",
    "Michelin-starred fine dining experience with seasonal tasting menus",
    "Authentic Mexican cantina with fresh tortillas and craft cocktails",
    "Contemporary steakhouse featuring premium aged beef and wine selection",
    "Coastal seafood restaurant with daily fresh catches and ocean views"
  ];

  const dishDescriptions = [
    "Perfectly crispy truffle fries with parmesan and herbs - absolutely divine!",
    "Best ramen I've ever had! Rich tonkotsu broth with tender chashu pork",
    "Incredible chocolate lava cake with vanilla bean ice cream",
    "Fresh caught salmon with seasonal vegetables and lemon butter sauce",
    "Authentic margherita pizza with San Marzano tomatoes and buffalo mozzarella",
    "House-made gnocchi in brown butter sage sauce - comfort food perfection",
    "Wagyu beef burger with aged cheddar and caramelized onions",
    "Spicy tuna roll with avocado and sriracha mayo - so fresh and flavorful"
  ];

  const restaurantNames = [
    "Bella Vista", "Dragon Palace", "Green Garden", "Smoke & Fire", 
    "Le Bernardin", "Casa Miguel", "Prime Cut", "Ocean's Bounty",
    "Mario's Kitchen", "Tokyo Eats", "The Healthy Spot", "BBQ Central"
  ];

  const dishNames = [
    "Truffle Fries", "Tonkotsu Ramen", "Chocolate Lava Cake", "Grilled Salmon",
    "Margherita Pizza", "Brown Butter Gnocchi", "Wagyu Burger", "Spicy Tuna Roll",
    "Caesar Salad", "Fish Tacos", "Ribeye Steak", "Pad Thai"
  ];

  return Array.from({ length: 24 }, (_, i) => {
    const postType = i % 4 === 0 ? 'sponsored' : (i % 3 === 0 ? 'dish' : 'restaurant');
    
    return {
      id: `food-${i}`,
      type: postType,
      image: foodImages[i % foodImages.length],
      rating: postType === 'restaurant' ? Number((3.5 + Math.random() * 1.5).toFixed(1)) : undefined,
      dishScore: postType === 'dish' ? Number((7.0 + Math.random() * 3.0).toFixed(1)) : undefined,
      displayName: postType === 'dish' ? dishNames[i % dishNames.length] : restaurantNames[i % restaurantNames.length],
      restaurantName: postType === 'dish' ? restaurantNames[i % restaurantNames.length] : undefined,
      isVerified: i % 5 === 0,
      description: postType === 'dish' ? dishDescriptions[i % dishDescriptions.length] : restaurantDescriptions[i % restaurantDescriptions.length],
      likedBy: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => `user${j}`),
      isLiked: Math.random() > 0.5,
      likes: Math.floor(Math.random() * 100) + 10
    };
  });
}

// Delivery mode components and mock data
interface DeliveryViewProps {
  restaurants: Restaurant[];
  searchQuery: string;
  onAddToCart: (restaurantId: string, itemId: string) => void;
  onRemoveFromCart: (restaurantId: string, itemId: string) => void;
  getCartItemCount: (restaurantId: string, itemId: string) => number;
  onAddToFavorites: (restaurant: Restaurant, dish?: MenuItem) => void;
  deviceType: 'phone' | 'tablet';
  padding: string;
}

function DeliveryView({ 
  restaurants, 
  searchQuery, 
  onAddToCart, 
  onRemoveFromCart, 
  getCartItemCount, 
  onAddToFavorites,
  deviceType, 
  padding 
}: DeliveryViewProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (selectedRestaurant) {
    return (
      <RestaurantMenu
        restaurant={selectedRestaurant}
        onBack={() => setSelectedRestaurant(null)}
        onAddToCart={onAddToCart}
        onRemoveFromCart={onRemoveFromCart}
        getCartItemCount={getCartItemCount}
        onAddToFavorites={onAddToFavorites}
        deviceType={deviceType}
        padding={padding}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide">
      <div className={cn("pb-20", padding, "pt-2")}>
        {/* Promoted Restaurants */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 nav-rum-raisin">Featured Restaurants</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {restaurants.slice(0, 5).map((restaurant) => (
              <FeaturedRestaurantCard
                key={`featured-${restaurant.id}`}
                restaurant={restaurant}
                onClick={() => setSelectedRestaurant(restaurant)}
                onAddToFavorites={onAddToFavorites}
                deviceType={deviceType}
              />
            ))}
          </div>
        </div>

        {/* Restaurant List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold nav-rum-raisin">All Restaurants</h2>
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onClick={() => setSelectedRestaurant(restaurant)}
              onAddToFavorites={onAddToFavorites}
              deviceType={deviceType}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface FeaturedRestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
  onAddToFavorites: (restaurant: Restaurant) => void;
  deviceType: 'phone' | 'tablet';
}

function FeaturedRestaurantCard({ restaurant, onClick, onAddToFavorites, deviceType }: FeaturedRestaurantCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToFavorites(restaurant);
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex-shrink-0 bg-card rounded-lg border border-border overflow-hidden cursor-pointer relative",
        "touch-feedback transition-all duration-200 hover:shadow-md",
        deviceType === 'tablet' ? "w-64" : "w-56"
      )}
    >
      <div className="relative h-32">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        {restaurant.promo && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            {restaurant.promo}
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          <div className="bg-black/50 backdrop-blur-sm rounded px-2 py-1">
            <div className="flex items-center gap-1">
              <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-white text-xs font-medium">{restaurant.rating}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteClick}
            className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70 rounded-full"
          >
            <HeartIcon className="h-3 w-3 text-white" />
          </Button>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold truncate">{restaurant.name}</h3>
        <p className="text-sm text-muted-foreground truncate">{restaurant.categories.join(', ')}</p>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Truck className="w-3 h-3" />
            <span>${restaurant.deliveryFee === 0 ? 'Free' : restaurant.deliveryFee}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
  onAddToFavorites: (restaurant: Restaurant) => void;
  deviceType: 'phone' | 'tablet';
}

function RestaurantCard({ restaurant, onClick, onAddToFavorites, deviceType }: RestaurantCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToFavorites(restaurant);
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card rounded-lg border border-border overflow-hidden cursor-pointer",
        "touch-feedback transition-all duration-200 hover:shadow-md"
      )}
    >
      <div className="flex">
        <div className="relative w-24 h-24 flex-shrink-0">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          {restaurant.isPartner && (
            <div className="absolute top-1 left-1 bg-blue-500 text-white p-1 rounded-full">
              <LightningIcon className="w-2 h-2 fill-current" />
            </div>
          )}
        </div>
        <div className="flex-1 p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{restaurant.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{restaurant.categories.join(', ')}</p>
              <div className="flex items-center gap-1 mt-1">
                <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{restaurant.rating}</span>
                <span className="text-sm text-muted-foreground">({restaurant.reviewCount})</span>
                <span className="text-sm text-muted-foreground">• {restaurant.distance}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-2">
              {restaurant.promo && (
                <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium flex-shrink-0">
                  {restaurant.promo}
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavoriteClick}
                className="h-8 w-8 p-0 rounded-full"
              >
                <HeartIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Truck className="w-3 h-3" />
                <span>{restaurant.deliveryFee === 0 ? 'Free delivery' : `$${restaurant.deliveryFee} delivery`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RestaurantMenuProps {
  restaurant: Restaurant;
  onBack: () => void;
  onAddToCart: (restaurantId: string, itemId: string) => void;
  onRemoveFromCart: (restaurantId: string, itemId: string) => void;
  getCartItemCount: (restaurantId: string, itemId: string) => number;
  onAddToFavorites: (restaurant: Restaurant, dish?: MenuItem) => void;
  deviceType: 'phone' | 'tablet';
  padding: string;
}

function RestaurantMenu({ 
  restaurant, 
  onBack, 
  onAddToCart, 
  onRemoveFromCart, 
  getCartItemCount, 
  onAddToFavorites,
  deviceType, 
  padding 
}: RestaurantMenuProps) {
  const menuItems = generateMenuItems(restaurant.id);

  const handleFavoriteRestaurant = () => {
    onAddToFavorites(restaurant);
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide">
      {/* Restaurant Header */}
      <div className="relative h-48">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white h-8 w-8 p-0 rounded-full"
        >
          ←
        </Button>
        <Button
          onClick={handleFavoriteRestaurant}
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white h-8 w-8 p-0 rounded-full"
        >
          <HeartIcon className="h-4 w-4" />
        </Button>
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-white text-2xl font-bold">{restaurant.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <StarIcon className="h-3.5 w-3.5 text-yellow-400 fill-current" />
              <span className="text-white font-medium">{restaurant.rating}</span>
              <span className="text-white/80">({restaurant.reviewCount})</span>
            </div>
            <span className="text-white/80">• {restaurant.distance}</span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-white/80 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="w-3 h-3" />
              <span>{restaurant.deliveryFee === 0 ? 'Free delivery' : `$${restaurant.deliveryFee} delivery`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className={cn("pb-20", padding, "pt-4")}>
        <h2 className="text-lg font-semibold mb-4 nav-rum-raisin">Menu</h2>
        <div className="space-y-3">
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              restaurant={restaurant}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onAddToFavorites={onAddToFavorites}
              cartCount={getCartItemCount(restaurant.id, item.id)}
              deviceType={deviceType}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface MenuItemProps {
  item: MenuItem;
  restaurant: Restaurant;
  onAddToCart: (restaurantId: string, itemId: string) => void;
  onRemoveFromCart: (restaurantId: string, itemId: string) => void;
  onAddToFavorites: (restaurant: Restaurant, dish: MenuItem) => void;
  cartCount: number;
  deviceType: 'phone' | 'tablet';
}

function MenuItem({ 
  item, 
  restaurant, 
  onAddToCart, 
  onRemoveFromCart, 
  onAddToFavorites,
  cartCount, 
  deviceType 
}: MenuItemProps) {
  const handleFavoriteDish = () => {
    onAddToFavorites(restaurant, item);
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="flex">
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{item.name}</h3>
                {item.isPopular && (
                  <Badge variant="secondary" className="text-xs">Popular</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
              <p className="text-lg font-bold mt-2">${item.price.toFixed(2)}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteDish}
              className="h-8 w-8 p-0 rounded-full ml-2"
            >
              <HeartIcon className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Add to Cart Controls */}
          <div className="flex items-center justify-between mt-3">
            <div className="text-xs text-muted-foreground">
              {item.customizations && item.customizations.length > 0 && (
                <span>Customizable</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {cartCount > 0 && (
                <Button
                  onClick={() => onRemoveFromCart(restaurant.id, item.id)}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <Minus className="w-3.5 h-3.5" />
                </Button>
              )}
              {cartCount > 0 && (
                <span className="text-sm font-medium min-w-[20px] text-center">{cartCount}</span>
              )}
              <Button
                onClick={() => onAddToCart(restaurant.id, item.id)}
                variant="default"
                size="sm"
                className="h-8 w-8 p-0 rounded-full bg-primary hover:bg-primary/90"
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
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
  );
}

// Mock data generators for delivery mode
function generateMockRestaurants(): Restaurant[] {
  const restaurantData = [
    {
      name: "Mario's Pizza Palace",
      categories: ["Italian", "Pizza", "Pasta"],
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      promo: "30% OFF",
      deliveryTime: "20-35 min",
      deliveryFee: 0,
      isPartner: true,
      latitude: 37.7749,
      longitude: -122.4194
    },
    {
      name: "Tokyo Sushi Bar",
      categories: ["Japanese", "Sushi", "Asian"],
      image: "https://images.unsplash.com/photo-1563379091339-03246963d321?w=400&h=300&fit=crop",
      promo: undefined,
      deliveryTime: "25-40 min",
      deliveryFee: 2.99,
      isPartner: true,
      latitude: 37.7849,
      longitude: -122.4094
    },
    {
      name: "Healthy Bowl Co.",
      categories: ["Healthy", "Bowls", "Vegan"],
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
      promo: "Free Delivery",
      deliveryTime: "15-30 min",
      deliveryFee: 0,
      isPartner: false,
      latitude: 37.7649,
      longitude: -122.4294
    },
    {
      name: "Burger Junction",
      categories: ["American", "Burgers", "Fast Food"],
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      promo: undefined,
      deliveryTime: "10-25 min",
      deliveryFee: 1.99,
      isPartner: true,
      latitude: 37.7789,
      longitude: -122.4184
    },
    {
      name: "Spice Route Indian",
      categories: ["Indian", "Curry", "Halal"],
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
      promo: "25% OFF",
      deliveryTime: "30-45 min",
      deliveryFee: 3.49,
      isPartner: false,
      latitude: 37.7709,
      longitude: -122.4304
    },
    {
      name: "Fresh Salad Works",
      categories: ["Healthy", "Salads", "Organic"],
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
      promo: undefined,
      deliveryTime: "15-25 min",
      deliveryFee: 0,
      isPartner: true,
      latitude: 37.7819,
      longitude: -122.4164
    }
  ];

  return restaurantData.map((data, i) => ({
    id: `restaurant-${i}`,
    name: data.name,
    image: data.image,
    rating: Number((4.0 + Math.random() * 1.0).toFixed(1)),
    reviewCount: Math.floor(Math.random() * 1000) + 100,
    deliveryTime: data.deliveryTime,
    deliveryFee: data.deliveryFee,
    categories: data.categories,
    promo: data.promo,
    distance: `${(0.5 + Math.random() * 2.5).toFixed(1)} mi`,
    isPartner: data.isPartner,
    latitude: data.latitude,
    longitude: data.longitude
  }));
}

function generateMenuItems(restaurantId: string): MenuItem[] {
  const menuData = [
    {
      name: "Margherita Pizza",
      description: "Fresh mozzarella, basil, and tomato sauce on our signature dough",
      price: 16.99,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop",
      isPopular: true,
      customizations: ["Size", "Crust", "Extra Toppings"]
    },
    {
      name: "Caesar Salad",
      description: "Crisp romaine lettuce, parmesan cheese, croutons, and caesar dressing",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop",
      isPopular: false,
      customizations: ["Protein", "Dressing"]
    },
    {
      name: "Cheeseburger Deluxe",
      description: "Angus beef patty with cheese, lettuce, tomato, onion, and special sauce",
      price: 14.99,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop",
      isPopular: true,
      customizations: ["Meat Temp", "Cheese Type", "Add-ons"]
    },
    {
      name: "Chicken Teriyaki Bowl",
      description: "Grilled chicken with teriyaki sauce, rice, and steamed vegetables",
      price: 13.99,
      image: "https://images.unsplash.com/photo-1563379091339-03246963d321?w=200&h=200&fit=crop",
      isPopular: false,
      customizations: ["Rice Type", "Sauce Level"]
    },
    {
      name: "Fish Tacos",
      description: "Beer-battered fish with cabbage slaw and chipotle mayo in corn tortillas",
      price: 15.99,
      image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=200&h=200&fit=crop",
      isPopular: true,
      customizations: ["Spice Level", "Tortilla Type"]
    }
  ];

  return menuData.map((data, i) => ({
    id: `${restaurantId}-item-${i}`,
    name: data.name,
    description: data.description,
    price: data.price,
    image: data.image,
    isPopular: data.isPopular,
    customizations: data.customizations
  }));
}