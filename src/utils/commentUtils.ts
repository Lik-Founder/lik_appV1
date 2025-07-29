import { Comment } from '@/lib/types';

/**
 * Utility function to organize flat comments into a threaded structure
 */
export function organizeComments(flatComments: Comment[]): Comment[] {
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  // First pass: create a map of all comments
  flatComments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: organize into tree structure
  flatComments.forEach(comment => {
    const commentWithReplies = commentMap.get(comment.id)!;
    
    if (comment.parentId) {
      const parentComment = commentMap.get(comment.parentId);
      if (parentComment) {
        parentComment.replies = parentComment.replies || [];
        parentComment.replies.push(commentWithReplies);
        parentComment.replyCount = (parentComment.replyCount || 0) + 1;
      }
    } else {
      rootComments.push(commentWithReplies);
    }
  });

  return rootComments;
}

/**
 * Get the total count of comments including all nested replies
 */
export function getTotalCommentCount(comments: Comment[]): number {
  return comments.reduce((total, comment) => {
    return total + 1 + (comment.replies ? getTotalCommentCount(comment.replies) : 0);
  }, 0);
}

/**
 * Find a comment by ID in a threaded structure
 */
export function findCommentById(comments: Comment[], commentId: string): Comment | null {
  for (const comment of comments) {
    if (comment.id === commentId) {
      return comment;
    }
    
    if (comment.replies) {
      const found = findCommentById(comment.replies, commentId);
      if (found) return found;
    }
  }
  
  return null;
}

/**
 * Get the depth of a comment thread
 */
export function getMaxDepth(comments: Comment[]): number {
  return comments.reduce((maxDepth, comment) => {
    const currentDepth = 1 + (comment.replies ? getMaxDepth(comment.replies) : 0);
    return Math.max(maxDepth, currentDepth);
  }, 0);
}

/**
 * Get the total count of replies for a specific comment (recursive)
 */
export function getReplyCount(comment: Comment): number {
  if (!comment.replies || comment.replies.length === 0) {
    return comment.replyCount || 0;
  }
  
  let count = comment.replies.length;
  comment.replies.forEach(reply => {
    count += getReplyCount(reply);
  });
  
  return count;
}

/**
 * Check if a comment thread should be collapsible based on reply count and depth
 */
export function shouldBeCollapsible(comment: Comment, depth: number = 0): boolean {
  const replyCount = getReplyCount(comment);
  
  // Top-level comments with 2+ replies should be collapsible
  if (depth === 0 && replyCount >= 2) return true;
  
  // Nested comments with 1+ replies should be collapsible
  if (depth > 0 && replyCount >= 1) return true;
  
  return false;
}

/**
 * Get thread preview data for collapsed threads
 */
export function getThreadPreview(comment: Comment, maxPreviewUsers: number = 3) {
  if (!comment.replies) return null;
  
  const totalReplies = getReplyCount(comment);
  const previewReplies = comment.replies.slice(0, maxPreviewUsers);
  const remainingCount = Math.max(0, totalReplies - maxPreviewUsers);
  
  return {
    totalReplies,
    previewReplies,
    remainingCount,
    hasMore: remainingCount > 0
  };
}

/**
 * Sort comments by engagement (likes + replies) for better mobile UX
 */
export function sortCommentsByEngagement(comments: Comment[]): Comment[] {
  return [...comments].sort((a, b) => {
    const aEngagement = (a.likes || 0) + getReplyCount(a);
    const bEngagement = (b.likes || 0) + getReplyCount(b);
    
    // Sort by engagement, then by timestamp (newest first)
    if (aEngagement !== bEngagement) {
      return bEngagement - aEngagement;
    }
    
    return b.timestamp - a.timestamp;
  });
}

/**
 * Sort comments by most liked (highest likes first)
 */
export function sortCommentsByMostLiked(comments: Comment[]): Comment[] {
  return [...comments].sort((a, b) => {
    const aLikes = a.likes || 0;
    const bLikes = b.likes || 0;
    
    // Sort by likes first, then by timestamp (newest first) for ties
    if (aLikes !== bLikes) {
      return bLikes - aLikes;
    }
    
    return b.timestamp - a.timestamp;
  });
}

/**
 * Sort comments by newest first (most recent timestamp)
 */
export function sortCommentsByNewest(comments: Comment[]): Comment[] {
  return [...comments].sort((a, b) => {
    return b.timestamp - a.timestamp;
  });
}

/**
 * Sort comments by oldest first (earliest timestamp)
 */
export function sortCommentsByOldest(comments: Comment[]): Comment[] {
  return [...comments].sort((a, b) => {
    return a.timestamp - b.timestamp;
  });
}

/**
 * Sort comments based on the specified filter type
 */
export function sortCommentsByFilter(comments: Comment[], filter: 'engagement' | 'mostLiked' | 'newest' | 'oldest'): Comment[] {
  const sortFunction = (commentsToSort: Comment[]) => {
    switch (filter) {
      case 'mostLiked':
        return sortCommentsByMostLiked(commentsToSort);
      case 'newest':
        return sortCommentsByNewest(commentsToSort);
      case 'oldest':
        return sortCommentsByOldest(commentsToSort);
      case 'engagement':
      default:
        return sortCommentsByEngagement(commentsToSort);
    }
  };

  // Sort the main comments
  const sortedComments = sortFunction(comments);

  // Recursively sort replies within each comment thread
  return sortedComments.map(comment => ({
    ...comment,
    replies: comment.replies ? sortCommentsByFilter(comment.replies, filter) : undefined
  }));
}

/**
 * Flatten threaded comments back to a flat array
 */
export function flattenComments(threadedComments: Comment[]): Comment[] {
  const flatComments: Comment[] = [];
  
  function traverse(comments: Comment[]) {
    comments.forEach(comment => {
      const { replies, ...commentWithoutReplies } = comment;
      flatComments.push(commentWithoutReplies as Comment);
      
      if (replies) {
        traverse(replies);
      }
    });
  }
  
  traverse(threadedComments);
  return flatComments;
}