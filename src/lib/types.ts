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

export type TabType = 'home' | 'search' | 'create' | 'messages' | 'profile';