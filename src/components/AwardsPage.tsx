import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { useDevice } from '@/hooks/use-device';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeftIcon as ArrowLeft,
  TrophyIcon as Trophy,
  ShareIcon as Share,
  StarIcon as Star,
  ArrowTrendingUpIcon as TrendUp,
  TrendingDownIcon as TrendDown,
  CalendarIcon as Calendar,
  MapPinIcon as MapPin,
  CrownIcon as Crown,
  TrophyIcon as Medal,
  TrophyIcon as Award,
  HeartIcon as Heart,
  EyeIcon as Eye,
  XMarkIcon as X
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AwardsPageProps {
  restaurantId: string;
  onBack: () => void;
}

interface RestaurantAward {
  id: string;
  name: string;
  icon: string;
  year?: number;
  description: string;
  category: 'michelin' | 'james_beard' | 'lik_exclusive' | 'sustainability' | 'community';
  dateEarned: number;
  details?: string;
  image?: string;
}

interface RankingHistory {
  category: string;
  currentRank: number;
  peakRank: number;
  previousRank: number;
  trend: 'up' | 'down' | 'stable';
  location: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  date: number;
  icon: string;
  image?: string;
  type: 'achievement' | 'milestone' | 'recognition';
}

interface CriticReview {
  id: string;
  criticName: string;
  publication: string;
  reviewText: string;
  rating?: number;
  date: number;
  avatar: string;
}

