import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConsistentAvatar } from '@/components/ui/consistent-avatar';
import { Card, CardContent } from '@/components/ui/card';
import { 
  XMarkIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  UserGroupIcon,
  ClockIcon,
  FireIcon,
  StarIcon,
  EyeIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon,
  ShareIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  PlusIcon,
  MinusIcon,
  GlobeAltIcon,
  BuildingStorefrontIcon,
  CameraIcon,
  PlayIcon,
  PhotoIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  HandRaisedIcon,
  TrophyIcon,
  BoltIcon,
  GiftIcon,
  BeakerIcon,
  MusicalNoteIcon,
  PuzzlePieceIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';
import { useKV } from '@github/spark/hooks';
import LikLogoHeart from '@/assets/images/Lik_Logo_Heart_1.0.png';

interface MapLocation {
  id: string;
  lat: number;
  lng: number;
  type: 'user' | 'restaurant' | 'event' | 'hotspot' | 'friend';
  title: string;
  subtitle?: string;
  avatar?: string;
  media?: {
    type: 'image' | 'video';
    url: string;
    duration?: number;
  };
  timestamp?: Date;
  isActive?: boolean;
  viewCount?: number;
  heatLevel?: number;
  rating?: number;
  isOpen?: boolean;
  isVerified?: boolean;
  distance?: number;
  category?: string;
  tags?: string[];
  likCount?: number;
  commentCount?: number;
  isLiked?: boolean;
  isFriend?: boolean;
  isMutualFriend?: boolean;
  level?: number;
  status?: 'online' | 'recently' | 'offline';
  activity?: string;
  mood?: string;
  streakDays?: number;
  friends?: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
}

interface MapPageProps {
  onBack: () => void;
  onShowUserProfile?: (userId: string) => void;
  onShowRestaurantProfile?: (restaurantId: string) => void;
}

// Mock data for map locations
const mockMapLocations: MapLocation[] = [
  {
    id: '1',
    lat: 40.7589,
    lng: -73.9851,
    type: 'friend',
    title: 'Sarah Chen',
    subtitle: 'At Gourmet Bistro',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop'
    },
    timestamp: new Date(Date.now() - 30 * 60000), // 30 mins ago
    isActive: true,
    viewCount: 45,
    level: 12,
    status: 'online',
    activity: 'Trying amazing pasta!',
    mood: '😋',
    streakDays: 7,
    isFriend: true,
    likCount: 23,
    commentCount: 5,
    isLiked: false
  },
  {
    id: '2',
    lat: 40.7505,
    lng: -73.9934,
    type: 'restaurant',
    title: 'Bella Italia',
    subtitle: 'Italian • $$$ • 4.7⭐',
    avatar: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&h=150&fit=crop',
    media: {
      type: 'video',
      url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=600&fit=crop',
      duration: 15
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
    isActive: true,
    viewCount: 234,
    heatLevel: 8,
    rating: 4.7,
    isOpen: true,
    isVerified: true,
    distance: 0.3,
    category: 'Italian',
    tags: ['Pasta', 'Wine Bar', 'Date Night'],
    likCount: 156,
    commentCount: 28
  },
  {
    id: '3',
    lat: 40.7614,
    lng: -73.9776,
    type: 'hotspot',
    title: 'Times Square Food District',
    subtitle: '🔥 Hot Right Now',
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=600&fit=crop'
    },
    timestamp: new Date(Date.now() - 45 * 60000),
    isActive: true,
    viewCount: 1250,
    heatLevel: 10,
    distance: 0.8,
    category: 'Food District',
    tags: ['Street Food', 'Diverse', 'Tourist Spot'],
    likCount: 892,
    commentCount: 156
  },
  {
    id: '4',
    lat: 40.7282,
    lng: -74.0776,
    type: 'friend',
    title: 'Marco Rodriguez',
    subtitle: 'At The Burger Joint',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=600&fit=crop'
    },
    timestamp: new Date(Date.now() - 4 * 60 * 60000), // 4 hours ago
    isActive: false,
    viewCount: 67,
    level: 8,
    status: 'recently',
    activity: 'Best burger in NYC!',
    mood: '🤤',
    streakDays: 3,
    isFriend: true,
    isMutualFriend: true,
    likCount: 34,
    commentCount: 8,
    friends: [
      { id: 'f1', name: 'Alex', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
      { id: 'f2', name: 'Sam', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' }
    ]
  },
  {
    id: '5',
    lat: 40.7516,
    lng: -73.9755,
    type: 'event',
    title: 'Food Truck Festival',
    subtitle: 'Live Event • 2hrs left',
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    },
    timestamp: new Date(Date.now() - 60 * 60000),
    isActive: true,
    viewCount: 456,
    heatLevel: 9,
    distance: 0.5,
    category: 'Food Event',
    tags: ['Food Trucks', 'Live Music', 'Family Friendly'],
    likCount: 234,
    commentCount: 67
  },
  {
    id: '6',
    lat: 40.7505,
    lng: -73.9855,
    type: 'user',
    title: 'Jessica Park',
    subtitle: 'Shared a story',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    media: {
      type: 'video',
      url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=600&fit=crop',
      duration: 8
    },
    timestamp: new Date(Date.now() - 6 * 60 * 60000),
    isActive: false,
    viewCount: 89,
    level: 15,
    status: 'offline',
    activity: 'Taco Tuesday vibes 🌮',
    likCount: 67,
    commentCount: 12
  }
];

