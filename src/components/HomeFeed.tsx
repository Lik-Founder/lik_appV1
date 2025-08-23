import { useKV } from '@github/spark/hooks';
import { useState, useRef, useEffect } from 'react';
import { Story as StoryType, User } from '@/lib/types';
import { generateMockStories, generateMockUsers, getCurrentUser } from '@/lib/mockData';
import { StoriesBar } from '@/components/StoriesBar';
import { CreateStoryModal } from '@/components/CreateStoryModal';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { Carousel } from '@/components/Carousel';
import { HorizontalCarousel } from '@/components/HorizontalCarousel';
import { useDevice } from '@/hooks/use-device';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  PuzzlePieceIcon, 
  PlayIcon, 
  ChatBubbleLeftIcon, 
  ChevronRightIcon,
  StarIcon,
  HeartIcon,
  UsersIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import likLogo from '@/assets/images/lik.png';
import ad1 from '@/assets/images/ad1.png';
import ad2 from '@/assets/images/ad2.png';
import ad3 from '@/assets/images/ad3.png';

interface HomeFeedProps {
  onShowUserProfile?: (userId: string) => void;
  onShowRestaurantProfile?: (restaurantId: string) => void;
  onShowLeaderboard?: () => void;
  onShowLikTV?: () => void;
  onShowGuidePage?: () => void;
  onShowEventsPage?: () => void;
  onShowMessagesPage?: () => void;
  onShowLikPassport?: () => void;
  onShowNotifications?: () => void;
  onShowReservationManager?: () => void;
}

