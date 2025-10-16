import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateMatches, getMatchesForUser, updateMatchStatus } from '@/lib/matching'
import { createErrorResponse, validateRequired } from '@/lib/error-handler'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return createErrorResponse(new Error('User ID is required'))
    }

    const matches = await getMatchesForUser(userId)

    return NextResponse.json({ matches })
  } catch (error) {
    return createErrorResponse(error)
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, limit = 3 } = body

    validateRequired(body, ['userId'])

    const matches = await generateMatches(userId, limit)

    return NextResponse.json({ 
      matches,
      success: true,
      message: `${matches.length} matches generated successfully`
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}
