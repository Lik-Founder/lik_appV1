import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConsistentAvatar } from '@/components/ui/consistent-avatar';
import { 
  ArrowLeftIcon, 
  MapPinIcon, 
  GiftIcon, 
  EllipsisVerticalIcon,
  CameraIcon,
  BookmarkIcon as TargetIcon,
  BuildingOfficeIcon,
  TrophyIcon,
  HeartIcon,
  FireIcon,
  HandThumbUpIcon,
  FaceSmileIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  ClockIcon,
  StarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  XMarkIcon,
  CheckIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MessageThreadProps {
  chatId: string;
  onBack: () => void;
  onShowRestaurantProfile?: (restaurantId: string) => void;
  onShowUserProfile?: (userId: string) => void;
}

interface ChatMessage {
  id: string;
  senderId: string;
  type: 'text' | 'image' | 'restaurant' | 'quest' | 'coin_transfer' | 'system';
  content: string;
  timestamp: number;
  isRead: boolean;
  reactions?: { emoji: string; users: string[]; }[];
  questData?: {
    id: string;
    title: string;
    restaurant: string;
    reward: number;
    timeLeft: string;
    type: 'bounty' | 'duel' | 'challenge';
    accepted?: boolean;
  };
  restaurantData?: {
    id: string;
    name: string;
    image: string;
    rating: number;
    cuisine: string;
    distance: string;
  };
  coinData?: {
    amount: number;
    message: string;
  };
  imageUrl?: string;
}

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  level: number;
  isOnline: boolean;
  lastSeen?: string;
}

