import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase'
import { errorHandler } from '@/lib/error-handler'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const matchId = params.id
    const supabase = createClient()

    // Get match details
    const { data: match, error } = await supabase
      .from('matches')
      .select(`
        *,
        match_user:profiles!matches_match_user_id_fkey(
          user_id,
          display_name,
          avatar_url,
          bio,
          work_on,
          progress_goal,
          strengths_text,
          needs_text,
          shared_values,
          value_creation_type,
          meaningful_progress_goals
        )
      `)
      .eq('id', matchId)
      .eq('user_id', user.id)
      .single()

    if (error || !match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ match })

  } catch (error) {
    const aiError = errorHandler.handleError(error as Error, {
      userId: user?.id,
      operation: 'get_match_detail',
      matchId: params.id
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const matchId = params.id
    const body = await request.json()
    const { action } = body // 'accept', 'decline', 'save'

    if (!['accept', 'decline', 'save'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be accept, decline, or save' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Update match status
    const statusMap = {
      accept: 'accepted',
      decline: 'declined',
      save: 'saved'
    }

    const { data: updatedMatch, error } = await supabase
      .from('matches')
      .update({
        status: statusMap[action as keyof typeof statusMap],
        updated_at: new Date().toISOString()
      })
      .eq('id', matchId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update match: ${error.message}`)
    }

    // If accepting, create interaction record
    if (action === 'accept') {
      await supabase
        .from('interactions')
        .insert({
          user_id: user.id,
          target_user_id: updatedMatch.match_user_id,
          interaction_type: 'match_accepted',
          metadata: {
            match_id: matchId,
            similarity_score: updatedMatch.similarity_score,
            match_type: updatedMatch.match_type
          }
        })
    }

    return NextResponse.json({
      match: updatedMatch,
      action,
      message: `Match ${action}ed successfully`
    })

  } catch (error) {
    const aiError = errorHandler.handleError(error as Error, {
      userId: user?.id,
      operation: 'update_match',
      matchId: params.id
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
