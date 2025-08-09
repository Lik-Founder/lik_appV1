import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConsistentAvatar } from '@/components/ui/consistent-avatar';
import { ArrowLeft, Search, SlidersHorizontal, Plus, Crown, Trophy, MapPin, MessageCircle, Users, Gear } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { CreateGroupChatModal } from '@/components/CreateGroupChatModal';
import { AddMembersModal } from '@/components/AddMembersModal';
import { GroupManagementModal } from '@/components/GroupManagementModal';
import { GroupChatIntroModal } from '@/components/GroupChatIntroModal';
import { useKV } from '@github/spark/hooks';

interface Chat {
  id: string;
  name: string;
  avatar: string;
  level: number;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  isVerified?: boolean;
  isRestaurant?: boolean;
  isGroup?: boolean;
  hasQuest?: boolean;
  questType?: 'bounty' | 'duel' | 'challenge';
  messageType?: 'text' | 'location' | 'quest';
  streakDays?: number;
  unreadCount?: number;
  memberCount?: number;
  groupCategory?: string;
  isAdmin?: boolean;
}

interface MessagesPageProps {
  onBack: () => void;
  onOpenChat?: (chatId: string) => void;
  onShowUserProfile?: (userId: string) => void;
  onShowRestaurantProfile?: (restaurantId: string) => void;
}

