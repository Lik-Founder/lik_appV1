import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from '@phosphor-icons/react';
import { useKV } from '@github/spark/hooks';
import { cn } from '@/lib/utils';

export function SwipeHint() {
  const [hasSeenHint, setHasSeenHint] = useKV('swipe-navigation-hint-seen', false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show hint after a short delay if user hasn't seen it
    if (!hasSeenHint) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasSeenHint]);

  const dismissHint = () => {
    setIsVisible(false);
    setHasSeenHint(true);
  };

  if (hasSeenHint || !isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Swipe to Navigate</h3>
          <button
            onClick={dismissHint}
            className="p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Swipe left or right anywhere on the screen to quickly switch between tabs.
        </p>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 bg-muted rounded-full">
              <ChevronLeft size={16} />
            </div>
            <span>Previous</span>
          </div>
          
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full swipe-hint" />
          
          <div className="flex items-center gap-2 text-sm">
            <span>Next</span>
            <div className="p-2 bg-muted rounded-full">
              <ChevronRight size={16} />
            </div>
          </div>
        </div>
        
        <button
          onClick={dismissHint}
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}