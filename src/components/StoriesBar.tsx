import { useState } from 'react';
import { Story as StoryType, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface StoryProps {
  story: StoryType;
  user: User;
  onStoryClick: (storyId: string) => void;
}

export function Story({ story, user, onStoryClick }: StoryProps) {
  return (
    <button
      onClick={() => onStoryClick(story.id)}
      className="flex flex-col items-center gap-1 min-w-0"
    >
      <div className={cn(
        "p-0.5 rounded-full",
        story.isViewed ? "story-ring-viewed" : "story-ring"
      )}>
        <Avatar className="w-14 h-14 border-2 border-background">
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      <span className="text-xs text-center truncate w-16">{user.username}</span>
    </button>
  );
}

interface StoriesBarProps {
  stories: StoryType[];
  users: User[];
  onStoryClick: (storyId: string) => void;
  currentUser: User;
  onAddStory: () => void;
}

export function StoriesBar({ stories, users, onStoryClick, currentUser, onAddStory }: StoriesBarProps) {
  const storyUsers = stories.map(story => {
    const user = users.find(u => u.id === story.userId);
    return { story, user };
  }).filter(item => item.user);

  return (
    <div className="flex gap-4 px-4 py-3 overflow-x-auto scrollbar-hide border-b border-border">
      <button
        onClick={onAddStory}
        className="flex flex-col items-center gap-1 min-w-0"
      >
        <div className="relative">
          <Avatar className="w-14 h-14 border border-border">
            <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
            <AvatarFallback>{currentUser.username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full border-2 border-background flex items-center justify-center">
            <span className="text-white text-xs font-bold">+</span>
          </div>
        </div>
        <span className="text-xs text-center truncate w-16">Your Story</span>
      </button>

      {storyUsers.map(({ story, user }) => (
        <Story
          key={story.id}
          story={story}
          user={user!}
          onStoryClick={onStoryClick}
        />
      ))}
    </div>
  );
}