export function MessagesPage({ onBack, onOpenChat, onShowUserProfile, onShowRestaurantProfile }: MessagesPageProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'quests' | 'groups' | 'verified'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState<string | null>(null);
  const [showGroupManagement, setShowGroupManagement] = useState<string | null>(null);
  const [showGroupIntro, setShowGroupIntro] = useState(false);
  
  // Track if user has seen group chat intro
  const [hasSeenGroupIntro, setHasSeenGroupIntro] = useKV('has-seen-group-intro', false);

  // Mock chat data
  const mockChats: Chat[] = [
    {
      id: '1',
      name: 'Alex Chen',
      avatar: '/api/placeholder/48/48',
      level: 18,
      lastMessage: 'Hey! Have you tried that new ramen place downtown? The broth is incredible!',
      timestamp: '5m ago',
      unread: true,
      messageType: 'text',
      streakDays: 5,
      unreadCount: 2
    },
    {
      id: '2',
      name: 'Food Explorers',
      avatar: '/api/placeholder/48/48',
      level: 0,
      lastMessage: 'Sarah: Who wants to try the new burger place?',
      timestamp: '3h ago',
      unread: false,
      messageType: 'text',
      isGroup: true,
      memberCount: 8,
      groupCategory: 'Local Dining',
      isAdmin: true
    },
    {
      id: '3',
      name: 'Marcus Rivera',
      avatar: '/api/placeholder/48/48',
      level: 22,
      lastMessage: '💪 Food duel in progress - Pizza Challenge!',
      timestamp: 'Yesterday',
      unread: true,
      hasQuest: true,
      questType: 'duel',
      messageType: 'quest',
      isVerified: true,
      unreadCount: 3
    },
    {
      id: '4',
      name: 'Chef Gordon',
      avatar: '/api/placeholder/48/48',
      level: 35,
      lastMessage: 'Thanks for the amazing review! 👨‍🍳',
      timestamp: 'Yesterday',
      unread: false,
      isVerified: true,
      messageType: 'text'
    },
    {
      id: '5',
      name: 'Taco Tuesday Gang',
      avatar: '/api/placeholder/48/48',
      level: 0,
      lastMessage: 'Maria: See you all at 7pm! 🌮',
      timestamp: '2d ago',
      unread: false,
      messageType: 'text',
      isGroup: true,
      memberCount: 12,
      groupCategory: 'Events',
      isAdmin: false
    },
    {
      id: '6',
      name: 'SF Foodies United',
      avatar: '/api/placeholder/48/48',
      level: 0,
      lastMessage: 'David: Found an amazing new sushi place!',
      timestamp: '1w ago',
      unread: true,
      messageType: 'text',
      isGroup: true,
      memberCount: 24,
      groupCategory: 'General Food Talk',
      isAdmin: true,
      unreadCount: 5
    }
  ];

  const tabs = [
    { key: 'all', label: 'All', count: mockChats.length },
    { key: 'unread', label: 'Unread', count: mockChats.filter(c => c.unread).length },
    { key: 'quests', label: 'With Quests', count: mockChats.filter(c => c.hasQuest).length },
    { key: 'groups', label: 'Groups', count: mockChats.filter(c => c.isGroup).length },
    { key: 'verified', label: 'Verified Creators', count: mockChats.filter(c => c.isVerified).length }
  ] as const;

  const filteredChats = mockChats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (activeTab) {
      case 'unread':
        return chat.unread && matchesSearch;
      case 'quests':
        return chat.hasQuest && matchesSearch;
      case 'groups':
        return chat.isGroup && matchesSearch;
      case 'verified':
        return chat.isVerified && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  const getLevelColor = (level: number) => {
    if (level >= 30) return 'from-purple-500 to-pink-500';
    if (level >= 20) return 'from-blue-500 to-purple-500';
    if (level >= 10) return 'from-green-500 to-blue-500';
    return 'from-orange-500 to-red-500';
  };

  const getQuestIcon = (questType?: string) => {
    switch (questType) {
      case 'bounty':
        return '🎯';
      case 'duel':
        return '💪';
      case 'challenge':
        return '🏆';
      default:
        return '🎯';
    }
  };

  const getMessageTypeIcon = (messageType?: string) => {
    switch (messageType) {
      case 'location':
        return <MapPin className="w-4 h-4 text-blue-500" />;
      case 'quest':
        return <Trophy className="w-4 h-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const handleChatClick = (chat: Chat) => {
    if (chat.isRestaurant && onShowRestaurantProfile) {
      onShowRestaurantProfile(chat.id);
    } else if (chat.name === 'Alex Chen' && onOpenChat) {
      // Alex Chen should open a chat thread, not a profile
      onOpenChat(chat.id);
    } else if (!chat.isRestaurant && !chat.isGroup && onShowUserProfile) {
      onShowUserProfile(chat.id);
    } else if (onOpenChat) {
      onOpenChat(chat.id);
    }
  };

  const handleChatLongPress = (chat: Chat) => {
    if (chat.isGroup) {
      setShowGroupManagement(chat.id);
    }
  };

  const handleCreateGroup = (groupData: any) => {
    console.log('Creating group:', groupData);
    // Here you would typically call an API to create the group
    // For now, we'll just close the modal
  };

  const handleAddMembers = (groupId: string, memberIds: string[]) => {
    console.log('Adding members to group:', groupId, memberIds);
    // Here you would typically call an API to add members
    setShowAddMembers(null);
  };

  const handleStartGroupCreation = () => {
    if (!hasSeenGroupIntro) {
      setShowGroupIntro(true);
    } else {
      setShowCreateGroup(true);
    }
  };

  const handleGroupIntroComplete = () => {
    setHasSeenGroupIntro(true);
    setShowGroupIntro(false);
    setShowCreateGroup(true);
  };

  const mockGroupData = {
    name: 'Food Explorers',
    description: 'A group for adventurous food lovers exploring new cuisines together',
    memberCount: 8,
    category: 'Local Dining',
    privacy: 'private' as const,
    created: '2024-01-15',
    allowQuestSharing: true,
    allowLocationSharing: true,
    moderationLevel: 'moderated' as const
  };

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 hover:bg-muted rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold nav-rum-raisin">Messages</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-muted rounded-full"
          >
            <Search className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilter(!showFilter)}
            className="p-2 hover:bg-muted rounded-full"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStartGroupCreation}
            className="p-2 hover:bg-muted rounded-full"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {showFilter && (
        <div className="p-4 border-b border-border bg-muted/30">
          <Input
            placeholder="Search messages, users, or restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      )}

      {/* Tab Selector */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-[73px] z-10">
        <div className="flex gap-1 p-4 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all",
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-muted/50"
              )}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={cn(
                  "ml-2 px-2 py-0.5 rounded-full text-xs",
                  activeTab === tab.key
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                  {tab.count}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <MessageCircle className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No messages found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? "Try adjusting your search" : "Start a conversation with fellow foodies!"}
            </p>
            <Button className="rounded-full" onClick={handleStartGroupCreation}>
              <Plus className="w-4 h-4 mr-2" />
              Start New Chat
            </Button>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatClick(chat)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleChatLongPress(chat);
                }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-card hover:bg-muted/50 transition-all duration-200 cursor-pointer touch-feedback relative group"
              >
                {/* Profile Picture with Level Ring */}
                <div className="relative flex-shrink-0">
                  {chat.isGroup ? (
                    <ConsistentAvatar
                      src=""
                      alt={chat.name}
                      fallback=""
                      size="lg"
                      variant="level-badge"
                      level={chat.memberCount}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    </ConsistentAvatar>
                  ) : (
                    <ConsistentAvatar
                      src={chat.avatar}
                      alt={chat.name}
                      fallback={chat.name[0]?.toUpperCase()}
                      size="lg"
                      variant="level-badge"
                      level={chat.level > 0 ? chat.level : undefined}
                      isOnline={chat.isOnline}
                    />
                  )}
                  
                  {/* Verification Badge */}
                  {chat.isVerified && (
                    <div className="absolute -top-1 -right-1">
                      <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </div>
                  )}
                </div>

                {/* Chat Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">
                      {chat.name}
                    </h3>
                    {chat.isGroup && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        Group
                      </span>
                    )}
                    {!chat.isGroup && chat.level > 0 && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        Lv. {chat.level}
                      </span>
                    )}
                    {chat.streakDays && (
                      <div className="flex items-center gap-1">
                        <span className="text-sm">🔥</span>
                        <span className="text-xs text-orange-500 font-medium">
                          {chat.streakDays}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getMessageTypeIcon(chat.messageType)}
                    <p className="text-sm text-muted-foreground truncate flex-1">
                      {chat.hasQuest && (
                        <span className="mr-2">
                          {getQuestIcon(chat.questType)}
                        </span>
                      )}
                      {chat.lastMessage}
                    </p>
                  </div>
                  
                  {/* Group Category */}
                  {chat.isGroup && chat.groupCategory && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {chat.groupCategory}
                    </p>
                  )}
                </div>

                {/* Right Side */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {chat.timestamp}
                    </span>
                    
                    {/* Group Management Button */}
                    {chat.isGroup && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowGroupManagement(chat.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                      >
                        <Gear className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {chat.hasQuest && (
                      <div className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">
                        Quest
                      </div>
                    )}
                    
                    {chat.unread && chat.unreadCount && (
                      <div className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                        {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                      </div>
                    )}
                    
                    {chat.unread && !chat.unreadCount && (
                      <div className="w-3 h-3 bg-primary rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-20">
        <Button
          size="lg"
          onClick={handleStartGroupCreation}
          className="fab w-14 h-14 rounded-full shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Modals */}
      <GroupChatIntroModal
        isOpen={showGroupIntro}
        onClose={() => setShowGroupIntro(false)}
        onStartCreating={handleGroupIntroComplete}
      />

      <CreateGroupChatModal
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onCreateGroup={handleCreateGroup}
      />

      {showAddMembers && (
        <AddMembersModal
          isOpen={!!showAddMembers}
          onClose={() => setShowAddMembers(null)}
          groupId={showAddMembers}
          groupName="Food Explorers"
          currentMembers={['1', '2', '3']}
          onAddMembers={(memberIds) => handleAddMembers(showAddMembers, memberIds)}
        />
      )}

      {showGroupManagement && (
        <GroupManagementModal
          isOpen={!!showGroupManagement}
          onClose={() => setShowGroupManagement(null)}
          groupId={showGroupManagement}
          groupData={mockGroupData}
          isAdmin={true}
          onUpdateGroup={(updates) => console.log('Update group:', updates)}
          onLeaveGroup={() => {
            console.log('Leave group');
            setShowGroupManagement(null);
          }}
          onDeleteGroup={() => {
            console.log('Delete group');
            setShowGroupManagement(null);
          }}
        />
      )}
    </div>
  );
}