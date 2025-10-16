import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createErrorResponse, validateRequired } from '@/lib/error-handler'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, step, data } = body

    validateRequired(body, ['userId', 'step'])

    // Save onboarding progress
    const { data: progress, error } = await supabaseAdmin
      .from('profiles')
      .upsert({
        user_id: userId,
        ...data
      })
      .select()
      .single()

    if (error) {
      return createErrorResponse(error)
    }

    return NextResponse.json({ 
      success: true, 
      progress,
      message: 'Progress saved successfully' 
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}
