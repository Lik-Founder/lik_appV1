import { useState, useRef, useEffect } from 'react';
import { XMarkIcon, HeartIcon, ArrowUturnLeftIcon, PaperAirplaneIcon, ChatBubbleOvalLeftIcon, BarsArrowUpIcon, HandThumbUpIcon, ClockIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { organizeComments, getTotalCommentCount, sortCommentsByFilter } from '@/utils/commentUtils';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postAuthor: User;
  deviceType: DeviceType;
  onUserClick?: (userId: string) => void;
}

export function CommentModal({ isOpen, onClose, postId, postAuthor, deviceType, onUserClick }: CommentModalProps) {
  // Sample threaded comments for demonstration
  const sampleComments: Comment[] = [
    {
      id: '1',
      userId: 'user1',
      username: 'foodie_sarah',
      text: 'This place looks amazing! Have you tried their pasta special?',
      timestamp: Date.now() - 3600000, // 1 hour ago
      likes: 12,
      isLiked: false
    },
    {
      id: '2',
      userId: 'user2',
      username: 'chef_marco',
      text: 'Yes! Their truffle pasta is incredible. The chef there is a master.',
      timestamp: Date.now() - 3300000, // 55 minutes ago
      likes: 8,
      isLiked: true,
      parentId: '1'
    },
    {
      id: '3',
      userId: 'user3',
      username: 'pasta_lover',
      text: '@chef_marco Do they make their own pasta? The texture looks perfect!',
      timestamp: Date.now() - 3000000, // 50 minutes ago
      likes: 5,
      isLiked: false,
      parentId: '1'
    },
    {
      id: '4',
      userId: 'user2',
      username: 'chef_marco',
      text: '@pasta_lover Absolutely! Hand-rolled daily. They use semolina from Italy.',
      timestamp: Date.now() - 2700000, // 45 minutes ago
      likes: 3,
      isLiked: false,
      parentId: '3'
    },
    {
      id: '5',
      userId: 'user4',
      username: 'local_guide',
      text: 'The ambiance here is perfect for date nights! 🍝✨',
      timestamp: Date.now() - 1800000, // 30 minutes ago
      likes: 15,
      isLiked: true
    },
    {
      id: '6',
      userId: 'user5',
      username: 'wine_enthusiast',
      text: '@local_guide What wine would you recommend with their seafood dishes?',
      timestamp: Date.now() - 1500000, // 25 minutes ago
      likes: 2,
      isLiked: false,
      parentId: '5'
    }
  ];

  const [comments, setComments] = useKV<Comment[]>(`comments-${postId}`, sampleComments);
  const [users] = useKV<User[]>('users', []);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyingToParent, setReplyingToParent] = useState<string | null>(null);
  const [modalOffset, setModalOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [sortFilter, setSortFilter] = useState<'engagement' | 'mostLiked' | 'newest' | 'oldest'>('engagement');
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

  // Mock additional users for comments
  const mockCommentUsers: User[] = [
    {
      id: 'user1',
      username: 'foodie_sarah',
      displayName: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Food explorer',
      followerCount: 1200,
      followingCount: 340,
      postCount: 89,
      isFollowing: false
    },
    {
      id: 'user2',
      username: 'chef_marco',
      displayName: 'Marco Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Professional chef',
      followerCount: 5600,
      followingCount: 120,
      postCount: 245,
      isFollowing: true
    },
    {
      id: 'user3',
      username: 'pasta_lover',
      displayName: 'Alex Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Pasta enthusiast',
      followerCount: 850,
      followingCount: 200,
      postCount: 156,
      isFollowing: false
    },
    {
      id: 'user4',
      username: 'local_guide',
      displayName: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      bio: 'Local food guide',
      followerCount: 2300,
      followingCount: 180,
      postCount: 312,
      isFollowing: true
    },
    {
      id: 'user5',
      username: 'wine_enthusiast',
      displayName: 'James Parker',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      bio: 'Wine connoisseur',
      followerCount: 1800,
      followingCount: 90,
      postCount: 198,
      isFollowing: false
    }
  ];

  // Transform flat comments array into threaded structure and sort by selected filter
  const threadedComments = sortCommentsByFilter(organizeComments(comments), sortFilter);
  
  // Count total comments including replies
  const totalCommentCount = getTotalCommentCount(threadedComments);

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
    const allUsers = [...users, ...mockCommentUsers, currentUser];
    return allUsers.find(u => u.id === userId) || currentUser;
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
      isLiked: false,
      parentId: replyingToParent || undefined
    };

    setComments(prevComments => [...prevComments, comment]);
    setNewComment('');
    setReplyingTo(null);
    setReplyingToParent(null);
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
    // Remove the comment and all its replies
    const removeCommentAndReplies = (comments: Comment[], targetId: string): Comment[] => {
      return comments.filter(comment => {
        if (comment.id === targetId) return false;
        if (comment.parentId === targetId) return false;
        return true;
      });
    };

    setComments(prevComments => removeCommentAndReplies(prevComments, commentId));
    triggerHaptic('medium');
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewComment(prev => prev + emoji);
    inputRef.current?.focus();
  };

  const handleReply = (commentId: string, username: string, parentId?: string) => {
    setReplyingTo(commentId);
    setReplyingToParent(parentId || commentId);
    setNewComment(`@${username} `);
    inputRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyingToParent(null);
    setNewComment('');
    inputRef.current?.focus();
  };

  const getReplyingToUsername = () => {
    if (!replyingTo) return '';
    const comment = comments.find(c => c.id === replyingTo);
    return comment ? getUserById(comment.userId).username : '';
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
        <div className="px-4 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className={cn(
              "font-semibold",
              deviceType === 'tablet' ? "text-lg" : "text-base"
            )}>
              Comments ({totalCommentCount})
            </h2>
            
            <div className="flex items-center gap-2">
              {/* Sort Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="touch-target flex items-center gap-1"
                  >
                    <ArrowsUpDownIcon className={iconSize === 16 ? 'h-4 w-4' : 'h-5 w-5'} />
                    {deviceType === 'tablet' && (
                      <span className="text-xs">
                        {sortFilter === 'engagement' && 'Top'}
                        {sortFilter === 'mostLiked' && 'Liked'}
                        {sortFilter === 'newest' && 'New'}
                        {sortFilter === 'oldest' && 'Old'}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 comment-sort-dropdown">
                  <DropdownMenuItem
                    onClick={() => {
                      setSortFilter('engagement');
                      triggerHaptic('light');
                    }}
                    className={cn(
                      "flex items-center gap-2",
                      sortFilter === 'engagement' && "bg-muted"
                    )}
                  >
                    <ArrowsUpDownIcon className="h-4 w-4" />
                    <span>Top Comments</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortFilter('mostLiked');
                      triggerHaptic('light');
                    }}
                    className={cn(
                      "flex items-center gap-2",
                      sortFilter === 'mostLiked' && "bg-muted"
                    )}
                  >
                    <ThumbsUp size={16} />
                    <span>Most Liked</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortFilter('newest');
                      triggerHaptic('light');
                    }}
                    className={cn(
                      "flex items-center gap-2",
                      sortFilter === 'newest' && "bg-muted"
                    )}
                  >
                    <Clock size={16} />
                    <span>Newest First</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortFilter('oldest');
                      triggerHaptic('light');
                    }}
                    className={cn(
                      "flex items-center gap-2",
                      sortFilter === 'oldest' && "bg-muted"
                    )}
                  >
                    <Clock size={16} className="rotate-180" />
                    <span>Oldest First</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="touch-target"
              >
                <X size={iconSize} />
              </Button>
            </div>
          </div>
          
          {/* Filter indicator */}
          {sortFilter !== 'engagement' && (
            <div className="mt-2 flex items-center gap-1">
              <div className="h-1 w-1 bg-primary rounded-full" />
              <span className="text-xs text-muted-foreground">
                Sorted by {' '}
                {sortFilter === 'mostLiked' && 'most liked'}
                {sortFilter === 'newest' && 'newest first'}
                {sortFilter === 'oldest' && 'oldest first'}
              </span>
            </div>
          )}
        </div>

        {/* Comments List */}
        <ScrollArea className="flex-1 px-4">
          <div className={cn(
            "space-y-6 py-4 transition-all duration-300", // Added transition for smooth filter changes
            deviceType === 'tablet' && "space-y-8"
          )}>
            {threadedComments.length === 0 ? (
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
              threadedComments.map((comment, index) => {
                const user = getUserById(comment.userId);
                return (
                  <div 
                    key={comment.id} 
                    className={cn(
                      "comment-item relative transition-all duration-300", // Added transition for individual comments
                      // Add visual separation between top-level comments
                      index > 0 && "border-t border-border/30 pt-6"
                    )}
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      transform: 'translateY(0)', // Ensure smooth positioning
                      opacity: 1
                    }}
                  >
                    <CommentItem
                      comment={comment}
                      user={user}
                      isAuthor={user.id === postAuthor.id}
                      onLike={handleLikeComment}
                      onReply={handleReply}
                      onDelete={user.id === currentUser.id ? handleDeleteComment : undefined}
                      onUserClick={onUserClick}
                      deviceType={deviceType}
                      depth={0}
                      maxDepth={3}
                      getUserById={getUserById}
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
                Replying to @{getReplyingToUsername()}
              </span>
              <button
                onClick={cancelReply}
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
                  <PaperAirplaneIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}