import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { useDevice } from '@/hooks/use-device';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeftIcon as ArrowLeft,
  ArrowPathIcon as ClockCounterClockwise,
  MapPinIcon as MapPin,
  TruckIcon as Truck,
  CheckCircleIcon as CheckCircle,
  ClockIcon as Clock,
  StarIcon as Star,
  PhoneIcon as Phone,
  ShoppingCartIcon as ShoppingCart,
  PlusIcon as Plus
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Order, CartItem } from '@/lib/types';

interface OrderHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onShowRestaurantProfile?: (restaurantId: string) => void;
}

export function OrderHistory({ isOpen, onClose, onShowRestaurantProfile }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cartItemsDetailed, setCartItemsDetailed] = useKV<CartItem[]>('cart-items-detailed', []);
  const device = useDevice();

  useEffect(() => {
    if (isOpen) {
      // Load orders from localStorage (in real app, this would be from API)
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      setOrders(savedOrders);
    }
  }, [isOpen]);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'preparing':
        return <ClockCounterClockwise className="h-4 w-4 text-orange-500" />;
      case 'on_the_way':
        return <Truck className="h-4 w-4 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <CheckCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleContactDriver = () => {
    toast.info('Driver contact feature coming soon!');
  };

  const handleReorder = (order: Order) => {
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
    onClose();
  };

  const handleReorderSingleItem = (item: CartItem, order: Order) => {
    const cartItemId = `${item.restaurantId}-${item.itemId}-${Date.now()}`;
    
    setCartItemsDetailed(current => {
      const existingItemIndex = current.findIndex(
        cartItem => cartItem.restaurantId === item.restaurantId && cartItem.itemId === item.itemId
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        return current.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        // Add new item to cart
        const newCartItem: CartItem = {
          ...item,
          id: cartItemId
        };
        return [...current, newCartItem];
      }
    });

    toast.success(`${item.name} added to cart!`);
  };

  if (!isOpen) return null;

  if (selectedOrder) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Order #{selectedOrder.id.split('-')[1]}</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Status */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                {getStatusIcon(selectedOrder.status)}
                <div>
                  <h3 className="font-semibold capitalize">{selectedOrder.status.replace('_', ' ')}</h3>
                  <p className="text-sm text-muted-foreground">
                    Ordered on {formatDate(selectedOrder.timestamp)}
                  </p>
                </div>
              </div>
              
              {selectedOrder.status === 'on_the_way' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-primary" />
                    <span>Your order is on the way</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleContactDriver}>
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Driver
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Restaurant Info */}
          <Card>
            <CardHeader>
              <CardTitle 
                className="text-base cursor-pointer hover:underline"
                onClick={() => onShowRestaurantProfile?.(selectedOrder.restaurantId)}
              >
                {selectedOrder.restaurantName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{selectedOrder.deliveryInfo.address}</span>
              </div>
              {selectedOrder.deliveryInfo.instructions && (
                <p className="text-sm text-muted-foreground">
                  <strong>Instructions:</strong> {selectedOrder.deliveryInfo.instructions}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm">Qty: {item.quantity}</span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReorderSingleItem(item, selectedOrder)}
                    className="h-8 w-8 p-0 rounded-full flex-shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${selectedOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>${selectedOrder.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tip:</span>
                <span>${selectedOrder.tip.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${selectedOrder.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-base">
                <span>Total:</span>
                <span>${selectedOrder.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="border-t border-border p-4 space-y-3">
          <Button 
            variant="default" 
            className="w-full"
            onClick={() => handleReorder(selectedOrder)}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Reorder All Items
          </Button>
          {selectedOrder.status === 'delivered' && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleReorder(selectedOrder)}
            >
              Order Again
            </Button>
          )}
          <Button variant="outline" className="w-full" onClick={() => toast.info('Help & support coming soon!')}>
            Get Help
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Order History</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <ClockCounterClockwise className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-4">
              Your order history will appear here once you place your first order.
            </p>
            <Button onClick={onClose} variant="outline">
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {orders.map((order) => (
              <Card 
                key={order.id} 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedOrder(order)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 
                        className="font-semibold cursor-pointer hover:underline"
                        onClick={() => onShowRestaurantProfile?.(order.restaurantId)}
                      >
                        {order.restaurantName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.timestamp)} • {order.items.length} items
                      </p>
                    </div>
                    <Badge className={cn("text-xs", getStatusColor(order.status))}>
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">${order.total.toFixed(2)}</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReorder(order);
                        }}
                        className="text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Reorder
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}