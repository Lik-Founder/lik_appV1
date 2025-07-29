export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  postCount: number;
  isFollowing: boolean;
}

export interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  timestamp: number;
  location?: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
  likes: number;
  isLiked: boolean;
  parentId?: string; // For threaded replies
  replies?: Comment[]; // Nested replies array
  replyCount?: number; // Count of direct replies
}

export interface Story {
  id: string;
  userId: string;
  imageUrl: string; // For backward compatibility
  mediaUrl: string; // New field for both images and videos
  type: 'image' | 'video';
  caption?: string;
  timestamp: number;
  isViewed: boolean;
  duration: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  imageUrl?: string;
  timestamp: number;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
}

export type TabType = 'home' | 'search' | 'lik' | 'trending' | 'profile';

// Trending page specific types
export interface TrendingContent {
  id: string;
  type: 'user_post' | 'restaurant_post' | 'ad';
  mediaUrl: string;
  mediaType: 'image' | 'video';
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  isLiked: boolean;
  isSaved: boolean;
  location: string;
  likedBy: User[];
}

export interface UserPost extends TrendingContent {
  type: 'user_post';
  user: User & { level: number };
  restaurant: {
    name: string;
    rating: number;
  };
  review: {
    rating: number;
    price: string;
    text: string;
    tags: string[];
  };
}

export interface RestaurantPost extends TrendingContent {
  type: 'restaurant_post';
  restaurant: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    cuisineTypes: string[];
    isOpen: boolean;
    isVerified: boolean;
  };
  dish: {
    name: string;
    calories: number;
    price: string;
    description: string;
    tags: string[];
  };
}

export interface AdPost extends TrendingContent {
  type: 'ad';
  restaurant: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    isVerified: boolean;
  };
  promotion: {
    text: string;
    likCoinReward: number;
    questAvailable: boolean;
    xpBonus: number;
  };
  challenge?: {
    name: string;
    description: string;
  };
  distance: number;
}

// Lik page specific types
export interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streakCount: number;
  likTickets: number;
  likCoins: number;
}

export interface Bounty {
  id: string;
  dishName: string;
  restaurantName: string;
  category: string;
  timeRemaining: string;
  rating: number;
  reward: number;
  imageUrl: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
}

export interface Quest {
  id: string;
  name: string;
  type: 'solo' | 'team';
  reward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  locationCount: number;
  timeLimit: string;
  imageUrl: string;
  description: string;
}

// Cart and Checkout types
export interface CartItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  itemId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  customizations?: string[];
}

export interface DeliveryInfo {
  address: string;
  instructions?: string;
  estimatedTime: string;
  fee: number;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  cardType?: 'visa' | 'mastercard' | 'amex';
  isDefault: boolean;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tip: number;
  tax: number;
  total: number;
  deliveryInfo: DeliveryInfo;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'confirmed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
  timestamp: number;
  estimatedDelivery: string;
}