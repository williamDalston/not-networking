import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate required environment variables
if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is required')
}
if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is required')
}
if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required')
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client with service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types (commented out for JS compatibility)
// export interface User {
//   id: string
//   email: string
//   full_name?: string
//   avatar_url?: string
//   role: 'giver' | 'seeker' | 'both'
//   created_at: string
//   updated_at: string
//   onboarding_completed: boolean
//   is_active: boolean
// }

// export interface Profile {
//   id: string
//   user_id: string
//   strengths: string[]
//   needs: string[]
//   goals: string[]
//   values: string[]
//   bio?: string
//   location?: string
//   timezone?: string
//   availability_preferences?: any
//   communication_preferences?: any
//   industry?: string
//   experience_level?: string
//   created_at: string
//   updated_at: string
// }

// export interface Match {
//   id: string
//   user1_id: string
//   user2_id: string
//   status: 'pending' | 'accepted' | 'declined' | 'expired'
//   match_score: number
//   explanation?: string
//   evidence?: any
//   created_at: string
//   expires_at: string
//   feedback_user1?: any
//   feedback_user2?: any
// }

// export interface Event {
//   id: string
//   title: string
//   description?: string
//   event_type: 'virtual' | 'in-person' | 'hybrid'
//   location?: string
//   virtual_link?: string
//   start_time: string
//   end_time: string
//   max_attendees?: number
//   status: 'draft' | 'published' | 'cancelled' | 'completed'
//   organizer_id: string
//   created_at: string
//   updated_at: string
// }

// export interface EventRSVP {
//   id: string
//   event_id: string
//   user_id: string
//   status: 'yes' | 'no' | 'maybe' | 'pending'
//   checked_in: boolean
//   check_in_time?: string
//   created_at: string
//   updated_at: string
// }

// export interface Feedback {
//   id: string
//   match_id: string
//   user_id: string
//   helpful?: boolean
//   feedback_text?: string
//   rating?: number
//   created_at: string
// }

// export interface Embedding {
//   id: string
//   user_id: string
//   embedding_type: 'strengths' | 'needs' | 'goals' | 'values'
//   embedding: number[]
//   text_content: string
//   created_at: string
//   updated_at: string
// }
