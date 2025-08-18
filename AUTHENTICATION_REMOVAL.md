# Authentication System Removal

## Changes Made

### Deleted Components
- `src/components/OnboardingPage.tsx` - Welcome/onboarding flow
- `src/components/AuthPage.tsx` - Login/signup forms 
- `src/components/PreferencesPage.tsx` - Initial user preferences setup

### Deleted Contexts
- `src/contexts/AuthContext.tsx` - Authentication state management

### Modified Files

#### `src/App.tsx`
- Removed all authentication-related imports
- Removed `AuthProvider` wrapper
- Removed onboarding/auth/preferences state and logic
- Simplified app flow to directly show main interface
- Removed all auth-related useEffect hooks and conditional rendering

#### `src/hooks/useRealTime.ts`
- Removed `useAuth` dependency
- Added mock user for development (`mock-user-123`)
- Updated all functions to work without authentication

## Current State

The app now:
- Starts directly on the home page
- No login/signup required
- No onboarding flow
- Uses mock user data for any user-specific functionality
- All existing features remain functional

## Benefits

- Simplified user experience - immediate access to app
- Faster development and testing
- No authentication barriers
- All gamification features still work with mock data

## Mock User Data

Default mock user ID: `mock-user-123`
Email: `guest@lik.app`

This mock user is used throughout the app for any user-dependent features.