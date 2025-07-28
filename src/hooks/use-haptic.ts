import { useCallback } from 'react';

export type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export function useHapticFeedback() {
  const triggerHaptic = useCallback((type: HapticFeedbackType = 'light') => {
    // Check if device supports haptic feedback
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(20);
          break;
        case 'heavy':
          navigator.vibrate([30, 10, 30]);
          break;
        case 'success':
          navigator.vibrate([10, 5, 10, 5, 20]);
          break;
        case 'warning':
          navigator.vibrate([20, 10, 20]);
          break;
        case 'error':
          navigator.vibrate([50, 20, 50, 20, 100]);
          break;
        default:
          navigator.vibrate(10);
      }
    }

    // For iOS devices, we can try the webkit haptic API if available
    if ('webkitTapHighlightColor' in document.documentElement.style) {
      // iOS Safari doesn't expose haptic feedback to web apps
      // but we can use the Taptic Engine through PWA if installed
      try {
        // This is experimental and may not work in all cases
        const impact = new (window as any).ImpactFeedbackGenerator?.();
        if (impact) {
          switch (type) {
            case 'light':
              impact.impactOccurred(0); // UIImpactFeedbackStyleLight
              break;
            case 'medium':
              impact.impactOccurred(1); // UIImpactFeedbackStyleMedium
              break;
            case 'heavy':
              impact.impactOccurred(2); // UIImpactFeedbackStyleHeavy
              break;
            default:
              impact.impactOccurred(0);
          }
        }
      } catch (error) {
        // Silently fail if haptic feedback is not available
      }
    }
  }, []);

  const isHapticSupported = useCallback(() => {
    return 'vibrate' in navigator;
  }, []);

  return {
    triggerHaptic,
    isHapticSupported
  };
}