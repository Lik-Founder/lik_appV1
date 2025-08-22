import React, { useState, useEffect } from 'react';
import { CalendarIcon as Calendar, ClockIcon as Clock, UsersIcon as Users, StarIcon as Star, MapPinIcon as MapPin, PhoneIcon as Phone, CheckIcon as Check, XMarkIcon as X, ExclamationCircleIcon as AlertCircle } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useKV } from '@github/spark/hooks';
import { toast } from 'sonner';

interface TimeSlot {
  time: string;
  available: boolean;
  price?: number;
  maxPartySize: number;
}

interface Reservation {
  id: string;
  restaurantId: string;
  restaurantName: string;
  date: string;
  time: string;
  partySize: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  confirmationCode: string;
  createdAt: string;
}

interface ReservationSystemProps {
  restaurantId: string;
  restaurantName: string;
  onBack: () => void;
  onReservationComplete?: (reservation: Reservation) => void;
}

const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const isToday = date.toDateString() === new Date().toDateString();
  const currentHour = new Date().getHours();
  
  // Generate slots from 11:00 AM to 10:00 PM
  for (let hour = 11; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const isPastTime = isToday && hour < currentHour;
      
      // Simulate availability (80% chance of being available)
      const available = !isPastTime && Math.random() > 0.2;
      
      slots.push({
        time,
        available,
        maxPartySize: 8,
        price: hour >= 18 ? 25 : 0 // Premium time slots after 6 PM
      });
    }
  }
  
  return slots;
};

const generateConfirmationCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export function ReservationSystem({ 
  restaurantId, 
  restaurantName, 
  onBack, 
  onReservationComplete 
}: ReservationSystemProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [partySize, setPartySize] = useState<number>(2);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Booking form state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Storage for reservations
  const [reservations, setReservations] = useKV<Reservation[]>('user-reservations', []);

  useEffect(() => {
    const slots = generateTimeSlots(selectedDate);
    setTimeSlots(slots);
    setSelectedTime('');
    setShowBookingForm(false);
  }, [selectedDate]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  const getDateOptions = (): Date[] => {
    const dates: Date[] = [];
    const today = new Date();
    
    // Show next 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const handleTimeSlotSelect = (time: string) => {
    setSelectedTime(time);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !customerEmail || !customerPhone) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const reservation: Reservation = {
        id: Date.now().toString(),
        restaurantId,
        restaurantName,
        date: selectedDate.toISOString(),
        time: selectedTime,
        partySize,
        customerName,
        customerEmail,
        customerPhone,
        specialRequests,
        status: 'confirmed',
        confirmationCode: generateConfirmationCode(),
        createdAt: new Date().toISOString()
      };
      
      // Add to reservations
      setReservations(current => [...current, reservation]);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Reservation confirmed! Check your email for details.');
      
      if (onReservationComplete) {
        onReservationComplete(reservation);
      }
      
      // Reset form
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setSpecialRequests('');
      setShowBookingForm(false);
      setSelectedTime('');
      
    } catch (error) {
      toast.error('Failed to create reservation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const availableSlots = timeSlots.filter(slot => slot.available);
  const totalSlots = timeSlots.length;
  const availabilityPercentage = Math.round((availableSlots.length / totalSlots) * 100);

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <X className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-rum-raisin font-bold">Make Reservation</h1>
          <p className="text-sm text-muted-foreground">{restaurantName}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Restaurant Info Card */}
        <Card className="m-4 border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{restaurantName}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>123 Foodie Street, NYC</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>4.8 (1.2k reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>(555) 123-4567</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Selection */}
        <Card className="m-4 border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-5 h-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-2">
              {getDateOptions().slice(0, 8).map((date, index) => (
                <Button
                  key={index}
                  variant={selectedDate.toDateString() === date.toDateString() ? "default" : "outline"}
                  className="h-auto p-3 flex flex-col items-start"
                  onClick={() => setSelectedDate(date)}
                >
                  <span className="text-xs opacity-70">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="font-semibold">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </Button>
              ))}
            </div>
            
            {selectedDate && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{formatDate(selectedDate)}</span>
                  <Badge variant={availabilityPercentage > 50 ? "default" : "destructive"}>
                    {availabilityPercentage}% available
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Party Size Selection */}
        <Card className="m-4 border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="w-5 h-5" />
              Party Size
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                <Button
                  key={size}
                  variant={partySize === size ? "default" : "outline"}
                  className="aspect-square"
                  onClick={() => setPartySize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card className="m-4 border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="w-5 h-5" />
              Available Times
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  className={`h-auto p-3 flex flex-col ${
                    !slot.available ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!slot.available || slot.maxPartySize < partySize}
                  onClick={() => slot.available && handleTimeSlotSelect(slot.time)}
                >
                  <span className="font-semibold">{formatTime(slot.time)}</span>
                  {slot.price && slot.price > 0 && (
                    <span className="text-xs opacity-70">+${slot.price}</span>
                  )}
                </Button>
              ))}
            </div>
            
            {timeSlots.filter(slot => !slot.available).length > 0 && (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                <span>Grayed out times are unavailable</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Form */}
        {showBookingForm && (
          <Card className="m-4 border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Reservation Details</CardTitle>
              <div className="text-sm text-muted-foreground">
                {formatDate(selectedDate)} at {formatTime(selectedTime)} for {partySize} guests
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="requests">Special Requests</Label>
                  <Textarea
                    id="requests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Any dietary restrictions, celebrations, or special requests?"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="pt-4 space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full h-12"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Confirming Reservation...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        <span>Confirm Reservation</span>
                      </div>
                    )}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowBookingForm(false)}
                  >
                    Choose Different Time
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Terms and Policies */}
        <Card className="m-4 border-0 shadow-lg">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Reservation Policy</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Reservations can be cancelled up to 2 hours in advance</li>
              <li>• Late arrivals of 15+ minutes may result in table release</li>
              <li>• Groups of 6+ may have 18% gratuity added</li>
              <li>• Special dietary needs should be mentioned in advance</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}