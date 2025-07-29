import { useState } from 'react';
import { MessageCircle, Heart } from '@phosphor-icons/react';
import { Comment, User } from '@/lib/types';
import { useKV } from '@github/spark/hooks';
import { DeviceType } from '@/hooks/use-device';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface QuickCommentsViewProps {
  postId: string;
  onOpenModal: () => void;
  deviceType: DeviceType;
}

export function QuickCommentsView({ postId, onOpenModal, deviceType }: QuickCommentsViewProps) {
  const [comments] = useKV<Comment[]>(`comments-${postId}`, []);
  const [users] = useKV<User[]>('users', []);

  const getUserById = (userId: string) => {
    return users.find(u => u.id === userId) || {
      id: userId,
      username: 'user',
      displayName: 'Unknown User',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      bio: '',
      followerCount: 0,
      followingCount: 0,
      postCount: 0,
      isFollowing: false
    };
  };

  const recentComments = comments.slice(-2);
  const iconSize = deviceType === 'tablet' ? 16 : 14;

  if (comments.length === 0) {
    return (
      <button
        onClick={onOpenModal}
        className={cn(
          "text-muted-foreground hover:text-foreground transition-colors touch-target text-left",
          deviceType === 'tablet' ? "text-sm" : "text-xs"
        )}
      >
        Be the first to comment...
      </button>
    );
  }

  return (
    <div className="space-y-2">
      {comments.length > 2 && (
        <button
          onClick={onOpenModal}
          className={cn(
            "text-muted-foreground hover:text-foreground transition-colors touch-target flex items-center gap-2",
            deviceType === 'tablet' ? "text-sm" : "text-xs"
          )}
        >
          <MessageCircle size={iconSize} />
          View all {comments.length} comments
        </button>
      )}
      
      {recentComments.map((comment) => {
        const user = getUserById(comment.userId);
        return (
          <div 
            key={comment.id} 
            className={cn(
              "flex items-start gap-2 group cursor-pointer",
              deviceType === 'tablet' && "gap-3"
            )}
            onClick={onOpenModal}
          >
            <Avatar className={cn(
              deviceType === 'tablet' ? "w-6 h-6" : "w-5 h-5",
              "flex-shrink-0"
            )}>
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback className="text-xs">{user.username[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <p className={cn(
                "selectable-text leading-relaxed",
                deviceType === 'tablet' ? "text-sm" : "text-xs"
              )}>
                <span className="font-semibold mr-2">{user.username}</span>
                {comment.text}
              </p>
              
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                </span>
                
                {comment.likes > 0 && (
                  <div className="flex items-center gap-1">
                    <Heart 
                      size={10} 
                      weight={comment.isLiked ? "fill" : "regular"}
                      className={comment.isLiked ? "text-red-500" : "text-muted-foreground"}
                    />
                    <span className="text-xs text-muted-foreground">
                      {comment.likes}
                    </span>
                  </div>
                )}
                
                <button className="text-xs text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
                  Reply
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}