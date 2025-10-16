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
    const limit = parseInt(searchParams.get('limit') || '50')

    // Get users with their profiles and embeddings
    const { data: users, error } = await supabase
      .from('profiles')
      .select(`
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
        meaningful_progress_goals,
        created_at,
        updated_at
      `)
      .eq('is_onboarded', true)
      .not('user_id', 'eq', user.id) // Exclude current user
      .order('updated_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to fetch ecosystem users: ${error.message}`)
    }

    // Get match data for connections
    const { data: matches } = await supabase
      .from('matches')
      .select(`
        user_id,
        match_user_id,
        match_type,
        similarity_score,
        status
      `)
      .in('status', ['accepted', 'completed'])

    // Get interaction data for value flow
    const { data: interactions } = await supabase
      .from('interactions')
      .select(`
        user_id,
        target_user_id,
        interaction_type,
        created_at
      `)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

    return NextResponse.json({
      users: users || [],
      matches: matches || [],
      interactions: interactions || [],
      total: users?.length || 0
    })

  } catch (error) {
    const aiError = errorHandler.handleError(error as Error, {
      userId: user?.id,
      operation: 'get_ecosystem_users'
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
