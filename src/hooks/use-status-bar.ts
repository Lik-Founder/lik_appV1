import { useEffect } from 'react';

export function useStatusBar(style: 'light' | 'dark') {
  useEffect(() => {
    const updateStatusBar = async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        if (!Capacitor.isNativePlatform()) return;

        const { StatusBar, Style } = await import('@capacitor/status-bar');
        await StatusBar.setStyle({ 
          style: style === 'light' ? Style.Light : Style.Dark 
        });
      } catch {
        // StatusBar not available
      }
    };

    updateStatusBar();
  }, [style]);
}

