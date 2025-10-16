export class AppError extends Error {
  constructor(
    message,
    statusCode = 500,
    isOperational = true
  ) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.isOperational = isOperational
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400)
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401)
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404)
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409)
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429)
  }
}

export function handleError(error) {
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

export function createErrorResponse(error) {
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

export function validateRequired(data, fields) {
  const missing = fields.filter(field => !data[field])
  
  if (missing.length > 0) {
    throw new ValidationError(`Missing required fields: ${missing.join(', ')}`)
  }
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format')
  }
}

export function validatePassword(password) {
  if (password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters long')
  }
}

export function sanitizeInput(input) {
  if (typeof input === 'string') {
    return input.trim()
  }
  return input
}

export function rateLimitCheck(identifier, limit, windowMs) {
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
  const validRequests = requests.filter((timestamp) => timestamp > windowStart)
  
  if (validRequests.length >= limit) {
    throw new RateLimitError('Too many requests')
  }
  
  validRequests.push(now)
  store.set(key, validRequests)
  
  return true
}
