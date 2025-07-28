import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { User } from '@/lib/types';
import { generateMockUsers } from '@/lib/mockData';
import { UserCard } from '@/components/UserCard';
import { useDevice } from '@/hooks/use-device';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search as SearchIcon } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function SearchPage() {
  const [users, setUsers] = useKV<User[]>('users', generateMockUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const device = useDevice();
  
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
    'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop',
  ];

  // Grid columns based on device type
  const gridCols = device.type === 'tablet' ? 'grid-cols-4' : 'grid-cols-3';
  const padding = device.type === 'tablet' ? 'p-6' : 'p-4';

  return (
    <div className="h-full flex flex-col">
      {/* Search Header */}
      <div className={cn("border-b border-border bg-background/95 backdrop-blur-sm", padding)}>
        <div className="relative">
          <SearchIcon 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            size={device.type === 'tablet' ? 20 : 16} 
          />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "pl-10 touch-target",
              device.type === 'tablet' ? "h-12 text-base" : "h-10 text-sm"
            )}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="explore" className="flex-1 flex flex-col">
        <TabsList className={cn(
          "grid w-full grid-cols-2 mx-4 my-2",
          device.type === 'tablet' && "mx-6 my-3 h-12"
        )}>
          <TabsTrigger 
            value="explore"
            className={cn(
              "touch-target",
              device.type === 'tablet' && "text-base h-10"
            )}
          >
            Explore
          </TabsTrigger>
          <TabsTrigger 
            value="users"
            className={cn(
              "touch-target",
              device.type === 'tablet' && "text-base h-10"
            )}
          >
            Users
          </TabsTrigger>
        </TabsList>

        {/* Explore Tab */}
        <TabsContent value="explore" className="flex-1 overflow-hidden">
          <div className={cn("h-full overflow-y-auto scrollbar-hide", padding)}>
            <div className={cn("grid gap-1", gridCols)}>
              {exploreImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => toast.info('Post view coming soon!')}
                  className="aspect-square bg-muted rounded-sm overflow-hidden touch-target active:scale-95 transition-transform duration-150"
                >
                  <img
                    src={image}
                    alt={`Explore ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-hide">
            <div className="space-y-2">
              {searchQuery === '' ? (
                <div className={cn("text-center", device.type === 'tablet' ? "p-12" : "p-8")}>
                  <SearchIcon 
                    size={device.type === 'tablet' ? 64 : 48} 
                    className="mx-auto mb-4 text-muted-foreground" 
                  />
                  <p className={cn(
                    "text-muted-foreground",
                    device.type === 'tablet' ? "text-lg" : "text-base"
                  )}>
                    Search for users to discover new people
                  </p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className={cn("text-center", device.type === 'tablet' ? "p-12" : "p-8")}>
                  <p className={cn(
                    "text-muted-foreground",
                    device.type === 'tablet' ? "text-lg" : "text-base"
                  )}>
                    No users found for "{searchQuery}"
                  </p>
                </div>
              ) : (
                filteredUsers.map(user => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onFollow={handleFollow}
                    onUserClick={handleUserClick}
                    deviceType={device.type}
                  />
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}