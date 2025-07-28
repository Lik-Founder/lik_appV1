import { useState } from 'react';
import { Heart, MessageCircle, DotsThree, Bookmark } from '@phosphor-icons/react';
import { Post as PostType, User } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface PostProps {
  post: PostType;
  user: User;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onUserClick: (userId: string) => void;
}

export function Post({ post, user, onLike, onComment, onUserClick }: PostProps) {
  const [showAllComments, setShowAllComments] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card className="border-0 border-b border-border last:border-b-0 rounded-none">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => onUserClick(user.id)}>
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </button>
          <div className="flex-1">
            <button 
              onClick={() => onUserClick(user.id)}
              className="font-semibold text-sm hover:text-muted-foreground transition-colors"
            >
              {user.username}
            </button>
            {post.location && (
              <p className="text-xs text-muted-foreground">{post.location}</p>
            )}
          </div>
          <Button variant="ghost" size="sm" className="p-2">
            <DotsThree size={16} />
          </Button>
        </div>

        <div className="relative mb-3 bg-muted rounded-lg overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse aspect-square" />
          )}
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="w-full aspect-square object-cover"
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        <div className="flex items-center gap-4 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(post.id)}
            className="p-0 hover:bg-transparent"
          >
            <Heart 
              size={24} 
              weight={post.isLiked ? "fill" : "regular"}
              className={post.isLiked ? "text-red-500" : "text-foreground"}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onComment(post.id)}
            className="p-0 hover:bg-transparent"
          >
            <MessageCircle size={24} />
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
            <Bookmark size={24} />
          </Button>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-sm">{post.likes.toLocaleString()} likes</p>
          
          {post.caption && (
            <p className="text-sm">
              <span className="font-semibold mr-2">{user.username}</span>
              {post.caption}
            </p>
          )}

          {post.comments.length > 0 && (
            <div className="space-y-1">
              {!showAllComments && post.comments.length > 2 && (
                <button
                  onClick={() => setShowAllComments(true)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  View all {post.comments.length} comments
                </button>
              )}
              
              {(showAllComments ? post.comments : post.comments.slice(-2)).map((comment) => (
                <div key={comment.id} className="text-sm">
                  <span className="font-semibold mr-2">{comment.username}</span>
                  {comment.text}
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {formatDistanceToNow(new Date(post.timestamp))} ago
          </p>
        </div>
      </div>
    </Card>
  );
}