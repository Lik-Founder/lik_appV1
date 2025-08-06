import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  X, 
  Users, 
  UserPlus,
  Crown,
  Trophy,
  MapPin,
  MessageCircle,
  Heart,
  Share,
  Clock
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface GroupActivity {
  id: string;
  type: 'member_joined' | 'member_left' | 'quest_shared' | 'location_shared' | 'message' | 'admin_action';
  user: {
    id: string;
    name: string;
    avatar: string;
    level: number;
    isVerified?: boolean;
  };
  timestamp: string;
  content?: string;
  metadata?: {
    questTitle?: string;
    locationName?: string;
    memberName?: string;
    actionType?: string;
  };
  engagement?: {
    likes: number;
    comments: number;
    isLiked: boolean;
  };
}

interface GroupActivityFeedProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
}

export function GroupActivityFeed({ isOpen, onClose, groupId, groupName }: GroupActivityFeedProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'quests' | 'members' | 'locations'>('all');

  // Mock activity data
  const mockActivities: GroupActivity[] = [
    {
      id: '1',
      type: 'quest_shared',
      user: {
        id: '1',
        name: 'Alex Chen',
        avatar: '/api/placeholder/40/40',
        level: 18
      },
      timestamp: '2h ago',
      content: 'Check out this awesome pizza challenge! 🍕',
      metadata: {
        questTitle: 'NYC Pizza Tour Challenge'
      },
      engagement: {
        likes: 12,
        comments: 3,
        isLiked: false
      }
    },
    {
      id: '2',
      type: 'member_joined',
      user: {
        id: '2',
        name: 'Sarah Wilson',
        avatar: '/api/placeholder/40/40',
        level: 22,
        isVerified: true
      },
      timestamp: '4h ago',
      metadata: {
        memberName: 'Sarah Wilson'
      }
    },
    {
      id: '3',
      type: 'location_shared',
      user: {
        id: '3',
        name: 'Marcus Rivera',
        avatar: '/api/placeholder/40/40',
        level: 25
      },
      timestamp: '6h ago',
      content: 'Found this hidden gem! The ramen here is incredible 🍜',
      metadata: {
        locationName: 'Tanuki Ramen House'
      },
      engagement: {
        likes: 8,
        comments: 5,
        isLiked: true
      }
    },
    {
      id: '4',
      type: 'message',
      user: {
        id: '4',
        name: 'Emma Thompson',
        avatar: '/api/placeholder/40/40',
        level: 15
      },
      timestamp: '1d ago',
      content: 'Anyone tried the new Korean BBQ place on 5th street? Thinking of checking it out this weekend! 🥩',
      engagement: {
        likes: 15,
        comments: 8,
        isLiked: false
      }
    },
    {
      id: '5',
      type: 'admin_action',
      user: {
        id: '1',
        name: 'Alex Chen',
        avatar: '/api/placeholder/40/40',
        level: 18
      },
      timestamp: '2d ago',
      metadata: {
        actionType: 'enabled_quest_sharing'
      }
    }
  ];

  const filteredActivities = mockActivities.filter(activity => {
    switch (selectedFilter) {
      case 'quests':
        return activity.type === 'quest_shared';
      case 'members':
        return activity.type === 'member_joined' || activity.type === 'member_left';
      case 'locations':
        return activity.type === 'location_shared';
      default:
        return true;
    }
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quest_shared':
        return <Trophy className="w-4 h-4 text-orange-500" />;
      case 'location_shared':
        return <MapPin className="w-4 h-4 text-blue-500" />;
      case 'member_joined':
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'member_left':
        return <Users className="w-4 h-4 text-gray-500" />;
      case 'admin_action':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      default:
        return <MessageCircle className="w-4 h-4 text-primary" />;
    }
  };

  const getActivityText = (activity: GroupActivity) => {
    switch (activity.type) {
      case 'member_joined':
        return `${activity.user.name} joined the group`;
      case 'member_left':
        return `${activity.user.name} left the group`;
      case 'quest_shared':
        return `${activity.user.name} shared a quest: ${activity.metadata?.questTitle}`;
      case 'location_shared':
        return `${activity.user.name} shared ${activity.metadata?.locationName}`;
      case 'admin_action':
        return `${activity.user.name} enabled quest sharing for the group`;
      default:
        return activity.content || `${activity.user.name} posted a message`;
    }
  };

  const filters = [
    { key: 'all', label: 'All Activity' },
    { key: 'quests', label: 'Quests' },
    { key: 'members', label: 'Members' },
    { key: 'locations', label: 'Locations' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-background rounded-t-3xl md:rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold">Group Activity</h2>
            <p className="text-sm text-muted-foreground">
              Recent activity in {groupName}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Filters */}
        <div className="border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide">
            {filters.map((filter) => (
              <Button
                key={filter.key}
                variant={selectedFilter === filter.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.key as any)}
                className="flex-shrink-0 rounded-full"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="overflow-y-auto max-h-[60vh] p-4">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No Activity</h3>
              <p className="text-sm text-muted-foreground">
                No recent activity matches your filter
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-card rounded-2xl p-4 border border-border hover:shadow-sm transition-shadow"
                >
                  {/* Activity Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={activity.user.avatar} />
                        <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                      </Avatar>
                      {activity.user.isVerified && (
                        <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate">
                          {activity.user.name}
                        </p>
                        <Badge variant="outline" className="text-xs px-2 py-0">
                          Lv. {activity.user.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {activity.timestamp}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getActivityIcon(activity.type)}
                        <p className="text-sm text-muted-foreground">
                          {getActivityText(activity)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Activity Content */}
                  {activity.content && (
                    <div className="mb-3 pl-13">
                      <p className="text-sm">{activity.content}</p>
                    </div>
                  )}

                  {/* Engagement */}
                  {activity.engagement && (
                    <div className="flex items-center gap-4 pl-13">
                      <button
                        className={cn(
                          "flex items-center gap-1 text-sm transition-colors",
                          activity.engagement.isLiked
                            ? "text-red-500"
                            : "text-muted-foreground hover:text-red-500"
                        )}
                      >
                        <Heart 
                          className={cn(
                            "w-4 h-4",
                            activity.engagement.isLiked && "fill-current"
                          )} 
                        />
                        {activity.engagement.likes}
                      </button>
                      
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        {activity.engagement.comments}
                      </button>
                      
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <Share className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}