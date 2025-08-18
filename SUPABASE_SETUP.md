# Lik App - Supabase Integration

This document explains how to set up and use Supabase with the Lik app for authentication, real-time features, and CRUD operations.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new account
2. Create a new project
3. Wait for the project to be fully initialized

### 2. Set Up the Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase-schema.sql` and run it
3. This will create all the necessary tables, indexes, RLS policies, and triggers

### 3. Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Enable the authentication providers you want to use:
   - Email/Password (enabled by default)
   - Google OAuth
   - GitHub OAuth
   - Discord OAuth
3. For OAuth providers, you'll need to configure them with your app's credentials

### 4. Set Up Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your Supabase project details:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### 5. Configure Storage (Optional)

If you want to handle file uploads (profile pictures, post images, etc.):

1. Go to Storage in your Supabase dashboard
2. Create buckets for different file types:
   - `avatars` - for profile pictures
   - `posts` - for post media
   - `restaurants` - for restaurant images
3. Set up RLS policies for each bucket as needed

## Features Implemented

### Authentication
- Email/password authentication
- OAuth providers (Google, GitHub, Discord)
- Automatic profile creation on signup
- Session management
- Protected routes

### Real-time Features
- Live message updates
- Real-time notifications
- Live post updates (likes, comments)
- Follow/unfollow updates

### CRUD Operations
- **Posts**: Create, read, update, delete posts with media
- **Comments**: Threaded comments with likes
- **Likes**: Like/unlike posts and comments
- **Follows**: Follow/unfollow users
- **Messages**: Direct messaging and group chats
- **Bounties & Quests**: Gamification features
- **Events**: Food events management
- **Notifications**: System notifications

### Database Structure

The database includes the following main tables:

- `profiles` - User profiles with gamification stats
- `restaurants` - Restaurant information
- `dishes` - Menu items and dishes
- `posts` - User posts and reviews
- `bounties` - Restaurant challenges
- `quests` - Multi-location challenges
- `events` - Food events
- `messages` - Chat messages
- `chats` - Chat rooms
- `comments` - Post comments
- `likes` - Post and comment likes
- `follows` - User relationships
- `notifications` - System notifications

## Usage Examples

### Creating a Post

```typescript
import { usePosts } from '@/hooks/useSupabase'

const { createPost } = usePosts()

const handleCreatePost = async () => {
  await createPost({
    user_id: user.id,
    content: "Amazing pasta!",
    restaurant_id: "restaurant-uuid",
    rating: 9.5,
    media_urls: ["image-url"],
    tags: ["italian", "pasta"]
  })
}
```

### Real-time Messages

```typescript
import { useRealtimeSubscription } from '@/hooks/useSupabase'

// Listen for new messages in a chat
useRealtimeSubscription(
  'messages',
  (payload) => {
    if (payload.eventType === 'INSERT') {
      setMessages(prev => [...prev, payload.new])
    }
  },
  `chat_id=eq.${chatId}`
)
```

### Authentication

```typescript
import { useAuth } from '@/contexts/AuthContext'

const { user, signIn, signOut, updateProfile } = useAuth()

// Sign in
await signIn('email@example.com', 'password')

// Update profile
await updateProfile({
  display_name: 'New Name',
  bio: 'Food enthusiast'
})
```

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with appropriate policies:
- Users can only access their own private data
- Public data (posts, restaurants) is readable by everyone
- Users can only modify their own content

### Real-time Security
Real-time subscriptions respect RLS policies, ensuring users only receive updates for data they have access to.

### File Upload Security
Storage buckets can be configured with RLS policies to control who can upload/access files.

## Deployment Considerations

### Environment Variables
Make sure to set the correct environment variables in production:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### OAuth Redirect URLs
Update OAuth provider settings with your production URLs.

### Database Backup
Set up regular database backups through the Supabase dashboard.

### Monitoring
Use Supabase's built-in monitoring to track:
- API usage
- Database performance
- Real-time connections
- Storage usage

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**: Make sure your policies allow the operations you're trying to perform
2. **Real-time Not Working**: Check that the table is added to the realtime publication
3. **Authentication Issues**: Verify your environment variables and OAuth configurations
4. **File Upload Failures**: Check storage bucket policies and file size limits

### Debugging

Enable Supabase logging in development:
```typescript
import { supabase } from '@/lib/supabase'

// Enable debug mode
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event, session)
})
```

## Performance Optimization

### Database Indexes
The schema includes optimized indexes for:
- Post queries by user/restaurant
- Message queries by chat
- Notification queries by user
- Follow relationships

### Real-time Optimization
- Only subscribe to channels you need
- Unsubscribe when components unmount
- Use filters to reduce unnecessary updates

### Query Optimization
- Use `select()` to only fetch needed columns
- Implement pagination for large datasets
- Use appropriate filters and ordering

## Next Steps

1. **Analytics**: Add analytics tracking for user behavior
2. **Push Notifications**: Implement push notifications for mobile
3. **Advanced Search**: Add full-text search capabilities
4. **Caching**: Implement client-side caching for better performance
5. **Offline Support**: Add offline-first capabilities with sync