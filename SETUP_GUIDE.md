# 🚀 Quick Supabase Setup Guide for Lik App

Follow these steps to set up your Supabase database and enable all features of the Lik app.

## 📋 Prerequisites

- Supabase account (https://supabase.com)
- Your Supabase project credentials are already in `.env`

## 🗄️ Step 1: Database Setup

### 1.1 Run the Main Schema
1. Go to https://supabase.com/dashboard
2. Select your project: `qvipudhnjyhajixeqdov`
3. Click **SQL Editor** in the left sidebar
4. Copy and paste the entire contents of `supabase-schema.sql`
5. Click **Run** to execute

This creates:
- ✅ All tables (profiles, restaurants, dishes, posts, etc.)
- ✅ Row Level Security policies
- ✅ Database functions and triggers
- ✅ Indexes for performance
- ✅ Realtime subscriptions

### 1.2 Set Up Storage Buckets
1. In the SQL Editor, copy and paste the contents of `supabase-storage.sql`
2. Click **Run** to execute

This creates:
- ✅ Avatar storage bucket
- ✅ Post media bucket
- ✅ Restaurant images bucket
- ✅ Dish images bucket
- ✅ Event images bucket
- ✅ Storage policies for secure access

### 1.3 Add Sample Data (Optional)
1. In the SQL Editor, copy and paste the contents of `supabase-sample-data.sql`
2. Click **Run** to execute

This adds:
- ✅ Sample restaurants (Bella Italia, Sushi Zen, etc.)
- ✅ Sample dishes with images
- ✅ Sample bounties and quests
- ✅ Sample events

## ⚙️ Step 2: Configuration

### 2.1 Enable Realtime (If Not Working)
1. Go to **Database** > **Replication** in Supabase dashboard
2. Make sure these tables are enabled:
   - ✅ profiles
   - ✅ posts
   - ✅ comments
   - ✅ likes
   - ✅ follows
   - ✅ messages
   - ✅ notifications

### 2.2 Authentication Settings
1. Go to **Authentication** > **Settings**
2. Set your **Site URL** (if deploying)
3. Add any **Redirect URLs** you need
4. Enable providers you want (Google, GitHub, Discord)

## 🧪 Step 3: Test Your Setup

### 3.1 Quick Test
1. Start your app: `npm run dev`
2. Click "Get Started" on the onboarding screen
3. On the login screen, **leave both email and password empty**
4. Click "Continue as Guest" to bypass authentication
5. You should now be in the app with a mock user session

### 3.2 Database Test
Try these features to verify your setup:
- ✅ Browse restaurants on the Explore page
- ✅ View bounties on the Lik page
- ✅ Check sample events on the Events page
- ✅ Navigate between different pages

### 3.3 Storage Test
If you want to test file uploads:
1. Go to **Storage** in Supabase dashboard
2. Verify you see these buckets:
   - ✅ avatars
   - ✅ posts
   - ✅ restaurants
   - ✅ dishes
   - ✅ events

## 🔧 Troubleshooting

### Common Issues

**❌ "relation does not exist" errors**
- Make sure you ran the complete `supabase-schema.sql` file
- Check for any SQL errors in the Supabase dashboard

**❌ Storage upload fails**
- Verify storage buckets were created with `supabase-storage.sql`
- Check that policies are correctly set up

**❌ Realtime not working**
- Go to Database > Replication and enable tables
- Refresh your app

**❌ RLS policy errors**
- Make sure you're using the guest mode bypass (empty credentials)
- Check that all policies were created in the schema

### Getting Help

1. **Check Supabase Logs**: Go to Logs in your dashboard
2. **SQL Editor**: Test individual queries
3. **Browser Console**: Look for JavaScript errors
4. **Network Tab**: Check for failed API calls

## 🎉 You're All Set!

Your Lik app should now have:
- ✅ Complete database with sample data
- ✅ File storage capabilities
- ✅ Real-time features
- ✅ Guest mode for easy testing
- ✅ Secure row-level security

**Next Steps:**
- Deploy your app to production
- Set up custom authentication flows
- Add more sample data
- Configure email templates in Supabase

## 📱 App Features Now Available

With this setup, your Lik app includes:
- 🏠 **Home**: Feed with stories and recommendations
- 🔍 **Explore**: Restaurant discovery with map view
- 🎯 **Lik**: Gamified bounties and quests
- 📱 **Trending**: TikTok-style food content
- 👤 **Profile**: User profiles with XP and levels
- 💬 **Messages**: Real-time chat system
- 📅 **Events**: Food events and meetups
- 🏆 **Leaderboards**: Competitive rankings
- 📺 **LikTV**: Streaming food content
- 🎁 **Rewards**: User rewards and loyalty
- 📚 **Guides**: Curated food guides

Enjoy building with Lik! 🚀