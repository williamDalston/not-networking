import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createErrorResponse } from '@/lib/error-handler'

export async function GET(request, { params }) {
  try {
    const { id } = params

    const { data: match, error } = await supabaseAdmin
      .from('matches')
      .select(`
        *,
        user1:users!matches_user1_id_fkey(*),
        user2:users!matches_user2_id_fkey(*),
        feedback(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      return createErrorResponse(error)
    }

    if (!match) {
      return createErrorResponse(new Error('Match not found'))
    }

    return NextResponse.json({ match })
  } catch (error) {
    return createErrorResponse(error)
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { userId, status } = body

    if (!userId || !status) {
      return createErrorResponse(new Error('User ID and status are required'))
    }

    const match = await updateMatchStatus(id, userId, status)

    return NextResponse.json({ 
      match,
      success: true,
      message: `Match ${status} successfully`
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}
