import { useState, useEffect } from 'react';
import { TabType } from '@/lib/types';

interface SwipeIndicatorProps {
  direction: 'left' | 'right' | 'none';
  progress: number;
}

export function SwipeIndicator({ direction, progress }: SwipeIndicatorProps) {
  const [showIndicator, setShowIndicator] = useState(false);
  
  useEffect(() => {
    if (direction !== 'none' && progress > 0) {
      setShowIndicator(true);
      const timer = setTimeout(() => {
        setShowIndicator(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowIndicator(false);
    }
  }, [direction, progress]);

  if (!showIndicator) return null;

  return (
    <div className="swipe-feedback-indicator active" style={{ 
      left: direction === 'right' ? '20px' : 'auto',
      right: direction === 'left' ? '20px' : 'auto', 
      transform: 'translateY(-50%)',
      top: '50%'
    }}>
      {direction === 'left' ? '→' : '←'}
    </div>
  );
}