import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase'
import { errorHandler } from '@/lib/error-handler'

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      matchId, 
      rating, 
      feedbackText, 
      outcome 
    } = body

    // Validate required fields
    if (!matchId || !rating || !outcome) {
      return NextResponse.json(
        { error: 'Missing required fields: matchId, rating, outcome' },
        { status: 400 }
      )
    }

    // Validate rating (1-5 scale)
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Validate outcome
    const validOutcomes = [
      'collaboration',
      'insight', 
      'good_chat',
      'didnt_click',
      'no_response'
    ]
    
    if (!validOutcomes.includes(outcome)) {
      return NextResponse.json(
        { error: 'Invalid outcome. Must be one of: ' + validOutcomes.join(', ') },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Verify match exists and belongs to user
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('id, match_user_id')
      .eq('id', matchId)
      .eq('user_id', user.id)
      .single()

    if (matchError || !match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // Insert feedback
    const { data: feedback, error: insertError } = await supabase
      .from('feedback')
      .insert({
        user_id: user.id,
        target_user_id: match.match_user_id,
        match_id: matchId,
        rating,
        outcome,
        feedback_text: feedbackText,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) {
      throw new Error(`Failed to save feedback: ${insertError.message}`)
    }

    // Update match status to 'completed' if it was pending
    await supabase
      .from('matches')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', matchId)
      .eq('user_id', user.id)

    // Create interaction record
    await supabase
      .from('interactions')
      .insert({
        user_id: user.id,
        target_user_id: match.match_user_id,
        interaction_type: 'feedback_submitted',
        metadata: {
          match_id: matchId,
          rating,
          outcome,
          feedback_text: feedbackText
        }
      })

    return NextResponse.json({
      feedback,
      message: 'Feedback submitted successfully'
    })

  } catch (error) {
    const aiError = errorHandler.handleError(error as Error, {
      userId: user?.id,
      operation: 'submit_feedback',
      matchId: body?.matchId
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

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = createClient()

    // Get user's feedback history
    const { data: feedback, error } = await supabase
      .from('feedback')
      .select(`
        *,
        target_user:profiles!feedback_target_user_id_fkey(
          display_name,
          avatar_url
        ),
        match:matches!feedback_match_id_fkey(
          similarity_score,
          match_type,
          explanation
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(`Failed to fetch feedback: ${error.message}`)
    }

    // Get total count
    const { count } = await supabase
      .from('feedback')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    return NextResponse.json({
      feedback: feedback || [],
      total: count || 0,
      limit,
      offset
    })

  } catch (error) {
    const aiError = errorHandler.handleError(error as Error, {
      userId: user?.id,
      operation: 'get_feedback_history'
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
