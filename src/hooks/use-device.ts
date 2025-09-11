import { useEffect, useState } from "react"

export type DeviceType = 'phone' | 'tablet' | 'foldable'
export type Orientation = 'portrait' | 'landscape'

export interface DeviceInfo {
  type: DeviceType
  orientation: Orientation
  isIOS: boolean
  isAndroid: boolean
  hasNotch: boolean
  screenHeight: number
  screenWidth: number
  isMobile: boolean
}

export interface SafeAreaInfo {
  top: number
  bottom: number
  left: number
  right: number
}

export function useDevice() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: 'phone',
    orientation: 'portrait',
    isIOS: false,
    isAndroid: false,
    hasNotch: false,
    screenHeight: 0,
    screenWidth: 0,
    isMobile: true
  })

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const userAgent = navigator.userAgent

      // Device type detection
      let type: DeviceType = 'phone'
      if (width >= 768) {
        type = 'tablet'
      }
      // Check for foldable devices
      if ('screen' in window && 'orientation' in window.screen) {
        // @ts-ignore - experimental API
        if (window.screen.isExtended) {
          type = 'foldable'
        }
      }

      // Orientation
      const orientation: Orientation = height > width ? 'portrait' : 'landscape'

      // Platform detection
      const isIOS = /iPad|iPhone|iPod/.test(userAgent)
      const isAndroid = /Android/.test(userAgent)

      // Notch detection (approximate)
      const hasNotch = isIOS && (
        (width === 375 && height === 812) || // iPhone X/XS
        (width === 414 && height === 896) || // iPhone XR/XS Max
        (width === 390 && height === 844) || // iPhone 12/13 Pro
        (width === 428 && height === 926) || // iPhone 12/13 Pro Max
        (width === 393 && height === 852) || // iPhone 14 Pro
        (width === 430 && height === 932)    // iPhone 14 Pro Max
      )

      setDeviceInfo({
        type,
        orientation,
        isIOS,
        isAndroid,
        hasNotch,
        screenHeight: height,
        screenWidth: width,
        isMobile: type === 'phone' || isIOS || isAndroid
      })
    }

    updateDeviceInfo()
    window.addEventListener('resize', updateDeviceInfo)
    window.addEventListener('orientationchange', updateDeviceInfo)

    return () => {
      window.removeEventListener('resize', updateDeviceInfo)
      window.removeEventListener('orientationchange', updateDeviceInfo)
    }
  }, [])

  return deviceInfo
}

// Safe area utilities for iOS devices
export function useSafeArea(): SafeAreaInfo {
  const [safeArea, setSafeArea] = useState<SafeAreaInfo>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  })

  useEffect(() => {
    const updateSafeArea = () => {
      const computed = getComputedStyle(document.documentElement)
      setSafeArea({
        top: parseInt(computed.getPropertyValue('--safe-area-inset-top') || '0'),
        bottom: parseInt(computed.getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parseInt(computed.getPropertyValue('--safe-area-inset-left') || '0'),
        right: parseInt(computed.getPropertyValue('--safe-area-inset-right') || '0')
      })
    }

    updateSafeArea()
    window.addEventListener('resize', updateSafeArea)
    window.addEventListener('orientationchange', updateSafeArea)

    return () => {
      window.removeEventListener('resize', updateSafeArea)
      window.removeEventListener('orientationchange', updateSafeArea)
    }
  }, [])

  return safeArea
}