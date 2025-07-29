import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { useDevice } from '@/hooks/use-device';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Heart,
  Star,
  Clock,
  Truck,
  Plus,
  Lightning,
  MapPin,
  Trash,
  ShoppingCart
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { FavoriteRestaurant, FavoriteDish, CartItem } from '@/lib/types';

interface FavoritesPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FavoritesPage({ isOpen, onClose }: FavoritesPageProps) {
  const [favoriteRestaurants, setFavoriteRestaurants] = useKV<FavoriteRestaurant[]>('favorite-restaurants', []);
  const [favoriteDishes, setFavoriteDishes] = useKV<FavoriteDish[]>('favorite-dishes', []);
  const [cartItemsDetailed, setCartItemsDetailed] = useKV<CartItem[]>('cart-items-detailed', []);
  const [activeTab, setActiveTab] = useState<'restaurants' | 'dishes'>('restaurants');
  const device = useDevice();

  const removeFavoriteRestaurant = (restaurantId: string) => {
    setFavoriteRestaurants(current => 
      current.filter(restaurant => restaurant.id !== restaurantId)
    );
    toast.success('Restaurant removed from favorites');
  };

  const removeFavoriteDish = (dishId: string) => {
    setFavoriteDishes(current => 
      current.filter(dish => dish.id !== dishId)
    );
    toast.success('Dish removed from favorites');
  };

  const reorderDish = (dish: FavoriteDish) => {
    const cartItemId = `${dish.restaurantId}-${dish.id}`;
    
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
          restaurantId: dish.restaurantId,
          restaurantName: dish.restaurantName,
          itemId: dish.id,
          name: dish.name,
          description: dish.description,
          price: dish.price,
          image: dish.image,
          quantity: 1
        };
        return [...current, newCartItem];
      }
    });

    toast.success('Added to cart!');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Heart className="h-5 w-5 text-red-500 fill-current" />
        <h1 className="text-lg font-semibold">Favorites</h1>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'restaurants' | 'dishes')} className="flex-1 flex flex-col">
        <div className="border-b border-border px-4">
          <TabsList className="grid w-full grid-cols-2 h-10">
            <TabsTrigger value="restaurants" className="text-sm">
              Restaurants ({favoriteRestaurants.length})
            </TabsTrigger>
            <TabsTrigger value="dishes" className="text-sm">
              Dishes ({favoriteDishes.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <TabsContent value="restaurants" className="m-0 p-4 space-y-3">
            {favoriteRestaurants.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Heart className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No favorite restaurants yet</h3>
                <p className="text-muted-foreground mb-4">
                  Save restaurants you love to quickly find them later
                </p>
                <Button onClick={onClose} variant="outline">
                  Browse Restaurants
                </Button>
              </div>
            ) : (
              favoriteRestaurants
                .sort((a, b) => b.dateAdded - a.dateAdded)
                .map((restaurant) => (
                  <RestaurantFavoriteCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onRemove={() => removeFavoriteRestaurant(restaurant.id)}
                    deviceType={device.type}
                  />
                ))
            )}
          </TabsContent>

          <TabsContent value="dishes" className="m-0 p-4 space-y-3">
            {favoriteDishes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Heart className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No favorite dishes yet</h3>
                <p className="text-muted-foreground mb-4">
                  Save dishes you love for quick reordering
                </p>
                <Button onClick={onClose} variant="outline">
                  Browse Dishes
                </Button>
              </div>
            ) : (
              favoriteDishes
                .sort((a, b) => b.dateAdded - a.dateAdded)
                .map((dish) => (
                  <DishFavoriteCard
                    key={dish.id}
                    dish={dish}
                    onRemove={() => removeFavoriteDish(dish.id)}
                    onReorder={() => reorderDish(dish)}
                    deviceType={device.type}
                  />
                ))
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

interface RestaurantFavoriteCardProps {
  restaurant: FavoriteRestaurant;
  onRemove: () => void;
  deviceType: 'phone' | 'tablet';
}

function RestaurantFavoriteCard({ restaurant, onRemove, deviceType }: RestaurantFavoriteCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          <div className="relative w-24 h-24 flex-shrink-0">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            {restaurant.isPartner && (
              <div className="absolute top-1 left-1 bg-blue-500 text-white p-1 rounded-full">
                <Lightning size={8} className="fill-current" />
              </div>
            )}
          </div>
          <div className="flex-1 p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{restaurant.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{restaurant.categories.join(', ')}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={12} className="text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{restaurant.rating}</span>
                  <span className="text-sm text-muted-foreground">({restaurant.reviewCount})</span>
                  <span className="text-sm text-muted-foreground">• {restaurant.distance}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash size={16} />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck size={12} />
                  <span>{restaurant.deliveryFee === 0 ? 'Free delivery' : `$${restaurant.deliveryFee} delivery`}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DishFavoriteCardProps {
  dish: FavoriteDish;
  onRemove: () => void;
  onReorder: () => void;
  deviceType: 'phone' | 'tablet';
}

function DishFavoriteCard({ dish, onRemove, onReorder, deviceType }: DishFavoriteCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          <div className="w-24 h-24 flex-shrink-0">
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{dish.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{dish.restaurantName}</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{dish.description}</p>
                <p className="text-lg font-bold mt-2">${dish.price.toFixed(2)}</p>
              </div>
              <div className="flex flex-col gap-2 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRemove}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash size={16} />
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={onReorder}
                  className="h-8 w-8 p-0 bg-primary hover:bg-primary/90"
                >
                  <ShoppingCart size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}