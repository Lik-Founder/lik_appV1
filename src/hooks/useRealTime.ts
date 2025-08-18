import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export function useRealTimeMessages(chatId: string) {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!chatId || !user) return

    // Fetch initial messages
    fetchMessages()

    // Set up real-time subscription
    const channel = supabase
      .channel(`messages_${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === payload.new.id ? payload.new : msg
            )
          )
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [chatId, user])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id (
            id,
            display_name,
            avatar_url,
            username
          )
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (content: string, messageType: string = 'text', metadata?: any) => {
    if (!user || !content.trim()) return

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          sender_id: user.id,
          chat_id: chatId,
          content: content.trim(),
          message_type: messageType,
          metadata
        }])
        .select(`
          *,
          sender:sender_id (
            id,
            display_name,
            avatar_url,
            username
          )
        `)
        .single()

      if (error) throw error

      // Update chat's last message
      await supabase
        .from('chats')
        .update({
          last_message_id: data.id,
          last_message_at: data.created_at
        })
        .eq('id', chatId)

      return data
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
      throw error
    }
  }

  return {
    messages,
    loading,
    sendMessage,
    refreshMessages: fetchMessages
  }
}

export function useRealTimeNotifications() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    // Fetch initial notifications
    fetchNotifications()

    // Set up real-time subscription
    const channel = supabase
      .channel(`notifications_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev])
          setUnreadCount(prev => prev + 1)
          
          // Show toast for new notification
          toast.info(payload.new.title, {
            description: payload.new.message
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          setNotifications(prev =>
            prev.map(notif =>
              notif.id === payload.new.id ? payload.new : notif
            )
          )
          
          // Update unread count if notification was marked as read
          if (payload.new.read && !payload.old.read) {
            setUnreadCount(prev => Math.max(0, prev - 1))
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [user])

  const fetchNotifications = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      
      setNotifications(data || [])
      setUnreadCount(data?.filter(n => !n.read).length || 0)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

      if (error) throw error
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false)

      if (error) throw error
      
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications
  }
}

export function useRealTimePosts(filters?: { userId?: string; restaurantId?: string }) {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch initial posts
    fetchPosts()

    // Set up real-time subscription
    const channel = supabase
      .channel('posts_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts'
        },
        (payload) => {
          // Only add if it matches our filters
          if (shouldIncludePost(payload.new)) {
            setPosts(prev => [payload.new, ...prev])
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts'
        },
        (payload) => {
          setPosts(prev =>
            prev.map(post =>
              post.id === payload.new.id ? { ...post, ...payload.new } : post
            )
          )
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [filters])

  const shouldIncludePost = (post: any) => {
    if (filters?.userId && post.user_id !== filters.userId) return false
    if (filters?.restaurantId && post.restaurant_id !== filters.restaurantId) return false
    return true
  }

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
        .limit(20)

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId)
      }
      if (filters?.restaurantId) {
        query = query.eq('restaurant_id', filters.restaurantId)
      }

      const { data, error } = await query

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  return {
    posts,
    loading,
    refreshPosts: fetchPosts
  }
}