import { useState, useRef, useEffect } from 'react';
import { X, Heart, ArrowBendUpLeft, PaperPlaneTilt, MessageCircle } from '@phosphor-icons/react';
import { Comment, User } from '@/lib/types';
import { useKV } from '@github/spark/hooks';
import { DeviceType } from '@/hooks/use-device';
import { useHapticFeedback } from '@/hooks/use-haptic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CommentItem } from '@/components/CommentItem';
import { EmojiPicker } from '@/components/EmojiPicker';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postAuthor: User;
  deviceType: DeviceType;
}

export function CommentModal({ isOpen, onClose, postId, postAuthor, deviceType }: CommentModalProps) {
  const [comments, setComments] = useKV<Comment[]>(`comments-${postId}`, []);
  const [users] = useKV<User[]>('users', []);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [modalOffset, setModalOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const { triggerHaptic } = useHapticFeedback();

  // Mock current user
  const currentUser: User = {
    id: 'current-user',
    username: 'you',
    displayName: 'You',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    bio: '',
    followerCount: 0,
    followingCount: 0,
    postCount: 0,
    isFollowing: false
  };

  // Handle modal drag to dismiss
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (!modalRef.current?.contains(e.target as Node)) return;
      startY.current = e.touches[0].clientY;
      setIsDragging(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;
      
      // Only allow downward swipes
      if (diff > 0) {
        setModalOffset(diff);
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      setIsDragging(false);
      
      // If dragged down more than 100px, close modal
      if (modalOffset > 100) {
        onClose();
        triggerHaptic('medium');
      }
      setModalOffset(0);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, modalOffset, onClose, triggerHaptic]);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleAddComment();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, newComment]);

  const getUserById = (userId: string) => {
    return users.find(u => u.id === userId) || currentUser;
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      text: newComment.trim(),
      timestamp: Date.now(),
      likes: 0,
      isLiked: false
    };

    setComments(prevComments => [...prevComments, comment]);
    setNewComment('');
    setReplyingTo(null);
    triggerHaptic('light');
    
    // Show success feedback
    if (typeof window !== 'undefined' && 'toast' in window) {
      // Use toast if available
      const toast = (window as any).toast;
      toast?.success?.('Comment added!');
    }
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === commentId 
          ? { 
              ...comment, 
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
            }
          : comment
      )
    );
    triggerHaptic('light');
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prevComments => 
      prevComments.filter(comment => comment.id !== commentId)
    );
    triggerHaptic('medium');
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewComment(prev => prev + emoji);
    inputRef.current?.focus();
  };

  const handleReply = (commentId: string, username: string) => {
    setReplyingTo(commentId);
    setNewComment(`@${username} `);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  const iconSize = deviceType === 'tablet' ? 20 : 18;
  const avatarSize = deviceType === 'tablet' ? 'w-8 h-8' : 'w-7 h-7';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm comment-modal">
      {/* Modal */}
      <div 
        ref={modalRef}
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl transition-transform duration-300 ease-out comment-modal-content",
          "max-h-[85vh] overflow-hidden shadow-2xl",
          deviceType === 'tablet' && "max-w-md mx-auto",
          isOpen && "open"
        )}
        style={{
          transform: `translateY(${modalOffset}px)`,
          transitionDuration: isDragging ? '0ms' : '300ms'
        }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-4 border-b border-border">
          <h2 className={cn(
            "font-semibold",
            deviceType === 'tablet' ? "text-lg" : "text-base"
          )}>
            Comments ({comments.length})
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="touch-target"
          >
            <X size={iconSize} />
          </Button>
        </div>

        {/* Comments List */}
        <ScrollArea className="flex-1 px-4">
          <div className={cn(
            "space-y-4 py-4",
            deviceType === 'tablet' && "space-y-6"
          )}>
            {comments.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-sm mb-2">
                  No comments yet
                </p>
                <p className="text-muted-foreground text-xs">
                  Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              comments.map((comment, index) => {
                const user = getUserById(comment.userId);
                return (
                  <div 
                    key={comment.id} 
                    className="comment-item"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CommentItem
                      comment={comment}
                      user={user}
                      isAuthor={user.id === postAuthor.id}
                      onLike={handleLikeComment}
                      onReply={handleReply}
                      onDelete={user.id === currentUser.id ? handleDeleteComment : undefined}
                      deviceType={deviceType}
                    />
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* Comment Input */}
        <div className="border-t border-border p-4 bg-background">
          {replyingTo && (
            <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-muted rounded-lg">
              <ArrowBendUpLeft size={14} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Replying to comment
              </span>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setNewComment('');
                }}
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
              <AvatarFallback>{currentUser.username[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className={cn(
                  "rounded-full border-muted-foreground/20 bg-muted pr-20",
                  deviceType === 'tablet' ? "text-sm" : "text-xs"
                )}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
              />
              
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-6 w-6 p-0 transition-colors",
                    newComment.trim() 
                      ? "text-primary hover:text-primary/80" 
                      : "text-muted-foreground"
                  )}
                >
                  <PaperPlaneTilt size={16} weight="fill" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}