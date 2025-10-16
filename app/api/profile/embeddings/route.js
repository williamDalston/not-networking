import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateUserEmbeddings } from '@/lib/embeddings'
import { createErrorResponse, validateRequired } from '@/lib/error-handler'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    validateRequired(body, ['userId'])

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (profileError) {
      return createErrorResponse(profileError)
    }

    if (!profile) {
      return createErrorResponse(new Error('Profile not found'))
    }

    // Generate embeddings
    const embeddings = await generateUserEmbeddings(userId, profile)

    // Mark onboarding as completed
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ onboarding_completed: true })
      .eq('id', userId)

    if (updateError) {
      return createErrorResponse(updateError)
    }

    return NextResponse.json({ 
      success: true, 
      embeddings: embeddings.length,
      message: 'Embeddings generated successfully' 
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}