export function MapPage({ onBack, onShowUserProfile, onShowRestaurantProfile }: MapPageProps) {
  const [locations, setLocations] = useKV('map-locations', mockMapLocations);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState({ lat: 40.7589, lng: -73.9851 });
  const [zoomLevel, setZoomLevel] = useState(14);
  const [filterType, setFilterType] = useState<'all' | 'friends' | 'restaurants' | 'events' | 'hotspots'>('all');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [showLocationSettings, setShowLocationSettings] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Simulate user location
  const [userLocation] = useState({ lat: 40.7589, lng: -73.9851 });

  // Filter locations based on selected filter
  const filteredLocations = locations.filter(location => {
    if (filterType === 'all') return true;
    if (filterType === 'friends') return location.type === 'friend' || location.type === 'user';
    if (filterType === 'restaurants') return location.type === 'restaurant';
    if (filterType === 'events') return location.type === 'event';
    if (filterType === 'hotspots') return location.type === 'hotspot';
    return true;
  }).filter(location => {
    if (!searchQuery) return true;
    return location.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           location.subtitle?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Handle location tap
  const handleLocationTap = (location: MapLocation) => {
    setSelectedLocation(location);
    setDetailsOpen(true);
    setMapCenter({ lat: location.lat, lng: location.lng });
  };

  // Handle like toggle
  const handleLike = (locationId: string) => {
    setLocations(prev => prev.map(loc => 
      loc.id === locationId 
        ? { 
            ...loc, 
            isLiked: !loc.isLiked,
            likCount: (loc.likCount || 0) + (loc.isLiked ? -1 : 1)
          }
        : loc
    ));
  };

  // Get location icon based on type
  const getLocationIcon = (location: MapLocation) => {
    const isActive = location.isActive && location.timestamp && 
      (Date.now() - location.timestamp.getTime()) < 24 * 60 * 60 * 1000; // 24 hours

    switch (location.type) {
      case 'friend':
      case 'user':
        return (
          <div className="relative">
            <ConsistentAvatar
              src={location.avatar}
              alt={location.title}
              fallback={location.title[0]}
              size="sm"
              variant={location.level ? "xp-ring" : "default"}
              level={location.level}
              xpProgress={0.65}
              className={cn(
                "border-2 transition-all duration-200",
                isActive ? "border-green-400 shadow-lg shadow-green-400/30" : "border-white",
                location.status === 'online' ? "ring-2 ring-green-400" : 
                location.status === 'recently' ? "ring-2 ring-yellow-400" : ""
              )}
            />
            {isActive && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            )}
            {location.mood && (
              <div className="absolute -bottom-1 -right-1 text-xs bg-white rounded-full w-5 h-5 flex items-center justify-center border">
                {location.mood}
              </div>
            )}
          </div>
        );
      case 'restaurant':
        return (
          <div className="relative">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center border-2 border-white shadow-lg transition-all duration-200",
              location.isOpen ? "bg-green-500" : "bg-gray-500",
              location.heatLevel && location.heatLevel > 7 ? "animate-pulse" : ""
            )}>
              <BuildingStorefrontIcon className="w-5 h-5 text-white" />
            </div>
            {location.isVerified && (
              <CheckCircleIcon className="absolute -top-1 -right-1 w-4 h-4 text-blue-500 bg-white rounded-full" />
            )}
            {location.heatLevel && location.heatLevel > 8 && (
              <div className="absolute -bottom-1 -right-1 flex items-center justify-center">
                <FireIcon className="w-4 h-4 text-red-500 animate-bounce" />
              </div>
            )}
          </div>
        );
      case 'event':
        return (
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
              <MusicalNoteIcon className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold animate-bounce">
              LIVE
            </div>
          </div>
        );
      case 'hotspot':
        return (
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-orange-500 flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
              <FireIcon className="w-6 h-6 text-white" />
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/30 via-yellow-500/30 to-orange-500/30 animate-ping" />
          </div>
        );
      default:
        return <MapPinIcon className="w-6 h-6 text-red-500" />;
    }
  };

  // Get time ago string
  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="h-full bg-gray-900 relative overflow-hidden">
      {/* Map container */}
      <div 
        ref={mapRef} 
        className="w-full h-full relative bg-gradient-to-br from-gray-800 via-gray-900 to-black"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(239, 68, 68, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, transparent 30%, rgba(16, 185, 129, 0.05) 30%, rgba(16, 185, 129, 0.05) 70%, transparent 70%)
          `
        }}
      >
        {/* Grid overlay for map feel */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* User location indicator */}
        <div 
          className="absolute z-10 transition-all duration-300"
          style={{
            left: `${50}%`,
            top: `${50}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
            <div className="absolute inset-0 w-4 h-4 bg-blue-500/30 rounded-full animate-ping" />
          </div>
        </div>

        {/* Location markers */}
        {filteredLocations.map((location, index) => {
          const offsetX = (location.lng - mapCenter.lng) * 1000 + (Math.random() - 0.5) * 200;
          const offsetY = (mapCenter.lat - location.lat) * 1000 + (Math.random() - 0.5) * 200;
          
          return (
            <div
              key={location.id}
              className="absolute z-20 cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                left: `${50 + offsetX / 10}%`,
                top: `${50 + offsetY / 10}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => handleLocationTap(location)}
            >
              {getLocationIcon(location)}
            </div>
          );
        })}

        {/* Heatmap overlay */}
        {showHeatmap && (
          <div className="absolute inset-0 z-5">
            {filteredLocations.map((location) => (
              <div
                key={`heat-${location.id}`}
                className="absolute rounded-full"
                style={{
                  left: `${50 + (location.lng - mapCenter.lng) * 1000 / 10}%`,
                  top: `${50 + (mapCenter.lat - location.lat) * 1000 / 10}%`,
                  width: `${(location.heatLevel || 1) * 20}px`,
                  height: `${(location.heatLevel || 1) * 20}px`,
                  background: `radial-gradient(circle, rgba(239, 68, 68, ${(location.heatLevel || 1) * 0.1}) 0%, transparent 70%)`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Top header */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/80 via-black/60 to-transparent safe-top">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-white p-2 hover:bg-white/10 rounded-full"
          >
            <XMarkIcon className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-2">
            <h1 className="text-white font-bold text-lg font-rum-raisin">Snap Map</h1>
            <GlobeAltIcon className="w-5 h-5 text-white" />
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSearch(!showSearch)}
              className="text-white p-2 hover:bg-white/10 rounded-full"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
              className="text-white p-2 hover:bg-white/10 rounded-full"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="px-4 pb-3 animate-slideUp">
            <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-3">
              <MagnifyingGlassIcon className="w-4 h-4 text-white/70" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search friends, places, events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-white/70 outline-none text-sm"
                autoFocus
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSearchQuery('')}
                  className="p-1 hover:bg-white/10 rounded-full"
                >
                  <XMarkIcon className="w-4 h-4 text-white/70" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="absolute top-20 left-0 right-0 z-30 safe-top">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-full p-1">
            {[
              { key: 'all', label: 'All', icon: GlobeAltIcon },
              { key: 'friends', label: 'Friends', icon: UserGroupIcon },
              { key: 'restaurants', label: 'Food', icon: BuildingStorefrontIcon },
              { key: 'events', label: 'Events', icon: MusicalNoteIcon },
              { key: 'hotspots', label: 'Hot', icon: FireIcon }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant="ghost"
                size="sm"
                onClick={() => setFilterType(filter.key as any)}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all duration-200",
                  filterType === filter.key 
                    ? "bg-white text-black font-bold" 
                    : "text-white hover:bg-white/10"
                )}
              >
                <filter.icon className="w-3.5 h-3.5" />
                {filter.label}
              </Button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={cn(
              "p-2 rounded-full transition-all duration-200",
              showHeatmap ? "bg-red-500 text-white" : "bg-black/40 text-white hover:bg-white/10"
            )}
          >
            <FireIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Map controls */}
      <div className="absolute right-4 top-1/3 z-30 flex flex-col gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setZoomLevel(Math.min(20, zoomLevel + 1))}
          className="w-10 h-10 bg-black/40 backdrop-blur-md text-white hover:bg-white/10 rounded-full"
        >
          <PlusIcon className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setZoomLevel(Math.max(8, zoomLevel - 1))}
          className="w-10 h-10 bg-black/40 backdrop-blur-md text-white hover:bg-white/10 rounded-full"
        >
          <MinusIcon className="w-5 h-5" />
        </Button>
      </div>

      {/* Location details bottom sheet */}
      {selectedLocation && detailsOpen && (
        <div className="absolute bottom-0 left-0 right-0 z-40 animate-slideUp">
          <div className="bg-black/95 backdrop-blur-xl border-t border-white/10 rounded-t-3xl max-h-[70vh] overflow-hidden">
            {/* Handle bar */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1 bg-white/30 rounded-full" />
            </div>

            {/* Content */}
            <div className="px-4 pb-8 space-y-4">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {getLocationIcon(selectedLocation)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-bold text-lg font-rum-raisin truncate">
                      {selectedLocation.title}
                    </h3>
                    {selectedLocation.isVerified && (
                      <CheckCircleIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    )}
                    {selectedLocation.level && (
                      <Badge className="bg-red-600 text-white text-xs font-rum-raisin">
                        Lv.{selectedLocation.level}
                      </Badge>
                    )}
                  </div>
                  <p className="text-white/70 text-sm font-rum-raisin">{selectedLocation.subtitle}</p>
                  {selectedLocation.distance && (
                    <p className="text-white/50 text-xs font-rum-raisin mt-1">
                      {selectedLocation.distance} mi away
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDetailsOpen(false)}
                  className="text-white/70 p-1 hover:bg-white/10 rounded-full"
                >
                  <ChevronDownIcon className="w-5 h-5" />
                </Button>
              </div>

              {/* Media preview */}
              {selectedLocation.media && (
                <div className="relative rounded-2xl overflow-hidden bg-gray-800">
                  <img 
                    src={selectedLocation.media.url} 
                    alt={selectedLocation.title}
                    className="w-full h-64 object-cover"
                  />
                  {selectedLocation.media.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 backdrop-blur-sm rounded-full p-3">
                        <PlayIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                  {selectedLocation.timestamp && (
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className="text-white text-xs font-rum-raisin">
                        {getTimeAgo(selectedLocation.timestamp)}
                      </span>
                    </div>
                  )}
                  {selectedLocation.viewCount && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                      <EyeIcon className="w-3 h-3 text-white" />
                      <span className="text-white text-xs font-rum-raisin">
                        {selectedLocation.viewCount}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Activity and mood */}
              {selectedLocation.activity && (
                <div className="bg-white/5 rounded-2xl p-3">
                  <p className="text-white text-sm font-rum-raisin">
                    "{selectedLocation.activity}"
                  </p>
                </div>
              )}

              {/* Stats and actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(selectedLocation.id)}
                    className="flex items-center gap-2 text-white hover:bg-white/10 rounded-full px-3 py-2"
                  >
                    {selectedLocation.isLiked ? (
                      <HeartSolid className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                    <span className="text-sm font-rum-raisin">
                      {selectedLocation.likCount || 0}
                    </span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-white hover:bg-white/10 rounded-full px-3 py-2"
                  >
                    <ChatBubbleLeftIcon className="w-5 h-5" />
                    <span className="text-sm font-rum-raisin">
                      {selectedLocation.commentCount || 0}
                    </span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-white hover:bg-white/10 rounded-full px-3 py-2"
                  >
                    <ShareIcon className="w-5 h-5" />
                  </Button>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  {selectedLocation.type === 'friend' || selectedLocation.type === 'user' ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-white/10 text-white hover:bg-white/20 rounded-full px-3 py-2 font-rum-raisin"
                      >
                        <CameraIcon className="w-4 h-4 mr-1" />
                        Send Snap
                      </Button>
                      <Button
                        onClick={() => {
                          onShowUserProfile?.(selectedLocation.id);
                          setDetailsOpen(false);
                        }}
                        className="glossy-red-pill text-white px-4 py-2 font-rum-raisin"
                      >
                        View Profile
                      </Button>
                    </>
                  ) : selectedLocation.type === 'restaurant' ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-white/10 text-white hover:bg-white/20 rounded-full px-3 py-2 font-rum-raisin"
                      >
                        <CameraIcon className="w-4 h-4 mr-1" />
                        Story Here
                      </Button>
                      <Button
                        onClick={() => {
                          onShowRestaurantProfile?.(selectedLocation.id);
                          setDetailsOpen(false);
                        }}
                        className="glossy-red-pill text-white px-4 py-2 font-rum-raisin"
                      >
                        Visit
                      </Button>
                    </>
                  ) : selectedLocation.type === 'hotspot' ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-white/10 text-white hover:bg-white/20 rounded-full px-3 py-2 font-rum-raisin"
                      >
                        <FireIcon className="w-4 h-4 mr-1" />
                        Join Heat
                      </Button>
                      <Button className="glossy-red-pill text-white px-4 py-2 font-rum-raisin">
                        Explore
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-white/10 text-white hover:bg-white/20 rounded-full px-3 py-2 font-rum-raisin"
                      >
                        <MusicalNoteIcon className="w-4 h-4 mr-1" />
                        Join Event
                      </Button>
                      <Button className="glossy-red-pill text-white px-4 py-2 font-rum-raisin">
                        Get Tickets
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Additional info for specific types */}
              {selectedLocation.type === 'friend' && selectedLocation.friends && (
                <div className="bg-white/5 rounded-2xl p-3">
                  <h4 className="text-white font-semibold text-sm font-rum-raisin mb-2">
                    Mutual Friends
                  </h4>
                  <div className="flex items-center gap-2">
                    {selectedLocation.friends.slice(0, 3).map((friend) => (
                      <ConsistentAvatar
                        key={friend.id}
                        src={friend.avatar}
                        alt={friend.name}
                        fallback={friend.name[0]}
                        size="xs"
                        variant="default"
                        className="border border-white/20"
                      />
                    ))}
                    {selectedLocation.friends.length > 3 && (
                      <span className="text-white/70 text-xs font-rum-raisin">
                        +{selectedLocation.friends.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {selectedLocation.type === 'restaurant' && selectedLocation.tags && (
                <div className="flex flex-wrap gap-1">
                  {selectedLocation.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      className="bg-white/10 text-white text-xs font-rum-raisin"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {selectedLocation.streakDays && (
                <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-2xl p-3 border border-orange-500/30">
                  <div className="flex items-center gap-2">
                    <FireIcon className="w-5 h-5 text-orange-400" />
                    <span className="text-orange-300 font-semibold text-sm font-rum-raisin">
                      {selectedLocation.streakDays} day food streak!
                    </span>
                  </div>
                </div>
              )}

              {/* Location insights for hotspots */}
              {selectedLocation.type === 'hotspot' && (
                <div className="bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-2xl p-3 border border-red-500/30">
                  <h4 className="text-white font-semibold text-sm font-rum-raisin mb-2 flex items-center gap-2">
                    <TrophyIcon className="w-4 h-4 text-yellow-400" />
                    What's Hot Right Now
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 font-rum-raisin">Active Users</span>
                      <span className="text-white font-bold font-rum-raisin">1.2K+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 font-rum-raisin">Stories Posted</span>
                      <span className="text-white font-bold font-rum-raisin">456</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 font-rum-raisin">Heat Level</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FireIcon 
                            key={i} 
                            className={cn(
                              "w-3 h-3",
                              i < (selectedLocation.heatLevel || 0) / 2 ? "text-red-500" : "text-gray-500"
                            )} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Event details */}
              {selectedLocation.type === 'event' && (
                <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-3 border border-purple-500/30">
                  <h4 className="text-white font-semibold text-sm font-rum-raisin mb-2 flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-purple-400" />
                    Event Details
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 font-rum-raisin">Time Remaining</span>
                      <span className="text-purple-300 font-bold font-rum-raisin">2h 15m</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 font-rum-raisin">Attendees</span>
                      <span className="text-white font-bold font-rum-raisin">234 going</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 font-rum-raisin">Food Trucks</span>
                      <span className="text-white font-bold font-rum-raisin">12 vendors</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stories/Recent activity indicator */}
      <div className="absolute bottom-20 left-4 right-4 z-30">
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold text-sm font-rum-raisin">Recent Activity</h3>
            <div className="flex items-center gap-2">
              {/* Ghost mode toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsGhostMode(!isGhostMode)}
                className={cn(
                  "p-1.5 rounded-full transition-all duration-200",
                  isGhostMode ? "bg-purple-600 text-white" : "bg-white/10 text-white hover:bg-white/20"
                )}
              >
                <HandRaisedIcon className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs font-rum-raisin">Live</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {filteredLocations.filter(loc => loc.isActive).slice(0, 8).map((location) => (
              <div 
                key={location.id}
                onClick={() => handleLocationTap(location)}
                className="flex-shrink-0 cursor-pointer"
              >
                <div className="relative">
                  <ConsistentAvatar
                    src={location.avatar}
                    alt={location.title}
                    fallback={location.title[0]}
                    size="sm"
                    variant="default"
                    className="border-2 border-green-400"
                  />
                  {location.type === 'restaurant' && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <BuildingStorefrontIcon className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Ghost mode indicator */}
          {isGhostMode && (
            <div className="mt-3 bg-purple-600/20 border border-purple-500/30 rounded-xl p-2">
              <div className="flex items-center gap-2">
                <HandRaisedIcon className="w-4 h-4 text-purple-300" />
                <span className="text-purple-200 text-xs font-rum-raisin">
                  Ghost Mode: You're invisible to friends
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Location sharing settings modal */}
      {showLocationSettings && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end">
          <div className="w-full bg-gray-900 rounded-t-3xl p-6 space-y-6 animate-slideUp">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-xl font-rum-raisin">Location Settings</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLocationSettings(false)}
                className="text-white/70 p-1 hover:bg-white/10 rounded-full"
              >
                <XMarkIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Ghost Mode */}
              <div className="bg-white/5 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <HandRaisedIcon className="w-6 h-6 text-purple-400" />
                    <div>
                      <h3 className="text-white font-semibold font-rum-raisin">Ghost Mode</h3>
                      <p className="text-white/70 text-sm font-rum-raisin">Hide your location from all friends</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsGhostMode(!isGhostMode)}
                    className={cn(
                      "w-12 h-6 rounded-full transition-all duration-200",
                      isGhostMode ? "bg-purple-600" : "bg-gray-600"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 bg-white rounded-full transition-all duration-200",
                      isGhostMode ? "translate-x-3" : "-translate-x-3"
                    )} />
                  </Button>
                </div>
              </div>

              {/* Location Sharing */}
              <div className="bg-white/5 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <GlobeAltIcon className="w-6 h-6 text-blue-400" />
                  <div>
                    <h3 className="text-white font-semibold font-rum-raisin">Who Can See My Location</h3>
                    <p className="text-white/70 text-sm font-rum-raisin">Control who sees you on the map</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {['All Friends', 'Close Friends Only', 'No One'].map((option) => (
                    <div key={option} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg">
                      <span className="text-white font-rum-raisin">{option}</span>
                      <div className="w-4 h-4 border border-white/30 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Request Location Permissions */}
              <div className="bg-white/5 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
                  <div>
                    <h3 className="text-white font-semibold font-rum-raisin">Location Accuracy</h3>
                    <p className="text-white/70 text-sm font-rum-raisin">Enable precise location for better map experience</p>
                  </div>
                </div>
                <Button className="w-full glossy-red-pill text-white font-rum-raisin">
                  Enable Precise Location
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-30">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowLocationSettings(true)}
          className="bg-black/60 backdrop-blur-md text-white hover:bg-black/80 rounded-full p-2"
        >
          <InformationCircleIcon className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}