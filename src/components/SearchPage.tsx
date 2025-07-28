import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { User } from '@/lib/types';
import { generateMockUsers } from '@/lib/mockData';
import { UserCard } from '@/components/UserCard';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search as SearchIcon } from '@phosphor-icons/react';
import { toast } from 'sonner';

export function SearchPage() {
  const [users, setUsers] = useKV<User[]>('users', generateMockUsers());
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFollow = (userId: string) => {
    setUsers(currentUsers =>
      currentUsers.map(user =>
        user.id === userId
          ? {
              ...user,
              isFollowing: !user.isFollowing,
              followerCount: user.isFollowing 
                ? user.followerCount - 1 
                : user.followerCount + 1
            }
          : user
      )
    );
  };

  const handleUserClick = (userId: string) => {
    toast.info('Profile view coming soon!');
  };

  const exploreImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=300&fit=crop',
  ];

  return (
    <div className="h-full">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="explore" className="h-full">
        <TabsList className="grid w-full grid-cols-2 mx-4 my-2">
          <TabsTrigger value="explore">Explore</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="explore" className="h-full">
          <ScrollArea className="h-full p-4">
            <div className="grid grid-cols-3 gap-1">
              {exploreImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => toast.info('Post view coming soon!')}
                  className="aspect-square bg-muted rounded-sm overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`Explore ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="users" className="h-full">
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {searchQuery === '' ? (
                <div className="p-8 text-center">
                  <SearchIcon size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Search for users to discover new people</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No users found for "{searchQuery}"</p>
                </div>
              ) : (
                filteredUsers.map(user => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onFollow={handleFollow}
                    onUserClick={handleUserClick}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}