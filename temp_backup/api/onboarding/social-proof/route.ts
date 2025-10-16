import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { generateSocialProof } from '@/lib/onboarding-engine'

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { stepId, userLocation } = body

    // Generate social proof message
    const message = await generateSocialProof(stepId, userLocation)

    if (!message) {
      return NextResponse.json({ message: null })
    }

    return NextResponse.json({ message })

  } catch (error) {
    console.error('Error generating social proof:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
