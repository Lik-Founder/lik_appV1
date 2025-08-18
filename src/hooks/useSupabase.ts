import { useState, useEffect } from 'react'
import { supabase, createRealtimeSubscription } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

type Post = Database['public']['Tables']['posts']['Row']
type Restaurant = Database['public']['Tables']['restaurants']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

export function usePosts(filters?: {
  userId?: string
  restaurantId?: string
  limit?: number
  offset?: number
}) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [filters])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            display_name,
            avatar_url,
            verified
          ),
          restaurants:restaurant_id (
            id,
            name,
            rating
          ),
          dishes:dish_id (
            id,
            name,
            price
          )
        `)
        .order('created_at', { ascending: false })

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId)
      }
      if (filters?.restaurantId) {
        query = query.eq('restaurant_id', filters.restaurantId)
      }
      if (filters?.limit) {
        query = query.limit(filters.limit)
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      const { data, error } = await query

      if (error) throw error
      setPosts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createPost = async (postData: Database['public']['Tables']['posts']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([postData])
        .select()
        .single()

      if (error) throw error
      
      // Update local state
      setPosts(prev => [data, ...prev])
      return data
    } catch (err) {
      throw err
    }
  }

  const likePost = async (postId: string, userId: string) => {
    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single()

      if (existingLike) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId)

        // Decrement likes count
        await supabase
          .from('posts')
          .update({ likes_count: supabase.sql`likes_count - 1` })
          .eq('id', postId)
      } else {
        // Like
        await supabase
          .from('likes')
          .insert([{ post_id: postId, user_id: userId }])

        // Increment likes count
        await supabase
          .from('posts')
          .update({ likes_count: supabase.sql`likes_count + 1` })
          .eq('id', postId)
      }

      // Refresh posts
      await fetchPosts()
    } catch (err) {
      throw err
    }
  }

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    likePost
  }
}

export function useRestaurants(filters?: {
  cuisineType?: string
  location?: string
  limit?: number
  offset?: number
}) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRestaurants()
  }, [filters])

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('restaurants')
        .select('*')
        .order('rating', { ascending: false })

      if (filters?.cuisineType) {
        query = query.eq('cuisine_type', filters.cuisineType)
      }
      if (filters?.location) {
        query = query.ilike('address', `%${filters.location}%`)
      }
      if (filters?.limit) {
        query = query.limit(filters.limit)
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      const { data, error } = await query

      if (error) throw error
      setRestaurants(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return {
    restaurants,
    loading,
    error,
    fetchRestaurants
  }
}

export function useProfiles(userIds: string[]) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userIds.length > 0) {
      fetchProfiles()
    }
  }, [userIds])

  const fetchProfiles = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds)

      if (error) throw error
      setProfiles(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return {
    profiles,
    loading,
    error,
    fetchProfiles
  }
}

export function useRealtimeSubscription<T>(
  table: string,
  callback: (payload: any) => void,
  filter?: string
) {
  useEffect(() => {
    const subscription = createRealtimeSubscription(table, callback, filter)

    return () => {
      subscription.unsubscribe()
    }
  }, [table, filter])
}