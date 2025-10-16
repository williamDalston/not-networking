import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { getNextStep, determineFlowType, analyzeEngagement } from '@/lib/onboarding-engine'

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      userId,
      currentStep,
      responses,
      userLocation,
      timezone
    } = body

    // Verify user owns this onboarding session
    if (user.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Analyze current engagement
    const engagementMetrics = analyzeEngagement(responses)
    
    // Determine flow type based on engagement
    const flowType = determineFlowType(responses, new Date(), timezone)
    
    // Get next step
    const nextStep = getNextStep({
      userId,
      currentStep,
      totalSteps: responses.length,
      responses,
      flowType,
      engagementScore: engagementMetrics.averageTimePerStep,
      completionRate: responses.length / 14, // Assuming 14 max steps
      lastActivity: new Date()
    }, responses)

    if (!nextStep) {
      // Onboarding complete
      return NextResponse.json({
        step: null,
        flowType,
        engagementMetrics,
        completed: true
      })
    }

    return NextResponse.json({
      step: nextStep,
      flowType,
      engagementMetrics,
      completed: false
    })

  } catch (error) {
    console.error('Error getting next step:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
