import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { runMatchingPipeline } from '@/lib/matching'
import { createClient } from '@/lib/supabase'
import { errorHandler } from '@/lib/error-handler'

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has completed onboarding
    const supabase = createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_onboarded')
      .eq('user_id', user.id)
      .single()

    if (!profile?.is_onboarded) {
      return NextResponse.json(
        { error: 'Please complete onboarding first' },
        { status: 400 }
      )
    }

    // Get existing matches for the user
    const { data: existingMatches } = await supabase
      .from('matches')
      .select(`
        *,
        match_user:profiles!matches_match_user_id_fkey(
          user_id,
          display_name,
          avatar_url,
          bio,
          work_on
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      matches: existingMatches || [],
      total: existingMatches?.length || 0
    })

  } catch (error) {
    const aiError = errorHandler.handleError(error as Error, {
      userId: user?.id,
      operation: 'get_matches'
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
    const { forceRefresh = false } = body

    // Check if user has completed onboarding
    const supabase = createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_onboarded')
      .eq('user_id', user.id)
      .single()

    if (!profile?.is_onboarded) {
      return NextResponse.json(
        { error: 'Please complete onboarding first' },
        { status: 400 }
      )
    }

    // Run matching pipeline to generate new matches
    const matches = await runMatchingPipeline(user.id)

    // Save matches to database
    const matchesToInsert = matches.map(match => ({
      user_id: user.id,
      match_user_id: match.user_id,
      similarity_score: match.similarity,
      match_type: match.match_type,
      features: match.features,
      explanation: match.explanation,
      status: 'pending',
      created_at: new Date().toISOString()
    }))

    const { data: insertedMatches, error: insertError } = await supabase
      .from('matches')
      .insert(matchesToInsert)
      .select(`
        *,
        match_user:profiles!matches_match_user_id_fkey(
          user_id,
          display_name,
          avatar_url,
          bio,
          work_on
        )
      `)

    if (insertError) {
      throw new Error(`Failed to save matches: ${insertError.message}`)
    }

    return NextResponse.json({
      matches: insertedMatches,
      total: insertedMatches?.length || 0,
      generated: true
    })

  } catch (error) {
    const aiError = errorHandler.handleError(error as Error, {
      userId: user?.id,
      operation: 'generate_matches'
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
