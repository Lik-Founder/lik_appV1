import { useState } from 'react';
import { Story as StoryType, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DeviceType } from '@/hooks/use-device';
import { cn } from '@/lib/utils';

interface StoryProps {
  story: StoryType;
  user: User;
  onStoryClick: (storyId: string) => void;
  deviceType: DeviceType;
}

export function Story({ story, user, onStoryClick, deviceType }: StoryProps) {
  const avatarSize = deviceType === 'tablet' ? 'w-16 h-16' : 'w-14 h-14';
  const textWidth = deviceType === 'tablet' ? 'w-20' : 'w-16';
  
  return (
    <button
      onClick={() => onStoryClick(story.id)}
      className="flex flex-col items-center gap-1 min-w-0 touch-target active:scale-95 transition-transform duration-150"
    >
      <div className={cn(
        "p-0.5 rounded-full transition-transform duration-150 active:scale-95",
        story.isViewed ? "story-ring-viewed" : "story-ring"
      )}>
        <Avatar className={cn(avatarSize, "border-2 border-background")}>
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      <span className={cn(
        "text-xs text-center truncate selectable-text",
        textWidth,
        deviceType === 'tablet' && "text-sm"
      )}>
        {user.username}
      </span>
    </button>
  );
}

interface StoriesBarProps {
  stories: StoryType[];
  users: User[];
  onStoryClick: (storyId: string) => void;
  currentUser: User;
  onAddStory: () => void;
  deviceType: DeviceType;
}

export function StoriesBar({ stories, users, onStoryClick, currentUser, onAddStory, deviceType }: StoriesBarProps) {
  const storyUsers = stories.map(story => {
    const user = users.find(u => u.id === story.userId);
    return { story, user };
  }).filter(item => item.user);

  const avatarSize = deviceType === 'tablet' ? 'w-16 h-16' : 'w-14 h-14';
  const textWidth = deviceType === 'tablet' ? 'w-20' : 'w-16';
  const padding = deviceType === 'tablet' ? 'px-6 py-4' : 'px-4 py-3';
  const gap = deviceType === 'tablet' ? 'gap-6' : 'gap-4';

  return (
    <div className={cn(
      "flex overflow-x-auto scrollbar-hide border-b border-border bg-background",
      padding,
      gap
    )}>
      <button
        onClick={onAddStory}
        className="flex flex-col items-center gap-1 min-w-0 touch-target active:scale-95 transition-transform duration-150"
      >
        <div className="relative">
          <Avatar className={cn(avatarSize, "border border-border")}>
            <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
            <AvatarFallback>{currentUser.username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className={cn(
            "absolute -bottom-1 -right-1 bg-accent rounded-full border-2 border-background flex items-center justify-center",
            deviceType === 'tablet' ? "w-7 h-7" : "w-6 h-6"
          )}>
            <span className={cn(
              "text-white font-bold",
              deviceType === 'tablet' ? "text-sm" : "text-xs"
            )}>
              +
            </span>
          </div>
        </div>
        <span className={cn(
          "text-xs text-center truncate selectable-text",
          textWidth,
          deviceType === 'tablet' && "text-sm"
        )}>
          Your Story
        </span>
      </button>

      {storyUsers.map(({ story, user }) => (
        <Story
          key={story.id}
          story={story}
          user={user!}
          onStoryClick={onStoryClick}
          deviceType={deviceType}
        />
      ))}
    </div>
  );
}