import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  XMarkIcon as X, 
  MagnifyingGlassIcon as Search, 
  PlusIcon as Plus,
  CrownIcon as Crown, 
  UserPlusIcon as UserPlus,
  ShareIcon as Share,
  LinkIcon,
  QrCodeIcon as QrCode
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  level: number;
  isVerified?: boolean;
  isFollowing?: boolean;
  mutualFriends?: number;
  location?: string;
}

interface AddMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
  currentMembers: string[];
  onAddMembers: (memberIds: string[]) => void;
}

export function AddMembersModal({ 
  isOpen, 
  onClose, 
  groupId, 
  groupName, 
  currentMembers,
  onAddMembers 
}: AddMembersModalProps) {
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteMethod, setInviteMethod] = useState<'search' | 'link' | 'qr'>('search');

  // Mock friends/contacts data (excluding current members)
  const mockUsers: User[] = [
    {
      id: '6',
      name: 'Jessica Brown',
      username: '@jessb',
      avatar: '/api/placeholder/40/40',
      level: 19,
      isFollowing: true,
      mutualFriends: 4,
      location: 'Portland'
    },
    {
      id: '7',
      name: 'Ryan Mitchell',
      username: '@ryanm',
      avatar: '/api/placeholder/40/40',
      level: 16,
      isVerified: true,
      isFollowing: true,
      mutualFriends: 7,
      location: 'Austin'
    },
    {
      id: '8',
      name: 'Olivia Davis',
      username: '@oliviad',
      avatar: '/api/placeholder/40/40',
      level: 23,
      isFollowing: false,
      mutualFriends: 2,
      location: 'Miami'
    },
    {
      id: '9',
      name: 'James Wilson',
      username: '@jameswilson',
      avatar: '/api/placeholder/40/40',
      level: 21,
      isFollowing: true,
      mutualFriends: 5,
      location: 'Denver'
    },
    {
      id: '10',
      name: 'Sophie Chen',
      username: '@sophiec',
      avatar: '/api/placeholder/40/40',
      level: 17,
      isVerified: true,
      isFollowing: true,
      mutualFriends: 9,
      location: 'Boston'
    }
  ].filter(user => !currentMembers.includes(user.id));

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMemberToggle = (userId: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedMembers(newSelected);
  };

  const handleAddMembers = () => {
    onAddMembers(Array.from(selectedMembers));
    setSelectedMembers(new Set());
    onClose();
  };

  const generateInviteLink = () => {
    return `https://lik.app/groups/${groupId}/invite?token=abc123`;
  };

  const copyInviteLink = async () => {
    const link = generateInviteLink();
    try {
      await navigator.clipboard.writeText(link);
      // Show toast notification
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-background rounded-t-3xl md:rounded-3xl w-full max-w-lg max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold">Add Members</h2>
            <p className="text-sm text-muted-foreground">
              Add people to {groupName}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Invite Methods */}
        <div className="p-6 border-b border-border">
          <div className="flex gap-2">
            <Button
              variant={inviteMethod === 'search' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInviteMethod('search')}
              className="flex-1"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button
              variant={inviteMethod === 'link' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInviteMethod('link')}
              className="flex-1"
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Link
            </Button>
            <Button
              variant={inviteMethod === 'qr' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInviteMethod('qr')}
              className="flex-1"
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {/* Search Method */}
          {inviteMethod === 'search' && (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search friends and contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Selected Members */}
              {selectedMembers.size > 0 && (
                <div className="space-y-2">
                  <Label>Selected ({selectedMembers.size})</Label>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(selectedMembers).map((memberId) => {
                      const user = mockUsers.find(u => u.id === memberId);
                      if (!user) return null;
                      return (
                        <Badge
                          key={memberId}
                          variant="secondary"
                          className="flex items-center gap-2 p-2"
                        >
                          <Avatar className="w-4 h-4">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          {user.name}
                          <button
                            onClick={() => handleMemberToggle(memberId)}
                            className="hover:bg-muted rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* User List */}
              <div className="space-y-2">
                <Label>Add People</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No more friends to add</p>
                      <p className="text-sm">Try using an invite link instead</p>
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            {user.isVerified && (
                              <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{user.name}</p>
                              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                Lv. {user.level}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{user.username}</span>
                              {user.isFollowing && (
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  Following
                                </Badge>
                              )}
                            </div>
                            {user.mutualFriends && (
                              <p className="text-xs text-muted-foreground">
                                {user.mutualFriends} mutual friends
                              </p>
                            )}
                          </div>
                        </div>
                        <Checkbox
                          checked={selectedMembers.has(user.id)}
                          onCheckedChange={() => handleMemberToggle(user.id)}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Link Method */}
          {inviteMethod === 'link' && (
            <div className="space-y-4">
              <div className="text-center">
                <LinkIcon className="w-12 h-12 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Share Invite Link</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Anyone with this link can join the group
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={generateInviteLink()}
                    readOnly
                    className="flex-1 bg-muted"
                  />
                  <Button onClick={copyInviteLink} size="sm">
                    Copy
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Share className="w-4 h-4" />
                    Share
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    More Options
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Link Settings</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expires:</span>
                    <span>7 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max uses:</span>
                    <span>No limit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Admin approval:</span>
                    <span>Required</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* QR Code Method */}
          {inviteMethod === 'qr' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-48 h-48 mx-auto bg-muted rounded-2xl flex items-center justify-center mb-4">
                  <QrCode className="w-24 h-24 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Scan to Join</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Let people scan this QR code to join {groupName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Share className="w-4 h-4" />
                  Share QR
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Save Image
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {inviteMethod === 'search' && (
          <div className="p-6 border-t border-border bg-muted/30">
            <Button
              onClick={handleAddMembers}
              disabled={selectedMembers.size === 0}
              className="w-full"
            >
              Add {selectedMembers.size} Member{selectedMembers.size !== 1 ? 's' : ''}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}