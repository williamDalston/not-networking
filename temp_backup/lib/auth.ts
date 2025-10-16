import { createServerClient } from './supabase'
import { redirect } from 'next/navigation'
import { User } from '@supabase/supabase-js'

export async function getUser(): Promise<User | null> {
  const supabase = createServerClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting user:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Error in getUser:', error)
    return null
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  return user
}

export async function requireOnboarded(): Promise<User> {
  const user = await requireAuth()
  const supabase = createServerClient()
  
  const { data: userProfile, error } = await supabase
    .from('users')
    .select('is_onboarded')
    .eq('id', user.id)
    .single()
  
  if (error) {
    console.error('Error checking onboarding status:', error)
    redirect('/auth/login')
  }
  
  if (!userProfile?.is_onboarded) {
    redirect('/onboarding')
  }
  
  return user
}

export async function getUserProfile(userId: string) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      profiles (*)
    `)
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error getting user profile:', error)
    return null
  }
  
  return data
}

export async function updateUserLastActive(userId: string) {
  const supabase = createServerClient()
  
  await supabase
    .from('users')
    .update({ last_active_at: new Date().toISOString() })
    .eq('id', userId)
}

// Ecosystem Compact validation
export function validateEcosystemCompact(compact: {
  curiosity: boolean
  generosity: boolean
  thoughtful_feedback: boolean
}): boolean {
  return compact.curiosity && compact.generosity && compact.thoughtful_feedback
}

// Onboarding completion
export async function completeOnboarding(userId: string, profileData: any) {
  const supabase = createServerClient()
  
  // Start transaction
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      user_id: userId,
      ...profileData,
      updated_at: new Date().toISOString()
    })
  
  if (profileError) {
    throw new Error(`Profile update failed: ${profileError.message}`)
  }
  
  const { error: userError } = await supabase
    .from('users')
    .update({
      is_onboarded: true,
      onboarding_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
  
  if (userError) {
    throw new Error(`User update failed: ${userError.message}`)
  }
  
  return true
}
