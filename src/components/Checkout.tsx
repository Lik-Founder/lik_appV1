import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { useDevice } from '@/hooks/use-device';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  ArrowLeft,
  MapPin,
  Clock,
  CreditCard,
  Wallet,
  DeviceMobile,
  Star,
  Gift,
  CheckCircle,
  Truck
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { CartItem, DeliveryInfo, PaymentMethod, Order } from '@/lib/types';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  cartItems: CartItem[];
}

export function Checkout({ isOpen, onClose, onBack, cartItems }: CheckoutProps) {
  const [deliveryInfo, setDeliveryInfo] = useKV<DeliveryInfo>('delivery-info', {
    address: '123 Main St, New York, NY 10001',
    instructions: '',
    estimatedTime: '25-35 min',
    fee: 2.99
  });
  
  const [paymentMethods] = useKV<PaymentMethod[]>('payment-methods', [
    {
      id: '1',
      type: 'card',
      last4: '1234',
      cardType: 'visa',
      isDefault: true
    },
    {
      id: '2',
      type: 'apple_pay',
      isDefault: false
    },
    {
      id: '3',
      type: 'paypal',
      isDefault: false
    }
  ]);

  const [selectedPaymentId, setSelectedPaymentId] = useState(paymentMethods.find(p => p.isDefault)?.id || paymentMethods[0]?.id);
  const [tipAmount, setTipAmount] = useState(3.00);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string>('');

  const device = useDevice();

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08875; // NY tax rate
  const total = subtotal + deliveryInfo.fee + tax + tipAmount;

  const tipOptions = [
    { amount: Math.round(subtotal * 0.15 * 100) / 100, label: '15%' },
    { amount: Math.round(subtotal * 0.18 * 100) / 100, label: '18%' },
    { amount: Math.round(subtotal * 0.20 * 100) / 100, label: '20%' },
  ];

  const handlePlaceOrder = async () => {
    if (!selectedPaymentId) {
      toast.error('Please select a payment method');
      return;
    }

    setIsPlacingOrder(true);
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const selectedPayment = paymentMethods.find(p => p.id === selectedPaymentId);
      if (!selectedPayment) throw new Error('Payment method not found');

      // Group items by restaurant for the order
      const restaurantGroups = cartItems.reduce((acc, item) => {
        if (!acc[item.restaurantId]) {
          acc[item.restaurantId] = {
            restaurantName: item.restaurantName,
            items: []
          };
        }
        acc[item.restaurantId].items.push(item);
        return acc;
      }, {} as Record<string, { restaurantName: string; items: CartItem[] }>);

      // For demo purposes, create order for first restaurant
      const firstRestaurant = Object.values(restaurantGroups)[0];
      const orderId = 'ORD-' + Date.now();
      
      const newOrder: Order = {
        id: orderId,
        restaurantId: Object.keys(restaurantGroups)[0],
        restaurantName: firstRestaurant.restaurantName,
        items: firstRestaurant.items,
        subtotal,
        deliveryFee: deliveryInfo.fee,
        tip: tipAmount,
        tax,
        total,
        deliveryInfo,
        paymentMethod: selectedPayment,
        status: 'confirmed',
        timestamp: Date.now(),
        estimatedDelivery: deliveryInfo.estimatedTime
      };

      // Save order (in real app, this would be sent to backend)
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.unshift(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));

      // Add sample orders if this is the first order (for demo purposes)
      if (orders.length === 1) {
        const sampleOrders: Order[] = [
          {
            id: 'ORD-' + (Date.now() - 86400000), // 1 day ago
            restaurantId: 'restaurant-0',
            restaurantName: "Mario's Pizza Palace",
            items: [
              {
                id: 'restaurant-0-item-0',
                restaurantId: 'restaurant-0',
                restaurantName: "Mario's Pizza Palace",
                itemId: 'item-0',
                name: 'Margherita Pizza',
                description: 'Fresh mozzarella, basil, and tomato sauce',
                price: 16.99,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop',
                quantity: 1
              },
              {
                id: 'restaurant-0-item-1',
                restaurantId: 'restaurant-0', 
                restaurantName: "Mario's Pizza Palace",
                itemId: 'item-1',
                name: 'Caesar Salad',
                description: 'Crisp romaine lettuce with parmesan cheese',
                price: 12.99,
                image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop',
                quantity: 1
              }
            ],
            subtotal: 29.98,
            deliveryFee: 2.99,
            tip: 5.00,
            tax: 2.40,
            total: 40.37,
            deliveryInfo: {
              address: '123 Main St, New York, NY 10001',
              estimatedTime: '25-35 min',
              fee: 2.99
            },
            paymentMethod: selectedPayment,
            status: 'delivered',
            timestamp: Date.now() - 86400000,
            estimatedDelivery: '25-35 min'
          },
          {
            id: 'ORD-' + (Date.now() - 172800000), // 2 days ago
            restaurantId: 'restaurant-1',
            restaurantName: 'Tokyo Sushi Bar',
            items: [
              {
                id: 'restaurant-1-item-2',
                restaurantId: 'restaurant-1',
                restaurantName: 'Tokyo Sushi Bar',
                itemId: 'item-2',
                name: 'Salmon Roll',
                description: 'Fresh salmon with avocado and cucumber',
                price: 18.99,
                image: 'https://images.unsplash.com/photo-1563379091339-03246963d321?w=200&h=200&fit=crop',
                quantity: 2
              }
            ],
            subtotal: 37.98,
            deliveryFee: 2.99,
            tip: 7.00,
            tax: 3.04,
            total: 51.01,
            deliveryInfo: {
              address: '123 Main St, New York, NY 10001',
              estimatedTime: '30-40 min',
              fee: 2.99
            },
            paymentMethod: selectedPayment,
            status: 'delivered',
            timestamp: Date.now() - 172800000,
            estimatedDelivery: '30-40 min'
          }
        ];
        
        orders.push(...sampleOrders);
        localStorage.setItem('orders', JSON.stringify(orders));
      }

      setPlacedOrderId(orderId);
      setOrderPlaced(true);
      
      // Clear cart
      localStorage.removeItem('cart-items-detailed');
      
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleAddressChange = (field: keyof DeliveryInfo, value: string | number) => {
    setDeliveryInfo(current => ({
      ...current,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  if (orderPlaced) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-green-100 p-4 rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-4">
            Your order #{placedOrderId} has been placed successfully
          </p>
          
          <Card className="w-full max-w-md mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Estimated Delivery</p>
                  <p className="text-sm text-muted-foreground">{deliveryInfo.estimatedTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-sm text-muted-foreground">{deliveryInfo.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3 w-full max-w-md">
            <Button 
              className="w-full" 
              onClick={onClose}
            >
              Continue Shopping
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                toast.info('Order tracking coming soon!');
              }}
            >
              Track Order
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Checkout</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Delivery Address */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={deliveryInfo.address}
                onChange={(e) => handleAddressChange('address', e.target.value)}
                placeholder="Enter delivery address"
              />
            </div>
            <div>
              <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
              <Textarea
                id="instructions"
                value={deliveryInfo.instructions || ''}
                onChange={(e) => handleAddressChange('instructions', e.target.value)}
                placeholder="e.g., Leave at door, Ring doorbell"
                rows={2}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Estimated delivery: {deliveryInfo.estimatedTime}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={selectedPaymentId} 
              onValueChange={setSelectedPaymentId}
              className="space-y-3"
            >
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-3">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id} className="flex items-center gap-2 flex-1 cursor-pointer">
                    {method.type === 'card' && <CreditCard className="h-4 w-4" />}
                    {method.type === 'apple_pay' && <DeviceMobile className="h-4 w-4" />}
                    {method.type === 'paypal' && <Wallet className="h-4 w-4" />}
                    
                    <span className="flex-1">
                      {method.type === 'card' && `${method.cardType?.toUpperCase()} •••• ${method.last4}`}
                      {method.type === 'apple_pay' && 'Apple Pay'}
                      {method.type === 'paypal' && 'PayPal'}
                    </span>
                    
                    {method.isDefault && (
                      <Badge variant="secondary" className="text-xs">Default</Badge>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Tip */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Tip Your Driver
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {tipOptions.map((option) => (
                <Button
                  key={option.amount}
                  variant={tipAmount === option.amount ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTipAmount(option.amount)}
                >
                  ${option.amount.toFixed(2)}
                  <br />
                  <span className="text-xs opacity-70">{option.label}</span>
                </Button>
              ))}
            </div>
            <div>
              <Label htmlFor="custom-tip">Custom Amount</Label>
              <Input
                id="custom-tip"
                type="number"
                step="0.01"
                min="0"
                value={tipAmount}
                onChange={(e) => setTipAmount(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>${deliveryInfo.fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tip:</span>
                <span>${tipAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-base">
                <span>Total:</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-background p-4">
        <Button
          className="w-full"
          size="lg"
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder || !selectedPaymentId}
        >
          {isPlacingOrder ? (
            "Placing Order..."
          ) : (
            <>
              <Gift className="h-4 w-4 mr-2" />
              Place Order - ${total.toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}