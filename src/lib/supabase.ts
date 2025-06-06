
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using placeholder values for development.')
}

// Use placeholder values if environment variables are not set
const defaultUrl = supabaseUrl || 'https://placeholder.supabase.co'
const defaultKey = supabaseAnonKey || 'placeholder-key'

export const supabase = createClient(defaultUrl, defaultKey)




// Export a flag to check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      tracking_data: {
        Row: {
          id: string
          user_id: string
          date: string
          gym: boolean
          diet: boolean
          gym_notes: string | null
          diet_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          gym: boolean
          diet: boolean
          gym_notes?: string | null
          diet_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          gym?: boolean
          diet?: boolean
          gym_notes?: string | null
          diet_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
