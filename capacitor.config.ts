import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.lik.app',
  appName: 'Lik',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
  plugins: {
    StatusBar: {
      overlaysWebView: true,
      style: 'DARK',
    },
    Keyboard: {
      resize: 'native',
      resizeOnFullScreen: false,
    },
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
}

export default config


