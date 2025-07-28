# Swipe Gestures Guide

This Instagram clone now includes comprehensive swipe gesture support for enhanced mobile interaction.

## Story Navigation

### Story Bar
- **Swipe Left/Right**: Navigate through story bar horizontally
- **Tap Story**: Open story viewer with full swipe navigation

### Story Viewer
- **Swipe Left**: Next story
- **Swipe Right**: Previous story  
- **Swipe Up/Down**: Close story viewer
- **Tap Left Side**: Previous story
- **Tap Center**: Pause/Play story
- **Tap Right Side**: Next story

## Post Interactions

### Image Swipe Actions
- **Swipe Right**: Quick like (shows heart animation with haptic feedback)
- **Swipe Left**: Quick bookmark (shows bookmark icon)
- **Swipe Up**: Open comments
- **Swipe Down**: Share post
- **Double Tap**: Like with heart animation and stronger haptic feedback

### Visual Feedback
- Posts provide real-time visual feedback during swipes
- Action icons appear when swipe threshold is reached
- Smooth animations with proper easing functions
- Hardware-accelerated transforms for smooth performance

## Haptic Feedback

The app includes haptic feedback for enhanced mobile experience:
- **Light**: Navigation and minor actions
- **Medium**: Comments and secondary actions  
- **Heavy**: Double-tap to like
- **Success**: Successful like action

## Accessibility Features

- Respects `prefers-reduced-motion` for users with motion sensitivity
- Maintains keyboard navigation support
- Provides visual feedback for all gesture actions
- Supports both touch and mouse interactions on tablets

## Technical Implementation

- Custom `useSwipe` hook for gesture detection
- `useHapticFeedback` hook for tactile feedback
- GPU-accelerated animations for smooth performance
- Safe area support for modern mobile devices
- Optimized for both iOS and Android devices

## Gesture Thresholds

- **Minimum swipe distance**: 80px for story navigation
- **Post swipe threshold**: 80px for actions
- **Touch target size**: Minimum 44px for accessibility
- **Double tap window**: 300ms for like detection

## Browser Support

- Works on all modern mobile browsers
- Optimized for Safari (iOS) and Chrome (Android)
- Fallback support for older devices
- PWA-ready for app-like experience