import { useState, useEffect } from 'react';
import { Heart, ArrowBendUpLeft, DotsThree, CaretDown, CaretRight, ChatsCircle } from '@phosphor-icons/react';
import { Comment as CommentType, User } from '@/lib/types';
import { DeviceType } from '@/hooks/use-device';
import { useHapticFeedback } from '@/hooks/use-haptic';
import { useCommentSwipe } from '@/hooks/use-comment-swipe';
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
  onReply: (commentId: string, username: string, parentId?: string) => void;
  onDelete?: (commentId: string) => void;
  onUserClick?: (userId: string) => void;
  deviceType: DeviceType;
  depth?: number; // For threading depth
  maxDepth?: number; // Maximum nesting depth
  getUserById?: (userId: string) => User;
}

export function CommentItem({ 
  comment, 
  user, 
  isAuthor, 
  onLike, 
  onReply, 
  onDelete,
  onUserClick,
  deviceType,
  depth = 0,
  maxDepth = 3,
  getUserById
}: CommentItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const [showReplies, setShowReplies] = useState(depth === 0); // Auto-expand top-level threads
  const [isCollapsing, setIsCollapsing] = useState(false);
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

  const handleReplyClick = () => {
    onReply(comment.id, user.username, comment.parentId || comment.id);
  };

  // Swipe functionality for mobile interactions
  const {
    swipeDirection,
    isSwiping,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    getSwipeStyle
  } = useCommentSwipe({
    threshold: 60,
    onSwipeLeft: () => {
      triggerHaptic('light');
      handleReplyClick();
    },
    onSwipeRight: () => {
      onLike(comment.id);
      triggerHaptic('light');
    }
  });

  const toggleReplies = () => {
    if (showReplies) {
      setIsCollapsing(true);
      setTimeout(() => {
        setShowReplies(false);
        setIsCollapsing(false);
      }, 200); // Match CSS animation duration
    } else {
      setShowReplies(true);
    }
    triggerHaptic('light');
  };

  // Count total replies recursively
  const countTotalReplies = (comment: CommentType): number => {
    if (!comment.replies) return comment.replyCount || 0;
    
    let total = comment.replies.length;
    comment.replies.forEach(reply => {
      total += countTotalReplies(reply);
    });
    return total;
  };

  const avatarSize = deviceType === 'tablet' ? 'w-8 h-8' : 'w-7 h-7';
  const iconSize = deviceType === 'tablet' ? 16 : 14;
  const isNested = depth > 0;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const totalReplies = countTotalReplies(comment);
  const shouldShowCollapseButton = hasReplies && (totalReplies > 1 || depth === 0);

  return (
    <div className={cn(
      "flex gap-3 group relative",
      isNested && "ml-6 mt-3"
    )}>
      {/* Thread connector line for nested comments */}
      {isNested && (
        <>
          <div className="absolute left-6 top-0 w-0.5 h-full bg-border opacity-30 comment-thread-line" />
          <div className="absolute left-6 top-4 w-3 h-0.5 bg-border opacity-30 comment-thread-connector" />
        </>
      )}
      
      {/* Collapsible indicator for threads with multiple replies */}
      {shouldShowCollapseButton && depth === 0 && (
        <div className="absolute -left-4 top-2 z-10">
          <button
            onClick={toggleReplies}
            className={cn(
              "w-6 h-6 rounded-full bg-background border border-border",
              "flex items-center justify-center transition-all duration-200",
              "hover:bg-muted hover:scale-105 active:scale-95 touch-target",
              "shadow-sm"
            )}
          >
            {showReplies ? (
              <CaretDown size={12} className="text-muted-foreground" />
            ) : (
              <CaretRight size={12} className="text-muted-foreground" />
            )}
          </button>
        </div>
      )}
      
      <button 
        onClick={() => onUserClick?.(user.id)}
        className="touch-target active:scale-95 transition-transform duration-150"
      >
        <Avatar className={cn(
          avatarSize,
          isNested && "w-6 h-6"
        )}>
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </button>
      
      <div className="flex-1 min-w-0">
        <div 
          className={cn(
            "bg-muted rounded-2xl px-3 py-2 relative touch-feedback comment-bubble",
            isSwiping && "transition-none"
          )}
          style={getSwipeStyle()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={(e) => {
            handleTouchEnd();
            handleDoubleTap();
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <button 
              onClick={() => onUserClick?.(user.id)}
              className="touch-target active:opacity-70 transition-opacity duration-150"
            >
              <span className={cn(
                "font-semibold hover:text-primary transition-colors",
                deviceType === 'tablet' ? "text-sm" : "text-xs",
                isNested && "text-xs"
              )}>
                {user.username}
              </span>
            </button>
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
                <DropdownMenuItem onClick={handleReplyClick}>
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
            deviceType === 'tablet' ? "text-sm" : "text-xs",
            isNested && "text-xs"
          )}>
            {comment.text}
          </p>
          
          {/* Like indicator on comment bubble */}
          {comment.isLiked && (
            <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1">
              <Heart size={10} weight="fill" className="text-white" />
            </div>
          )}
          
          {/* Swipe indicators for mobile */}
          {swipeDirection && (
            <>
              <div className={cn(
                "absolute top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none",
                "comment-swipe-indicator",
                swipeDirection === 'right' ? "left-2 text-red-500 active" : "left-2 opacity-0"
              )}>
                <Heart size={16} weight="fill" />
              </div>
              <div className={cn(
                "absolute top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none",
                "comment-swipe-indicator", 
                swipeDirection === 'left' ? "right-2 text-blue-500 active" : "right-2 opacity-0"
              )}>
                <ArrowBendUpLeft size={16} />
              </div>
            </>
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
          
          {/* Only show reply button if we haven't reached max depth */}
          {depth < maxDepth && (
            <button
              onClick={handleReplyClick}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors touch-target font-medium"
            >
              Reply
            </button>
          )}

          {/* Show/Hide replies button with enhanced styling */}
          {shouldShowCollapseButton && depth > 0 && (
            <button
              onClick={toggleReplies}
              className={cn(
                "flex items-center gap-1 text-xs transition-all duration-200 touch-target font-medium",
                "px-2 py-1 rounded-full hover:bg-muted",
                showReplies 
                  ? "text-primary hover:text-primary/80" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {showReplies ? (
                <>
                  <CaretDown size={12} />
                  <span>Hide {totalReplies} {totalReplies === 1 ? 'reply' : 'replies'}</span>
                </>
              ) : (
                <>
                  <CaretRight size={12} />
                  <ChatsCircle size={12} />
                  <span>Show {totalReplies} {totalReplies === 1 ? 'reply' : 'replies'}</span>
                </>
              )}
            </button>
          )}
          
          {/* Compact thread summary for collapsed top-level threads */}
          {!showReplies && depth === 0 && hasReplies && (
            <button
              onClick={toggleReplies}
              className={cn(
                "flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground",
                "transition-colors touch-target font-medium px-2 py-1 rounded-full hover:bg-muted"
              )}
            >
              <ChatsCircle size={12} />
              <span>{totalReplies} {totalReplies === 1 ? 'reply' : 'replies'}</span>
              <CaretRight size={10} />
            </button>
          )}
        </div>

        {/* Nested Replies with enhanced animations */}
        {hasReplies && showReplies && comment.replies && getUserById && (
          <div className={cn(
            "mt-3 space-y-3 relative overflow-hidden",
            isCollapsing ? "comment-replies-exit" : "comment-replies-enter"
          )}>
            {/* Thread depth indicator */}
            <div className="comment-depth-indicator" />
            
            {comment.replies.map((reply, index) => {
              const replyUser = getUserById(reply.userId);
              return (
                <div
                  key={reply.id}
                  className="comment-thread"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CommentItem
                    comment={reply}
                    user={replyUser}
                    isAuthor={replyUser.id === user.id}
                    onLike={onLike}
                    onReply={onReply}
                    onDelete={onDelete}
                    onUserClick={onUserClick}
                    deviceType={deviceType}
                    depth={depth + 1}
                    maxDepth={maxDepth}
                    getUserById={getUserById}
                  />
                </div>
              );
            })}
          </div>
        )}
        
        {/* Load more indicator for collapsed threads */}
        {!showReplies && hasReplies && totalReplies > 3 && depth === 0 && (
          <div className="mt-2 ml-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex -space-x-1">
                {comment.replies?.slice(0, 3).map((reply, index) => {
                  const replyUser = getUserById(reply.userId);
                  return (
                    <button 
                      key={reply.id} 
                      onClick={() => onUserClick?.(replyUser.id)}
                      className="touch-target active:scale-90 transition-transform duration-150"
                    >
                      <Avatar className="w-4 h-4 border border-background">
                        <AvatarImage src={replyUser.avatar} alt={replyUser.username} />
                        <AvatarFallback className="text-xs">{replyUser.username[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </button>
                  );
                })}
              </div>
              <span>and {totalReplies - 3} others replied</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}