export function HomeFeed({ onShowUserProfile, onShowRestaurantProfile, onShowLeaderboard, onShowLikTV, onShowGuidePage, onShowEventsPage, onShowMessagesPage, onShowLikPassport, onShowNotifications, onShowReservationManager }: HomeFeedProps) {
  const [stories, setStories] = useKV<StoryType[]>('stories', generateMockStories());
  const [users, setUsers] = useKV<User[]>('users', generateMockUsers());
  const [currentUser] = useKV<User>('currentUser', getCurrentUser());
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [activeReviewTab, setActiveReviewTab] = useState('Popular');
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  
  // Profile dropdown state
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [avatarRect, setAvatarRect] = useState<DOMRect | null>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  
  // Floating app bar state
  const [showAppBar, setShowAppBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const device = useDevice();

  // Profile dropdown handlers
  const handleAvatarClick = () => {
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      setAvatarRect(rect);
      setIsProfileDropdownOpen(true);
    }
  };

  const handleProfileNavigate = (destination: string) => {
    setIsProfileDropdownOpen(false);
    
    switch (destination) {
      case 'passport':
        onShowLikPassport?.();
        break;
      case 'quests':
      case 'lik':
        // Navigate to Lik page (could add this to props if needed)
        break;
      case 'reservations':
        onShowReservationManager?.();
        break;
      case 'leaderboard':
        onShowLeaderboard?.();
        break;
      case 'messages':
        onShowMessagesPage?.();
        break;
      case 'liktv':
        onShowLikTV?.();
        break;
      case 'notifications':
        onShowNotifications?.();
        break;
      default:
        console.log(`Navigate to: ${destination}`);
    }
  };

  // Mock data for profile dropdown
  const profileDropdownUser = {
    avatar: currentUser.avatar,
    displayName: currentUser.username,
    username: currentUser.username,
    tasteTitle: "Flavor Explorer",
    level: 34,
    xp: 18000,
    maxXp: 20000,
    badges: [
      { id: "verified", icon: "✓", label: "Verified" },
      { id: "creator", icon: "⭐", label: "Creator" }
    ]
  };

  const profileDropdownStats = {
    streak: 4,
    tickets: 2,
    likCoins: "1.2k",
    hearts: "3.2k"
  };

  const profileDropdownDailyProgress = {
    currentTime: "00:00",
    targetTime: "02:00", 
    bonusReward: "+600 LP",
    streakDays: 7,
    currentStreak: 4
  };

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
      image: ad1,
      title: 'Featured Promotion',
      subtitle: 'Discover amazing deals'
    },
    {
      id: '2', 
      image: ad2,
      title: 'Special Offers',
      subtitle: 'Limited time only'
    },
    {
      id: '3',
      image: ad3,
      title: 'Exclusive Deals',
      subtitle: 'Just for you'
    }
  ];

  const reviewTabs = ['Popular', 'Friends', 'Following', 'Nearby'];
  
  const reviewCards = [
    {
      id: '1',
      userId: '1',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=400&fit=crop',
      reviewer: 'DisplayName',
      verified: true,
      rating: 4.9,
      likes: '11.2K',
      restaurant: 'Ice Cream Shop',
      restaurantId: 'rest1'
    },
    {
      id: '2',
      userId: '2',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=350&fit=crop',
      reviewer: 'DisplayName',
      verified: false,
      rating: '9.9/10',
      likes: 99,
      restaurant: 'Pizza Palace',
      restaurantId: 'rest2'
    },
    {
      id: '3',
      userId: '3',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=400&fit=crop',
      reviewer: 'DisplayName',
      verified: true,
      rating: 4.1,
      likes: '1.1k',
      restaurant: 'Coffee House',
      restaurantId: 'rest3'
    },
    {
      id: '4',
      userId: '4',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=350&fit=crop',
      reviewer: 'DisplayName',
      verified: false,
      rating: '8/10',
      likes: 102,
      restaurant: 'Pancake House',
      restaurantId: 'rest4'
    }
  ];

  const liksPicks = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=400&fit=crop',
      restaurant: 'BurgerFast',
      restaurantId: 'rest4',
      rating: 3.8,
      foodScore: '1.5',
      dish: 'Bacon Ranch Fry Platter',
      description: 'Fry Platter with bacon cheese and ranch for you to share with friends.',
      price: '$16.00',
      calories: '900 cal',
      dietaryInfo: ['🥓', '🧀', '🌿'],
      likedBy: ['user1', 'user2', 'user3', 'user4', 'user5']
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
      restaurant: 'Pizza Corner',
      restaurantId: 'rest5',
      rating: 4.6,
      foodScore: '8.8',
      dish: 'Margherita Supreme',
      description: 'Fresh mozzarella, basil, and tomato sauce on crispy thin crust.',
      price: '$18.50',
      calories: '750 cal',
      dietaryInfo: ['🧀', '🌿', '🍅'],
      likedBy: ['user4', 'user5', 'user6']
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
      restaurant: 'Taco Fiesta',
      restaurantId: 'rest6',
      rating: 4.2,
      foodScore: '9.1',
      dish: 'Carne Asada Bowl',
      description: 'Grilled steak with fresh cilantro, onions, and lime.',
      price: '$14.75',
      calories: '620 cal',
      dietaryInfo: ['🥩', '🌶️', '🌿'],
      likedBy: ['user1', 'user3', 'user7', 'user8']
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

  // Scroll detection effect for floating app bar
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const currentScrollY = scrollContainerRef.current.scrollTop;
      const scrollDifference = currentScrollY - lastScrollY;
      
      // Always show app bar at the top
      if (currentScrollY <= 50) {
        setShowAppBar(true);
        setLastScrollY(currentScrollY);
        return;
      }
      
      // Only hide/show app bar if scroll difference is significant (8px threshold)
      if (Math.abs(scrollDifference) > 8) {
        if (scrollDifference > 0 && currentScrollY > 100) {
          // Scrolling down - hide app bar
          setShowAppBar(false);
        } else if (scrollDifference < 0) {
          // Scrolling up - show app bar
          setShowAppBar(true);
        }
        
        setLastScrollY(currentScrollY);
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', throttledScroll, { passive: true });
      return () => scrollContainer.removeEventListener('scroll', throttledScroll);
    }
  }, [lastScrollY]);

  return (
    <div className="h-full bg-background">
      {/* Top Navigation Bar */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm floating-app-bar floating-app-bar-backdrop",
        showAppBar ? "visible" : "hidden"
      )}>
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left - User Icon */}
          <div className="flex items-center min-w-[60px]">
            <div 
              ref={avatarRef}
              onClick={handleAvatarClick}
              className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <ProfileAvatar
                src={currentUser.avatar}
                alt="Profile"
                level={12}
                xp={8500}
                maxXp={10000}
                size="sm"
              />
            </div>
          </div>

          {/* Center - Lik Logo */}
          <div className="flex items-center justify-center px-4 flex-1">
            <img 
              src={likLogo} 
              alt="Lik" 
              className="h-12 w-auto object-contain max-w-[140px] ml-[-90px]"
            />
          </div>

          {/* Right - Icons */}
          <div className="flex items-center gap-2 min-w-[160px] justify-end">
            <Button variant="ghost" size="icon" className="w-9 h-9">
              <PuzzlePieceIcon className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="w-9 h-9" onClick={onShowLikTV}>
              <PlayIcon className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="w-9 h-9" onClick={onShowMessagesPage}>
              <ChatBubbleLeftIcon className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="w-9 h-9" onClick={onShowLeaderboard}>
              <span className="text-xl">🏆</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        ref={scrollContainerRef}
        className={cn(
          "h-full overflow-y-auto scrollbar-hide pt-[72px] smooth-scroll-container",
          "mx-auto",
          device.type === 'tablet' ? "max-w-2xl" : "w-full"
        )}
      >
        
        {/* Hero Carousel */}
        <div className="px-[10px]">
          <Carousel 
            autoScroll={true}
            autoScrollInterval={4000}
            showArrows={true}
            showDots={false}
            onSlideChange={(index) => setCurrentPromoIndex(index)}
          >
            {promoCarousel.map((promo) => (
              <div key={promo.id} className="relative">
                <img 
                  src={promo.image} 
                  alt={promo.title}
                  className="w-full h-[402px] object-cover rounded-lg"
                />
              </div>
            ))}
          </Carousel>
        </div>

        {/* Stories Section */}
        <StoriesBar
          stories={stories}
          users={users}
          currentUser={currentUser}
          onStoryClick={handleStoryClick}
          onUserClick={onShowUserProfile}
          onAddStory={handleAddStory}
          deviceType={device.type}
        />

        {/* Review Section */}
        <div className="p-4">
          {/* Tab Bar */}
          <div className="bg-white/70 backdrop-blur-sm rounded-full p-1 mb-6 shadow-sm max-w-fit mx-auto">
            <div className="flex gap-1">
              {reviewTabs.map((tab) => (
                <Button
                  key={tab}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveReviewTab(tab)}
                  className={`rounded-full nav-rum-raisin transition-all duration-300 px-4 py-2 text-sm ${
                    activeReviewTab === tab 
                      ? 'glossy-red-pill text-white font-semibold'
                      : 'text-gray-600 font-light hover:bg-gray-100/50'
                  }`}
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Posts Grid */}
          <div className="grid grid-cols-2 gap-3">
            {reviewCards.map((review, index) => (
              <div key={review.id} className="relative group">
                {/* Display Name */}
                <div className="flex items-center justify-between mb-2">
                  <span 
                    className="font-medium text-sm cursor-pointer hover:underline" 
                    onClick={() => onShowUserProfile?.(review.userId)}
                  >
                    {review.reviewer}
                  </span>
                  <Button variant="ghost" size="icon" className="w-6 h-6 hover:bg-gray-100">
                    <div className="flex flex-col gap-0.5">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                  </Button>
                </div>

                {/* Image Card */}
                <div className="relative overflow-hidden rounded-2xl">
                  <img 
                    src={review.image} 
                    alt={review.restaurant}
                    className="w-full h-44 object-cover"
                  />
                  
                  {/* Rating/Score Overlay */}
                  <div className="absolute top-3 left-3">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      {typeof review.rating === 'string' && review.rating.includes('/10') ? (
                        <span className="text-white font-semibold text-sm">{review.rating}</span>
                      ) : (
                        <>
                          <StarIcon className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-white font-semibold text-sm">{review.rating}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Like Count Overlay */}
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      <HeartIcon className="w-3 h-3 text-red-500 fill-red-500" />
                      <span className="text-white font-semibold text-sm">{review.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lik's Picks */}
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 nav-rum-raisin">Lik's Picks</h2>
          <HorizontalCarousel 
            autoScroll={true}
            autoScrollInterval={7000}
            itemClassName="min-w-[320px]"
          >
            {liksPicks.map((pick) => (
              <Card key={pick.id} className="overflow-hidden">
                <CardContent className="p-0 relative">
                  {/* Background Image */}
                  <div className="relative h-80">
                    <img 
                      src={pick.image} 
                      alt={pick.dish}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
                    
                    {/* Top Section - Restaurant Rating & Name + Food Score */}
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                          <StarIcon className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                          <span className="text-white font-semibold text-sm">{pick.rating}</span>
                        </div>
                        <h3 
                          className="text-white font-bold text-lg cursor-pointer hover:underline text-shadow-lg"
                          onClick={() => onShowRestaurantProfile?.(pick.restaurantId)}
                        >
                          {pick.restaurant}
                        </h3>
                      </div>
                      <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-white font-bold text-lg">{pick.foodScore || '8.5'}/10</span>
                      </div>
                    </div>

                    {/* Bottom Section - Dish Info & Interactions */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {/* Dish Name and Price */}
                      <div className="flex items-end justify-between mb-2">
                        <div>
                          <h4 className="text-white font-bold text-xl text-shadow-lg mb-1">{pick.dish}</h4>
                          <p className="text-white/90 text-sm text-shadow-lg leading-relaxed max-w-[250px]">
                            {pick.description || "Delicious dish prepared with fresh ingredients and authentic flavors."}
                          </p>
                        </div>
                        <div className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-lg">
                          {pick.price}
                        </div>
                      </div>

                      {/* Bottom Row - Dietary Icons & Liked By */}
                      <div className="flex items-center justify-between">
                        {/* Dietary/Allergy Icons */}
                        <div className="flex items-center gap-1">
                          {pick.dietaryInfo?.map((info, index) => (
                            <div key={index} className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-semibold">{info}</span>
                            </div>
                          ))}
                          {!pick.dietaryInfo && (
                            <>
                              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-semibold">🌿</span>
                              </div>
                              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-semibold">🥜</span>
                              </div>
                              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-semibold">🧀</span>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Liked By */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <img src="/src/assets/images/Lik_Logo_Heart_1.0.png" alt="Lik" className="w-4 h-4" />
                            <span className="text-white text-sm nav-rum-raisin font-semibold text-shadow-lg">Liked By</span>
                          </div>
                          <div className="flex -space-x-2">
                            {pick.likedBy.slice(0, 3).map((_, index) => (
                              <div 
                                key={index} 
                                className="w-7 h-7 rounded-full border-2 border-white"
                                style={{
                                  backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'][index % 4]
                                }}
                              />
                            ))}
                            {pick.likedBy.length > 3 && (
                              <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center">
                                <span className="text-white text-xs font-bold">+{pick.likedBy.length - 3}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </HorizontalCarousel>
        </div>

        {/* Global Stories */}
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 nav-rum-raisin">Global Stories</h2>
          <div className="grid grid-cols-3 gap-3">
            {globalStoriesCategories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                className="flex flex-col items-center p-4 h-auto gap-2 nav-rum-raisin"
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
            <h2 className="text-xl font-bold nav-rum-raisin">Food Events</h2>
            <Button variant="ghost" size="icon" onClick={onShowEventsPage}>
              <ArrowRightIcon className="w-5 h-5" />
            </Button>
          </div>
          <HorizontalCarousel 
            autoScroll={true}
            autoScrollInterval={8000}
            itemClassName="min-w-[300px]"
          >
            {foodEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-0">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="font-bold mb-2">{event.title}</h3>
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{event.date}</span>
                      <ClockIcon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      <MapPinIcon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{event.location}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 nav-rum-raisin font-light">
                        Interested ({event.interested})
                      </Button>
                      <Button size="sm" className="flex-1 nav-rum-raisin font-semibold">
                        Going ({event.going})
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </HorizontalCarousel>
        </div>

        {/* Guides */}
        <div className="p-4 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold nav-rum-raisin">Guides</h2>
            <Button variant="ghost" size="icon" onClick={onShowGuidePage}>
              <ArrowRightIcon className="w-5 h-5" />
            </Button>
          </div>
          <HorizontalCarousel 
            autoScroll={true}
            autoScrollInterval={9000}
            itemClassName="min-w-[250px]"
          >
            {guides.map((guide) => (
              <Card key={guide.id}>
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
                      <MapPinIcon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{guide.spots} spots</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </HorizontalCarousel>
        </div>
      </div>
      
      {/* Create Story Modal */}
      <CreateStoryModal 
        open={isCreateStoryOpen} 
        onOpenChange={setIsCreateStoryOpen}
      />

      {/* Profile Dropdown */}
      <ProfileDropdown
        isOpen={isProfileDropdownOpen}
        onClose={() => setIsProfileDropdownOpen(false)}
        anchorRect={avatarRect}
        user={profileDropdownUser}
        stats={profileDropdownStats}
        dailyProgress={profileDropdownDailyProgress}
        onNavigate={handleProfileNavigate}
      />
    </div>
  );
}