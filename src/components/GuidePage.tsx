import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ConsistentAvatar } from '@/components/ui/consistent-avatar';
import { HorizontalCarousel } from '@/components/HorizontalCarousel';
import { IndividualGuidePage } from '@/components/IndividualGuidePage';
import { 
  ArrowLeftIcon, 
  BookmarkIcon, 
  MagnifyingGlassIcon,
  ChevronDownIcon,
  MapPinIcon,
  ArrowRightIcon,
  StarIcon,
  FireIcon,
  HeartIcon,
  UsersIcon,
  TrophyIcon,
  StarIcon as SparklesIcon
} from '@heroicons/react/24/outline';

interface GuidePageProps {
  onBack: () => void;
  onShowUserProfile?: (userId: string) => void;
  onShowRestaurantProfile?: (restaurantId: string) => void;
}

interface Guide {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  coverImage: string;
  description: string;
  tags: string[];
  likes: number;
  views: number;
  restaurantCount: number;
  isBookmarked: boolean;
  isTrending?: boolean;
  isVerified?: boolean;
  isEditorsPick?: boolean;
  updatedRecently?: boolean;
  city: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface City {
  id: string;
  name: string;
  country: string;
  image: string;
  guidesCount: number;
}

export function GuidePage({ onBack, onShowUserProfile, onShowRestaurantProfile }: GuidePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisineFilter, setSelectedCuisineFilter] = useState('For You');
  const [selectedVibeFilter, setSelectedVibeFilter] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [showFilters, setShowFilters] = useState(false);
  const [location, setLocation] = useState('Los Angeles');
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);

  // Mock data for guides
  const featuredGuides: Guide[] = [
    {
      id: '1',
      title: 'Best Late Night Food Spots: LA',
      author: 'Bon a Petite',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=250&fit=crop',
      description: 'Late night cravings? We got you covered with the best 24-hour spots in LA.',
      tags: ['Late Night', 'Editor\'s Pick'],
      likes: 2400,
      views: 15600,
      restaurantCount: 12,
      isBookmarked: false,
      isTrending: true,
      isEditorsPick: true,
      updatedRecently: true,
      city: 'Los Angeles'
    },
    {
      id: '2',
      title: 'Hidden Sushi Gems in Tokyo',
      author: 'Tokyo Eats',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b107?w=40&h=40&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1563612198-e1a83330b84d?w=400&h=250&fit=crop',
      description: 'Discover authentic sushi spots that locals don\'t want tourists to know about.',
      tags: ['Hidden Gems', 'Sushi', 'Authentic'],
      likes: 3200,
      views: 22100,
      restaurantCount: 8,
      isBookmarked: true,
      isVerified: true,
      city: 'Tokyo'
    },
    {
      id: '3',
      title: 'Michelin Star Street Food',
      author: 'Street Food Chronicles',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=250&fit=crop',
      description: 'Street vendors that earned Michelin recognition across Asia.',
      tags: ['Michelin', 'Street Food', 'Asia'],
      likes: 5600,
      views: 31200,
      restaurantCount: 15,
      isBookmarked: false,
      isVerified: true,
      isTrending: true,
      city: 'Singapore'
    }
  ];

  const categories: Category[] = [
    { id: '1', name: 'Sushi', icon: '🍣', count: 24 },
    { id: '2', name: 'Ramen', icon: '🍜', count: 18 },
    { id: '3', name: 'Burgers', icon: '🍔', count: 32 },
    { id: '4', name: 'Coffee', icon: '☕', count: 41 },
    { id: '5', name: 'Bakeries', icon: '🥐', count: 27 },
    { id: '6', name: 'Tacos', icon: '🌮', count: 19 },
    { id: '7', name: 'Pizza', icon: '🍕', count: 35 },
    { id: '8', name: 'Desserts', icon: '🧁', count: 22 }
  ];

  const popularCities: City[] = [
    {
      id: '1',
      name: 'New York',
      country: 'United States',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=200&h=120&fit=crop',
      guidesCount: 156
    },
    {
      id: '2', 
      name: 'Los Angeles',
      country: 'United States',
      image: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=200&h=120&fit=crop',
      guidesCount: 124
    },
    {
      id: '3',
      name: 'Tokyo',
      country: 'Japan', 
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200&h=120&fit=crop',
      guidesCount: 98
    },
    {
      id: '4',
      name: 'Paris',
      country: 'France',
      image: 'https://images.unsplash.com/photo-1524396309943-e03f5249f002?w=200&h=120&fit=crop',
      guidesCount: 87
    },
    {
      id: '5',
      name: 'London',
      country: 'United Kingdom',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=200&h=120&fit=crop',
      guidesCount: 72
    }
  ];

  const guidesYoullLik: Guide[] = [
    {
      id: '4',
      title: 'Best Boba Spots: LA',
      author: 'LA Times',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=250&h=150&fit=crop',
      description: 'From classic milk tea to trendy fruit teas, explore LA\'s boba scene.',
      tags: ['Boba', 'LA', 'Trendy'],
      likes: 1800,
      views: 12400,
      restaurantCount: 15,
      isBookmarked: false,
      isEditorsPick: true,
      city: 'Los Angeles'
    },
    {
      id: '5',
      title: 'Best Steak Shops in New Jersey',
      author: 'Julii24gh',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=250&h=150&fit=crop',
      description: 'Premium cuts and hidden steakhouse gems across New Jersey.',
      tags: ['Steak', 'New Jersey', 'Premium'],
      likes: 920,
      views: 6800,
      restaurantCount: 8,
      isBookmarked: true,
      city: 'New Jersey'
    }
  ];

  const latestGuides: Guide[] = [
    {
      id: '6',
      title: 'SF Hit List: Best New Restaurants',
      author: 'The Fatuation',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=80&h=60&fit=crop',
      description: 'The hottest new openings worth the wait.',
      tags: ['New', 'San Francisco'],
      likes: 540,
      views: 3200,
      restaurantCount: 15,
      isBookmarked: false,
      updatedRecently: true,
      city: 'San Francisco'
    },
    {
      id: '7',
      title: 'Best Coffee SF',
      author: 'PosterName',
      authorAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=80&h=60&fit=crop',
      description: 'Third wave coffee culture at its finest.',
      tags: ['Coffee', 'SF'],
      likes: 320,
      views: 1800,
      restaurantCount: 5,
      isBookmarked: false,
      updatedRecently: true,
      city: 'San Francisco'
    }
  ];

  const cuisineFilters = ['For You', 'Halal', 'Mexican', 'Asian', 'Coffee', 'Italian', 'Indian', 'Thai'];
  const vibeFilters = ['Trendy', 'Hidden Gems', 'Family-Friendly', 'Luxury', 'Viral', 'Michelin Picks'];
  const sortOptions = ['Newest', 'Most Liked', 'Most Viewed', 'Nearby'];

  const filteredGuides = featuredGuides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  // Show individual guide page if a guide is selected
  if (selectedGuideId) {
    return (
      <IndividualGuidePage
        guideId={selectedGuideId}
        onBack={() => setSelectedGuideId(null)}
        onShowRestaurantProfile={onShowRestaurantProfile}
        onShowUserProfile={onShowUserProfile}
      />
    );
  }

  return (
    <div className="h-full bg-background overflow-y-auto scrollbar-hide">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeftIcon className="w-6 h-6" />
          </Button>
          
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{location}</span>
            <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
          </div>
          
          <Button variant="ghost" size="icon">
            <BookmarkIcon className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Hero Carousel */}
      <div className="px-4 py-2">
        <HorizontalCarousel 
          autoScroll={true}
          autoScrollInterval={8000}
          itemClassName="min-w-full"
          showDots={true}
        >
          {featuredGuides.map((guide) => (
            <div 
              key={guide.id} 
              className="relative rounded-2xl overflow-hidden bg-black cursor-pointer"
              onClick={() => setSelectedGuideId(guide.id)}
            >
              <img 
                src={guide.coverImage}
                alt={guide.title}
                className="w-full h-[294px] object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <ConsistentAvatar
                    src={guide.authorAvatar}
                    alt={guide.author}
                    fallback={guide.author[0]?.toUpperCase()}
                    size="xs"
                    variant="xp-ring"
                    level={Math.floor(Math.random() * 30) + 10} // Mock levels for guide authors
                    xpProgress={Math.random() * 0.8 + 0.2}
                  />
                  <span className="text-sm font-medium">{guide.author}</span>
                  {guide.isVerified && (
                    <StarIcon className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  )}
                </div>
                <h2 className="text-xl font-bold mb-2">{guide.title}</h2>
                <p className="text-sm text-gray-200 mb-4 line-clamp-2">{guide.description}</p>
                <Button className="bg-white text-black hover:bg-white/90">
                  Open Guide
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </HorizontalCarousel>
      </div>

      {/* Search & Filters */}
      <div className="px-4 py-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for Guide"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full"
          />
        </div>

        {/* Browse By Section */}
        <div className="mb-4">
          <h3 className="font-semibold mb-3 nav-rum-raisin">Browse By</h3>
          
          {/* Cuisine Filters */}
          <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide pb-2">
            {cuisineFilters.map((filter) => (
              <Button
                key={filter}
                variant={selectedCuisineFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCuisineFilter(filter)}
                className="rounded-full whitespace-nowrap"
              >
                {filter}
              </Button>
            ))}
          </div>

          {/* Vibe Filters */}
          <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide pb-2">
            {vibeFilters.map((filter) => (
              <Button
                key={filter}
                variant={selectedVibeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedVibeFilter(selectedVibeFilter === filter ? '' : filter)}
                className="rounded-full whitespace-nowrap"
              >
                {filter}
              </Button>
            ))}
          </div>

          {/* Quick Toggles & Sort */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">
              Updated this week
            </Button>
            <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">
              Most Liked
            </Button>
            <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">
              Nearby
            </Button>
            <div className="flex items-center gap-1 ml-2">
              <span className="text-sm text-muted-foreground">Sort:</span>
              <Button variant="ghost" size="sm" className="rounded-full">
                {sortBy}
                <ChevronDownIcon className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Carousel */}
      <div className="px-4 mb-6">
        <h3 className="font-semibold mb-3 nav-rum-raisin">Categories</h3>
        <HorizontalCarousel 
          autoScroll={false}
          itemClassName="min-w-[100px]"
        >
          {categories.map((category) => (
            <Card key={category.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{category.icon}</div>
                <h4 className="text-sm font-medium mb-1">{category.name}</h4>
                <p className="text-xs text-muted-foreground">{category.count} guides</p>
              </CardContent>
            </Card>
          ))}
        </HorizontalCarousel>
      </div>

      {/* Gamification Banner */}
      <div className="mx-4 mb-6">
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <TrophyIcon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Complete 3 Guides This Week</p>
                <p className="text-xs text-muted-foreground">Earn 50 Lik Coins</p>
              </div>
              <Button size="sm" className="rounded-full">
                Start
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guides You'll Lik */}
      <div className="px-4 mb-6">
        <h3 className="font-semibold mb-4 nav-rum-raisin">Guides You'll Lik</h3>
        <div className="grid grid-cols-2 gap-3">
          {guidesYoullLik.map((guide) => (
            <Card 
              key={guide.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedGuideId(guide.id)}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={guide.coverImage}
                    alt={guide.title}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  {guide.isTrending && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                      <FireIcon className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  {guide.isEditorsPick && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500 text-black text-xs">
                      <SparklesIcon className="w-3 h-3 mr-1" />
                      Editor's Pick
                    </Badge>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ConsistentAvatar
                      src={guide.authorAvatar}
                      alt={guide.author}
                      fallback={guide.author[0]?.toUpperCase()}
                      size="xs"
                      variant="xp-ring"
                      level={Math.floor(Math.random() * 25) + 15} // Mock levels
                      xpProgress={Math.random() * 0.8 + 0.2}
                    />
                    <span className="text-xs font-medium text-muted-foreground">{guide.author}</span>
                  </div>
                  <h4 className="font-medium text-sm mb-2 line-clamp-2">{guide.title}</h4>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <HeartIcon className="w-3 h-3" />
                      <span>{guide.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UsersIcon className="w-3 h-3" />
                      <span>Saved by {(guide.likes / 10).toFixed(1)}K</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Latest Guides */}
      <div className="px-4 mb-6">
        <h3 className="font-semibold mb-4 nav-rum-raisin">Latest</h3>
        <div className="space-y-3">
          {latestGuides.map((guide) => (
            <Card 
              key={guide.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedGuideId(guide.id)}
            >
              <CardContent className="p-3">
                <div className="flex gap-3">
                  <img 
                    src={guide.coverImage}
                    alt={guide.title}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {guide.updatedRecently && (
                        <Badge variant="secondary" className="text-xs px-2 py-0">
                          🆕 New This Week
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-medium text-sm mb-1 line-clamp-1">{guide.title}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <ConsistentAvatar
                        src={guide.authorAvatar}
                        alt={guide.author}
                        fallback={guide.author[0]?.toUpperCase()}
                        size="xs"
                        variant="xp-ring"
                        level={Math.floor(Math.random() * 20) + 10} // Mock levels
                        xpProgress={Math.random() * 0.8 + 0.2}
                      />
                      <span className="text-xs text-muted-foreground">{guide.author}</span>
                      <span className="text-xs text-muted-foreground">• {guide.restaurantCount} Restaurants</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Food Cities */}
      <div className="px-4 pb-8">
        <h3 className="font-semibold mb-4 nav-rum-raisin">Popular Food Cities</h3>
        <HorizontalCarousel 
          autoScroll={false}
          itemClassName="min-w-[160px]"
        >
          {popularCities.map((city) => (
            <Card key={city.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={city.image}
                    alt={city.name}
                    className="w-full h-24 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-lg" />
                  <div className="absolute bottom-2 left-2 text-white">
                    <h4 className="font-medium text-sm">{city.name}</h4>
                    <p className="text-xs opacity-90">{city.country}</p>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-muted-foreground">{city.guidesCount} guides</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </HorizontalCarousel>
      </div>
    </div>
  );
}