export function MessageThread({ chatId, onBack, onShowRestaurantProfile, onShowUserProfile }: MessageThreadProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'media' | 'quests' | 'restaurants' | 'rewards' | 'pins'>('media');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [chatStreak, setChatStreak] = useState(5);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock chat user data
  const chatUser: ChatUser = {
    id: '1',
    name: 'Alex Chen',
    avatar: '/api/placeholder/48/48',
    level: 18,
    isOnline: true,
    lastSeen: '5m ago'
  };

  // Mock messages data
  useEffect(() => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        senderId: '1',
        type: 'text',
        content: 'Hey! Have you tried that new ramen place downtown? The broth is incredible!',
        timestamp: Date.now() - 3600000,
        isRead: true,
        reactions: [
          { emoji: '👍', users: ['current-user'] },
          { emoji: '🔥', users: ['current-user'] }
        ]
      },
      {
        id: '2',
        senderId: 'current-user',
        type: 'text',
        content: 'No way! Which one are you talking about?',
        timestamp: Date.now() - 3500000,
        isRead: true
      },
      {
        id: '3',
        senderId: '1',
        type: 'restaurant',
        content: 'Found it! Look at this place',
        timestamp: Date.now() - 3400000,
        isRead: true,
        restaurantData: {
          id: 'rest1',
          name: 'Ichiran Ramen',
          image: '/api/placeholder/200/150',
          rating: 4.8,
          cuisine: 'Japanese',
          distance: '0.8 mi'
        }
      },
      {
        id: '4',
        senderId: 'current-user',
        type: 'text',
        content: 'That looks amazing! Want to go together?',
        timestamp: Date.now() - 3200000,
        isRead: true
      },
      {
        id: '5',
        senderId: '1',
        type: 'text',
        content: 'Definitely! How about tomorrow evening?',
        timestamp: Date.now() - 600000,
        isRead: false
      }
    ];
    setMessages(mockMessages);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getLevelColor = (level: number) => {
    if (level >= 30) return 'from-purple-500 to-pink-500';
    if (level >= 20) return 'from-blue-500 to-purple-500';
    if (level >= 10) return 'from-green-500 to-blue-500';
    return 'from-orange-500 to-red-500';
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'current-user',
      type: 'text',
      content: newMessage,
      timestamp: Date.now(),
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setIsTyping(false);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const existingReaction = reactions.find(r => r.emoji === emoji);
        
        if (existingReaction) {
          if (existingReaction.users.includes('current-user')) {
            // Remove reaction
            existingReaction.users = existingReaction.users.filter(u => u !== 'current-user');
            if (existingReaction.users.length === 0) {
              return { ...msg, reactions: reactions.filter(r => r.emoji !== emoji) };
            }
          } else {
            // Add reaction
            existingReaction.users.push('current-user');
          }
        } else {
          // New reaction
          reactions.push({ emoji, users: ['current-user'] });
        }
        
        return { ...msg, reactions };
      }
      return msg;
    }));
  };

  const handleAcceptQuest = (questId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.questData?.id === questId) {
        return {
          ...msg,
          questData: { ...msg.questData, accepted: true }
        };
      }
      return msg;
    }));
    toast.success('Quest accepted! Good luck! 🎯');
  };

  const renderMessage = (message: ChatMessage, isOwnMessage: boolean) => {
    const showProfile = isOwnMessage || message.senderId === 'system';

    return (
      <div
        key={message.id}
        className={cn(
          'flex gap-3 mb-4',
          isOwnMessage ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        {/* Profile Picture */}
        {!isOwnMessage && !showProfile && (
          <ConsistentAvatar
            src={chatUser.avatar}
            alt={chatUser.name}
            fallback={chatUser.name[0]?.toUpperCase()}
            size="sm"
            variant="xp-ring"
            level={chatUser.level}
            xpProgress={0.7} // Mock XP progress
            onClick={() => onShowUserProfile?.(chatUser.id)}
          />
        )}

        {/* Message Content */}
        <div className={cn(
          'flex flex-col max-w-[280px]',
          isOwnMessage ? 'items-end' : 'items-start'
        )}>
          {/* Message Bubble */}
          <div
            className={cn(
              'relative rounded-2xl px-4 py-3 break-words message-bubble',
              isOwnMessage
                ? 'bg-primary text-primary-foreground rounded-br-md'
                : 'bg-muted text-foreground rounded-bl-md',
              message.type === 'system' && 'bg-muted/50 text-muted-foreground text-center text-sm'
            )}
          >
            {/* Text Message */}
            {message.type === 'text' && (
              <p className="text-sm">{message.content}</p>
            )}

            {/* Image Message */}
            {message.type === 'image' && (
              <div className="space-y-2">
                <img
                  src={message.imageUrl}
                  alt="Shared image"
                  className="rounded-lg max-w-full h-auto cursor-pointer"
                  onClick={() => {
                    // Handle image zoom
                  }}
                />
                {message.content && (
                  <p className="text-sm">{message.content}</p>
                )}
              </div>
            )}

            {/* Restaurant Card */}
            {message.type === 'restaurant' && message.restaurantData && (
              <div className="space-y-2">
                <p className="text-sm">{message.content}</p>
                <div
                  className="bg-background border border-border rounded-xl p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onShowRestaurantProfile?.(message.restaurantData!.id)}
                >
                  <div className="flex gap-3">
                    <img
                      src={message.restaurantData.image}
                      alt={message.restaurantData.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{message.restaurantData.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{message.restaurantData.rating}</span>
                        <span>•</span>
                        <span>{message.restaurantData.cuisine}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        📍 {message.restaurantData.distance} away
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quest Card */}
            {message.type === 'quest' && message.questData && (
              <div className="space-y-2">
                <p className="text-sm">{message.content}</p>
                <div className={cn(
                  'bg-background border rounded-xl p-3',
                  message.questData.accepted 
                    ? 'border-green-500 bg-green-50 quest-accepted-animation' 
                    : 'border-orange-500 bg-orange-50'
                )}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <TargetIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{message.questData.title}</h4>
                      <p className="text-sm text-muted-foreground">{message.questData.restaurant}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1 text-orange-600">
                          <CurrencyDollarIcon className="w-4 h-4" />
                          <span>+{message.questData.reward} LKC</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <ClockIcon className="w-4 h-4" />
                          <span>{message.questData.timeLeft}</span>
                        </div>
                      </div>
                      {!message.questData.accepted && !isOwnMessage && (
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            onClick={() => handleAcceptQuest(message.questData!.id)}
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            Accept
                          </Button>
                          <Button size="sm" variant="outline">
                            Decline
                          </Button>
                        </div>
                      )}
                      {message.questData.accepted && (
                        <div className="mt-3 text-sm text-green-600 font-medium">
                          ✅ Quest Accepted!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Coin Transfer */}
            {message.type === 'coin_transfer' && message.coinData && (
              <div className="space-y-2">
                <div className="text-center coin-burst-animation">
                  <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-2 rounded-full">
                    <CurrencyDollarIcon className="w-5 h-5" />
                    <span className="font-bold">+{message.coinData.amount} Lik Coins</span>
                  </div>
                  <p className="text-sm mt-2">{message.coinData.message}</p>
                </div>
              </div>
            )}
          </div>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex gap-1 mt-1 flex-wrap">
              {message.reactions.map((reaction) => (
                <button
                  key={reaction.emoji}
                  onClick={() => handleReaction(message.id, reaction.emoji)}
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all',
                    reaction.users.includes('current-user')
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  )}
                >
                  <span>{reaction.emoji}</span>
                  <span>{reaction.users.length}</span>
                </button>
              ))}
            </div>
          )}

          {/* Timestamp and Read Status */}
          <div className={cn(
            'flex items-center gap-2 mt-1 text-xs text-muted-foreground',
            isOwnMessage ? 'flex-row-reverse' : 'flex-row'
          )}>
            <span>{formatTime(message.timestamp)}</span>
            {isOwnMessage && (
              <div className="flex items-center">
                {message.isRead ? (
                  <CheckBadgeIcon className="w-3 h-3 text-blue-500" />
                ) : (
                  <CheckIcon className="w-3 h-3" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Reactions */}
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {['❤️', '👍', '🔥'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReaction(message.id, emoji)}
              className="w-6 h-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-xs transition-all"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const handleSendQuest = () => {
    const questMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'current-user',
      type: 'quest',
      content: 'Want to take on this challenge together?',
      timestamp: Date.now(),
      isRead: false,
      questData: {
        id: 'quest-' + Date.now(),
        title: 'Pizza Paradise Challenge',
        restaurant: 'Tony\'s Pizza',
        reward: 150,
        timeLeft: '3 days',
        type: 'challenge',
        accepted: false
      }
    };
    setMessages(prev => [...prev, questMessage]);
    toast.success('Quest challenge sent! 🎯');
  };

  const handleSendCoins = () => {
    const coinMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'current-user',
      type: 'coin_transfer',
      content: 'Here are some Lik Coins for you!',
      timestamp: Date.now(),
      isRead: false,
      coinData: {
        amount: 25,
        message: 'Thanks for being an awesome food buddy!'
      }
    };
    setMessages(prev => [...prev, coinMessage]);
    toast.success('25 Lik Coins sent! 💰');
  };

  const handleSendLocation = () => {
    toast.success('Location shared! 📍');
  };

  const tabs = [
    { key: 'media', label: 'Media', icon: '📸' },
    { key: 'quests', label: 'Quests', icon: '🎯' },
    { key: 'restaurants', label: 'Restaurants', icon: '🍕' },
    { key: 'rewards', label: 'Rewards', icon: '🏅' },
    { key: 'pins', label: 'Pins', icon: '📌' }
  ] as const;

  return (
    <div className="h-full bg-background flex flex-col message-thread-container">
      {/* Top Navigation */}
      <div className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-20">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 hover:bg-muted rounded-full"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
            
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => onShowUserProfile?.(chatUser.id)}
            >
              <ConsistentAvatar
                src={chatUser.avatar}
                alt={chatUser.name}
                fallback={chatUser.name[0]?.toUpperCase()}
                size="md"
                variant="xp-ring"
                level={chatUser.level}
                xpProgress={0.8} // Mock XP progress
                isOnline={chatUser.isOnline}
              />
              
              <div>
                <h2 className="font-bold text-foreground">{chatUser.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Level {chatUser.level} • {chatUser.isOnline ? 'Online' : `Last seen ${chatUser.lastSeen}`}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSendLocation}
              className="p-2 hover:bg-muted rounded-full"
            >
              <MapPinIcon className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSendCoins}
              className="p-2 hover:bg-muted rounded-full"
            >
              <GiftIcon className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="p-2 hover:bg-muted rounded-full"
            >
              <EllipsisVerticalIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Sticky Header Tabs */}
        <div className="px-4 pb-3">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted/50"
                )}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <div className="group">
          {messages.map((message) => 
            renderMessage(message, message.senderId === 'current-user')
          )}
        </div>
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-muted" />
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot" />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="border-t border-border bg-background/95 backdrop-blur-sm p-4">
        {/* Chat Streak */}
        <div className="flex items-center justify-center mb-3">
          <div className={cn(
            "flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full",
            chatStreak >= 7 && "chat-streak-glow"
          )}>
            <FireIcon className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium">Chat streak: {chatStreak} days</span>
          </div>
        </div>

        <div className="flex items-end gap-3">
          {/* Quick Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-muted rounded-full"
            >
              <CameraIcon className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSendQuest}
              className="p-2 hover:bg-muted rounded-full"
            >
              <Target className="w-5 h-5" />
            </Button>
          </div>

          {/* Message Input */}
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Send a message or a challenge..."
              className="pr-20 rounded-full border-border"
            />
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1.5 hover:bg-muted rounded-full"
              >
                <FaceSmileIcon className="w-4 h-4" />
              </Button>
              
              {newMessage.trim() && (
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  className="p-1.5 rounded-full bg-primary text-primary-foreground"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="flex items-center justify-center gap-4 mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {/* Handle restaurant sharing */}}
            className="flex items-center gap-2 text-sm"
          >
            <BuildingOfficeIcon className="w-4 h-4" />
            Restaurant
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSendCoins}
            className="flex items-center gap-2 text-sm"
          >
            <GiftIcon className="w-4 h-4" />
            Reward
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {/* Handle food duel */}}
            className="flex items-center gap-2 text-sm"
          >
            <TrophyIcon className="w-4 h-4" />
            Duel
          </Button>
        </div>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 right-4 z-30 bg-background border border-border rounded-xl shadow-lg p-3 w-64">
          <div className="grid grid-cols-8 gap-1">
            {['😀', '😂', '😍', '🥰', '😘', '😋', '🤔', '😎', '😊', '😉', '👍', '👎', '❤️', '🔥', '💯', '🎉', '🚀', '🌟', '⭐', '✨', '💪', '👏', '🙌', '🤝', '🍕', '🍔', '🌮', '🍜', '🍱', '🍰', '☕', '🥤'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setNewMessage(prev => prev + emoji);
                  setShowEmojiPicker(false);
                }}
                className="h-8 w-8 flex items-center justify-center text-lg hover:bg-muted rounded transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* More Options Dropdown */}
      {showMoreOptions && (
        <div className="absolute top-16 right-4 z-30 bg-background border border-border rounded-xl shadow-lg p-2 min-w-[200px]">
          <Button variant="ghost" size="sm" className="w-full justify-start">
            Mute notifications
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            Pin conversation
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-destructive">
            Block user
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-destructive">
            Report
          </Button>
        </div>
      )}
    </div>
  );
}