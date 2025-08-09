import { useRef, useEffect, useCallback } from 'react';

  onSwipeRight: () => void;
  preventScroll?: boolean;
  onSwipeRight: () => void;
  onSwipeLeft,
  preventScroll?: boolean;
}

export function useSwipeTabs({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  preventScroll = false
}: SwipeTabsOptions) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);
  const isSwipingRef = useRef(false);

      if (preventScroll) {
      }
    
  }, [preventScroll]);
  const handleTouchEnd = useCallb
      tou

    }
    const deltaX = touchEnd.current.
    
    if (Math.abs(deltaX) > delt
        onSwipeRight();
        onSwipeLeft();
    
    touchStart.current = null;
    isSwipingRef.current = false;

    on
    onTouchEnd: handleTouchEnd,
      if (preventScroll) {
}
      }

    

  }, [preventScroll]);







    }



    



        onSwipeRight();

        onSwipeLeft();



    touchStart.current = null;

    isSwipingRef.current = false;





    onTouchEnd: handleTouchEnd,



}