import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { 
  X, 
  Camera,
  Crown,
  Shield,
  UserMinus,
  Settings,
  Bell,
  Volume,
  Eye,
  Globe,
  Lock,
  Trash,
  Users,
  Info,
  Edit
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface GroupMember {
  id: string;
  name: string;
  username: string;
  avatar: string;
  level: number;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
  isVerified?: boolean;
  isOnline?: boolean;
  lastSeen?: string;
}

interface GroupManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupData: {
    name: string;
    description: string;
    avatar?: string;
    memberCount: number;
    category: string;
    privacy: 'public' | 'private' | 'invite-only';
    created: string;
    allowQuestSharing: boolean;
    allowLocationSharing: boolean;
    moderationLevel: 'open' | 'moderated' | 'strict';
  };
  isAdmin: boolean;
  onUpdateGroup?: (updates: any) => void;
  onLeaveGroup?: () => void;
  onDeleteGroup?: () => void;
}

export function GroupManagementModal({ 
  isOpen, 
  onClose, 
  groupId,
  groupData,
  isAdmin,
  onUpdateGroup,
  onLeaveGroup,
  onDeleteGroup
}: GroupManagementModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'members' | 'activity' | 'settings' | 'notifications'>('info');
  const [editMode, setEditMode] = useState(false);
  const [groupName, setGroupName] = useState(groupData.name);
  const [description, setDescription] = useState(groupData.description);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Notification settings
  const [muteNotifications, setMuteNotifications] = useState(false);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [questNotifications, setQuestNotifications] = useState(true);
  const [mentionNotifications, setMentionNotifications] = useState(true);

  // Mock group members
  const mockMembers: GroupMember[] = [
    {
      id: '1',
      name: 'Alex Chen',
      username: '@alexfoodie',
      avatar: '/api/placeholder/40/40',
      level: 18,
      role: 'admin',
      joinedAt: '2024-01-15',
      isVerified: false,
      isOnline: true
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      username: '@sarahwils',
      avatar: '/api/placeholder/40/40',
      level: 22,
      role: 'moderator',
      joinedAt: '2024-01-16',
      isVerified: true,
      isOnline: true
    },
    {
      id: '3',
      name: 'Marcus Rivera',
      username: '@marcuseats',
      avatar: '/api/placeholder/40/40',
      level: 25,
      role: 'member',
      joinedAt: '2024-01-20',
      isOnline: false,
      lastSeen: '2h ago'
    },
    {
      id: '4',
      name: 'Emma Thompson',
      username: '@emmafood',
      avatar: '/api/placeholder/40/40',
      level: 15,
      role: 'member',
      joinedAt: '2024-01-25',
      isOnline: false,
      lastSeen: '1d ago'
    }
  ];

  const filteredMembers = mockMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'moderator':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'moderator':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSaveChanges = () => {
    if (onUpdateGroup) {
      onUpdateGroup({
        name: groupName,
        description: description
      });
    }
    setEditMode(false);
  };

  const tabs = [
    { key: 'info', label: 'Info', icon: <Info className="w-4 h-4" /> },
    { key: 'members', label: 'Members', icon: <Users className="w-4 h-4" /> },
    { key: 'activity', label: 'Activity', icon: <MessageCircle className="w-4 h-4" /> },
    { key: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { key: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-background rounded-t-3xl md:rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold">Group Management</h2>
            <p className="text-sm text-muted-foreground">
              Manage {groupData.name}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="p-6 space-y-6">
              {/* Group Avatar and Basic Info */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center border">
                    {groupData.avatar ? (
                      <img src={groupData.avatar} alt="Group" className="w-full h-full rounded-2xl object-cover" />
                    ) : (
                      <Users className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  {isAdmin && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  {editMode ? (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="editGroupName">Group Name</Label>
                        <Input
                          id="editGroupName"
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="editDescription">Description</Label>
                        <Textarea
                          id="editDescription"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveChanges}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditMode(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{groupData.name}</h3>
                        {isAdmin && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditMode(true)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">{groupData.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          {groupData.memberCount} members
                        </Badge>
                        <Badge variant="outline">
                          {groupData.category}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {groupData.privacy === 'public' && <Globe className="w-3 h-3" />}
                          {groupData.privacy === 'private' && <Lock className="w-3 h-3" />}
                          {groupData.privacy === 'invite-only' && <Shield className="w-3 h-3" />}
                          {groupData.privacy}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Group Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-primary">{groupData.memberCount}</p>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-primary">
                    {mockMembers.filter(m => m.isOnline).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Online Now</p>
                </div>
              </div>

              {/* Group Features */}
              <div className="space-y-3">
                <h4 className="font-semibold">Features</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm">Quest Sharing</span>
                    <Badge variant={groupData.allowQuestSharing ? 'default' : 'secondary'}>
                      {groupData.allowQuestSharing ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm">Location Sharing</span>
                    <Badge variant={groupData.allowLocationSharing ? 'default' : 'secondary'}>
                      {groupData.allowLocationSharing ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm">Moderation Level</span>
                    <Badge variant="outline">
                      {groupData.moderationLevel}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="p-6 space-y-4">
              {/* Search Members */}
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Members List */}
              <div className="space-y-3">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        {member.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                        )}
                        {member.isVerified && (
                          <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{member.name}</p>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            Lv. {member.level}
                          </span>
                          {getRoleIcon(member.role)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{member.username}</span>
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs px-2 py-0", getRoleBadgeColor(member.role))}
                          >
                            {member.role}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {member.isOnline ? 'Online' : `Last seen ${member.lastSeen}`}
                        </p>
                      </div>
                    </div>
                    
                    {isAdmin && member.role !== 'admin' && (
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <UserMinus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="p-6 space-y-4">
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Group Activity</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View recent group activity and engagement
                </p>
                <Button onClick={() => {
                  // This would open the full activity feed
                  console.log('Open activity feed for group:', groupId);
                }}>
                  View Full Activity
                </Button>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold text-primary">24</p>
                  <p className="text-xs text-muted-foreground">Messages Today</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold text-primary">3</p>
                  <p className="text-xs text-muted-foreground">Quests Shared</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold text-primary">5</p>
                  <p className="text-xs text-muted-foreground">New Members</p>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="p-6 space-y-6">
              {isAdmin ? (
                <div className="space-y-6">
                  {/* Privacy Settings */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Privacy & Access</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Group Privacy</p>
                          <p className="text-xs text-muted-foreground">
                            Control who can find and join this group
                          </p>
                        </div>
                        <Badge variant="outline">{groupData.privacy}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Quest Sharing</p>
                          <p className="text-xs text-muted-foreground">
                            Allow members to share food quests
                          </p>
                        </div>
                        <Switch checked={groupData.allowQuestSharing} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Location Sharing</p>
                          <p className="text-xs text-muted-foreground">
                            Allow members to share restaurant locations
                          </p>
                        </div>
                        <Switch checked={groupData.allowLocationSharing} />
                      </div>
                    </div>
                  </div>

                  {/* Moderation Settings */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Moderation</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm">Moderation Level</span>
                        <Badge variant="outline">{groupData.moderationLevel}</Badge>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm">Auto-moderate Links</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm">Spam Detection</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="space-y-3 border-t border-border pt-6">
                    <h4 className="font-semibold text-destructive">Danger Zone</h4>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full text-destructive border-destructive hover:bg-destructive/10"
                        onClick={onDeleteGroup}
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete Group
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">Admin Only</h3>
                    <p className="text-sm text-muted-foreground">
                      Only group administrators can modify these settings
                    </p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full text-destructive border-destructive hover:bg-destructive/10"
                    onClick={onLeaveGroup}
                  >
                    <UserMinus className="w-4 h-4 mr-2" />
                    Leave Group
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mute Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Turn off all notifications from this group
                    </p>
                  </div>
                  <Switch 
                    checked={muteNotifications}
                    onCheckedChange={setMuteNotifications}
                  />
                </div>

                <div className="space-y-4 opacity-50" style={{ opacity: muteNotifications ? 0.5 : 1 }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Messages</p>
                      <p className="text-xs text-muted-foreground">
                        New messages in this group
                      </p>
                    </div>
                    <Switch 
                      checked={messageNotifications && !muteNotifications}
                      onCheckedChange={setMessageNotifications}
                      disabled={muteNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Quests & Challenges</p>
                      <p className="text-xs text-muted-foreground">
                        New quests and food challenges
                      </p>
                    </div>
                    <Switch 
                      checked={questNotifications && !muteNotifications}
                      onCheckedChange={setQuestNotifications}
                      disabled={muteNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mentions</p>
                      <p className="text-xs text-muted-foreground">
                        When someone mentions you
                      </p>
                    </div>
                    <Switch 
                      checked={mentionNotifications && !muteNotifications}
                      onCheckedChange={setMentionNotifications}
                      disabled={muteNotifications}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/30">
          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}