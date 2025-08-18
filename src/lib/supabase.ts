import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we have valid Supabase credentials
const hasValidCredentials = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder_anon_key'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a mock client for development when credentials are placeholders
const createMockClient = () => {
  const mockAuth = {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Mock mode - Supabase not configured') }),
    signUp: () => Promise.resolve({ data: null, error: new Error('Mock mode - Supabase not configured') }),
    signOut: () => Promise.resolve({ error: null }),
    signInWithOAuth: () => Promise.resolve({ data: null, error: new Error('Mock mode - Supabase not configured') })
  }

  const mockFrom = () => ({
    select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Mock mode - Supabase not configured') }) }) }),
    insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Mock mode - Supabase not configured') }) }) }),
    update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Mock mode - Supabase not configured') }) }) }) })
  })

  const mockStorage = {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: new Error('Mock mode - Supabase not configured') }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
      remove: () => Promise.resolve({ error: new Error('Mock mode - Supabase not configured') })
    })
  }

  const mockChannel = () => ({
    on: () => mockChannel(),
    subscribe: () => mockChannel(),
    unsubscribe: () => {}
  })

  return {
    auth: mockAuth,
    from: mockFrom,
    storage: mockStorage,
    channel: mockChannel
  }
}

export const supabase = hasValidCredentials 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : createMockClient() as any

// Helper functions for common operations
export const auth = supabase.auth

// Real-time subscriptions helper
export const createRealtimeSubscription = (
  table: string,
  callback: (payload: any) => void,
  filter?: string
) => {
  const channel = supabase
    .channel(`${table}_changes`)
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

// Storage helpers
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) throw error
  return data
}

export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}

export const deleteFile = async (bucket: string, path: string) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])
  
  if (error) throw error
}