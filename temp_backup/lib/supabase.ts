import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createServerComponentClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client for API routes and server components
export const createServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}

// Client-side Supabase client for use in client components
export const createClientSupabase = () => {
  return createClientComponentClient()
}

// Service role client for admin operations
export const createServiceClient = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'giver' | 'seeker' | 'both'
          location: string | null
          timezone: string
          is_onboarded: boolean
          onboarding_completed_at: string | null
          created_at: string
          updated_at: string
          last_active_at: string
          is_active: boolean
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'giver' | 'seeker' | 'both'
          location?: string | null
          timezone?: string
          is_onboarded?: boolean
          onboarding_completed_at?: string | null
          created_at?: string
          updated_at?: string
          last_active_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'giver' | 'seeker' | 'both'
          location?: string | null
          timezone?: string
          is_onboarded?: boolean
          onboarding_completed_at?: string | null
          created_at?: string
          updated_at?: string
          last_active_at?: string
          is_active?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          bio: string | null
          headline: string | null
          website: string | null
          linkedin_url: string | null
          github_url: string | null
          strengths: string[] | null
          needs: string[] | null
          goals: string[] | null
          values: string[] | null
          work_style: any | null
          weekly_availability: number
          readiness_level: number | null
          confidence_weights: any
          matching_preferences: any
          privacy_settings: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bio?: string | null
          headline?: string | null
          website?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          strengths?: string[] | null
          needs?: string[] | null
          goals?: string[] | null
          values?: string[] | null
          work_style?: any | null
          weekly_availability?: number
          readiness_level?: number | null
          confidence_weights?: any
          matching_preferences?: any
          privacy_settings?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bio?: string | null
          headline?: string | null
          website?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          strengths?: string[] | null
          needs?: string[] | null
          goals?: string[] | null
          values?: string[] | null
          work_style?: any | null
          weekly_availability?: number
          readiness_level?: number | null
          confidence_weights?: any
          matching_preferences?: any
          privacy_settings?: any
          created_at?: string
          updated_at?: string
        }
      }
      embeddings: {
        Row: {
          id: string
          user_id: string
          field_type: string
          embedding: string | null
          text_content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          field_type: string
          embedding?: string | null
          text_content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          field_type?: string
          embedding?: string | null
          text_content?: string
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          user_a_id: string
          user_b_id: string
          match_score: number
          match_type: string
          explanation_data: any | null
          raw_features: any | null
          allocated_at: string
          allocation_week: string
          status: 'pending' | 'accepted' | 'declined' | 'expired'
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_a_id: string
          user_b_id: string
          match_score: number
          match_type: string
          explanation_data?: any | null
          raw_features?: any | null
          allocated_at?: string
          allocation_week: string
          status?: 'pending' | 'accepted' | 'declined' | 'expired'
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_a_id?: string
          user_b_id?: string
          match_score?: number
          match_type?: string
          explanation_data?: any | null
          raw_features?: any | null
          allocated_at?: string
          allocation_week?: string
          status?: 'pending' | 'accepted' | 'declined' | 'expired'
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          match_id: string
          user_id: string
          other_user_id: string
          rating: 'collaboration' | 'insight' | 'good_chat' | 'didnt_click' | 'no_response'
          ordinal_score: number | null
          feedback_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          match_id: string
          user_id: string
          other_user_id: string
          rating: 'collaboration' | 'insight' | 'good_chat' | 'didnt_click' | 'no_response'
          ordinal_score?: number | null
          feedback_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          user_id?: string
          other_user_id?: string
          rating?: 'collaboration' | 'insight' | 'good_chat' | 'didnt_click' | 'no_response'
          ordinal_score?: number | null
          feedback_text?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_type: string
          location: string | null
          virtual_url: string | null
          start_time: string
          end_time: string
          max_attendees: number | null
          requires_rsvp: boolean
          is_public: boolean
          status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled'
          pre_intro_count: number
          pre_intro_sent_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_type: string
          location?: string | null
          virtual_url?: string | null
          start_time: string
          end_time: string
          max_attendees?: number | null
          requires_rsvp?: boolean
          is_public?: boolean
          status?: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled'
          pre_intro_count?: number
          pre_intro_sent_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          event_type?: string
          location?: string | null
          virtual_url?: string | null
          start_time?: string
          end_time?: string
          max_attendees?: number | null
          requires_rsvp?: boolean
          is_public?: boolean
          status?: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled'
          pre_intro_count?: number
          pre_intro_sent_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      v_helpful_rate: {
        Row: {
          week: string
          total_matches: number
          feedback_count: number
          helpful_count: number
          helpful_rate_percent: number
        }
      }
      v_ghost_rate: {
        Row: {
          week: string
          total_matches: number
          ghost_count: number
          ghost_rate_percent: number
        }
      }
      v_coverage_diversity: {
        Row: {
          tag: string
          user_count: number
          coverage_percent: number
        }
      }
    }
  }
}
