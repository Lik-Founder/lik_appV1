export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          level: number
          xp: number
          lik_coins: number
          streak_count: number
          tickets: number
          hearts: number
          following_count: number
          followers_count: number
          posts_count: number
          reviews_count: number
          bounties_completed: number
          quests_completed: number
          location: string | null
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          level?: number
          xp?: number
          lik_coins?: number
          streak_count?: number
          tickets?: number
          hearts?: number
          following_count?: number
          followers_count?: number
          posts_count?: number
          reviews_count?: number
          bounties_completed?: number
          quests_completed?: number
          location?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          level?: number
          xp?: number
          lik_coins?: number
          streak_count?: number
          tickets?: number
          hearts?: number
          following_count?: number
          followers_count?: number
          posts_count?: number
          reviews_count?: number
          bounties_completed?: number
          quests_completed?: number
          location?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      restaurants: {
        Row: {
          id: string
          name: string
          description: string | null
          cuisine_type: string | null
          address: string | null
          latitude: number | null
          longitude: number | null
          phone: string | null
          website: string | null
          hours: Json | null
          rating: number
          price_range: number
          verified: boolean
          cover_image_url: string | null
          profile_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          cuisine_type?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          website?: string | null
          hours?: Json | null
          rating?: number
          price_range?: number
          verified?: boolean
          cover_image_url?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          cuisine_type?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          website?: string | null
          hours?: Json | null
          rating?: number
          price_range?: number
          verified?: boolean
          cover_image_url?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      dishes: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          description: string | null
          price: number
          calories: number | null
          category: string | null
          image_url: string | null
          ingredients: string[] | null
          allergens: string[] | null
          dietary_tags: string[] | null
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          description?: string | null
          price: number
          calories?: number | null
          category?: string | null
          image_url?: string | null
          ingredients?: string[] | null
          allergens?: string[] | null
          dietary_tags?: string[] | null
          rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          description?: string | null
          price?: number
          calories?: number | null
          category?: string | null
          image_url?: string | null
          ingredients?: string[] | null
          allergens?: string[] | null
          dietary_tags?: string[] | null
          rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string | null
          dish_id: string | null
          content: string | null
          media_urls: string[] | null
          rating: number | null
          price_paid: number | null
          tags: string[] | null
          likes_count: number
          comments_count: number
          shares_count: number
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id?: string | null
          dish_id?: string | null
          content?: string | null
          media_urls?: string[] | null
          rating?: number | null
          price_paid?: number | null
          tags?: string[] | null
          likes_count?: number
          comments_count?: number
          shares_count?: number
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_id?: string | null
          dish_id?: string | null
          content?: string | null
          media_urls?: string[] | null
          rating?: number | null
          price_paid?: number | null
          tags?: string[] | null
          likes_count?: number
          comments_count?: number
          shares_count?: number
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bounties: {
        Row: {
          id: string
          restaurant_id: string
          dish_id: string | null
          title: string
          description: string | null
          reward_coins: number
          reward_xp: number
          difficulty: 'easy' | 'medium' | 'hard' | 'expert'
          expires_at: string | null
          max_completions: number | null
          current_completions: number
          requirements: Json | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          dish_id?: string | null
          title: string
          description?: string | null
          reward_coins?: number
          reward_xp?: number
          difficulty?: 'easy' | 'medium' | 'hard' | 'expert'
          expires_at?: string | null
          max_completions?: number | null
          current_completions?: number
          requirements?: Json | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          dish_id?: string | null
          title?: string
          description?: string | null
          reward_coins?: number
          reward_xp?: number
          difficulty?: 'easy' | 'medium' | 'hard' | 'expert'
          expires_at?: string | null
          max_completions?: number | null
          current_completions?: number
          requirements?: Json | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      quests: {
        Row: {
          id: string
          title: string
          description: string | null
          reward_coins: number
          reward_xp: number
          difficulty: 'easy' | 'medium' | 'hard' | 'expert'
          expires_at: string | null
          max_participants: number | null
          current_participants: number
          requirements: Json | null
          locations_required: number
          quest_type: 'individual' | 'team' | 'challenge'
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          reward_coins?: number
          reward_xp?: number
          difficulty?: 'easy' | 'medium' | 'hard' | 'expert'
          expires_at?: string | null
          max_participants?: number | null
          current_participants?: number
          requirements?: Json | null
          locations_required?: number
          quest_type?: 'individual' | 'team' | 'challenge'
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          reward_coins?: number
          reward_xp?: number
          difficulty?: 'easy' | 'medium' | 'hard' | 'expert'
          expires_at?: string | null
          max_participants?: number | null
          current_participants?: number
          requirements?: Json | null
          locations_required?: number
          quest_type?: 'individual' | 'team' | 'challenge'
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          user_id: string
          post_id: string
          parent_id: string | null
          content: string
          likes_count: number
          replies_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          parent_id?: string | null
          content: string
          likes_count?: number
          replies_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          parent_id?: string | null
          content?: string
          likes_count?: number
          replies_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string | null
          chat_id: string
          content: string
          message_type: 'text' | 'image' | 'restaurant' | 'quest' | 'reward'
          metadata: Json | null
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id?: string | null
          chat_id: string
          content: string
          message_type?: 'text' | 'image' | 'restaurant' | 'quest' | 'reward'
          metadata?: Json | null
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string | null
          chat_id?: string
          content?: string
          message_type?: 'text' | 'image' | 'restaurant' | 'quest' | 'reward'
          metadata?: Json | null
          read_at?: string | null
          created_at?: string
        }
      }
      chats: {
        Row: {
          id: string
          type: 'dm' | 'group'
          name: string | null
          participants: string[]
          last_message_id: string | null
          last_message_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type?: 'dm' | 'group'
          name?: string | null
          participants: string[]
          last_message_id?: string | null
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'dm' | 'group'
          name?: string | null
          participants?: string[]
          last_message_id?: string | null
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string | null
          location: string | null
          latitude: number | null
          longitude: number | null
          start_date: string
          end_date: string | null
          price: number | null
          tags: string[] | null
          max_attendees: number | null
          current_attendees: number
          organizer_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url?: string | null
          location?: string | null
          latitude?: number | null
          longitude?: number | null
          start_date: string
          end_date?: string | null
          price?: number | null
          tags?: string[] | null
          max_attendees?: number | null
          current_attendees?: number
          organizer_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          location?: string | null
          latitude?: number | null
          longitude?: number | null
          start_date?: string
          end_date?: string | null
          price?: number | null
          tags?: string[] | null
          max_attendees?: number | null
          current_attendees?: number
          organizer_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          data: Json | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          data?: Json | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          data?: Json | null
          read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}