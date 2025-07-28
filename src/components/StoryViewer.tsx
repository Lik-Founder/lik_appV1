import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ArrowLeft, ArrowRight, Pause, Play, VolumeMute, VolumeHigh } from '@phosphor-icons/react';
import { Story, User } from '@/lib/types';
import { DeviceType } from '@/hooks/use-device';
import { useSwipe } from '@/hooks/use-swipe';
import { useHapticFeedback } from '@/hooks/use-haptic';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface StoryViewerProps {
  stories: Story[];
  users: User[];
  initialStoryIndex: number;
  onClose: () => void;
  deviceType: DeviceType;
}

export function StoryViewer({ stories, users, initialStoryIndex, onClose, deviceType }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { triggerHaptic } = useHapticFeedback();
  
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentStory = stories[currentIndex];
  const currentUser = users.find(user => user.id === currentStory?.userId);
  
  const STORY_DURATION = 5000; // 5 seconds per story
  const PROGRESS_INTERVAL = 50; // Update progress every 50ms

  // Navigation functions
  const goToNext = useCallback(() => {
    triggerHaptic('light');
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose, triggerHaptic]);

  const goToPrevious = useCallback(() => {
    triggerHaptic('light');
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  }, [currentIndex, triggerHaptic]);

  // Swipe handlers
  const swipeRef = useSwipe({
    onSwipeLeft: () => {
      goToNext();
    },
    onSwipeRight: () => {
      goToPrevious();
    },
    onSwipeUp: () => {
      onClose();
    },
    onSwipeDown: () => {
      onClose();
    }
  }, {
    threshold: 80,
    preventDefaultTouchmoveEvent: true
  });

  // Progress timer
  useEffect(() => {
    if (isPaused || !isVisible) return;

    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (PROGRESS_INTERVAL / STORY_DURATION) * 100;
        if (newProgress >= 100) {
          goToNext();
          return 0;
        }
        return newProgress;
      });
    }, PROGRESS_INTERVAL);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPaused, isVisible, goToNext, currentIndex]);

  // Reset progress when story changes
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  // Handle visibility change (pause when app is backgrounded)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Handle tap to pause/play
  const handleStoryTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const tapX = clientX - rect.left;
    const centerX = rect.width / 2;

    if (tapX < centerX * 0.3) {
      // Tap on left side - previous story
      goToPrevious();
    } else if (tapX > centerX * 1.7) {
      // Tap on right side - next story
      goToNext();
    } else {
      // Tap in center - pause/play
      triggerHaptic('light');
      setIsPaused(!isPaused);
    }
  };

  const iconSize = deviceType === 'tablet' ? 28 : 24;

  if (!currentStory || !currentUser) return null;

  return (
    <div 
      ref={swipeRef}
      className="fixed inset-0 bg-black z-50 flex flex-col"
    >
      {/* Progress bars */}
      <div className="flex gap-1 p-2 pt-safe">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-75 ease-linear"
              style={{
                width: index < currentIndex ? '100%' : 
                       index === currentIndex ? `${progress}%` : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 p-4 text-white">
        <Avatar className="w-8 h-8 border border-white/30">
          <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
          <AvatarFallback>{currentUser.username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="font-semibold text-sm">{currentUser.username}</span>
        <span className="text-white/70 text-xs">
          {new Date(currentStory.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
        <div className="flex-1" />
        
        {/* Control buttons */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsPaused(!isPaused)}
          className="text-white hover:bg-white/10 touch-target"
        >
          {isPaused ? <Play size={iconSize} /> : <Pause size={iconSize} />}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMuted(!isMuted)}
          className="text-white hover:bg-white/10 touch-target"
        >
          {isMuted ? <VolumeMute size={iconSize} /> : <VolumeHigh size={iconSize} />}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/10 touch-target"
        >
          <X size={iconSize} />
        </Button>
      </div>

      {/* Story content */}
      <div 
        className="flex-1 relative cursor-pointer select-none"
        onMouseDown={handleStoryTap}
        onTouchStart={handleStoryTap}
      >
        {/* Story media */}
        <div className="absolute inset-0 flex items-center justify-center">
          {currentStory.type === 'image' ? (
            <img
              src={currentStory.mediaUrl}
              alt="Story"
              className="max-w-full max-h-full object-contain"
              draggable={false}
            />
          ) : (
            <video
              src={currentStory.mediaUrl}
              className="max-w-full max-h-full object-contain"
              autoPlay
              muted={isMuted}
              loop
              playsInline
            />
          )}
        </div>

        {/* Navigation hit areas (invisible) */}
        <div className="absolute inset-0 flex">
          <div className="w-1/3 h-full" /> {/* Left tap area */}
          <div className="w-1/3 h-full" /> {/* Center tap area */}
          <div className="w-1/3 h-full" /> {/* Right tap area */}
        </div>

        {/* Swipe indicators */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white/70 text-xs text-center">
          <div className="space-y-1">
            <div>← Swipe for stories →</div>
            <div>↓ Swipe down to close ↓</div>
          </div>
        </div>

        {/* Navigation arrows for tablets */}
        {deviceType === 'tablet' && (
          <>
            {currentIndex > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10 touch-target"
              >
                <ArrowLeft size={iconSize} />
              </Button>
            )}
            {currentIndex < stories.length - 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10 touch-target"
              >
                <ArrowRight size={iconSize} />
              </Button>
            )}
          </>
        )}
      </div>

      {/* Story text/caption overlay */}
      {currentStory.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <p className="text-sm leading-relaxed selectable-text">
            {currentStory.caption}
          </p>
        </div>
      )}
    </div>
  );
}