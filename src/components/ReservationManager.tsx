import { useState } from 'react';
import { CalendarIcon as Calendar, ClockIcon as Clock, UsersIcon as Users, MapPinIcon as MapPin, PhoneIcon as Phone, EnvelopeIcon as Mail, QrCodeIcon as QrCode, StarIcon as Star, XMarkIcon as X, CheckIcon as Check, ExclamationCircleIcon as AlertCircle } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useKV } from '@github/spark/hooks';
import { toast } from 'sonner';

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

interface ReservationManagerProps {
  onBack: () => void;
  onShowReservationSystem?: (restaurantId: string) => void;
}

export function ReservationManager({ onBack, onShowReservationSystem }: ReservationManagerProps) {
  const [reservations, setReservations] = useKV<Reservation[]>('user-reservations', []);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  const isUpcoming = (dateString: string, time: string): boolean => {
    const reservationDate = new Date(dateString);
    const [hours, minutes] = time.split(':');
    reservationDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return reservationDate > new Date();
  };

  const upcomingReservations = reservations.filter(r => 
    r.status !== 'cancelled' && isUpcoming(r.date, r.time)
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastReservations = reservations.filter(r => 
    !isUpcoming(r.date, r.time) || r.status === 'cancelled'
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleCancelReservation = (reservationId: string) => {
    setReservations(current => 
      current.map(r => 
        r.id === reservationId 
          ? { ...r, status: 'cancelled' as const }
          : r
      )
    );
    toast.success('Reservation cancelled successfully');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const displayReservations = activeTab === 'upcoming' ? upcomingReservations : pastReservations;

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <X className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-rum-raisin font-bold">My Reservations</h1>
          <p className="text-sm text-muted-foreground">Manage your dining plans</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b px-4">
        <div className="flex">
          <Button
            variant={activeTab === 'upcoming' ? 'default' : 'ghost'}
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming ({upcomingReservations.length})
          </Button>
          <Button
            variant={activeTab === 'past' ? 'default' : 'ghost'}
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            onClick={() => setActiveTab('past')}
          >
            Past ({pastReservations.length})
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {displayReservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {activeTab === 'upcoming' ? 'No Upcoming Reservations' : 'No Past Reservations'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {activeTab === 'upcoming' 
                ? "You don't have any upcoming dining plans. Ready to discover your next great meal?"
                : "You haven't made any reservations yet."
              }
            </p>
            {activeTab === 'upcoming' && onShowReservationSystem && (
              <Button onClick={() => onShowReservationSystem('bella-italia')}>
                Make a Reservation
              </Button>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {displayReservations.map((reservation) => (
              <Card key={reservation.id} className="border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{reservation.restaurantName}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>123 Foodie Street, NYC</span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(reservation.status)}
                  </div>

                  {/* Reservation Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{formatDate(reservation.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{formatTime(reservation.time)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{reservation.partySize} guests</span>
                    </div>
                  </div>

                  {/* Confirmation Code */}
                  <div className="bg-muted/50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-muted-foreground">Confirmation Code</span>
                        <div className="font-mono font-semibold">{reservation.confirmationCode}</div>
                      </div>
                      <QrCode className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Special Requests */}
                  {reservation.specialRequests && (
                    <div className="mb-4">
                      <span className="text-xs text-muted-foreground">Special Requests</span>
                      <p className="text-sm mt-1">{reservation.specialRequests}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Restaurant
                    </Button>
                    
                    {activeTab === 'upcoming' && reservation.status === 'confirmed' && (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleCancelReservation(reservation.id)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                    
                    {activeTab === 'past' && reservation.status === 'confirmed' && (
                      <Button variant="outline" size="sm" className="flex-1">
                        <Star className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                    )}
                  </div>

                  {/* Booking Info */}
                  <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                    Booked on {new Date(reservation.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {upcomingReservations.length > 0 && activeTab === 'upcoming' && (
        <div className="p-4 bg-white border-t">
          <Card className="border-0 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Upcoming Reservation</p>
                  <p className="text-xs text-muted-foreground">
                    Next: {upcomingReservations[0].restaurantName} on {formatDate(upcomingReservations[0].date)}
                  </p>
                </div>
                <Button size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}