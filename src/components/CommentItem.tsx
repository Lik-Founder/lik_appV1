import { useState } from 'react';
import { Heart, ArrowBendUpLeft, DotsThree } from '@phosphor-icons/react';
import { Comment as CommentType, User } from '@/lib/types';
import { DeviceType } from '@/hooks/use-device';
import { useHapticFeedback } from '@/hooks/use-haptic';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface CommentItemProps {
  comment: CommentType;
  user: User;
  isAuthor: boolean;
  onLike: (commentId: string) => void;
  onReply: (commentId: string, username: string) => void;
  onDelete?: (commentId: string) => void;
  deviceType: DeviceType;
}

export function CommentItem({ 
  comment, 
  user, 
  isAuthor, 
  onLike, 
  onReply, 
  onDelete,
  deviceType 
}: CommentItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const { triggerHaptic } = useHapticFeedback();

  // Handle double-tap to like on mobile
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTap < DOUBLE_TAP_DELAY && !comment.isLiked) {
      onLike(comment.id);
      triggerHaptic('light');
    }
    setLastTap(now);
  };

  const avatarSize = deviceType === 'tablet' ? 'w-8 h-8' : 'w-7 h-7';
  const iconSize = deviceType === 'tablet' ? 16 : 14;

  return (
    <div className="flex gap-3 group">
      <Avatar className={avatarSize}>
        <AvatarImage src={user.avatar} alt={user.username} />
        <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div 
          className="bg-muted rounded-2xl px-3 py-2 relative touch-feedback"
          onTouchEnd={handleDoubleTap}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "font-semibold",
              deviceType === 'tablet' ? "text-sm" : "text-xs"
            )}>
              {user.username}
            </span>
            {isAuthor && (
              <span className="text-xs text-primary font-medium">
                Author
              </span>
            )}
            
            {/* Comment Menu */}
            <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "ml-auto h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
                    "touch-target"
                  )}
                >
                  <DotsThree size={iconSize} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={() => onReply(comment.id, user.username)}>
                  <ArrowBendUpLeft size={14} className="mr-2" />
                  Reply
                </DropdownMenuItem>
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(comment.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <p className={cn(
            "text-foreground selectable-text leading-relaxed",
            deviceType === 'tablet' ? "text-sm" : "text-xs"
          )}>
            {comment.text}
          </p>
          
          {/* Like indicator on comment bubble */}
          {comment.isLiked && (
            <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1">
              <Heart size={10} weight="fill" className="text-white" />
            </div>
          )}
        </div>
        
        {/* Comment Actions */}
        <div className="flex items-center gap-4 mt-2 px-3">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
          </span>
          
          <button
            onClick={() => onLike(comment.id)}
            className={cn(
              "flex items-center gap-1 text-xs transition-all duration-200 touch-target",
              "hover:scale-105 active:scale-95",
              comment.isLiked 
                ? "text-red-500 font-medium" 
                : "text-muted-foreground hover:text-red-500"
            )}
          >
            <Heart 
              size={12} 
              weight={comment.isLiked ? "fill" : "regular"}
              className="transition-all duration-200"
            />
            {comment.likes > 0 && (
              <span className="transition-all duration-200">
                {comment.likes}
              </span>
            )}
          </button>
          
          <button
            onClick={() => onReply(comment.id, user.username)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors touch-target font-medium"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}