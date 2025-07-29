import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Post as PostType, User, Order, CartItem } from '@/lib/types';
import { generateMockPosts, getCurrentUser } from '@/lib/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Grid3X3, Heart, MessageCircle, Settings, Plus, Camera, ClockCounterClockwise, ShoppingCart, Star, ArrowsClockwise } from '@phosphor-icons/react';
import { CreatePostModal } from '@/components/CreatePostModal';
import { CreateStoryModal } from '@/components/CreateStoryModal';
import { OrderHistory } from '@/components/OrderHistory';
import { FavoritesPage } from '@/components/FavoritesPage';
import { useDevice } from '@/hooks/use-device';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function ProfilePage() {
  const [currentUser, setCurrentUser] = useKV<User>('currentUser', getCurrentUser());
  const [posts] = useKV<PostType[]>('posts', generateMockPosts());
  const [cartItemsDetailed, setCartItemsDetailed] = useKV<CartItem[]>('cart-items-detailed', []);
  const [favoriteRestaurants] = useKV<any[]>('favorite-restaurants', []);
  const [favoriteDishes] = useKV<any[]>('favorite-dishes', []);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const device = useDevice();
  
  const userPosts = posts.filter(post => post.userId === currentUser.id);

  // Mock recent orders - in a real app this would come from an API
  const allOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
  const recentOrders = allOrders
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 3); // Show last 3 orders regardless of status
  const deliveredOrders = allOrders.filter((order: Order) => order.status === 'delivered');
  const frequentlyOrderedRestaurants = deliveredOrders
    .reduce((acc, order) => {
      acc[order.restaurantName] = (acc[order.restaurantName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  const topRestaurants = Object.entries(frequentlyOrderedRestaurants)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([name, count]) => ({ name, count }));

  const handleEditProfile = () => {
    toast.info('Profile editing coming soon!');
  };

  const handleSettings = () => {
    toast.info('Settings coming soon!');
  };

  const handlePostClick = (postId: string) => {
    toast.info('Post detail view coming soon!');
  };

  const handleQuickReorder = (order: Order) => {
    // Add all items from the order to the current cart
    const itemsToAdd = order.items.map(item => ({
      ...item,
      id: `${item.restaurantId}-${item.itemId}-${Date.now()}` // Create new ID to avoid conflicts
    }));

    setCartItemsDetailed(current => {
      const updatedCart = [...current];
      
      itemsToAdd.forEach(newItem => {
        const existingItemIndex = updatedCart.findIndex(
          item => item.restaurantId === newItem.restaurantId && item.itemId === newItem.itemId
        );
        
        if (existingItemIndex >= 0) {
          // Update quantity of existing item
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: updatedCart[existingItemIndex].quantity + newItem.quantity
          };
        } else {
          // Add new item
          updatedCart.push(newItem);
        }
      });
      
      return updatedCart;
    });

    toast.success(`${order.items.length} items added to cart!`);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'on_the_way':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="max-w-lg mx-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">{currentUser.username}</h1>
            <Button variant="ghost" size="sm" onClick={handleSettings}>
              <Settings size={20} />
            </Button>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
              <AvatarFallback className="text-2xl">
                {currentUser.username[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex gap-6 mb-2">
                <div className="text-center">
                  <p className="font-semibold text-lg">{currentUser.postCount}</p>
                  <p className="text-sm text-muted-foreground">Posts</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-lg">{currentUser.followerCount}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-lg">{currentUser.followingCount}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="font-semibold mb-1">{currentUser.displayName}</p>
            <p className="text-sm text-muted-foreground">{currentUser.bio}</p>
          </div>

          <div className="flex gap-2 mb-6">
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={handleEditProfile}
            >
              Edit Profile
            </Button>
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={() => setIsOrderHistoryOpen(true)}
            >
              <ClockCounterClockwise size={16} className="mr-2" />
              Orders
            </Button>
            <Button 
              variant="secondary"
              onClick={() => setIsFavoritesOpen(true)}
            >
              <Heart size={16} />
            </Button>
          </div>

          {/* Enhanced Recent Activity Section */}
          {(recentOrders.length > 0 || topRestaurants.length > 0) && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Recent Activity</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsOrderHistoryOpen(true)}
                  className="text-sm text-muted-foreground"
                >
                  View All
                </Button>
              </div>
              
              {/* Recent Orders */}
              {recentOrders.length > 0 && (
                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Recent Orders</h4>
                  {recentOrders.map((order) => (
                    <Card key={order.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                            <ShoppingCart size={16} className="text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{order.restaurantName}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{formatDate(order.timestamp)}</span>
                              <span>•</span>
                              <span>{order.items.length} items</span>
                              <span>•</span>
                              <span>${order.total.toFixed(2)}</span>
                            </div>
                            <Badge 
                              className={cn("text-xs mt-1", getStatusColor(order.status))}
                              variant="secondary"
                            >
                              {order.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        {order.status === 'delivered' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickReorder(order)}
                            className="ml-3 flex-shrink-0"
                          >
                            <ArrowsClockwise size={14} className="mr-1" />
                            Reorder
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Frequently Ordered Restaurants */}
              {topRestaurants.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Your Favorites</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {topRestaurants.map((restaurant, index) => (
                      <Card key={restaurant.name} className="p-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                            <Star size={12} className="text-white fill-current" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-sm truncate">{restaurant.name}</h5>
                            <p className="text-xs text-muted-foreground">
                              {restaurant.count} order{restaurant.count > 1 ? 's' : ''}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            #{index + 1}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <Grid3X3 size={16} />
              Posts
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart size={16} />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <MessageCircle size={16} />
              Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-0">
            {userPosts.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-foreground flex items-center justify-center">
                  <Grid3X3 size={24} />
                </div>
                <h3 className="text-xl font-light mb-2">Share your first photo</h3>
                <p className="text-muted-foreground mb-4">When you share photos, they will appear on your profile.</p>
                <Button 
                  className="instagram-gradient text-white border-0"
                  onClick={() => setIsCreatePostOpen(true)}
                >
                  Share your first photo
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {userPosts.map(post => (
                  <button
                    key={post.id}
                    onClick={() => handlePostClick(post.id)}
                    className="aspect-square bg-muted overflow-hidden"
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.caption}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </button>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="mt-0">
            {favoriteRestaurants.length === 0 && favoriteDishes.length === 0 ? (
              <div className="p-6 text-center">
                <Heart size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Your Favorites</h3>
                <p className="text-muted-foreground mb-4">
                  Save restaurants and dishes you love for quick access
                </p>
                <Button 
                  variant="outline"
                  onClick={() => setIsFavoritesOpen(true)}
                >
                  <Heart size={16} className="mr-2" />
                  Explore Favorites
                </Button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {favoriteRestaurants.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Restaurants ({favoriteRestaurants.length})</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setIsFavoritesOpen(true)}
                        className="text-sm text-muted-foreground"
                      >
                        View All
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {favoriteRestaurants.slice(0, 4).map((restaurant: any) => (
                        <Card key={restaurant.id} className="overflow-hidden">
                          <div className="aspect-square bg-muted relative">
                            <img
                              src={restaurant.image}
                              alt={restaurant.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <Heart size={16} className="text-red-500 fill-current" />
                            </div>
                          </div>
                          <div className="p-2">
                            <h5 className="font-medium text-sm truncate">{restaurant.name}</h5>
                            <div className="flex items-center gap-1 mt-1">
                              <Star size={10} className="text-yellow-400 fill-current" />
                              <span className="text-xs text-muted-foreground">{restaurant.rating}</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                {favoriteDishes.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Dishes ({favoriteDishes.length})</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setIsFavoritesOpen(true)}
                        className="text-sm text-muted-foreground"
                      >
                        View All
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {favoriteDishes.slice(0, 4).map((dish: any) => (
                        <Card key={dish.id} className="overflow-hidden">
                          <div className="aspect-square bg-muted relative">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <Heart size={16} className="text-red-500 fill-current" />
                            </div>
                          </div>
                          <div className="p-2">
                            <h5 className="font-medium text-sm truncate">{dish.name}</h5>
                            <p className="text-xs text-muted-foreground truncate">{dish.restaurantName}</p>
                            <p className="text-sm font-bold mt-1">${dish.price.toFixed(2)}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsFavoritesOpen(true)}
                >
                  <Heart size={16} className="mr-2" />
                  Manage All Favorites
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            <div className="p-12 text-center">
              <MessageCircle size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No saved posts</h3>
              <p className="text-muted-foreground">
                Save posts you want to revisit
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-0 right-0 p-4 z-10 flex flex-col gap-3" style={{ 
        bottom: device.hasNotch ? 'calc(env(safe-area-inset-bottom) + 80px)' : '80px',
        right: '16px'
      }}>
        {/* Story Creation Button */}
        <Button
          size="lg"
          variant="secondary"
          className={cn(
            "w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-border touch-feedback shadow-lg",
            "active:scale-95"
          )}
          onClick={() => setIsCreateStoryOpen(true)}
        >
          <Camera size={20} />
        </Button>
        
        {/* Post Creation Button */}
        <Button
          size="lg"
          className={cn(
            "fab w-14 h-14 text-white border-0 touch-feedback",
            "active:scale-95"
          )}
          onClick={() => setIsCreatePostOpen(true)}
        >
          <Plus size={24} weight="bold" />
        </Button>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal 
        open={isCreatePostOpen} 
        onOpenChange={setIsCreatePostOpen}
      />
      
      {/* Create Story Modal */}
      <CreateStoryModal 
        open={isCreateStoryOpen} 
        onOpenChange={setIsCreateStoryOpen}
      />

      {/* Order History Modal */}
      <OrderHistory 
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
      />

      {/* Favorites Modal */}
      <FavoritesPage
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
      />
    </ScrollArea>
  );
}