export function AwardsPage({ restaurantId, onBack }: AwardsPageProps) {
  const [awards, setAwards] = useKV<RestaurantAward[]>(`restaurant-awards-${restaurantId}`, generateMockAwards());
  const [rankings, setRankings] = useKV<RankingHistory[]>(`restaurant-rankings-${restaurantId}`, generateMockRankings());
  const [milestones, setMilestones] = useKV<Milestone[]>(`restaurant-milestones-${restaurantId}`, generateMockMilestones());
  const [criticReviews, setCriticReviews] = useKV<CriticReview[]>(`restaurant-critics-${restaurantId}`, generateMockCriticReviews());
  const [selectedAward, setSelectedAward] = useState<RestaurantAward | null>(null);
  const device = useDevice();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Bella Italia Awards & Recognition',
        text: 'Check out all the awards and recognition for Bella Italia!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const getAwardCategoryColor = (category: string) => {
    switch (category) {
      case 'michelin':
        return 'from-yellow-500 to-orange-500';
      case 'james_beard':
        return 'from-blue-600 to-purple-600';
      case 'lik_exclusive':
        return 'from-orange-500 to-red-500';
      case 'sustainability':
        return 'from-green-500 to-emerald-500';
      case 'community':
        return 'from-pink-500 to-rose-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendUp size={16} className="text-green-500" />;
      case 'down':
        return <TrendDown size={16} className="text-red-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const padding = device.type === 'tablet' ? 'p-6' : 'p-4';

  return (
    <div className="h-full bg-background overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop"
          alt="Bella Italia Awards"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
        
        {/* Top Overlay */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 safe-top">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="bg-black/50 hover:bg-black/70 text-white h-10 w-10 p-0 rounded-full backdrop-blur-sm"
          >
            <ArrowLeft size={18} />
          </Button>
          
          <Button
            onClick={handleShare}
            variant="ghost"
            size="sm"
            className="bg-black/50 hover:bg-black/70 text-white h-10 w-10 p-0 rounded-full backdrop-blur-sm"
          >
            <Share size={18} />
          </Button>
        </div>

        {/* Title Overlay */}
        <div className="absolute top-16 left-0 right-0 flex flex-col justify-center items-center text-center text-white px-4 pt-4 pb-48">
          <div className="flex items-center gap-3 mb-4">
            <Trophy size={32} className="text-yellow-400" />
            <h1 className="text-3xl font-bold nav-rum-raisin">Awards & Recognition</h1>
          </div>
          <p className="text-lg opacity-90">Celebrating Excellence in Culinary Arts</p>
        </div>

        {/* Dynamic Leaderboard Badge */}
        <div className="absolute bottom-4 left-4 right-4 mt-8">
          <Card className="bg-black/70 backdrop-blur-sm border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <Crown size={24} className="text-yellow-400" />
                  <div>
                    <p className="font-bold text-lg">#3 Italian in NYC</p>
                    <p className="text-sm opacity-80">Current Global Ranking</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-400">⭐⭐⭐</p>
                  <p className="text-xs opacity-80">Michelin Stars</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Award Badges Carousel */}
        <div className={cn("border-b border-border", padding, "pb-6")}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 nav-rum-raisin">
            <Medal size={20} className="text-yellow-500" />
            Award Collection
          </h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {awards.map((award) => (
              <Card
                key={award.id}
                className={cn(
                  "flex-shrink-0 w-40 cursor-pointer transition-all duration-200 hover:scale-105",
                  "bg-gradient-to-br",
                  getAwardCategoryColor(award.category),
                  "text-white border-0"
                )}
                onClick={() => setSelectedAward(award)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{award.icon}</div>
                  <h3 className="font-bold text-sm mb-1">{award.name}</h3>
                  {award.year && (
                    <p className="text-xs opacity-90">{award.year}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Leaderboard Highlights */}
        <div className={cn("border-b border-border", padding, "pb-6")}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 nav-rum-raisin">
            <Trophy size={20} className="text-orange-500" />
            Leaderboard Performance
          </h2>
          <div className="grid gap-4">
            {rankings.map((ranking, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{ranking.category} in {ranking.location}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span>Current: </span>
                          <Badge variant="outline" className="font-bold">
                            #{ranking.currentRank}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Peak: </span>
                          <Badge variant="secondary" className="font-bold text-yellow-600">
                            #{ranking.peakRank}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(ranking.trend)}
                      <span className="text-sm text-muted-foreground">
                        vs #{ranking.previousRank}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Awards Timeline */}
        <div className={cn("border-b border-border", padding, "pb-6")}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 nav-rum-raisin">
            <Calendar size={20} className="text-blue-500" />
            Achievement Timeline
          </h2>
          <div className="space-y-4">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-white text-xl",
                    milestone.type === 'achievement' && "bg-gradient-to-r from-yellow-500 to-orange-500",
                    milestone.type === 'milestone' && "bg-gradient-to-r from-blue-500 to-purple-500",
                    milestone.type === 'recognition' && "bg-gradient-to-r from-green-500 to-emerald-500"
                  )}>
                    {milestone.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{milestone.title}</h3>
                    <span className="text-sm text-muted-foreground">
                      {new Date(milestone.date).getFullYear()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                  {milestone.image && (
                    <img
                      src={milestone.image}
                      alt={milestone.title}
                      className="mt-2 rounded-lg w-full h-32 object-cover"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User & Critic Recognition */}
        <div className={cn("border-b border-border", padding, "pb-6")}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 nav-rum-raisin">
            <Star size={20} className="text-purple-500" />
            Critic & Professional Recognition
          </h2>
          <div className="space-y-4">
            {criticReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={review.avatar} />
                      <AvatarFallback>{review.criticName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{review.criticName}</h3>
                        <Badge variant="outline" className="text-xs">
                          {review.publication}
                        </Badge>
                        {review.rating && (
                          <div className="flex items-center gap-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} size={12} className="text-yellow-400 fill-current" />
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        "{review.reviewText}"
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className={cn(padding, "pb-8")}>
          <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20">
            <CardContent className="p-6 text-center">
              <Trophy size={32} className="mx-auto text-orange-500 mb-3" />
              <h2 className="text-xl font-bold mb-2 nav-rum-raisin">Nominate for Next Lik Award</h2>
              <p className="text-muted-foreground mb-4">
                Think Bella Italia deserves recognition? Nominate them for upcoming awards!
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" className="flex-1 max-w-xs">
                  <Eye size={16} className="mr-2" />
                  View Award-Winning Dishes
                </Button>
                <Button className="flex-1 max-w-xs bg-gradient-to-r from-orange-500 to-red-500">
                  <Heart size={16} className="mr-2" />
                  Nominate Restaurant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Award Detail Modal */}
      {selectedAward && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl",
                    "bg-gradient-to-r",
                    getAwardCategoryColor(selectedAward.category)
                  )}>
                    {selectedAward.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{selectedAward.name}</CardTitle>
                    {selectedAward.year && (
                      <CardDescription>Awarded in {selectedAward.year}</CardDescription>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAward(null)}
                  className="h-8 w-8 p-0"
                >
                  <X size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedAward.description}
              </p>
              {selectedAward.details && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2">Award Details</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedAward.details}
                  </p>
                </div>
              )}
              {selectedAward.image && (
                <img
                  src={selectedAward.image}
                  alt={selectedAward.name}
                  className="mt-4 rounded-lg w-full h-40 object-cover"
                />
              )}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Awarded on {new Date(selectedAward.dateEarned).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Mock data generators
function generateMockAwards(): RestaurantAward[] {
  return [
    {
      id: '1',
      name: 'Michelin Star',
      icon: '⭐',
      year: 2023,
      description: 'Recognition for exceptional cuisine and service excellence',
      category: 'michelin',
      dateEarned: Date.now() - 31536000000, // 1 year ago
      details: 'Awarded for outstanding culinary excellence, exceptional service, and consistent quality that defines the finest dining experiences.',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
    },
    {
      id: '2',
      name: 'James Beard Award',
      icon: '🏆',
      year: 2024,
      description: 'Outstanding Restaurant Award for culinary excellence',
      category: 'james_beard',
      dateEarned: Date.now() - 15768000000, // 6 months ago
      details: 'Recognized as an Outstanding Restaurant by the James Beard Foundation for exceptional food, hospitality, and contribution to the culinary community.',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop'
    },
    {
      id: '3',
      name: 'Lik Top 100',
      icon: '🔥',
      year: 2024,
      description: 'Top 100 restaurants globally on the Lik platform',
      category: 'lik_exclusive',
      dateEarned: Date.now() - 7884000000, // 3 months ago
      details: 'Selected as one of the top 100 restaurants worldwide based on user reviews, community engagement, and culinary innovation on the Lik platform.'
    },
    {
      id: '4',
      name: 'Green Restaurant',
      icon: '🌱',
      year: 2023,
      description: 'Certified for sustainable and eco-friendly practices',
      category: 'sustainability',
      dateEarned: Date.now() - 23652000000, // 9 months ago
      details: 'Certified for outstanding commitment to environmental sustainability, including locally sourced ingredients, waste reduction, and eco-friendly operations.'
    },
    {
      id: '5',
      name: 'Community Favorite',
      icon: '❤️',
      year: 2024,
      description: 'Most loved restaurant by the local community',
      category: 'community',
      dateEarned: Date.now() - 2628000000, // 1 month ago
      details: 'Voted as the most beloved restaurant by the local community for exceptional hospitality, community involvement, and consistent quality.'
    },
    {
      id: '6',
      name: "Editor's Pick",
      icon: '⭐',
      year: 2024,
      description: 'Selected by Lik editorial team for excellence',
      category: 'lik_exclusive',
      dateEarned: Date.now() - 1314000000, // 2 weeks ago
      details: 'Handpicked by the Lik editorial team for exceptional culinary innovation, unique dining experience, and outstanding customer satisfaction.'
    }
  ];
}

function generateMockRankings(): RankingHistory[] {
  return [
    {
      category: 'Italian Cuisine',
      currentRank: 3,
      peakRank: 2,
      previousRank: 4,
      trend: 'up',
      location: 'NYC'
    },
    {
      category: 'Fine Dining',
      currentRank: 12,
      peakRank: 8,
      previousRank: 15,
      trend: 'up',
      location: 'Global'
    },
    {
      category: 'Romantic Restaurants',
      currentRank: 7,
      peakRank: 4,
      previousRank: 7,
      trend: 'stable',
      location: 'NYC'
    },
    {
      category: 'Pasta & Risotto',
      currentRank: 2,
      peakRank: 1,
      previousRank: 3,
      trend: 'up',
      location: 'Regional'
    }
  ];
}

function generateMockMilestones(): Milestone[] {
  return [
    {
      id: '1',
      title: 'Joined Lik Platform',
      description: 'Bella Italia officially launched on the Lik platform, connecting with food enthusiasts worldwide.',
      date: Date.now() - 63072000000, // 2 years ago
      icon: '🚀',
      type: 'milestone'
    },
    {
      id: '2',
      title: 'First Michelin Star',
      description: 'Achieved our first Michelin Star recognition for exceptional culinary excellence and service.',
      date: Date.now() - 31536000000, // 1 year ago
      icon: '⭐',
      type: 'achievement',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop'
    },
    {
      id: '3',
      title: 'Lik Top 10 Pizza Challenge Winner',
      description: 'Won the prestigious Lik Top 10 Pizza Challenge with our signature wood-fired Margherita.',
      date: Date.now() - 23652000000, // 9 months ago
      icon: '🍕',
      type: 'achievement',
      image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=200&fit=crop'
    },
    {
      id: '4',
      title: 'James Beard Recognition',
      description: 'Nominated and awarded Outstanding Restaurant by the James Beard Foundation.',
      date: Date.now() - 15768000000, // 6 months ago
      icon: '🏆',
      type: 'achievement',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=200&fit=crop'
    },
    {
      id: '5',
      title: 'Ranked #1 Italian Restaurant in NYC',
      description: 'Achieved the top ranking for Italian cuisine in New York City on multiple platforms.',
      date: Date.now() - 7884000000, // 3 months ago
      icon: '👑',
      type: 'achievement'
    },
    {
      id: '6',
      title: 'Sustainability Certification',
      description: 'Received Green Restaurant certification for our commitment to environmental sustainability.',
      date: Date.now() - 5256000000, // 2 months ago
      icon: '🌱',
      type: 'recognition'
    }
  ];
}

function generateMockCriticReviews(): CriticReview[] {
  return [
    {
      id: '1',
      criticName: 'Anthony Bourdain Jr.',
      publication: 'Food & Wine Magazine',
      reviewText: 'Bella Italia captures the soul of authentic Italian cuisine with modern finesse. Every dish tells a story of tradition and innovation perfectly balanced.',
      rating: 5,
      date: Date.now() - 15768000000, // 6 months ago
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
    },
    {
      id: '2',
      criticName: 'Maria Rodriguez',
      publication: 'Michelin Guide',
      reviewText: 'The attention to detail and quality of ingredients at Bella Italia is exceptional. Chef Antonio has created something truly special.',
      rating: 4,
      date: Date.now() - 23652000000, // 9 months ago
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=150&h=150&fit=crop'
    },
    {
      id: '3',
      criticName: 'James Thompson',
      publication: 'NYC Eats',
      reviewText: 'A masterclass in Italian cuisine. The handmade pasta and wood-fired pizzas are worth the journey alone.',
      rating: 5,
      date: Date.now() - 31536000000, // 1 year ago
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
    },
    {
      id: '4',
      criticName: 'Sofia Chen',
      publication: 'Zagat',
      reviewText: 'Bella Italia seamlessly blends traditional Italian flavors with contemporary presentation. A must-visit destination for serious food lovers.',
      date: Date.now() - 7884000000, // 3 months ago
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
    }
  ];
}