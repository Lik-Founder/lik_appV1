# Profile Navigation System

The Lik app features a comprehensive profile navigation system that allows users to seamlessly navigate between user and restaurant profiles from any content across the app.

## Implementation Overview

### Core Navigation Architecture

The profile navigation system is built around two main callback functions:
- `onShowUserProfile: (userId: string) => void` - Navigate to user profiles
- `onShowRestaurantProfile: (restaurantId: string) => void` - Navigate to restaurant profiles

These callbacks are passed down through the component hierarchy from `App.tsx` to all content components.

### Navigation State Management

**App.tsx** manages the navigation state:
```typescript
const [showRestaurantProfile, setShowRestaurantProfile] = useState<string | null>(null);
const [showUserProfile, setShowUserProfile] = useState<string | null>(null);
```

When a profile is requested, the app:
1. Sets the profile ID state
2. Renders the profile component
3. Hides the bottom navigation
4. Disables swipe gestures

### Profile Components

- **UserProfile**: Displays user profiles with stats, posts, and social features
- **RestaurantProfile**: Shows restaurant information, menu, reviews, and awards

Both profiles include:
- Back navigation
- Profile switching capability
- Responsive design for mobile/tablet

## Components with Profile Navigation

### 1. Home Feed (`HomeFeed.tsx`)
- **Review Cards**: User names and restaurant names are clickable
- **Stories Bar**: User avatars and usernames navigate to profiles
- **Top Navigation**: User avatar navigates to current user profile

### 2. Trending Page (`TrendingPage.tsx`)
- **User Posts**: Profile avatars, display names, and restaurant mentions
- **Restaurant Posts**: Restaurant avatars, names, and verification badges
- **Ad Posts**: Sponsored restaurant profiles

### 3. Search/Explore Page (`SearchPage.tsx`)
- **Food Cards**: User profile pictures and display names
- **Restaurant Listings**: Restaurant names and avatars (in delivery mode)
- **Cart/Favorites**: Restaurant references in saved items

### 4. Comment System
- **CommentModal**: Passes profile navigation to comment items
- **CommentItem**: User avatars and usernames are clickable
- **Nested Comments**: All threaded replies maintain profile navigation

### 5. Stories
- **StoriesBar**: Story avatars and usernames
- **StoryViewer**: Profile information within story overlay

### 6. Posts
- **Post Component**: Author avatars, usernames, and location tags
- **Like/Comment Interface**: Tagged users and mentions

## Navigation Patterns

### User Profile Navigation
Users can access profiles by clicking:
- **Avatars**: Profile pictures anywhere in the app
- **Usernames**: Display names and @mentions
- **Attribution**: "Posted by" or "Reviewed by" text
- **Comment Authors**: Names in comment threads

### Restaurant Profile Navigation
Restaurant profiles are accessible via:
- **Restaurant Names**: In posts, reviews, and listings
- **Location Tags**: Geographic references
- **Menu Items**: Restaurant attribution
- **Review Context**: Restaurant mentions in user reviews

## Mobile Optimization

### Touch Targets
- All clickable profile elements meet 44px minimum touch target size
- Visual feedback on tap (scale/opacity changes)
- Haptic feedback where appropriate

### Gesture Integration
- Profile navigation works alongside swipe gestures
- Does not interfere with story navigation
- Maintains scroll behavior in feeds

### Responsive Design
- Profile navigation adapts to screen sizes
- Touch-first design for mobile
- Optimized for one-handed usage

## Profile Distinction

### User vs Restaurant Profiles
The app clearly distinguishes between profile types:

**User Profiles**:
- Personal avatars and usernames
- Level badges and XP progression
- Social stats (followers, following, posts)
- User-generated content

**Restaurant Profiles**:
- Business logos and names
- Verification badges for partners
- Star ratings and reviews
- Menu integration and ordering

### Visual Indicators
- **Verification Badges**: Blue checkmarks for verified accounts
- **Partner Badges**: Special indicators for Lik partners  
- **Business Hours**: Open/closed status for restaurants
- **Level Indicators**: XP levels for user accounts

## Deep Linking Support

The profile system supports:
- Direct profile URLs
- Back navigation history
- Cross-profile navigation
- Breadcrumb trails

## Error Handling

- **Profile Not Found**: Graceful fallback to default state
- **Network Issues**: Offline profile caching
- **Invalid IDs**: Silent failure with user feedback

## Accessibility

- **Screen Reader Support**: All profile links properly labeled
- **Keyboard Navigation**: Tab order and focus management
- **High Contrast**: Profile elements visible in all themes
- **Voice Control**: Profile names spoken for navigation

## Performance Considerations

- **Lazy Loading**: Profile data loaded on demand
- **Caching**: Recently viewed profiles cached locally
- **Preloading**: Common profiles preloaded in background
- **Memory Management**: Profile state cleanup on navigation

This comprehensive profile navigation system ensures users can effortlessly explore the social graph and discover new content throughout their Lik experience.