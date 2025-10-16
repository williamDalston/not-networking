import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createErrorResponse } from '@/lib/error-handler'

/**
 * Authentication middleware for API routes
 * Validates JWT token and extracts user information
 */
export async function authenticateRequest(request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: { message: 'Missing or invalid authorization header' } },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error || !user) {
      return NextResponse.json(
        { error: { message: 'Invalid or expired token' } },
        { status: 401 }
      )
    }

    return { user, error: null }
  } catch (error) {
    return { user: null, error: createErrorResponse(error) }
  }
}

/**
 * Higher-order function to wrap API routes with authentication
 */
export function withAuth(handler) {
  return async function(request, context) {
    const authResult = await authenticateRequest(request)
    
    if (authResult.error) {
      return authResult.error
    }
    
    // Add user to request context
    request.user = authResult.user
    
    return handler(request, context)
  }
}

/**
 * Rate limiting middleware
 * Simple in-memory implementation (use Redis in production)
 */
const rateLimitStore = new Map()

export function withRateLimit(limit = 100, windowMs = 15 * 60 * 1000) { // 100 requests per 15 minutes
  return function(handler) {
    return async function(request, context) {
      const identifier = request.headers.get('x-forwarded-for') || 
                        request.headers.get('x-real-ip') || 
                        'unknown'
      
      const now = Date.now()
      const windowStart = now - windowMs
      
      if (!rateLimitStore.has(identifier)) {
        rateLimitStore.set(identifier, [])
      }
      
      const requests = rateLimitStore.get(identifier)
      const validRequests = requests.filter(timestamp => timestamp > windowStart)
      
      if (validRequests.length >= limit) {
        return NextResponse.json(
          { error: { message: 'Rate limit exceeded' } },
          { 
            status: 429,
            headers: {
              'Retry-After': Math.ceil(windowMs / 1000),
              'X-RateLimit-Limit': limit,
              'X-RateLimit-Remaining': Math.max(0, limit - validRequests.length - 1),
              'X-RateLimit-Reset': new Date(now + windowMs).toISOString()
            }
          }
        )
      }
      
      validRequests.push(now)
      rateLimitStore.set(identifier, validRequests)
      
      return handler(request, context)
    }
  }
}

/**
 * Request validation middleware
 */
export function validateRequest(schema) {
  return function(handler) {
    return async function(request, context) {
      try {
        const body = await request.json()
        const validationResult = schema.safeParse(body)
        
        if (!validationResult.success) {
          return NextResponse.json(
            { 
              error: { 
                message: 'Validation failed',
                details: validationResult.error.errors
              } 
            },
            { status: 400 }
          )
        }
        
        request.validatedBody = validationResult.data
        return handler(request, context)
      } catch (error) {
        return NextResponse.json(
          { error: { message: 'Invalid JSON body' } },
          { status: 400 }
        )
      }
    }
  }
}
