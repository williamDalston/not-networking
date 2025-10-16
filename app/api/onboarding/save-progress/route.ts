import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { saveOnboardingProgress } from '@/lib/onboarding-engine'

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, responses, currentStep } = body

    // Verify user owns this onboarding session
    if (user.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Save progress
    await saveOnboardingProgress(userId, responses, currentStep)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error saving progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
