import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData?: Partial<Profile>) => Promise<void>
  signOut: () => Promise<void>
  signInWithProvider: (provider: 'google' | 'github' | 'discord') => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if we're in mock mode
    const isValidSupabase = import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
      import.meta.env.VITE_SUPABASE_ANON_KEY !== 'placeholder_anon_key'
    
    if (!isValidSupabase) {
      // In mock mode, just set loading to false and no user
      console.log('Running in mock mode - Supabase not configured')
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    }).catch((error) => {
      console.error('Error getting session:', error)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setProfile(data)
      } else {
        // Create profile if it doesn't exist
        await createInitialProfile(userId)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const createInitialProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            username: null,
            display_name: user?.user_metadata?.full_name || null,
            avatar_url: user?.user_metadata?.avatar_url || null,
            level: 1,
            xp: 0,
            lik_coins: 100, // Starting coins
            streak_count: 0,
            tickets: 0,
            hearts: 0,
            following_count: 0,
            followers_count: 0,
            posts_count: 0,
            reviews_count: 0,
            bounties_completed: 0,
            quests_completed: 0,
            verified: false
          }
        ])
        .select()
        .single()

      if (error) throw error
      if (data) setProfile(data)
    } catch (error) {
      console.error('Error creating profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } catch (error) {
      setLoading(false)
      if (error instanceof Error && error.message.includes('Mock mode')) {
        throw new Error('Authentication is not configured. Please set up Supabase credentials.')
      }
      throw error
    }
  }

  const signUp = async (email: string, password: string, userData?: Partial<Profile>) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      if (error) throw error
    } catch (error) {
      setLoading(false)
      if (error instanceof Error && error.message.includes('Mock mode')) {
        throw new Error('Authentication is not configured. Please set up Supabase credentials.')
      }
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error && !error.message.includes('Mock mode')) throw error
  }

  const signInWithProvider = async (provider: 'google' | 'github' | 'discord') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) {
      if (error.message.includes('Mock mode')) {
        throw new Error('Authentication is not configured. Please set up Supabase credentials.')
      }
      throw error
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in')
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      if (data) setProfile(data)
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const refreshProfile = async () => {
    if (!user) return
    await fetchProfile(user.id)
  }

  const value = {
    session,
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithProvider,
    updateProfile,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}