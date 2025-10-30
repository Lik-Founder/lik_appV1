// Minimal Capacitor UI bootstrap with dynamic imports so web builds don't break
// when @capacitor/* plugins are not installed yet.

export async function initCapacitorUI(): Promise<void> {
  try {
    const core = await import('@capacitor/core');
    if (!core.Capacitor.isNativePlatform()) return;

    try {
      const keyboard = await import('@capacitor/keyboard');
      await keyboard.Keyboard.setResizeMode({ mode: 'native' });
    } catch {
      // Keyboard plugin not available – ignore on web/when not installed yet
    }

    try {
      const statusBar = await import('@capacitor/status-bar');
      await statusBar.StatusBar.setOverlaysWebView({ overlay: true });
      await statusBar.StatusBar.setStyle({ style: statusBar.Style.Dark });
    } catch {
      // StatusBar plugin not available – ignore on web/when not installed yet
    }
  } catch {
    // Capacitor core not present – noop in web
  }
}


