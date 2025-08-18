# Complete Supabase Setup Guide for Lik App

This guide will help you set up your Supabase database tables, auth policies, and storage buckets for the Lik social food discovery app.

## 1. Database Setup

### Step 1: Run the Schema SQL
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `qvipudhnjyhajixeqdov`
3. Navigate to **SQL Editor** in the left sidebar
4. Copy and paste the contents of `supabase-schema.sql` (found in the root directory)
5. Click **Run** to execute the schema

This will create:
- All necessary tables (profiles, restaurants, dishes, posts, etc.)
- Row Level Security policies
- Indexes for performance
- Database functions and triggers
- Realtime subscriptions

### Step 2: Configure Authentication Settings
1. Go to **Authentication** > **Settings** in your Supabase dashboard
2. Under **Site URL**, add your app URL (if deploying)
3. Under **Redirect URLs**, add any redirect URLs you need

## 2. Storage Buckets Setup

### Step 3: Create Storage Buckets
Go to **Storage** in your Supabase dashboard and create these buckets:

#### 3.1 Profile Images Bucket
```sql
-- Run this in SQL Editor
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
```

#### 3.2 Post Media Bucket
```sql
-- Run this in SQL Editor
INSERT INTO storage.buckets (id, name, public) VALUES ('posts', 'posts', true);
```

#### 3.3 Restaurant Images Bucket
```sql
-- Run this in SQL Editor
INSERT INTO storage.buckets (id, name, public) VALUES ('restaurants', 'restaurants', true);
```

#### 3.4 Dish Images Bucket
```sql
-- Run this in SQL Editor
INSERT INTO storage.buckets (id, name, public) VALUES ('dishes', 'dishes', true);
```

#### 3.5 Event Images Bucket
```sql
-- Run this in SQL Editor
INSERT INTO storage.buckets (id, name, public) VALUES ('events', 'events', true);
```

### Step 4: Set Storage Policies

#### 4.1 Avatar Storage Policies
```sql
-- Allow public read access to avatars
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

-- Allow authenticated users to upload avatars
CREATE POLICY "Users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND auth.role() = 'authenticated'
);

-- Allow users to update their own avatars
CREATE POLICY "Users can update own avatars" ON storage.objects FOR UPDATE USING (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete own avatars" ON storage.objects FOR DELETE USING (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### 4.2 Posts Storage Policies
```sql
-- Allow public read access to post images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'posts');

-- Allow authenticated users to upload post images
CREATE POLICY "Users can upload post images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'posts' AND auth.role() = 'authenticated'
);

