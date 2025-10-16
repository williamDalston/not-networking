import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { submitMatchFeedback } from '@/lib/matching'
import { createErrorResponse, validateRequired } from '@/lib/error-handler'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { matchId, userId, feedback } = body

    validateRequired(body, ['matchId', 'userId', 'feedback'])

    const result = await submitMatchFeedback(matchId, userId, feedback)

    return NextResponse.json({ 
      result,
      success: true,
      message: 'Feedback submitted successfully'
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}
