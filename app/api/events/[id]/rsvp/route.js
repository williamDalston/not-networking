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
    const { status } = body

    // Validate status
    const validStatuses = ['attending', 'maybe', 'not_attending']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Check if event exists
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, max_attendees, current_attendees')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check if user already has an RSVP
    const { data: existingRSVP } = await supabase
      .from('rsvps')
      .select('id, status')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single()

    if (existingRSVP) {
      // Update existing RSVP
      const { error: updateError } = await supabase
        .from('rsvps')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingRSVP.id)

      if (updateError) {
        throw new Error(`Failed to update RSVP: ${updateError.message}`)
      }
    } else {
      // Create new RSVP
      const { error: insertError } = await supabase
        .from('rsvps')
        .insert({
          event_id: eventId,
          user_id: user.id,
          status,
          created_at: new Date().toISOString()
        })

      if (insertError) {
        throw new Error(`Failed to create RSVP: ${insertError.message}`)
      }
    }

    // Update event attendee count if attending
    if (status === 'attending') {
      const { error: updateCountError } = await supabase
        .from('events')
        .update({
          current_attendees: event.current_attendees + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId)

      if (updateCountError) {
        console.error('Failed to update attendee count:', updateCountError)
      }
    } else if (existingRSVP?.status === 'attending' && status !== 'attending') {
      // Decrease count if user was attending and now isn't
      const { error: updateCountError } = await supabase
        .from('events')
        .update({
          current_attendees: Math.max(0, event.current_attendees - 1),
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId)

      if (updateCountError) {
        console.error('Failed to update attendee count:', updateCountError)
      }
    }

    // Create interaction record
    await supabase
      .from('interactions')
      .insert({
        user_id: user.id,
        target_user_id: null, // No specific target user for event RSVP
        interaction_type: 'event_rsvp',
        metadata: {
          event_id: eventId,
          rsvp_status: status
        }
      })

    return NextResponse.json({
      success: true,
      status,
      message: `RSVP updated to ${status}`
    })

  } catch (error) {
    const aiError = errorHandler.handleError(error as Error, {
      userId: user?.id,
      operation: 'update_rsvp',
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

export async function DELETE(
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

    // Get existing RSVP
    const { data: rsvp, error: rsvpError } = await supabase
      .from('rsvps')
      .select('id, status')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single()

    if (rsvpError || !rsvp) {
      return NextResponse.json(
        { error: 'RSVP not found' },
        { status: 404 }
      )
    }

    // Delete RSVP
    const { error: deleteError } = await supabase
      .from('rsvps')
      .delete()
      .eq('id', rsvp.id)

    if (deleteError) {
      throw new Error(`Failed to delete RSVP: ${deleteError.message}`)
    }

    // Update event attendee count if user was attending
    if (rsvp.status === 'attending') {
      const { data: event } = await supabase
        .from('events')
        .select('current_attendees')
        .eq('id', eventId)
        .single()

      if (event) {
        await supabase
          .from('events')
          .update({
            current_attendees: Math.max(0, event.current_attendees - 1),
            updated_at: new Date().toISOString()
          })
          .eq('id', eventId)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'RSVP cancelled successfully'
    })

  } catch (error) {
    const aiError = errorHandler.handleError(error as Error, {
      userId: user?.id,
      operation: 'cancel_rsvp',
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
