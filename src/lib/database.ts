import { supabase } from './supabase'
import type { Database } from './database.types'

type Tables = Database['public']['Tables']
type Profile = Tables['profiles']['Row']
type Restaurant = Tables['restaurants']['Row']
type Dish = Tables['dishes']['Row']
type Post = Tables['posts']['Row']
type Bounty = Tables['bounties']['Row']
type Quest = Tables['quests']['Row']
type Event = Tables['events']['Row']

export class DatabaseService {
  /**
   * Profile operations
   */
  static async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error)
      throw error
    }

    return data
  }

  static async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      throw error
    }

    return data
  }

  /**
   * Restaurant operations
   */
  static async getRestaurants(options?: {
    limit?: number
    offset?: number
    search?: string
    cuisine?: string
  }) {
    let query = supabase
      .from('restaurants')
      .select('*')

    if (options?.search) {
      query = query.ilike('name', `%${options.search}%`)
    }

    if (options?.cuisine) {
      query = query.eq('cuisine_type', options.cuisine)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query.order('rating', { ascending: false })

    if (error) {
      console.error('Error fetching restaurants:', error)
      throw error
    }

    return data
  }

  static async getRestaurant(id: string): Promise<Restaurant | null> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching restaurant:', error)
      throw error
    }

    return data
  }

  /**
   * Dish operations
   */
  static async getDishesByRestaurant(restaurantId: string) {
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('rating', { ascending: false })

    if (error) {
      console.error('Error fetching dishes:', error)
      throw error
    }

    return data
  }

  /**
   * Post operations
   */
  static async getPosts(options?: {
    limit?: number
    offset?: number
    userId?: string
    restaurantId?: string
  }) {
    let query = supabase
      .from('posts')
      .select(`
        *,
        profiles!posts_user_id_fkey(username, display_name, avatar_url, level, verified),
        restaurants(name, cuisine_type),
        dishes(name, category)
      `)

    if (options?.userId) {
      query = query.eq('user_id', options.userId)
    }

    if (options?.restaurantId) {
      query = query.eq('restaurant_id', options.restaurantId)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
      throw error
    }

    return data
  }

  static async createPost(postData: Tables['posts']['Insert']) {
    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
      .select(`
        *,
        profiles!posts_user_id_fkey(username, display_name, avatar_url, level, verified),
        restaurants(name, cuisine_type),
        dishes(name, category)
      `)
      .single()

    if (error) {
      console.error('Error creating post:', error)
      throw error
    }

    return data
  }

  /**
   * Bounty operations
   */
  static async getBounties(options?: {
    limit?: number
    offset?: number
    restaurantId?: string
    difficulty?: string
  }) {
    let query = supabase
      .from('bounties')
      .select(`
        *,
        restaurants(name, cuisine_type, address),
        dishes(name, image_url)
      `)
      .eq('active', true)

    if (options?.restaurantId) {
      query = query.eq('restaurant_id', options.restaurantId)
    }

    if (options?.difficulty) {
      query = query.eq('difficulty', options.difficulty)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bounties:', error)
      throw error
    }

    return data
  }

  /**
   * Quest operations
   */
  static async getQuests(options?: {
    limit?: number
    offset?: number
    difficulty?: string
    questType?: string
  }) {
    let query = supabase
      .from('quests')
      .select('*')
      .eq('active', true)

    if (options?.difficulty) {
      query = query.eq('difficulty', options.difficulty)
    }

    if (options?.questType) {
      query = query.eq('quest_type', options.questType)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching quests:', error)
      throw error
    }

    return data
  }

  /**
   * Event operations
   */
  static async getEvents(options?: {
    limit?: number
    offset?: number
    upcoming?: boolean
  }) {
    let query = supabase
      .from('events')
      .select('*')

    if (options?.upcoming) {
      query = query.gte('start_date', new Date().toISOString())
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query.order('start_date', { ascending: true })

    if (error) {
      console.error('Error fetching events:', error)
      throw error
    }

    return data
  }

  /**
   * Social operations
   */
  static async likePost(userId: string, postId: string) {
    // First, try to insert the like
    const { error: insertError } = await supabase
      .from('likes')
      .insert([{ user_id: userId, post_id: postId }])

    if (insertError) {
      // If it fails due to duplicate, remove the like (unlike)
      if (insertError.code === '23505') {
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', userId)
          .eq('post_id', postId)

        if (deleteError) throw deleteError
        return { liked: false }
      }
      throw insertError
    }

    return { liked: true }
  }

  static async followUser(followerId: string, followingId: string) {
    const { error: insertError } = await supabase
      .from('follows')
      .insert([{ follower_id: followerId, following_id: followingId }])

    if (insertError) {
      // If it fails due to duplicate, remove the follow (unfollow)
      if (insertError.code === '23505') {
        const { error: deleteError } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', followerId)
          .eq('following_id', followingId)

        if (deleteError) throw deleteError
        return { following: false }
      }
      throw insertError
    }

    return { following: true }
  }

  /**
   * Realtime subscriptions
   */
  static subscribeToTable(
    table: string,
    callback: (payload: any) => void,
    filter?: string
  ) {
    const channel = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter
        },
        callback
      )
      .subscribe()

    return channel
  }

  /**
   * Search functionality
   */
  static async search(query: string, type?: 'restaurants' | 'users' | 'dishes') {
    const results: {
      restaurants?: Restaurant[]
      users?: Profile[]
      dishes?: Dish[]
    } = {}

    if (!type || type === 'restaurants') {
      const { data: restaurants } = await supabase
        .from('restaurants')
        .select('*')
        .or(`name.ilike.%${query}%,cuisine_type.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(10)

      results.restaurants = restaurants || []
    }

    if (!type || type === 'users') {
      const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
        .limit(10)

      results.users = users || []
    }

    if (!type || type === 'dishes') {
      const { data: dishes } = await supabase
        .from('dishes')
        .select('*, restaurants(name)')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(10)

      results.dishes = dishes || []
    }

    return results
  }
}