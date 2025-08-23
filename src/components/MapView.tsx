import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MagnifyingGlassIcon as SearchIcon,
  AdjustmentsHorizontalIcon as FilterIcon,
  ArrowLeftIcon as ArrowLeft,
  StarIcon as Star,
  ClockIcon as Clock,
  TruckIcon as Truck,
  MapPinIcon as MapPin,
  ArrowUpIcon as Navigation,
  PlusIcon as Plus,
  MinusIcon as Minus,
  XMarkIcon as X
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

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

interface MapViewProps {
  restaurants: Restaurant[];
  onBack: () => void;
  onShowRestaurantProfile?: (restaurantId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const mapPins = [
  { id: 'restaurant-0', lat: 37.7749, lng: -122.4194, name: "Mario's Pizza Palace" },
  { id: 'restaurant-1', lat: 37.7849, lng: -122.4094, name: "Tokyo Sushi Bar" },
  { id: 'restaurant-2', lat: 37.7649, lng: -122.4294, name: "Healthy Bowl Co." },
  { id: 'restaurant-3', lat: 37.7789, lng: -122.4184, name: "Burger Junction" },
  { id: 'restaurant-4', lat: 37.7709, lng: -122.4304, name: "Spice Route Indian" },
  { id: 'restaurant-5', lat: 37.7819, lng: -122.4164, name: "Fresh Salad Works" },
  { id: 'restaurant-6', lat: 37.7729, lng: -122.4244, name: "Taco Libre" },
  { id: 'restaurant-7', lat: 37.7769, lng: -122.4134, name: "Coffee & More" },
  { id: 'restaurant-8', lat: 37.7809, lng: -122.4214, name: "Pasta Corner" },
  { id: 'restaurant-9', lat: 37.7689, lng: -122.4334, name: "BBQ Paradise" },
];

export function MapView({ restaurants, onBack, onShowRestaurantProfile, searchQuery, onSearchChange }: MapViewProps) {
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [mapCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [filters, setFilters] = useState<string[]>(['All']);
  const mapRef = useRef<HTMLDivElement>(null);

  const filterOptions = ['All', 'Nearby', 'Fast Delivery', 'Highly Rated', 'Free Delivery'];

  const toggleFilter = (filter: string) => {
    if (filter === 'All') {
      setFilters(['All']);
    } else {
      setFilters(current => {
        const newFilters = current.filter(f => f !== 'All');
        if (newFilters.includes(filter)) {
          const filtered = newFilters.filter(f => f !== filter);
          return filtered.length === 0 ? ['All'] : filtered;
        } else {
          return [...newFilters, filter];
        }
      });
    }
  };

  const selectedRestaurant = selectedPin ? restaurants.find(r => r.id === selectedPin) : null;

  const handlePinClick = (pinId: string) => {
    setSelectedPin(pinId === selectedPin ? null : pinId);
  };

  const handleRestaurantCardClick = () => {
    if (selectedRestaurant) {
      onShowRestaurantProfile?.(selectedRestaurant.id);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur-sm border-b border-border z-20 relative">
        {/* Top Navigation */}
        <div className="flex items-center gap-3 p-4 pb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-8 w-8 p-0 rounded-full"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </Button>

          {/* Search Bar */}
          <div className="relative flex-1">
            <SearchIcon 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" 
            />
            <Input
              placeholder="Search restaurants & cuisines"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
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

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
          >
            <Navigation className="w-4.5 h-4.5" />
          </Button>
        </div>

        {/* Filter Chips */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {filterOptions.map((filter) => (
              <Badge
                key={filter}
                variant={filters.includes(filter) ? "default" : "secondary"}
                onClick={() => toggleFilter(filter)}
                className={cn(
                  "cursor-pointer whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium nav-rum-raisin",
                  "touch-target transition-all duration-200",
                  filters.includes(filter) 
                    ? "bg-foreground text-background font-semibold" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80 font-light"
                )}
              >
                {filter}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden">
        {/* Stylized Map Background */}
        <div 
          ref={mapRef}
          className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        >
          {/* Street patterns for visual effect */}
          <div className="absolute inset-0">
            {/* Main streets */}
            <div className="absolute top-1/4 left-0 right-0 h-2 bg-slate-300 opacity-60"></div>
            <div className="absolute top-3/4 left-0 right-0 h-2 bg-slate-300 opacity-60"></div>
            <div className="absolute left-1/4 top-0 bottom-0 w-2 bg-slate-300 opacity-60"></div>
            <div className="absolute left-3/4 top-0 bottom-0 w-2 bg-slate-300 opacity-60"></div>
            
            {/* Intersections */}
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-slate-400 opacity-40 rounded-full transform -translate-x-1 -translate-y-1"></div>
            <div className="absolute top-1/4 left-3/4 w-4 h-4 bg-slate-400 opacity-40 rounded-full transform -translate-x-1 -translate-y-1"></div>
            <div className="absolute top-3/4 left-1/4 w-4 h-4 bg-slate-400 opacity-40 rounded-full transform -translate-x-1 -translate-y-1"></div>
            <div className="absolute top-3/4 left-3/4 w-4 h-4 bg-slate-400 opacity-40 rounded-full transform -translate-x-1 -translate-y-1"></div>
          </div>

          {/* Restaurant Pins */}
          {mapPins.map((pin, index) => {
            const restaurant = restaurants.find(r => r.id === pin.id);
            if (!restaurant) return null;

            // Calculate position based on lat/lng relative to map center
            const x = ((pin.lng - mapCenter.lng) * 8000) + 50;
            const y = ((mapCenter.lat - pin.lat) * 8000) + 50;

            const isSelected = selectedPin === pin.id;

            return (
              <div
                key={pin.id}
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all duration-200",
                  isSelected ? "scale-110" : "hover:scale-105"
                )}
                style={{
                  left: `${Math.max(5, Math.min(95, x))}%`,
                  top: `${Math.max(5, Math.min(95, y))}%`
                }}
                onClick={() => handlePinClick(pin.id)}
              >
                <div className={cn(
                  "relative flex items-center justify-center",
                  isSelected && "animate-bounce"
                )}>
                  {/* Pin shadow */}
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-black/20 rounded-full blur-sm"></div>
                  
                  {/* Pin body */}
                  <div className={cn(
                    "w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center",
                    isSelected 
                      ? "bg-red-500 text-white" 
                      : restaurant.isPartner 
                        ? "bg-red-500 text-white" 
                        : "bg-orange-500 text-white"
                  )}>
                    <div className="text-lg">🍽️</div>
                  </div>
                  
                  {/* Pin pointer */}
                  <div className={cn(
                    "absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4",
                    isSelected 
                      ? "border-transparent border-t-red-500" 
                      : restaurant.isPartner 
                        ? "border-transparent border-t-red-500" 
                        : "border-transparent border-t-orange-500"
                  )}></div>

                  {/* Restaurant name label */}
                  {isSelected && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-2 py-1 shadow-lg border whitespace-nowrap">
                      <div className="text-xs font-medium text-center">{restaurant.name}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-white"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Location Labels */}
        <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div className="text-sm font-medium">San Francisco</div>
          <div className="text-xs text-muted-foreground">California</div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-20 right-4 flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-10 w-10 p-0 bg-white shadow-lg rounded-full border-2"
          >
            <Plus className="w-4.5 h-4.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-10 w-10 p-0 bg-white shadow-lg rounded-full border-2"
          >
            <Minus className="w-4.5 h-4.5" />
          </Button>
        </div>
      </div>

      {/* Bottom Sheet - Restaurant Details */}
      {selectedRestaurant && (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl border-t border-border z-30 animate-slideUp">
          <div className="p-4">
            {/* Handle */}
            <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4"></div>
            
            {/* Restaurant Card */}
            <div 
              className="cursor-pointer"
              onClick={handleRestaurantCardClick}
            >
              <div className="flex gap-4">
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={selectedRestaurant.image}
                    alt={selectedRestaurant.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedRestaurant.promo && (
                    <div className="absolute top-1 left-1 bg-red-500 text-white px-1 py-0.5 rounded text-xs font-medium">
                      {selectedRestaurant.promo}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{selectedRestaurant.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {selectedRestaurant.categories.join(', ')}
                      </p>
                      
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{selectedRestaurant.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({selectedRestaurant.reviewCount}) • {selectedRestaurant.distance}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{selectedRestaurant.deliveryTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          <span>
                            {selectedRestaurant.deliveryFee === 0 ? 'Free delivery' : `$${selectedRestaurant.deliveryFee} delivery`}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPin(null);
                      }}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <Button 
                  className="flex-1 rounded-full"
                  onClick={handleRestaurantCardClick}
                >
                  View Menu
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-full"
                >
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}