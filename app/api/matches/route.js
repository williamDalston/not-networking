import { NextResponse } from 'next/server'
import { withAuth, withRateLimit } from '@/lib/middleware'
import { matchingService } from '@/lib/services'
import { createErrorResponse, validateRequired } from '@/lib/error-handler'

async function getMatches(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return createErrorResponse(new Error('User ID is required'))
    }

    const matches = await matchingService.getMatchesForUser(userId)

    return NextResponse.json({ matches })
  } catch (error) {
    return createErrorResponse(error)
  }
}

async function generateMatches(request) {
  try {
    const body = await request.json()
    const { userId, limit = 3 } = body

    validateRequired(body, ['userId'])

    const matches = await matchingService.generateMatches(userId, limit)

    return NextResponse.json({ 
      matches,
      success: true,
      message: `${matches.length} matches generated successfully`
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

// Apply authentication and rate limiting
export const GET = withAuth(withRateLimit(50)(getMatches))
export const POST = withAuth(withRateLimit(10)(generateMatches))
