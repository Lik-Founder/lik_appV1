import { User, Post, Story, Message } from './types';

export const generateMockUsers = (): User[] => [
  {
    id: '1',
    username: 'johndoe',
    displayName: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Photographer & Travel Enthusiast 📸',
    followerCount: 1254,
    followingCount: 892,
    postCount: 87,
    isFollowing: false
  },
  {
    id: '2',
    username: 'jane_smith',
    displayName: 'Jane Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b88ad011?w=150&h=150&fit=crop&crop=face',
    bio: 'Artist & Designer ✨ Living my best life',
    followerCount: 2891,
    followingCount: 1203,
    postCount: 156,
    isFollowing: true
  },
  {
    id: '3',
    username: 'alex_travel',
    displayName: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: '🌍 Digital Nomad | 📱 Content Creator',
    followerCount: 5632,
    followingCount: 2156,
    postCount: 234,
    isFollowing: false
  },
  {
    id: '4',
    username: 'foodie_sarah',
    displayName: 'Sarah Wilson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Food blogger 🍕 NYC based chef',
    followerCount: 8921,
    followingCount: 567,
    postCount: 312,
    isFollowing: true
  }
];

export const generateMockPosts = (): Post[] => [
  {
    id: '1',
    userId: '2',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
    caption: 'Beautiful sunset at the beach 🌅 #sunset #beach #photography',
    likes: 142,
    isLiked: false,
    comments: [
      {
        id: '1',
        userId: '1',
        username: 'johndoe',
        text: 'Amazing shot! 📸',
        timestamp: Date.now() - 3600000,
        likes: 5,
        isLiked: false
      }
    ],
    timestamp: Date.now() - 7200000,
    location: 'Malibu, CA'
  },
  {
    id: '2',
    userId: '3',
    imageUrl: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&h=600&fit=crop',
    caption: 'Coffee and coding ☕️ #digitalnom #workfromeverywhere',
    likes: 89,
    isLiked: true,
    comments: [],
    timestamp: Date.now() - 14400000
  },
  {
    id: '3',
    userId: '4',
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=600&fit=crop',
    caption: 'Homemade pasta night! 🍝 Recipe in my bio',
    likes: 267,
    isLiked: false,
    comments: [
      {
        id: '2',
        userId: '2',
        username: 'jane_smith',
        text: 'Looks delicious! 😍',
        timestamp: Date.now() - 1800000,
        likes: 12,
        isLiked: true
      },
      {
        id: '3',
        userId: '1',
        username: 'johndoe',
        text: 'Can you share the recipe?',
        timestamp: Date.now() - 900000,
        likes: 3,
        isLiked: false
      }
    ],
    timestamp: Date.now() - 21600000
  }
];

export const generateMockStories = (): Story[] => [
  {
    id: '1',
    userId: '2',
    imageUrl: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=400&h=600&fit=crop',
    timestamp: Date.now() - 3600000,
    isViewed: false,
    duration: 15000
  },
  {
    id: '2',
    userId: '3',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop',
    timestamp: Date.now() - 7200000,
    isViewed: true,
    duration: 15000
  }
];

export const getCurrentUser = (): User => ({
  id: 'current-user',
  username: 'you',
  displayName: 'Your Name',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
  bio: 'Welcome to Instagram Clone! Edit your profile to get started.',
  followerCount: 42,
  followingCount: 156,
  postCount: 12,
  isFollowing: false
});