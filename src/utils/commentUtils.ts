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