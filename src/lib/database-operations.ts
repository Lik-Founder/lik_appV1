import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

type Bounty = Database['public']['Tables']['bounties']['Row']
type Quest = Database['public']['Tables']['quests']['Row']
type Event = Database['public']['Tables']['events']['Row']
type Post = Database['public']['Tables']['posts']['Row']
type Comment = Database['public']['Tables']['comments']['Row']
type Message = Database['public']['Tables']['messages']['Row']
type Chat = Database['public']['Tables']['chats']['Row']

// Bounty operations
export async function fetchBounties(filters?: {
  restaurantId?: string
  difficulty?: string
  active?: boolean
  limit?: number
  offset?: number
}) {
  let query = supabase
    .from('bounties')
    .select(`
      *,
      restaurants:restaurant_id (
        id,
        name,
        rating,
        cuisine_type,
        address
      ),
      dishes:dish_id (
        id,
        name,
        price,
        image_url
      )
    `)
    .order('created_at', { ascending: false })

  if (filters?.restaurantId) {
    query = query.eq('restaurant_id', filters.restaurantId)
  }
  if (filters?.difficulty) {
    query = query.eq('difficulty', filters.difficulty)
  }
  if (filters?.active !== undefined) {
    query = query.eq('active', filters.active)
  }
  if (filters?.limit) {
    query = query.limit(filters.limit)
  }
  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  return query
}

export async function createBounty(bountyData: Database['public']['Tables']['bounties']['Insert']) {
  return supabase
    .from('bounties')
    .insert([bountyData])
    .select()
    .single()
}

export async function completeBounty(bountyId: string, userId: string) {
  // This would involve creating a completion record and updating user stats
  // Implementation depends on your business logic
  return supabase.rpc('complete_bounty', {
    bounty_id: bountyId,
    user_id: userId
  })
}

// Quest operations
export async function fetchQuests(filters?: {
  difficulty?: string
  questType?: string
  active?: boolean
  limit?: number
  offset?: number
}) {
  let query = supabase
    .from('quests')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.difficulty) {
    query = query.eq('difficulty', filters.difficulty)
  }
  if (filters?.questType) {
    query = query.eq('quest_type', filters.questType)
  }
  if (filters?.active !== undefined) {
    query = query.eq('active', filters.active)
  }
  if (filters?.limit) {
    query = query.limit(filters.limit)
  }
  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  return query
}

export async function createQuest(questData: Database['public']['Tables']['quests']['Insert']) {
  return supabase
    .from('quests')
    .insert([questData])
    .select()
    .single()
}

// Event operations
export async function fetchEvents(filters?: {
  location?: string
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}) {
  let query = supabase
    .from('events')
    .select(`
      *,
      organizer:organizer_id (
        id,
        display_name,
        avatar_url
      )
    `)
    .order('start_date', { ascending: true })

  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }
  if (filters?.startDate) {
    query = query.gte('start_date', filters.startDate)
  }
  if (filters?.endDate) {
    query = query.lte('end_date', filters.endDate)
  }
  if (filters?.limit) {
    query = query.limit(filters.limit)
  }
  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  return query
}

export async function createEvent(eventData: Database['public']['Tables']['events']['Insert']) {
  return supabase
    .from('events')
    .insert([eventData])
    .select()
    .single()
}

export async function rsvpToEvent(eventId: string, userId: string) {
  // This would create an RSVP record and update attendee count
  return supabase.rpc('rsvp_to_event', {
    event_id: eventId,
    user_id: userId
  })
}

