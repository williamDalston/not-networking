import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createErrorResponse, validateRequired } from '@/lib/error-handler'

export async function POST(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { userId, status } = body

    validateRequired(body, ['userId', 'status'])

    const { data: rsvp, error } = await supabaseAdmin
      .from('event_rsvps')
      .upsert({
        event_id: id,
        user_id: userId,
        status: status
      })
      .select()
      .single()

    if (error) {
      return createErrorResponse(error)
    }

    return NextResponse.json({ 
      rsvp,
      success: true,
      message: `RSVP ${status} successfully`
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}