-- Allow users to update their own post images
CREATE POLICY "Users can update own post images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own post images
CREATE POLICY "Users can delete own post images" ON storage.objects FOR DELETE USING (
  bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### 4.3 Restaurant Storage Policies
```sql
-- Allow public read access to restaurant images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'restaurants');

-- Allow authenticated users to upload restaurant images
CREATE POLICY "Users can upload restaurant images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'restaurants' AND auth.role() = 'authenticated'
);
```

#### 4.4 Dish Storage Policies
```sql
-- Allow public read access to dish images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'dishes');

-- Allow authenticated users to upload dish images
CREATE POLICY "Users can upload dish images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'dishes' AND auth.role() = 'authenticated'
);
```

#### 4.5 Event Storage Policies
```sql
-- Allow public read access to event images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'events');

-- Allow authenticated users to upload event images
CREATE POLICY "Users can upload event images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'events' AND auth.role() = 'authenticated'
);
```

## 3. Seed Data (Optional)

### Step 5: Add Sample Data
You can add some sample data to test your app:

```sql
-- Insert sample restaurants
INSERT INTO restaurants (name, description, cuisine_type, address, rating, price_range, verified) VALUES
('Bella Italia', 'Authentic Italian cuisine in the heart of the city', 'Italian', '123 Main St, San Francisco, CA', 4.5, 3, true),
('Sushi Zen', 'Fresh sushi and Japanese specialties', 'Japanese', '456 Ocean Ave, San Francisco, CA', 4.8, 4, true),
('Taco Loco', 'Best tacos in town with authentic Mexican flavors', 'Mexican', '789 Mission St, San Francisco, CA', 4.2, 2, false);

-- Insert sample dishes
INSERT INTO dishes (restaurant_id, name, description, price, calories, category) VALUES
((SELECT id FROM restaurants WHERE name = 'Bella Italia'), 'Margherita Pizza', 'Classic pizza with fresh tomatoes, mozzarella, and basil', 18.99, 650, 'Pizza'),
((SELECT id FROM restaurants WHERE name = 'Bella Italia'), 'Fettuccine Alfredo', 'Creamy pasta with parmesan cheese', 22.99, 820, 'Pasta'),
((SELECT id FROM restaurants WHERE name = 'Sushi Zen'), 'California Roll', 'Fresh crab, avocado, and cucumber', 12.99, 320, 'Sushi'),
((SELECT id FROM restaurants WHERE name = 'Taco Loco'), 'Fish Tacos', 'Grilled fish with fresh salsa and lime', 15.99, 450, 'Tacos');

-- Insert sample bounties
INSERT INTO bounties (restaurant_id, title, description, reward_coins, reward_xp, difficulty) VALUES
((SELECT id FROM restaurants WHERE name = 'Bella Italia'), 'Try Our New Truffle Pizza', 'Order and review our signature truffle pizza', 100, 50, 'easy'),
((SELECT id FROM restaurants WHERE name = 'Sushi Zen'), 'Sushi Master Challenge', 'Try 5 different types of sushi in one visit', 250, 100, 'medium'),
((SELECT id FROM restaurants WHERE name = 'Taco Loco'), 'Spicy Challenge', 'Finish our spiciest taco without milk', 500, 200, 'hard');

-- Insert sample quests
INSERT INTO quests (title, description, reward_coins, reward_xp, difficulty, locations_required) VALUES
('Italian Food Tour', 'Visit 3 different Italian restaurants in the city', 300, 150, 'medium', 3),
('Dessert Explorer', 'Try desserts from 5 different cuisines', 400, 200, 'medium', 5),
('Night Market Adventure', 'Visit 4 food trucks after 8 PM', 200, 100, 'easy', 4);
```

## 4. Realtime Setup

### Step 6: Enable Realtime
Your schema already includes realtime setup, but verify it's working:

1. Go to **Database** > **Replication** in Supabase dashboard
2. Make sure these tables are enabled for realtime:
   - profiles
   - posts
   - comments
   - likes
   - follows
   - messages
   - notifications

## 5. Testing Your Setup

### Step 7: Test Database Connection
Once you've run all the setup steps, your app should be able to:

1. Create user profiles when users sign up
2. Store and retrieve posts, restaurants, and other data
3. Handle real-time updates for messages and notifications
4. Upload and serve images through storage buckets

### Step 8: Verify Setup
Check that these work in your app:

1. **Authentication**: Sign up/in functionality
2. **Database**: Creating posts, following users, etc.
3. **Storage**: Uploading profile pictures and post images
4. **Realtime**: Live updates when someone likes a post or sends a message

## 6. Bypass Login Setup

The app now supports bypassing login by entering empty credentials. When you leave both email and password fields empty and click "Sign In", it will create a mock user session.

## Security Notes

- All tables have Row Level Security (RLS) enabled
- Users can only access/modify their own data where appropriate
- Public data (restaurants, posts) is readable by everyone
- Private data (messages, notifications) is restricted to the user
- Storage buckets have appropriate policies for public/private access

## Troubleshooting

### Common Issues:
1. **RLS Policy Errors**: Make sure you're signed in when testing
2. **Storage Upload Fails**: Check bucket policies and authentication
3. **Realtime Not Working**: Verify tables are enabled in replication settings
4. **Connection Errors**: Double-check your environment variables

### Getting Help:
- Check Supabase logs in the dashboard
- Review the database schema for any missing relationships
- Test individual queries in the SQL editor