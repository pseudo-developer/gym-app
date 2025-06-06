
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
