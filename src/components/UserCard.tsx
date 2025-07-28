import { User } from '@/lib/types';
import { DeviceType } from '@/hooks/use-device';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserCardProps {
  user: User;
  onFollow: (userId: string) => void;
  onUserClick: (userId: string) => void;
  showFollowButton?: boolean;
  deviceType?: DeviceType;
}

export function UserCard({ user, onFollow, onUserClick, showFollowButton = true, deviceType = 'phone' }: UserCardProps) {
  const avatarSize = deviceType === 'tablet' ? 'w-14 h-14' : 'w-12 h-12';
  const padding = deviceType === 'tablet' ? 'p-4' : 'p-3';
  const gap = deviceType === 'tablet' ? 'gap-4' : 'gap-3';

  return (
    <div className={cn("flex items-center", padding, gap)}>
      <button 
        onClick={() => onUserClick(user.id)}
        className="touch-target active:scale-95 transition-transform duration-150"
      >
        <Avatar className={avatarSize}>
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </button>
      
      <div className="flex-1 min-w-0">
        <button 
          onClick={() => onUserClick(user.id)}
          className="block text-left w-full touch-target active:opacity-70 transition-opacity duration-150"
        >
          <p className={cn(
            "font-semibold truncate selectable-text",
            deviceType === 'tablet' ? "text-base" : "text-sm"
          )}>
            {user.username}
          </p>
          <p className={cn(
            "text-muted-foreground truncate selectable-text",
            deviceType === 'tablet' ? "text-sm" : "text-xs"
          )}>
            {user.displayName}
          </p>
        </button>
      </div>

      {showFollowButton && (
        <Button
          variant={user.isFollowing ? "secondary" : "default"}
          size={deviceType === 'tablet' ? "default" : "sm"}
          onClick={() => onFollow(user.id)}
          className={cn(
            "touch-target active:scale-95 transition-all duration-150",
            user.isFollowing ? "" : "instagram-gradient text-white border-0",
            deviceType === 'tablet' && "px-6"
          )}
        >
          {user.isFollowing ? 'Following' : 'Follow'}
        </Button>
      )}
    </div>
  );
}