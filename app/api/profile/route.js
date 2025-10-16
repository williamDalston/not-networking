import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createErrorResponse, validateRequired, validateEmail, validatePassword } from '@/lib/error-handler'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return createErrorResponse(new Error('User ID is required'))
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select(`
        *,
        users!inner(*)
      `)
      .eq('user_id', userId)
      .single()

    if (error) {
      return createErrorResponse(error)
    }

    return NextResponse.json({ profile })
  } catch (error) {
    return createErrorResponse(error)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, ...profileData } = body

    validateRequired(body, ['userId'])

    // Validate email if provided
    if (profileData.email) {
      validateEmail(profileData.email)
    }

    // Update user profile
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .update({
        email: profileData.email,
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url,
        role: profileData.role
      })
      .eq('id', userId)
      .select()
      .single()

    if (userError) {
      return createErrorResponse(userError)
    }

    // Update detailed profile
    const { data: detailedProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        user_id: userId,
        strengths: profileData.strengths,
        needs: profileData.needs,
        goals: profileData.goals,
        values: profileData.values,
        bio: profileData.bio,
        location: profileData.location,
        timezone: profileData.timezone,
        availability_preferences: profileData.availability_preferences,
        communication_preferences: profileData.communication_preferences,
        industry: profileData.industry,
        experience_level: profileData.experience_level
      })
      .select()
      .single()

    if (profileError) {
      return createErrorResponse(profileError)
    }

    return NextResponse.json({ 
      user, 
      profile: detailedProfile 
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}
