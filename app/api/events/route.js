import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createErrorResponse, validateRequired } from '@/lib/error-handler'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'published'

    const { data: events, error } = await supabaseAdmin
      .from('events')
      .select(`
        *,
        organizer:users!events_organizer_id_fkey(*),
        event_rsvps(*)
      `)
      .eq('status', status)
      .order('start_time', { ascending: true })

    if (error) {
      return createErrorResponse(error)
    }

    return NextResponse.json({ events })
  } catch (error) {
    return createErrorResponse(error)
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { title, description, event_type, location, virtual_link, start_time, end_time, max_attendees, organizer_id } = body

    validateRequired(body, ['title', 'event_type', 'start_time', 'end_time', 'organizer_id'])

    const { data: event, error } = await supabaseAdmin
      .from('events')
      .insert({
        title,
        description,
        event_type,
        location,
        virtual_link,
        start_time,
        end_time,
        max_attendees,
        organizer_id,
        status: 'published'
      })
      .select()
      .single()

    if (error) {
      return createErrorResponse(error)
    }

    return NextResponse.json({ 
      event,
      success: true,
      message: 'Event created successfully'
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}
