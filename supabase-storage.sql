-- Storage Buckets Setup for Lik App
-- Run this SQL in your Supabase SQL Editor after setting up the main schema

-- 1. Create Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('avatars', 'avatars', true),
  ('posts', 'posts', true),
  ('restaurants', 'restaurants', true),
  ('dishes', 'dishes', true),
  ('events', 'events', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Avatar Storage Policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own avatars" ON storage.objects FOR UPDATE USING (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own avatars" ON storage.objects FOR DELETE USING (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Posts Storage Policies
CREATE POLICY "Public Access Posts" ON storage.objects FOR SELECT USING (bucket_id = 'posts');

CREATE POLICY "Users can upload post images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'posts' AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own post images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own post images" ON storage.objects FOR DELETE USING (
  bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Restaurant Storage Policies
CREATE POLICY "Public Access Restaurants" ON storage.objects FOR SELECT USING (bucket_id = 'restaurants');

CREATE POLICY "Users can upload restaurant images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'restaurants' AND auth.role() = 'authenticated'
);

-- 5. Dish Storage Policies
CREATE POLICY "Public Access Dishes" ON storage.objects FOR SELECT USING (bucket_id = 'dishes');

CREATE POLICY "Users can upload dish images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'dishes' AND auth.role() = 'authenticated'
);

-- 6. Event Storage Policies
CREATE POLICY "Public Access Events" ON storage.objects FOR SELECT USING (bucket_id = 'events');

CREATE POLICY "Users can upload event images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'events' AND auth.role() = 'authenticated'
);

-- 7. Enable RLS on storage objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;