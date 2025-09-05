import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  ArrowLeftIcon,
  CheckIcon, 
  HeartIcon,
  ChatBubbleOvalLeftIcon, 
  UsersIcon,
  BoltIcon, 
  MapPinIcon, 
  TrophyIcon, 
  StarIcon as CrownIcon, 
  GiftIcon,
  StarIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

interface NotificationsPageProps {
  onBack: () => void;
}

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'quest' | 'bounty' | 'achievement' | 'coin' | 'level' | 'restaurant' | 'event';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  avatar?: string;
  icon?: React.ReactNode;
  reward?: string;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'quests' | 'social'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'achievement',
      title: '🏆 New Achievement Unlocked!',
      message: 'Congratulations! You\'ve earned the "Taco Tuesday Titan" badge for visiting 5 Mexican restaurants this week!',
      timestamp: '2 minutes ago',
      isRead: false,
      icon: <TrophyIcon className="w-5 h-5 text-yellow-500" />,
      reward: '+250 XP, +500 Lik Coins'
    },
    {
      id: '2',
      type: 'quest',
      title: '⚡ Quest Complete!',
      message: 'Amazing work completing the "Pizza Paradise" quest! Your taste buds are legendary.',
      timestamp: '15 minutes ago',
      isRead: false,
      icon: <BoltIcon className="w-5 h-5 text-purple-500" />,
      reward: '+1000 XP, +750 Lik Coins'
    },
    {
      id: '3',
      type: 'like',
      title: '❤️ Your post is trending!',
      message: 'Sarah Chen and 47 others liked your review of "The Perfect Ramen Bowl" at Noodle Nirvana.',
      timestamp: '1 hour ago',
      isRead: true,
      avatar: '/api/placeholder/32/32'
    },
    {
      id: '4',
      type: 'level',
      title: '🎉 Level Up!',
      message: 'Incredible! You\'ve reached Level 25 - Flavor Explorer! New perks and challenges await.',
      timestamp: '2 hours ago',
      isRead: false,
      icon: <CrownIcon className="w-5 h-5 text-gradient-to-r from-yellow-400 to-orange-500" />,
      reward: '+500 XP'
    },
    {
      id: '5',
      type: 'bounty',
      title: '🎯 New Bounty Available!',
      message: 'A legendary "Midnight Munchies" bounty appeared at Late Night Bites! Complete before dawn for bonus XP.',
      timestamp: '4 hours ago',
      isRead: true,
      icon: <MapPinIcon className="w-5 h-5 text-blue-500" />,
      reward: '+350 Lik Coins'
    },
    {
      id: '6',
      type: 'follow',
      title: '👤 New Follower',
      message: 'Chef Marcus Rodriguez (Verified) started following you! They loved your pasta review.',
      timestamp: '6 hours ago',
      isRead: true,
      avatar: '/api/placeholder/32/32'
    },
    {
      id: '7',
      type: 'coin',
      title: '💰 Lik Coins Earned!',
      message: 'You received 200 Lik Coins for checking in at Sunset Cafe during Happy Hour!',
      timestamp: '8 hours ago',
      isRead: true,
      icon: <GiftIcon className="w-5 h-5 text-green-500" />,
      reward: '+200 Lik Coins'
    },
    {
      id: '8',
      type: 'comment',
      title: '💬 New Comment',
      message: 'Alex Kim replied to your comment: "That dessert does look absolutely divine! Adding to my bucket list 🤤"',
      timestamp: '1 day ago',
      isRead: true,
      avatar: '/api/placeholder/32/32'
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'quests':
        return notifications.filter(n => ['quest', 'bounty', 'achievement', 'level'].includes(n.type));
      case 'social':
        return notifications.filter(n => ['like', 'comment', 'follow'].includes(n.type));
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (notification: Notification) => {
    if (notification.icon) return notification.icon;
    
    switch (notification.type) {
      case 'like': return <HeartIcon className="w-5 h-5 text-red-500" />;
      case 'comment': return <ChatBubbleOvalLeftIcon className="w-5 h-5 text-blue-500" />;
      case 'follow': return <UsersIcon className="w-5 h-5 text-green-500" />;
      case 'quest': return <BoltIcon className="w-5 h-5 text-purple-500" />;
      case 'bounty': return <MapPinIcon className="w-5 h-5 text-blue-500" />;
      case 'achievement': return <TrophyIcon className="w-5 h-5 text-yellow-500" />;
      case 'coin': return <GiftIcon className="w-5 h-5 text-green-500" />;
      case 'level': return <CrownIcon className="w-5 h-5 text-orange-500" />;
      case 'restaurant': return <StarIcon className="w-5 h-5 text-orange-500" />;
      case 'event': return <ClockIcon className="w-5 h-5 text-pink-500" />;
      default: return <StarIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-purple-100">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={onBack}
            className="p-2 hover:bg-purple-100 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-purple-600" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-purple-900 nav-rum-raisin">
              🔔 Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-sm text-purple-600">
                {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            <CheckIcon className="w-4 h-4 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="px-4 py-3 bg-white/60 backdrop-blur-sm border-b border-purple-100">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {[
            { key: 'all', label: '🌟 All', count: notifications.length },
            { key: 'unread', label: '🔥 Unread', count: unreadCount },
            { key: 'quests', label: '⚡ Quests & Rewards', count: notifications.filter(n => ['quest', 'bounty', 'achievement', 'level'].includes(n.type)).length },
            { key: 'social', label: '💫 Social', count: notifications.filter(n => ['like', 'comment', 'follow'].includes(n.type)).length }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                "whitespace-nowrap nav-rum-raisin text-sm relative",
                activeTab === tab.key 
                  ? "glossy-red-pill" 
                  : "text-purple-700 hover:bg-purple-100"
              )}
            >
              {tab.label}
              {tab.count > 0 && (
                <Badge 
                  variant="secondary" 
                  className="ml-2 h-5 w-5 p-0 text-xs bg-purple-100 text-purple-700"
                >
                  {tab.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {getFilteredNotifications().length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-purple-900 nav-rum-raisin mb-2">
              All caught up!
            </h3>
            <p className="text-purple-600">
              {activeTab === 'all' 
                ? "No new notifications. Keep exploring to earn more rewards!" 
                : "No notifications in this category yet."}
            </p>
          </div>
        ) : (
          getFilteredNotifications().map((notification) => (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={cn(
                "bg-white/70 backdrop-blur-sm rounded-2xl p-4 border transition-all duration-300 cursor-pointer",
                notification.isRead 
                  ? "border-purple-100 hover:border-purple-200" 
                  : "border-purple-200 hover:border-purple-300 bg-white/90 shadow-sm"
              )}
            >
              <div className="flex gap-3">
                {/* Icon/Avatar */}
                <div className="flex-shrink-0 relative">
                  {notification.avatar ? (
                    <img 
                      src={notification.avatar} 
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      {getNotificationIcon(notification)}
                    </div>
                  )}
                  {!notification.isRead && (
                    <div className="w-3 h-3 bg-purple-500 rounded-full absolute -top-1 -right-1" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={cn(
                      "font-semibold nav-rum-raisin",
                      notification.isRead ? "text-purple-700" : "text-purple-900"
                    )}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-purple-500 flex-shrink-0">
                      {notification.timestamp}
                    </span>
                  </div>

                  <p className={cn(
                    "text-sm mt-1",
                    notification.isRead ? "text-purple-600" : "text-purple-800"
                  )}>
                    {notification.message}
                  </p>

                  {notification.reward && (
                    <div className="mt-2 inline-flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-full border border-orange-200">
                      <GiftIcon className="w-3 h-3" />
                      {notification.reward}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};