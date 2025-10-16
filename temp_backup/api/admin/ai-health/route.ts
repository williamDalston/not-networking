import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { aiValidator, quickHealthCheck } from '@/lib/ai-validation'

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add admin role check
    // For now, allow any authenticated user to access health check

    const { searchParams } = new URL(request.url)
    const quick = searchParams.get('quick') === 'true'

    if (quick) {
      // Quick health check
      const health = await quickHealthCheck()
      return NextResponse.json({
        healthy: health.healthy,
        issues: health.issues,
        timestamp: new Date().toISOString()
      })
    } else {
      // Full system validation
      const health = await aiValidator.runFullSystemValidation()
      return NextResponse.json(health)
    }

  } catch (error) {
    console.error('AI health check failed:', error)
    return NextResponse.json(
      { 
        error: 'Health check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
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

    // Run specific validation tests
    const body = await request.json()
    const { component } = body

    let results

    switch (component) {
      case 'embeddings':
        results = await aiValidator.validateEmbeddingSystem()
        break
      case 'matching':
        results = await aiValidator.validateMatchingSystem()
        break
      case 'errorHandling':
        results = await aiValidator.validateErrorHandling()
        break
      case 'api':
        results = await aiValidator.validateAPIEndpoints()
        break
      default:
        return NextResponse.json({ error: 'Invalid component specified' }, { status: 400 })
    }

    return NextResponse.json({
      component,
      results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Component validation failed:', error)
    return NextResponse.json(
      { 
        error: 'Component validation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