// Comment operations
export async function fetchComments(postId: string, parentId?: string) {
  let query = supabase
    .from('comments')
    .select(`
      *,
      profiles:user_id (
        id,
        username,
        display_name,
        avatar_url,
        verified
      )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (parentId) {
    query = query.eq('parent_id', parentId)
  } else {
    query = query.is('parent_id', null)
  }

  return query
}

export async function createComment(commentData: Database['public']['Tables']['comments']['Insert']) {
  const { data, error } = await supabase
    .from('comments')
    .insert([commentData])
    .select()
    .single()

  if (error) throw error

  // Update comment count on post
  await supabase
    .from('posts')
    .update({ comments_count: supabase.sql`comments_count + 1` })
    .eq('id', commentData.post_id)

  return data
}

export async function likeComment(commentId: string, userId: string) {
  // Check if already liked
  const { data: existingLike } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('comment_id', commentId)
    .eq('user_id', userId)
    .single()

  if (existingLike) {
    // Unlike
    await supabase
      .from('comment_likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', userId)

    await supabase
      .from('comments')
      .update({ likes_count: supabase.sql`likes_count - 1` })
      .eq('id', commentId)
  } else {
    // Like
    await supabase
      .from('comment_likes')
      .insert([{ comment_id: commentId, user_id: userId }])

    await supabase
      .from('comments')
      .update({ likes_count: supabase.sql`likes_count + 1` })
      .eq('id', commentId)
  }
}

// Message operations
export async function fetchChats(userId: string) {
  return supabase
    .from('chats')
    .select(`
      *,
      last_message:last_message_id (
        id,
        content,
        message_type,
        created_at,
        sender:sender_id (
          id,
          display_name,
          avatar_url
        )
      )
    `)
    .contains('participants', [userId])
    .order('last_message_at', { ascending: false })
}

export async function fetchMessages(chatId: string, limit: number = 50, offset: number = 0) {
  return supabase
    .from('messages')
    .select(`
      *,
      sender:sender_id (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq('chat_id', chatId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
}

export async function sendMessage(messageData: Database['public']['Tables']['messages']['Insert']) {
  const { data, error } = await supabase
    .from('messages')
    .insert([messageData])
    .select()
    .single()

  if (error) throw error

  // Update chat's last message
  await supabase
    .from('chats')
    .update({
      last_message_id: data.id,
      last_message_at: data.created_at
    })
    .eq('id', messageData.chat_id)

  return data
}

export async function createOrGetDirectMessageChat(userId1: string, userId2: string) {
  // Check if chat already exists
  const { data: existingChat } = await supabase
    .from('chats')
    .select('*')
    .eq('type', 'dm')
    .or(`participants.cs.{${userId1},${userId2}},participants.cs.{${userId2},${userId1}}`)
    .single()

  if (existingChat) {
    return existingChat
  }

  // Create new chat
  const { data: newChat, error } = await supabase
    .from('chats')
    .insert([{
      type: 'dm',
      participants: [userId1, userId2]
    }])
    .select()
    .single()

  if (error) throw error
  return newChat
}

// Follow operations
export async function followUser(followerId: string, followingId: string) {
  const { error } = await supabase
    .from('follows')
    .insert([{ follower_id: followerId, following_id: followingId }])

  if (error) throw error

  // Update follower counts
  await Promise.all([
    supabase
      .from('profiles')
      .update({ following_count: supabase.sql`following_count + 1` })
      .eq('id', followerId),
    supabase
      .from('profiles')
      .update({ followers_count: supabase.sql`followers_count + 1` })
      .eq('id', followingId)
  ])
}

export async function unfollowUser(followerId: string, followingId: string) {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId)

  if (error) throw error

  // Update follower counts
  await Promise.all([
    supabase
      .from('profiles')
      .update({ following_count: supabase.sql`following_count - 1` })
      .eq('id', followerId),
    supabase
      .from('profiles')
      .update({ followers_count: supabase.sql`followers_count - 1` })
      .eq('id', followingId)
  ])
}

export async function checkIfFollowing(followerId: string, followingId: string) {
  const { data } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .single()

  return !!data
}

// Notification operations
export async function createNotification(notificationData: Database['public']['Tables']['notifications']['Insert']) {
  return supabase
    .from('notifications')
    .insert([notificationData])
    .select()
    .single()
}

export async function fetchNotifications(userId: string, limit: number = 20, offset: number = 0) {
  return supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
}

export async function markNotificationAsRead(notificationId: string) {
  return supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
}

export async function markAllNotificationsAsRead(userId: string) {
  return supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)
}