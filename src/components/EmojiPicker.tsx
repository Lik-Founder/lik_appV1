import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FaceSmileIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  children?: React.ReactNode;
}

const EMOJI_CATEGORIES = {
  'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪'],
  'Food': ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅'],
  'Activity': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️', '💯', '💢', '💥', '💫', '💦']
};

export function EmojiPicker({ onEmojiSelect, children }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Smileys');
  const [open, setOpen] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children || (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <FaceSmileIcon className="w-4 h-4" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" side="top">
        <div className="border-b border-border">
          <div className="flex overflow-x-auto scrollbar-hide">
            {Object.keys(EMOJI_CATEGORIES).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors",
                  activeCategory === category
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-3 max-h-48 overflow-y-auto">
          <div className="grid grid-cols-8 gap-1">
            {EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES]?.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="h-8 w-8 flex items-center justify-center text-lg hover:bg-muted rounded transition-colors touch-target"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}