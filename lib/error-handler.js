export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404)
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409)
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429)
  }
}

export function handleError(error: any) {
  console.error('Error:', error)
  
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
      isOperational: error.isOperational
    }
  }
  
  // Handle Supabase errors
  if (error.code) {
    switch (error.code) {
      case 'PGRST116':
        return {
          statusCode: 404,
          message: 'Resource not found',
          isOperational: true
        }
      case '23505':
        return {
          statusCode: 409,
          message: 'Resource already exists',
          isOperational: true
        }
      case '23503':
        return {
          statusCode: 400,
          message: 'Invalid reference',
          isOperational: true
        }
      default:
        return {
          statusCode: 500,
          message: 'Database error',
          isOperational: true
        }
    }
  }
  
  // Handle network errors
  if (error.name === 'FetchError' || error.message?.includes('fetch')) {
    return {
      statusCode: 503,
      message: 'Service temporarily unavailable',
      isOperational: true
    }
  }
  
  // Default error
  return {
    statusCode: 500,
    message: 'Internal server error',
    isOperational: false
  }
}

export function createErrorResponse(error: any) {
  const errorInfo = handleError(error)
  
  return Response.json(
    {
      error: {
        message: errorInfo.message,
        statusCode: errorInfo.statusCode,
        timestamp: new Date().toISOString()
      }
    },
    { status: errorInfo.statusCode }
  )
}

export function validateRequired(data: any, fields: string[]) {
  const missing = fields.filter(field => !data[field])
  
  if (missing.length > 0) {
    throw new ValidationError(`Missing required fields: ${missing.join(', ')}`)
  }
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format')
  }
}

export function validatePassword(password: string) {
  if (password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters long')
  }
}

export function sanitizeInput(input: any) {
  if (typeof input === 'string') {
    return input.trim()
  }
  return input
}

export function rateLimitCheck(identifier: string, limit: number, windowMs: number) {
  // Simple in-memory rate limiting (in production, use Redis)
  const now = Date.now()
  const windowStart = now - windowMs
  
  if (!global.rateLimitStore) {
    global.rateLimitStore = new Map()
  }
  
  const store = global.rateLimitStore
  const key = identifier
  
  if (!store.has(key)) {
    store.set(key, [])
  }
  
  const requests = store.get(key)
  const validRequests = requests.filter((timestamp: number) => timestamp > windowStart)
  
  if (validRequests.length >= limit) {
    throw new RateLimitError('Too many requests')
  }
  
  validRequests.push(now)
  store.set(key, validRequests)
  
  return true
}
