import { useState, useRef } from 'react';
import { Heart, MessageCircle, DotsThree, Bookmark, PaperPlaneTilt } from '@phosphor-icons/react';
import { Post as PostType, User, Comment } from '@/lib/types';
import { DeviceType, Orientation } from '@/hooks/use-device';
import { useSwipe } from '@/hooks/use-swipe';
import { useHapticFeedback } from '@/hooks/use-haptic';
import { useKV } from '@github/spark/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConsistentAvatar } from '@/components/ui/consistent-avatar';
import { CommentModal } from '@/components/CommentModal';
import { QuickCommentsView } from '@/components/QuickCommentsView';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface PostProps {
  post: PostType;
  user: User;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onUserClick: (userId: string) => void;
  deviceType: DeviceType;
  orientation: Orientation;
}

export function Post({ post, user, onLike, onComment, onUserClick, deviceType, orientation }: PostProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comments] = useKV<Comment[]>(`comments-${post.id}`, []);
  const imageRef = useRef<HTMLImageElement>(null);
  const { triggerHaptic } = useHapticFeedback();

  // Handle swipe gestures on post image
  const swipeRef = useSwipe({
    onSwipeLeft: () => {
      // Quick action: bookmark post
      triggerHaptic('light');
      setSwipeOffset(-50);
      setTimeout(() => setSwipeOffset(0), 200);
    },
    onSwipeRight: () => {
      // Quick action: like post
      if (!post.isLiked) {
        onLike(post.id);
        triggerHaptic('success');
        setShowHeartAnimation(true);
        setTimeout(() => setShowHeartAnimation(false), 800);
      } else {
        triggerHaptic('light');
      }
      setSwipeOffset(50);
      setTimeout(() => setSwipeOffset(0), 200);
    },
    onSwipeUp: () => {
      // Quick action: comment
      triggerHaptic('medium');
      setShowCommentModal(true);
    },
    onSwipeDown: () => {
      // Quick action: share
      triggerHaptic('light');
      // You could call a share function here
    },
    onSwiping: (data) => {
      // Provide visual feedback during swipe
      const maxOffset = 100;
      const offset = Math.max(-maxOffset, Math.min(maxOffset, data.deltaX * 0.3));
      setSwipeOffset(offset);
    },
    onSwipeEnd: () => {
      // Reset offset when swipe ends
      setTimeout(() => setSwipeOffset(0), 100);
    }
  }, {
    threshold: 80,
    preventDefaultTouchmoveEvent: false
  });

  // Handle double-tap to like on mobile
  const handleImageTap = (e: React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTap < DOUBLE_TAP_DELAY && !post.isLiked) {
      // Double tap detected - trigger like
      onLike(post.id);
      triggerHaptic('heavy');
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 800);
      
      // Create heart animation at touch point
      const rect = e.currentTarget.getBoundingClientRect();
      const touch = e.changedTouches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      // You could implement a more sophisticated animation here
    }
    setLastTap(now);
  };

  const iconSize = deviceType === 'tablet' ? 28 : 24;
  const padding = deviceType === 'tablet' ? 'p-6' : 'p-4';

  return (
    <Card className={cn(
      "border-0 border-b border-border last:border-b-0 rounded-none bg-background",
      deviceType === 'tablet' && "mx-2 mb-4 border border-border rounded-lg last:border-b"
    )}>
      <div className={padding}>
        {/* Post Header */}
        <div className={cn(
          "flex items-center gap-3 mb-3",
          deviceType === 'tablet' && "gap-4"
        )}>
          <button 
            onClick={() => onUserClick(user.id)}
            className="touch-target active:scale-95 transition-transform duration-150"
          >
            <ConsistentAvatar
              src={user.avatar}
              alt={user.username}
              fallback={user.username[0]?.toUpperCase()}
              size={deviceType === 'tablet' ? 'md' : 'sm'}
              variant="default"
            />
          </button>
          <div className="flex-1">
            <button 
              onClick={() => onUserClick(user.id)}
              className={cn(
                "font-semibold hover:text-muted-foreground transition-colors touch-target",
                deviceType === 'tablet' ? "text-base" : "text-sm"
              )}
            >
              {user.username}
            </button>
            {post.location && (
              <p className={cn(
                "text-muted-foreground",
                deviceType === 'tablet' ? "text-sm" : "text-xs"
              )}>
                {post.location}
              </p>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="touch-target active:scale-90 transition-transform duration-150"
          >
            <DotsThree size={iconSize} />
          </Button>
        </div>

        {/* Post Image */}
        <div 
          ref={swipeRef}
          className="relative mb-3 bg-muted rounded-lg overflow-hidden"
          style={{
            transform: `translateX(${swipeOffset}px)`,
            transition: swipeOffset === 0 ? 'transform 0.2s ease' : 'none'
          }}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse aspect-square" />
          )}
          
          {/* Swipe action indicators */}
          {swipeOffset > 20 && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-red-500 text-white rounded-full p-2">
              <Heart size={20} weight="fill" />
            </div>
          )}
          {swipeOffset < -20 && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-blue-500 text-white rounded-full p-2">
              <Bookmark size={20} weight="fill" />
            </div>
          )}
          
          {/* Heart animation overlay */}
          {showHeartAnimation && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <Heart 
                size={80} 
                weight="fill" 
                className="text-red-500 heart-animation"
              />
            </div>
          )}
          
          <img
            ref={imageRef}
            src={post.imageUrl}
            alt={post.caption}
            className="w-full aspect-square object-cover touch-target"
            onLoad={() => setImageLoaded(true)}
            onTouchEnd={handleImageTap}
          />
          
          {/* Swipe hint overlay */}
          {deviceType === 'phone' && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white/70 text-xs bg-black/30 px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
              ← Like | Bookmark →
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={cn(
          "flex items-center gap-4 mb-3",
          deviceType === 'tablet' && "gap-6"
        )}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(post.id)}
            className="p-0 hover:bg-transparent touch-target active:scale-90 transition-all duration-150"
          >
            <Heart 
              size={iconSize} 
              weight={post.isLiked ? "fill" : "regular"}
              className={post.isLiked ? "text-red-500" : "text-foreground"}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCommentModal(true)}
            className="p-0 hover:bg-transparent touch-target active:scale-90 transition-all duration-150"
          >
            <MessageCircle size={iconSize} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-0 hover:bg-transparent touch-target active:scale-90 transition-all duration-150"
          >
            <PaperPlaneTilt size={iconSize} />
          </Button>
          <div className="flex-1" />
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 hover:bg-transparent touch-target active:scale-90 transition-all duration-150"
          >
            <Bookmark size={iconSize} />
          </Button>
        </div>

        {/* Post Content */}
        <div className="space-y-2">
          <p className={cn(
            "font-semibold",
            deviceType === 'tablet' ? "text-base" : "text-sm"
          )}>
            {post.likes.toLocaleString()} likes
          </p>
          
          {post.caption && (
            <p className={cn(
              "selectable-text",
              deviceType === 'tablet' ? "text-base" : "text-sm"
            )}>
              <span className="font-semibold mr-2">{user.username}</span>
              {post.caption}
            </p>
          )}

          {comments.length > 0 && (
            <QuickCommentsView
              postId={post.id}
              onOpenModal={() => setShowCommentModal(true)}
              deviceType={deviceType}
            />
          )}

          <p className={cn(
            "text-muted-foreground uppercase tracking-wide",
            deviceType === 'tablet' ? "text-sm" : "text-xs"
          )}>
            {formatDistanceToNow(new Date(post.timestamp))} ago
          </p>
        </div>
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        postId={post.id}
        postAuthor={user}
        deviceType={deviceType}
        onUserClick={onUserClick}
      />
    </Card>
  );
}