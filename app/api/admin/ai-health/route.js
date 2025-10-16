import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createErrorResponse } from '@/lib/error-handler'

export async function GET(request: NextRequest) {
  try {
    // Get system health metrics
    const [
      usersResult,
      profilesResult,
      matchesResult,
      eventsResult,
      feedbackResult
    ] = await Promise.all([
      supabaseAdmin.from('users').select('id', { count: 'exact' }),
      supabaseAdmin.from('profiles').select('id', { count: 'exact' }),
      supabaseAdmin.from('matches').select('id', { count: 'exact' }),
      supabaseAdmin.from('events').select('id', { count: 'exact' }),
      supabaseAdmin.from('feedback').select('id', { count: 'exact' })
    ])

    // Get recent matches
    const { data: recentMatches } = await supabaseAdmin
      .from('matches')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    // Get helpful rate
    const { data: helpfulFeedback } = await supabaseAdmin
      .from('feedback')
      .select('helpful')
      .not('helpful', 'is', null)

    const helpfulRate = helpfulFeedback?.length > 0 
      ? (helpfulFeedback.filter(f => f.helpful).length / helpfulFeedback.length) * 100
      : 0

    // Get onboarding completion rate
    const { data: onboardingStats } = await supabaseAdmin
      .from('users')
      .select('onboarding_completed')
      .eq('is_active', true)

    const completionRate = onboardingStats?.length > 0
      ? (onboardingStats.filter(u => u.onboarding_completed).length / onboardingStats.length) * 100
      : 0

    const health = {
      metrics: {
        totalUsers: usersResult.count || 0,
        totalProfiles: profilesResult.count || 0,
        totalMatches: matchesResult.count || 0,
        totalEvents: eventsResult.count || 0,
        totalFeedback: feedbackResult.count || 0,
        helpfulRate: Math.round(helpfulRate * 100) / 100,
        onboardingCompletionRate: Math.round(completionRate * 100) / 100
      },
      recentMatches: recentMatches || [],
      status: 'healthy',
      timestamp: new Date().toISOString()
    }

    return NextResponse.json({ health })
  } catch (error) {
    return createErrorResponse(error)
  }
}
