import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Bookmark, 
  Share, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Camera, 
  QrCode,
  Navigation,
  Star,
  Heart,
  Play
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface FoodEventPageProps {
  eventId: string;
  onBack: () => void;
  onShowRestaurantProfile?: (restaurantId: string) => void;
  onShowUserProfile?: (userId: string) => void;
}

const mockEvent = {
  id: '1',
  name: 'BayArea Food Truck Meetup',
  subtitle: 'Taste from the top 10 trucks in SF',
  image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  video: null,
  date: 'August 12, 2025',
  time: '3 PM – 9 PM',
  address: '1234 Market Street, San Francisco, CA',
  distance: '2.3 miles',
  attendees: 247,
  isBookmarked: false,
  description: 'Join us for the ultimate food truck experience! Featuring the top 10 food trucks in San Francisco, live music, and a family-friendly atmosphere. Come hungry and ready to explore amazing street food from around the world.',
  organizer: 'SF Food Events',
  vendors: [
    'Curry Up Now', 'The Chairman', 'Señor Sisig', 'Off the Grid', 'Brass Knuckle',
    'Chairman Bao', 'Noms', 'Seoul on Wheels', 'Guerrilla Street Food'
  ],
  tags: [
    { icon: '🍔', label: 'Street Food' },
    { icon: '🎶', label: 'Live Music' },
    { icon: '🐶', label: 'Pet Friendly' },
    { icon: '👪', label: 'Family Friendly' },
    { icon: '🍻', label: 'Drinks' },
    { icon: '🎪', label: 'Festival' }
  ],
  photos: [
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  ],
  reviews: [
    {
      id: '1',
      user: { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
      rating: 5,
      comment: 'Amazing variety of food trucks! The tacos were incredible.',
      photo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
      id: '2',
      user: { name: 'Mike Rodriguez', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
      rating: 4,
      comment: 'Great atmosphere and live music. Perfect for families!',
      photo: null
    }
  ],
  attendingUsers: [
    { id: '1', name: 'Alex', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { id: '2', name: 'Emma', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { id: '3', name: 'David', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { id: '4', name: 'Lisa', avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' }
  ],
  ticketPrice: null,
  likPoints: 100,
  nearbyRestaurants: [
    { id: '1', name: 'Bella Italia', distance: '0.5 mi', rating: 4.8 },
    { id: '2', name: 'Taco Bell', distance: '0.3 mi', rating: 4.2 },
    { id: '3', name: 'Sushi Palace', distance: '0.7 mi', rating: 4.6 }
  ]
};

export function FoodEventPage({ eventId, onBack, onShowRestaurantProfile, onShowUserProfile }: FoodEventPageProps) {
  const [isBookmarked, setIsBookmarked] = useState(mockEvent.isBookmarked);
  const [isAttending, setIsAttending] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(mockEvent.attendees);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleRSVP = () => {
    setIsAttending(!isAttending);
    setAttendeeCount(prev => isAttending ? prev - 1 : prev + 1);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: mockEvent.name,
        text: mockEvent.subtitle,
        url: window.location.href,
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        weight={i < rating ? 'fill' : 'regular'}
        className={i < rating ? 'text-yellow-500' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b flex-shrink-0">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="rounded-full">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="font-semibold text-lg">Food Events</h1>
          <div className="w-8" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-safe">
        {/* Hero Section */}
        <div className="relative">
          <img
            src={mockEvent.image}
            alt={mockEvent.name}
            className="w-full h-64 object-cover"
          />
          
          {/* Hero Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Bookmark Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40"
          >
            <Bookmark size={20} weight={isBookmarked ? 'fill' : 'regular'} />
          </Button>

          {/* Event Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2 leading-tight">
              {mockEvent.name}
            </h1>
            <p className="text-lg opacity-90 mb-4">
              {mockEvent.subtitle}
            </p>
            
            {/* Date & Time Pill */}
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span className="text-sm font-medium">{mockEvent.date}</span>
              </div>
              <div className="w-1 h-1 bg-white/60 rounded-full" />
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span className="text-sm font-medium">{mockEvent.time}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location & RSVP Section */}
        <div className="p-6 space-y-4">
          {/* Map Preview */}
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-green-100 to-blue-100 relative rounded-t-lg">
              {/* Simple map placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin size={32} className="text-green-600" />
              </div>
            </div>
            <CardContent className="p-4">
              <p className="font-medium text-foreground mb-1">{mockEvent.address}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{mockEvent.distance} away</span>
                <Button size="sm" variant="outline" className="rounded-full">
                  <Navigation size={16} className="mr-2" />
                  Navigate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* RSVP & Share */}
          <div className="flex gap-3">
            <Button
              onClick={handleRSVP}
              className={cn(
                "flex-1 rounded-full font-semibold",
                isAttending
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-primary hover:bg-primary/90"
              )}
            >
              <Users size={20} className="mr-2" />
              {isAttending ? "Going!" : "I'm Going"} ({attendeeCount})
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare} className="rounded-full">
              <Share size={20} />
            </Button>
          </div>
        </div>

        {/* Event Details */}
        <div className="px-6 pb-6 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">About This Event</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {mockEvent.description}
              </p>
              <div className="text-sm text-muted-foreground">
                Organized by <span className="font-medium text-foreground">{mockEvent.organizer}</span>
              </div>
            </CardContent>
          </Card>

          {/* Vendors */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Featured Vendors</h3>
              <div className="flex flex-wrap gap-2">
                {mockEvent.vendors.map((vendor, index) => (
                  <Badge key={index} variant="secondary" className="rounded-full px-3 py-1">
                    {vendor}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <div>
            <h3 className="text-lg font-semibold mb-4">What to Expect</h3>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {mockEvent.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="whitespace-nowrap rounded-full px-4 py-2 text-sm"
                >
                  <span className="mr-2">{tag.icon}</span>
                  {tag.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Media Carousel */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Event Photos</h3>
            <Button variant="ghost" size="sm" className="rounded-full text-primary">
              <Camera size={16} className="mr-2" />
              Upload Photos
            </Button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {mockEvent.photos.map((photo, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo}
                  alt={`Event photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Community Section */}
        <div className="px-6 pb-6 space-y-6">
          {/* Reviews */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">What People Are Saying</h3>
              <div className="space-y-4">
                {mockEvent.reviews.map((review) => (
                  <div key={review.id} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Avatar
                        className="w-10 h-10 cursor-pointer"
                        onClick={() => onShowUserProfile?.(review.user.name)}
                      >
                        <AvatarImage src={review.user.avatar} />
                        <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{review.user.name}</span>
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {review.comment}
                        </p>
                        {review.photo && (
                          <img
                            src={review.photo}
                            alt="Review photo"
                            className="w-20 h-20 rounded-lg object-cover mt-2"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Who's Going */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Who's Going</h3>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {mockEvent.attendingUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex-shrink-0 text-center cursor-pointer"
                    onClick={() => onShowUserProfile?.(user.id)}
                  >
                    <Avatar className="w-12 h-12 mb-2">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-muted-foreground">{user.name}</p>
                  </div>
                ))}
                <div className="flex-shrink-0 text-center">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-2">
                    <span className="text-xs font-medium">+{attendeeCount - 4}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">more</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tickets & Rewards */}
        <div className="px-6 pb-6">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Check-in Rewards</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn Lik Points by attending this event
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">+{mockEvent.likPoints}</div>
                  <div className="text-xs text-muted-foreground">Lik Points</div>
                </div>
              </div>
              <Button className="w-full rounded-full">
                <QrCode size={20} className="mr-2" />
                Generate Check-in QR
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Nearby Suggestions */}
        <div className="px-6 pb-8">
          <h3 className="text-lg font-semibold mb-4">Explore Nearby</h3>
          <div className="space-y-3">
            {mockEvent.nearbyRestaurants.map((restaurant) => (
              <Card
                key={restaurant.id}
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => onShowRestaurantProfile?.(restaurant.id)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{restaurant.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin size={14} />
                      <span>{restaurant.distance}</span>
                      <div className="flex items-center gap-1">
                        <Star size={14} weight="fill" className="text-yellow-500" />
                        <span>{restaurant.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-full">
                    View
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt="Event photo"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
}