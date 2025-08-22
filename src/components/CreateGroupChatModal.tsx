import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  XMarkIcon as X, 
  PlusIcon as Plus, 
  MagnifyingGlassIcon as Search, 
  CameraIcon as Camera, 
  UsersIcon as Users, 
  CrownIcon as Crown, 
  MapPinIcon as MapPin,
  Square3Stack3DIcon as Utensils,
  GlobeAltIcon as Globe,
  LockClosedIcon as Lock,
  ShieldCheckIcon as Shield
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useKV } from '@github/spark/hooks';

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

interface CreateGroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (groupData: GroupChatData) => void;
}

interface GroupChatData {
  name: string;
  description: string;
  avatar?: string;
  members: string[];
  privacy: 'public' | 'private' | 'invite-only';
  category: string;
  location?: string;
  allowQuestSharing: boolean;
  allowLocationSharing: boolean;
  moderationLevel: 'open' | 'moderated' | 'strict';
}

export function CreateGroupChatModal({ isOpen, onClose, onCreateGroup }: CreateGroupChatModalProps) {
  const [step, setStep] = useState<'details' | 'members' | 'settings'>('details');
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'private' | 'invite-only'>('private');
  const [category, setCategory] = useState('general');
  const [location, setLocation] = useState('');
  const [allowQuestSharing, setAllowQuestSharing] = useState(true);
  const [allowLocationSharing, setAllowLocationSharing] = useState(true);
  const [moderationLevel, setModerationLevel] = useState<'open' | 'moderated' | 'strict'>('moderated');
  
  // Mock friends/contacts data
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Alex Chen',
      username: '@alexfoodie',
      avatar: '/api/placeholder/40/40',
      level: 18,
      isFollowing: true,
      mutualFriends: 5,
      location: 'San Francisco'
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      username: '@sarahwils',
      avatar: '/api/placeholder/40/40',
      level: 22,
      isVerified: true,
      isFollowing: true,
      mutualFriends: 8,
      location: 'Los Angeles'
    },
    {
      id: '3',
      name: 'Marcus Rivera',
      username: '@marcuseats',
      avatar: '/api/placeholder/40/40',
      level: 25,
      isFollowing: true,
      mutualFriends: 3,
      location: 'New York'
    },
    {
      id: '4',
      name: 'Emma Thompson',
      username: '@emmafood',
      avatar: '/api/placeholder/40/40',
      level: 15,
      isFollowing: false,
      mutualFriends: 2,
      location: 'Chicago'
    },
    {
      id: '5',
      name: 'David Kim',
      username: '@davidk',
      avatar: '/api/placeholder/40/40',
      level: 20,
      isVerified: true,
      isFollowing: true,
      mutualFriends: 6,
      location: 'Seattle'
    }
  ];

  const categories = [
    { id: 'general', label: 'General Food Talk', icon: '💬' },
    { id: 'local', label: 'Local Dining', icon: '📍' },
    { id: 'cuisine', label: 'Cuisine Specific', icon: '🍜' },
    { id: 'reviews', label: 'Restaurant Reviews', icon: '⭐' },
    { id: 'cooking', label: 'Cooking & Recipes', icon: '👨‍🍳' },
    { id: 'events', label: 'Food Events', icon: '🎉' },
    { id: 'challenges', label: 'Food Challenges', icon: '🏆' },
    { id: 'deals', label: 'Deals & Offers', icon: '💰' }
  ];

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

  const handleNext = () => {
    if (step === 'details') {
      setStep('members');
    } else if (step === 'members') {
      setStep('settings');
    }
  };

  const handleBack = () => {
    if (step === 'members') {
      setStep('details');
    } else if (step === 'settings') {
      setStep('members');
    }
  };

  const handleCreateGroup = () => {
    const groupData: GroupChatData = {
      name: groupName,
      description,
      members: Array.from(selectedMembers),
      privacy,
      category,
      location,
      allowQuestSharing,
      allowLocationSharing,
      moderationLevel
    };
    
    onCreateGroup(groupData);
    // Reset form
    setGroupName('');
    setDescription('');
    setSelectedMembers(new Set());
    setStep('details');
    onClose();
  };

  const canProceed = () => {
    if (step === 'details') return groupName.trim().length > 0;
    if (step === 'members') return selectedMembers.size > 0;
    return true;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-background rounded-t-3xl md:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            {step !== 'details' && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <X className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h2 className="text-xl font-bold">
                {step === 'details' && 'Create Group'}
                {step === 'members' && 'Add Members'}
                {step === 'settings' && 'Group Settings'}
              </h2>
              <p className="text-sm text-muted-foreground">
                Step {step === 'details' ? 1 : step === 'members' ? 2 : 3} of 3
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted h-1">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ 
              width: step === 'details' ? '33%' : step === 'members' ? '66%' : '100%' 
            }}
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Step 1: Group Details */}
          {step === 'details' && (
            <div className="space-y-6">
              {/* Group Avatar */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center border-2 border-dashed border-border">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Group Name */}
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name *</Label>
                <Input
                  id="groupName"
                  placeholder="e.g., SF Foodies, Taco Tuesday Crew"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground">
                  {groupName.length}/50 characters
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell people what this group is about..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={200}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/200 characters
                </p>
              </div>

              {/* Category */}
              <div className="space-y-3">
                <Label>Category</Label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={cn(
                        "p-3 rounded-xl border text-left transition-all",
                        category === cat.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{cat.icon}</span>
                        <span className="text-sm font-medium">{cat.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Add Members */}
          {step === 'members' && (
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
                  <Label>Selected Members ({selectedMembers.size})</Label>
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
                  {filteredUsers.map((user) => (
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
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Settings */}
          {step === 'settings' && (
            <div className="space-y-6">
              {/* Privacy Settings */}
              <div className="space-y-3">
                <Label>Privacy</Label>
                <div className="space-y-2">
                  {[
                    {
                      value: 'private',
                      label: 'Private',
                      description: 'Only invited members can join',
                      icon: <Lock className="w-4 h-4" />
                    },
                    {
                      value: 'invite-only',
                      label: 'Invite Only',
                      description: 'Members can invite others with approval',
                      icon: <Shield className="w-4 h-4" />
                    },
                    {
                      value: 'public',
                      label: 'Public',
                      description: 'Anyone can discover and join',
                      icon: <Globe className="w-4 h-4" />
                    }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setPrivacy(option.value as any)}
                      className={cn(
                        "w-full p-3 rounded-lg border text-left transition-all",
                        privacy === option.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "mt-0.5",
                          privacy === option.value ? "text-primary" : "text-muted-foreground"
                        )}>
                          {option.icon}
                        </div>
                        <div>
                          <p className="font-medium">{option.label}</p>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="e.g., San Francisco, CA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <Label>Group Features</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Quest Sharing</p>
                      <p className="text-xs text-muted-foreground">
                        Allow members to share food quests and challenges
                      </p>
                    </div>
                    <Checkbox
                      checked={allowQuestSharing}
                      onCheckedChange={setAllowQuestSharing}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Location Sharing</p>
                      <p className="text-xs text-muted-foreground">
                        Allow members to share restaurant locations
                      </p>
                    </div>
                    <Checkbox
                      checked={allowLocationSharing}
                      onCheckedChange={setAllowLocationSharing}
                    />
                  </div>
                </div>
              </div>

              {/* Moderation Level */}
              <div className="space-y-3">
                <Label>Moderation Level</Label>
                <div className="space-y-2">
                  {[
                    {
                      value: 'open',
                      label: 'Open',
                      description: 'Anyone can post freely'
                    },
                    {
                      value: 'moderated',
                      label: 'Moderated',
                      description: 'Admins approve new posts'
                    },
                    {
                      value: 'strict',
                      label: 'Strict',
                      description: 'All content requires approval'
                    }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setModerationLevel(option.value as any)}
                      className={cn(
                        "w-full p-3 rounded-lg border text-left transition-all",
                        moderationLevel === option.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/30">
          <div className="flex gap-3">
            {step !== 'details' && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
            )}
            <Button
              onClick={step === 'settings' ? handleCreateGroup : handleNext}
              disabled={!canProceed()}
              className="flex-1"
            >
              {step === 'settings' ? 'Create Group' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}