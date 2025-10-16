import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase'
import { errorHandler } from '@/lib/error-handler'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const eventId = params.id
    const body = await request.json()
    const { attendeeId } = body

    const supabase = createClient()

    // Check if event exists and is ongoing
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, start_time, end_time, status')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check if event is ongoing
    const now = new Date()
    const startTime = new Date(event.start_time)
    const endTime = event.end_time ? new Date(event.end_time) : new Date(startTime.getTime() + 2 * 60 * 60 * 1000)

    if (now < startTime) {
      return NextResponse.json(
        { error: 'Event has not started yet' },
        { status: 400 }
      )
    }

    if (now > endTime) {
      return NextResponse.json(
        { error: 'Event has already ended' },
        { status: 400 }
      )
    }

    // Check if user has RSVP'd
    const { data: rsvp, error: rsvpError } = await supabase
      .from('rsvps')
      .select('id, status')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single()

    if (rsvpError || !rsvp || rsvp.status !== 'attending') {
      return NextResponse.json(
        { error: 'You must RSVP as attending to check in' },
        { status: 400 }
      )
    }

    // Check if user has already checked in
    const { data: existingCheckIn, error: checkInError } = await supabase
      .from('checkins')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single()

    if (!checkInError && existingCheckIn) {
      return NextResponse.json(
        { error: 'You have already checked in to this event' },
        { status: 400 }
      )
    }

    // Create check-in record
    const { data: checkIn, error: createCheckInError } = await supabase
      .from('checkins')
      .insert({
        event_id: eventId,
        user_id: user.id,
        attendee_id: attendeeId, // From QR code scan
        checked_in_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (createCheckInError) {
      throw new Error(`Failed to create check-in: ${createCheckInError.message}`)
    }

    // Create interaction record
    await supabase
      .from('interactions')
      .insert({
        user_id: user.id,
        target_user_id: null, // No specific target user for check-in
        interaction_type: 'event_checkin',
        metadata: {
          event_id: eventId,
          attendee_id: attendeeId,
          checked_in_at: checkIn.checked_in_at
        }
      })

    return NextResponse.json({
      success: true,
      checkIn,
      message: 'Successfully checked in to event'
    })

  } catch (error) {
    const aiError = errorHandler.handleError(error as Error, {
      userId: user?.id,
      operation: 'event_checkin',
      eventId: params.id
    })

    return NextResponse.json(
      { 
        error: aiError.userFriendlyMessage,
        details: aiError.message 
      },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const eventId = params.id
    const supabase = createClient()

    // Check if user has checked in
    const { data: checkIn, error: checkInError } = await supabase
      .from('checkins')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single()

    if (checkInError && checkInError.code !== 'PGRST116') {
      throw new Error(`Failed to fetch check-in status: ${checkInError.message}`)
    }

    return NextResponse.json({
      checkedIn: !!checkIn,
      checkIn: checkIn || null
    })

  } catch (error) {
    const aiError = errorHandler.handleError(error as Error, {
      userId: user?.id,
      operation: 'get_checkin_status',
      eventId: params.id
    })

    return NextResponse.json(
      { 
        error: aiError.userFriendlyMessage,
        details: aiError.message 
      },
      { status: 500 }
    )
  }
}
