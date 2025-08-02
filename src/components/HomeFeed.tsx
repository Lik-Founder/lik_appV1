import { useKV } from '@github/spark/hooks';
import { useState } from 'react';
import { Story as StoryType, User } from '@/lib/types';
import { generateMockStories, generateMockUsers, getCurrentUser } from '@/lib/mockData';
import { StoriesBar } from '@/components/StoriesBar';
import { CreateStoryModal } from '@/components/CreateStoryModal';
import { useDevice } from '@/hooks/use-device';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  GameController, 
  Play, 
  ChatCircle, 
  Trophy, 
  CaretRight,
  Star,
  Heart,
  Users,
  MapPin,
  CalendarBlank,
  Clock,
  ArrowRight
} from '@phosphor-icons/react';

export function HomeFeed() {
  const [stories, setStories] = useKV<StoryType[]>('stories', generateMockStories());
  const [users, setUsers] = useKV<User[]>('users', generateMockUsers());
  const [currentUser] = useKV<User>('currentUser', getCurrentUser());
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [activeReviewTab, setActiveReviewTab] = useState('Popular');
  
  const device = useDevice();

  const handleStoryClick = (storyId: string) => {
    setStories(currentStories => 
      currentStories.map(story => 
        story.id === storyId ? { ...story, isViewed: true } : story
      )
    );
  };

  const handleAddStory = () => {
    setIsCreateStoryOpen(true);
  };

  // Mock data for the new sections
  const promoCarousel = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop',
      title: 'Summer Food Festival',
      subtitle: '50% off selected restaurants'
    },
    {
      id: '2', 
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=200&fit=crop',
      title: 'New Restaurant Alert',
      subtitle: 'Discover amazing flavors nearby'
    }
  ];

  const reviewTabs = ['Popular', 'Friends', 'Following', 'Nearby'];
  
  const reviewCards = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop',
      reviewer: 'Sarah Wilson',
      verified: true,
      rating: 4.8,
      likes: 124,
      restaurant: 'Bella Italia'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop',
      reviewer: 'John Doe',
      verified: false,
      rating: 4.5,
      likes: 89,
      restaurant: 'Taco Bell'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop',
      reviewer: 'Alex Rivera',
      verified: true,
      rating: 4.9,
      likes: 203,
      restaurant: 'Sushi Palace'
    }
  ];

  const liksPicks = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop',
      restaurant: 'Burger Barn',
      rating: 4.8,
      dish: 'Big Ranch Burger Set',
      price: '$16.00',
      calories: '900 cal',
      likedBy: ['user1', 'user2', 'user3']
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      restaurant: 'Pizza Corner',
      rating: 4.6,
      dish: 'Margherita Supreme',
      price: '$18.50',
      calories: '750 cal',
      likedBy: ['user4', 'user5']
    }
  ];

  const globalStoriesCategories = [
    { id: 'african', name: 'African', emoji: '🍛' },
    { id: 'american', name: 'American', emoji: '🍔' },
    { id: 'asian', name: 'Asian', emoji: '🍜' },
    { id: 'desi', name: 'Desi', emoji: '🍛' },
    { id: 'desserts', name: 'Desserts', emoji: '🍰' },
    { id: 'drinks', name: 'Drinks', emoji: '🥤' },
    { id: 'european', name: 'European', emoji: '🥖' },
    { id: 'latin', name: 'Latin', emoji: '🌮' },
    { id: 'mediterranean', name: 'Mediterranean', emoji: '🫒' }
  ];

  const foodEvents = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop',
      title: 'Annual San Jose OktoberFest',
      date: 'October 25, 2024',
      time: '11:30 PM',
      location: 'Broadway St, San Francisco',
      interested: 245,
      going: 89
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=200&fit=crop',
      title: 'Street Food Night Market',
      date: 'November 2, 2024',
      time: '6:00 PM',
      location: 'Downtown LA',
      interested: 512,
      going: 203
    }
  ];

  const guides = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop',
      title: 'Best Late Night Food Spots in LA',
      author: 'Bon a Petite',
      spots: 12
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=200&fit=crop',
      title: 'Hidden Gems of San Francisco',
      author: 'Food Explorer',
      spots: 8
    }
  ];

  return (
    <div className="h-full bg-background">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          {/* Left - User Icon */}
          <div className="flex items-center">
            <div className="relative">
              <img 
                src={currentUser.avatar} 
                alt="Profile" 
                className="w-10 h-10 rounded-full"
              />
              <Badge className="absolute -bottom-1 -right-1 text-xs px-1 py-0 h-5 bg-primary text-primary-foreground">
                12
              </Badge>
            </div>
          </div>

          {/* Center - Lik Logo */}
          <div className="font-bold text-xl text-primary nav-rum-raisin">
            Lik
          </div>

          {/* Right - Icons */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="w-9 h-9">
              <GameController size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="w-9 h-9">
              <Play size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="w-9 h-9">
              <ChatCircle size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="w-9 h-9">
              <Trophy size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "h-full overflow-y-auto scrollbar-hide pt-[76px]",
        "mx-auto",
        device.type === 'tablet' ? "max-w-2xl" : "w-full"
      )}>
        
        {/* Hero Carousel */}
        <div className="p-4">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="flex transition-transform duration-300 ease-in-out">
              {promoCarousel.map((promo) => (
                <div key={promo.id} className="w-full flex-shrink-0 relative">
                  <img 
                    src={promo.image} 
                    alt={promo.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold text-lg">{promo.title}</h3>
                    <p className="text-sm opacity-90">{promo.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-3">
              {promoCarousel.map((_, index) => (
                <div key={index} className="w-2 h-2 rounded-full bg-muted" />
              ))}
            </div>
          </div>
        </div>

        {/* Stories Section */}
        <StoriesBar
          stories={stories}
          users={users}
          currentUser={currentUser}
          onStoryClick={handleStoryClick}
          onAddStory={handleAddStory}
          deviceType={device.type}
        />

        {/* Review Section */}
        <div className="p-4">
          <div className="flex gap-2 mb-4">
            {reviewTabs.map((tab) => (
              <Button
                key={tab}
                variant={activeReviewTab === tab ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveReviewTab(tab)}
                className="rounded-full"
              >
                {tab}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {reviewCards.map((review) => (
              <Card key={review.id} className="min-w-[200px] flex-shrink-0">
                <CardContent className="p-0">
                  <img 
                    src={review.image} 
                    alt={review.restaurant}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">{review.reviewer}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">✓</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{review.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart size={14} className="text-red-500" />
                        <span className="text-sm text-muted-foreground">{review.likes}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Lik's Picks */}
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Lik's Picks</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {liksPicks.map((pick) => (
              <Card key={pick.id} className="min-w-[280px] flex-shrink-0">
                <CardContent className="p-0">
                  <img 
                    src={pick.image} 
                    alt={pick.dish}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">{pick.restaurant}</h3>
                      <div className="flex items-center gap-1">
                        <Star size={16} className="fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{pick.rating}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-2">{pick.dish}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-primary">{pick.price}</span>
                      <span className="text-sm text-muted-foreground">{pick.calories}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Liked by</span>
                      <div className="flex -space-x-2">
                        {pick.likedBy.map((_, index) => (
                          <div key={index} className="w-6 h-6 rounded-full bg-muted border-2 border-background" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Global Stories */}
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Global Stories</h2>
          <div className="grid grid-cols-3 gap-3">
            {globalStoriesCategories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                className="flex flex-col items-center p-4 h-auto gap-2"
              >
                <span className="text-2xl">{category.emoji}</span>
                <span className="text-xs font-medium">{category.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Food Events */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Food Events</h2>
            <Button variant="ghost" size="icon">
              <ArrowRight size={20} />
            </Button>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {foodEvents.map((event) => (
              <Card key={event.id} className="min-w-[300px] flex-shrink-0">
                <CardContent className="p-0">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="font-bold mb-2">{event.title}</h3>
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarBlank size={14} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{event.date}</span>
                      <Clock size={14} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      <MapPin size={14} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{event.location}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Interested ({event.interested})
                      </Button>
                      <Button size="sm" className="flex-1">
                        Going ({event.going})
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Guides */}
        <div className="p-4 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Guides</h2>
            <Button variant="ghost" size="icon">
              <ArrowRight size={20} />
            </Button>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {guides.map((guide) => (
              <Card key={guide.id} className="min-w-[250px] flex-shrink-0">
                <CardContent className="p-0">
                  <img 
                    src={guide.image} 
                    alt={guide.title}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="font-bold mb-2">{guide.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">by {guide.author}</p>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{guide.spots} spots</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Create Story Modal */}
      <CreateStoryModal 
        open={isCreateStoryOpen} 
        onOpenChange={setIsCreateStoryOpen}
      />
    </div>
  );
}