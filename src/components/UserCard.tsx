import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserCardProps {
  user: User;
  onFollow: (userId: string) => void;
  onUserClick: (userId: string) => void;
  showFollowButton?: boolean;
}

export function UserCard({ user, onFollow, onUserClick, showFollowButton = true }: UserCardProps) {
  return (
    <div className="flex items-center gap-3 p-3">
      <button onClick={() => onUserClick(user.id)}>
        <Avatar className="w-12 h-12">
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </button>
      
      <div className="flex-1 min-w-0">
        <button 
          onClick={() => onUserClick(user.id)}
          className="block text-left"
        >
          <p className="font-semibold text-sm truncate">{user.username}</p>
          <p className="text-xs text-muted-foreground truncate">{user.displayName}</p>
        </button>
      </div>

      {showFollowButton && (
        <Button
          variant={user.isFollowing ? "secondary" : "default"}
          size="sm"
          onClick={() => onFollow(user.id)}
          className={user.isFollowing ? "" : "instagram-gradient text-white border-0"}
        >
          {user.isFollowing ? 'Following' : 'Follow'}
        </Button>
      )}
    </div>
  );
}