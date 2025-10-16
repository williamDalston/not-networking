import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase'
import { errorHandler } from '@/lib/error-handler'

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status') || 'upcoming'

    // Get events with RSVP status for current user
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        organizer:profiles!events_organizer_id_fkey(
          display_name,
          avatar_url
        ),
        rsvps!left(
          user_id,
          status,
          created_at
        )
      `)
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(`Failed to fetch events: ${error.message}`)
    }

    // Transform events to include user's RSVP status
    const transformedEvents = events?.map(event => {
      const userRSVP = event.rsvps?.find((rsvp: any) => rsvp.user_id === user.id)
      
      return {
        id: event.id,
        title: event.title,
        description: event.description,
        start_time: event.start_time,
        end_time: event.end_time,
        location: event.location,
        location_type: event.location_type,
        max_attendees: event.max_attendees,
        current_attendees: event.current_attendees,
        event_type: event.event_type,
        status: event.status,
        organizer: {
          name: event.organizer?.display_name || 'Unknown',
          avatar_url: event.organizer?.avatar_url
        },
        is_rsvped: !!userRSVP,
        rsvp_status: userRSVP?.status || undefined
      }
    }) || []

    return NextResponse.json({
      events: transformedEvents,
      total: transformedEvents.length
    })

  } catch (error) {
    const aiError = errorHandler.handleError(error as Error, {
      userId: user?.id,
      operation: 'get_events'
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

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      start_time,
      end_time,
      location,
      location_type,
      max_attendees,
      event_type
    } = body

    // Validate required fields
    if (!title || !start_time || !location || !location_type || !event_type) {
      return NextResponse.json(
        { error: 'Missing required fields: title, start_time, location, location_type, event_type' },
        { status: 400 }
      )
    }

    // Validate location_type
    const validLocationTypes = ['in_person', 'virtual', 'hybrid']
    if (!validLocationTypes.includes(location_type)) {
      return NextResponse.json(
        { error: 'Invalid location_type. Must be one of: ' + validLocationTypes.join(', ') },
        { status: 400 }
      )
    }

    // Validate event_type
    const validEventTypes = ['networking', 'workshop', 'social', 'learning']
    if (!validEventTypes.includes(event_type)) {
      return NextResponse.json(
        { error: 'Invalid event_type. Must be one of: ' + validEventTypes.join(', ') },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Create event
    const { data: event, error } = await supabase
      .from('events')
      .insert({
        title,
        description,
        start_time,
        end_time,
        location,
        location_type,
        max_attendees,
        event_type,
        organizer_id: user.id,
        status: 'upcoming',
        current_attendees: 0,
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        organizer:profiles!events_organizer_id_fkey(
          display_name,
          avatar_url
        )
      `)
      .single()

    if (error) {
      throw new Error(`Failed to create event: ${error.message}`)
    }

    return NextResponse.json({
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        start_time: event.start_time,
        end_time: event.end_time,
        location: event.location,
        location_type: event.location_type,
        max_attendees: event.max_attendees,
        current_attendees: event.current_attendees,
        event_type: event.event_type,
        status: event.status,
        organizer: {
          name: event.organizer?.display_name || 'Unknown',
          avatar_url: event.organizer?.avatar_url
        },
        is_rsvped: false,
        rsvp_status: undefined
      },
      message: 'Event created successfully'
    })

  } catch (error) {
    const aiError = errorHandler.handleError(error as Error, {
      userId: user?.id,
      operation: 'create_event'
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
