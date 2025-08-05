import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  MapPin, 
  Search, 
  Share, 
  Bookmark, 
  Calendar, 
  Clock,
  Users,
  Heart,
  Map,
  ChevronLeft,
  ChevronRight,
  Flame
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface EventsPageProps {
  onBack: () => void;
}

interface Event {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  date: string;
  time: string;
  location: string;
  tags: string[];
  interested: number;
  price: 'Free' | '$' | '$$' | '$$$';
  category: string;
  countdown?: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Night Market Extravaganza',
    subtitle: 'Authentic Asian Street Food Festival',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    date: 'Sat, Aug 10',
    time: '5–9PM',
    location: 'Downtown Los Angeles',
    tags: ['Free Entry', 'Live Music', 'Family Friendly'],
    interested: 2100,
    price: 'Free',
    category: 'Night Market',
    countdown: 'Starts in 3 days'
  },
  {
    id: '2',
    title: 'Gourmet Food Truck Rally',
    subtitle: 'Best Food Trucks in the City',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&q=80',
    date: 'Sun, Aug 11',
    time: '12–6PM',
    location: 'Santa Monica Pier',
    tags: ['Pet Friendly', 'Outdoor'],
    interested: 1500,
    price: '$',
    category: 'Food Truck',
    countdown: 'Starts in 4 days'
  },
  {
    id: '3',
    title: 'Craft Beer & BBQ Festival',
    subtitle: 'Local Breweries & Pit Masters',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80',
    date: 'Fri, Aug 16',
    time: '6–11PM',
    location: 'Venice Beach',
    tags: ['21+ Only', 'Craft Beer', 'BBQ'],
    interested: 890,
    price: '$$',
    category: 'Festival'
  },
  {
    id: '4',
    title: 'Vegan Pop-Up Market',
    subtitle: 'Plant-Based Paradise',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    date: 'Sat, Aug 17',
    time: '10AM–4PM',
    location: 'Beverly Hills',
    tags: ['Vegan Friendly', 'Organic', 'Free Entry'],
    interested: 670,
    price: 'Free',
    category: 'Pop-Up'
  }
];

const filterChips = [
  'Nearby', 'Soon', 'Free Entry', '21+ Only', 'Pet Friendly', 
  'Live Music', 'Vegan Friendly', 'Family Friendly', 'Outdoor'
];

const cities = [
  'Los Angeles', 'San Francisco', 'New York', 'Chicago', 'Miami', 'Austin'
];

export function EventsPage({ onBack }: EventsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedCity, setSelectedCity] = useState('Los Angeles');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [heroEventIndex, setHeroEventIndex] = useState(0);
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);

  // Auto-rotate hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroEventIndex((prev) => (prev + 1) % mockEvents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter events based on search and filters
  useEffect(() => {
    let filtered = mockEvents.filter(event => 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (activeFilters.length > 0) {
      filtered = filtered.filter(event =>
        activeFilters.every(filter => 
          event.tags.includes(filter) || 
          (filter === 'Free Entry' && event.price === 'Free') ||
          (filter === 'Nearby' && event.location.includes(selectedCity))
        )
      );
    }

    setFilteredEvents(filtered);
  }, [searchQuery, activeFilters, selectedCity]);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const formatInterested = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const currentHeroEvent = mockEvents[heroEventIndex];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-background border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        <div className="relative">
          <Button 
            variant="ghost" 
            onClick={() => setShowCityPicker(!showCityPicker)}
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            <span className="font-medium">{selectedCity}</span>
          </Button>
          
          {showCityPicker && (
            <div className="absolute top-full mt-2 right-0 bg-background border rounded-lg shadow-lg p-2 z-10 min-w-40">
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setShowCityPicker(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors",
                    city === selectedCity && "bg-primary text-primary-foreground"
                  )}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
          >
            <Map className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Hero Carousel */}
      <div className="relative h-64 overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out h-full"
          style={{ transform: `translateX(-${heroEventIndex * 100}%)` }}
        >
          {mockEvents.map((event, index) => (
            <div
              key={event.id}
              className="min-w-full h-full relative bg-cover bg-center"
              style={{ backgroundImage: `url(${event.image})` }}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="text-white">
                  {event.countdown && (
                    <Badge variant="secondary" className="mb-2 bg-primary text-primary-foreground">
                      {event.countdown}
                    </Badge>
                  )}
                  <h1 className="text-2xl font-bold mb-1">{event.title}</h1>
                  {event.subtitle && (
                    <p className="text-white/90 mb-2">{event.subtitle}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
              
              {/* Hero Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button size="sm" variant="secondary" className="backdrop-blur-sm">
                  <Bookmark className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="secondary" className="backdrop-blur-sm">
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {mockEvents.map((_, index) => (
            <button
              key={index}
              onClick={() => setHeroEventIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === heroEventIndex 
                  ? "bg-white w-6" 
                  : "bg-white/50"
              )}
            />
          ))}
        </div>

        <button
          onClick={() => setHeroEventIndex((prev) => 
            prev === 0 ? mockEvents.length - 1 : prev - 1
          )}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 backdrop-blur-sm rounded-full p-2 text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={() => setHeroEventIndex((prev) => 
            (prev + 1) % mockEvents.length
          )}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 backdrop-blur-sm rounded-full p-2 text-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for Event"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {filterChips.map((filter) => (
            <Badge
              key={filter}
              variant={activeFilters.includes(filter) ? "default" : "secondary"}
              className={cn(
                "cursor-pointer whitespace-nowrap transition-all",
                activeFilters.includes(filter) 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
              onClick={() => toggleFilter(filter)}
            >
              {filter}
            </Badge>
          ))}
        </div>
      </div>

      {/* Events List or Map View */}
      {viewMode === 'list' ? (
        <div className="px-4 pb-6 space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-background/90 text-foreground">
                      {event.price}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1">{event.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {event.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {event.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{event.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span>{formatInterested(event.interested)} Interested</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Users className="h-4 w-4 mr-1" />
                          RSVP
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Calendar className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search for different events in {selectedCity}
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setActiveFilters([]);
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="px-4 pb-6">
          <div className="bg-muted rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <Map className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Map view coming soon</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}