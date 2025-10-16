import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createErrorResponse, validateRequired } from '@/lib/error-handler'

export async function POST(request: NextRequest, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { userId } = body

    validateRequired(body, ['userId'])

    const { data: checkin, error } = await supabaseAdmin
      .from('event_rsvps')
      .update({
        checked_in: true,
        check_in_time: new Date().toISOString()
      })
      .eq('event_id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      return createErrorResponse(error)
    }

    return NextResponse.json({ 
      checkin,
      success: true,
      message: 'Checked in successfully'
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}
