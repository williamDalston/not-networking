import { NextRequest, NextResponse } from 'next/server'
import { runMatchingPipeline } from '@/lib/matching'
import { createErrorResponse } from '@/lib/error-handler'

export async function POST(request: NextRequest) {
  try {
    const results = await runMatchingPipeline()

    const summary = {
      totalUsers: results.length,
      successfulMatches: results.filter(r => r.success).length,
      failedMatches: results.filter(r => !r.success).length,
      totalMatchesGenerated: results.reduce((sum, r) => sum + r.matchesGenerated, 0),
      results: results
    }

    return NextResponse.json({ 
      summary,
      success: true,
      message: 'Matching pipeline completed successfully'
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}
