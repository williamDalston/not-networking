// Comprehensive error handling system for the AI components

export interface ErrorContext {
  userId?: string
  stepId?: string
  operation?: string
  timestamp?: Date
  userAgent?: string
  additionalData?: Record<string, any>
}

export interface ErrorReport {
  id: string
  type: 'validation' | 'network' | 'ai_service' | 'database' | 'authentication' | 'rate_limit' | 'unknown'
  message: string
  context: ErrorContext
  severity: 'low' | 'medium' | 'high' | 'critical'
  resolved: boolean
  createdAt: Date
  resolvedAt?: Date
}

export class AIError extends Error {
  public readonly type: ErrorReport['type']
  public readonly severity: ErrorReport['severity']
  public readonly context: ErrorContext
  public readonly userFriendlyMessage: string
  public readonly retryable: boolean

  constructor(
    message: string,
    type: ErrorReport['type'],
    severity: ErrorReport['severity'] = 'medium',
    context: ErrorContext = {},
    userFriendlyMessage?: string,
    retryable: boolean = false
  ) {
    super(message)
    this.name = 'AIError'
    this.type = type
    this.severity = severity
    this.context = context
    this.userFriendlyMessage = userFriendlyMessage || this.getDefaultUserMessage(type)
    this.retryable = retryable
  }

  private getDefaultUserMessage(type: ErrorReport['type']): string {
    const messages = {
      validation: 'Please check your input and try again.',
      network: 'Connection issue. Please check your internet and try again.',
      ai_service: 'Our AI service is temporarily unavailable. Please try again in a moment.',
      database: 'We\'re experiencing technical difficulties. Please try again later.',
      authentication: 'Please sign in again to continue.',
      rate_limit: 'Too many requests. Please wait a moment and try again.',
      unknown: 'Something went wrong. Please try again or contact support.'
    }
    return messages[type]
  }
}

export class ErrorHandler {
  private static instance: ErrorHandler
  private errors: Map<string, ErrorReport> = new Map()

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  public handleError(error: Error, context: ErrorContext = {}): AIError {
    const errorId = this.generateErrorId()
    const timestamp = new Date()

    let aiError: AIError

    if (error instanceof AIError) {
      aiError = error
    } else {
      // Classify the error
      const { type, severity, retryable } = this.classifyError(error)
      aiError = new AIError(
        error.message,
        type,
        severity,
        { ...context, timestamp },
        undefined,
        retryable
      )
    }

    // Log the error
    this.logError(aiError, errorId)

    // Store error report
    const report: ErrorReport = {
      id: errorId,
      type: aiError.type,
      message: aiError.message,
      context: { ...aiError.context, timestamp },
      severity: aiError.severity,
      resolved: false,
      createdAt: timestamp
    }

    this.errors.set(errorId, report)

    // Handle critical errors
    if (aiError.severity === 'critical') {
      this.handleCriticalError(aiError, errorId)
    }

    return aiError
  }

  private classifyError(error: Error): { type: ErrorReport['type'], severity: ErrorReport['severity'], retryable: boolean } {
    const message = error.message.toLowerCase()

    // Network errors
    if (message.includes('fetch') || message.includes('network') || message.includes('timeout')) {
      return { type: 'network', severity: 'medium', retryable: true }
    }

    // Authentication errors
    if (message.includes('unauthorized') || message.includes('authentication') || message.includes('token')) {
      return { type: 'authentication', severity: 'high', retryable: false }
    }

    // Rate limiting
    if (message.includes('rate limit') || message.includes('too many requests') || message.includes('429')) {
      return { type: 'rate_limit', severity: 'medium', retryable: true }
    }

    // AI service errors
    if (message.includes('openai') || message.includes('huggingface') || message.includes('whisper') || message.includes('embedding')) {
      return { type: 'ai_service', severity: 'high', retryable: true }
    }

    // Database errors
    if (message.includes('database') || message.includes('supabase') || message.includes('postgres')) {
      return { type: 'database', severity: 'high', retryable: true }
    }

    // Validation errors
    if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
      return { type: 'validation', severity: 'low', retryable: false }
    }

    // Default classification
    return { type: 'unknown', severity: 'medium', retryable: false }
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private logError(error: AIError, errorId: string): void {
    const logData = {
      id: errorId,
      type: error.type,
      severity: error.severity,
      message: error.message,
      context: error.context,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('AI Error:', logData)
    }

    // In production, you might want to send to external logging service
    // e.g., Sentry, LogRocket, etc.
  }

  private handleCriticalError(error: AIError, errorId: string): void {
    // In production, you might want to:
    // 1. Send alert to monitoring system
    // 2. Notify administrators
    // 3. Take automatic recovery actions
    
    console.error(`CRITICAL ERROR ${errorId}:`, error)
  }

  public getErrorReport(errorId: string): ErrorReport | undefined {
    return this.errors.get(errorId)
  }

  public getAllErrors(): ErrorReport[] {
    return Array.from(this.errors.values())
  }

  public getUnresolvedErrors(): ErrorReport[] {
    return Array.from(this.errors.values()).filter(error => !error.resolved)
  }

  public resolveError(errorId: string): boolean {
    const error = this.errors.get(errorId)
    if (error && !error.resolved) {
      error.resolved = true
      error.resolvedAt = new Date()
      return true
    }
    return false
  }

  public getErrorStats(): {
    total: number
    unresolved: number
    byType: Record<string, number>
    bySeverity: Record<string, number>
  } {
    const errors = Array.from(this.errors.values())
    
    const byType = errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const bySeverity = errors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: errors.length,
      unresolved: errors.filter(e => !e.resolved).length,
      byType,
      bySeverity
    }
  }
}

// Utility functions for common error scenarios
export function validateEmbeddingInput(text: string): void {
  if (!text || typeof text !== 'string') {
    throw new AIError(
      'Text input is required and must be a string',
      'validation',
      'low',
      { operation: 'validateEmbeddingInput' },
      'Please provide some text to analyze.'
    )
  }

  if (text.trim().length === 0) {
    throw new AIError(
      'Text input cannot be empty',
      'validation',
      'low',
      { operation: 'validateEmbeddingInput' },
      'Please enter some text to continue.'
    )
  }

  if (text.length > 1000) {
    throw new AIError(
      'Text input is too long',
      'validation',
      'low',
      { operation: 'validateEmbeddingInput' },
      'Please keep your text under 1000 characters.'
    )
  }
}

export function validateUserId(userId: string): void {
  if (!userId || typeof userId !== 'string') {
    throw new AIError(
      'Valid user ID is required',
      'validation',
      'high',
      { operation: 'validateUserId' },
      'Please sign in again to continue.'
    )
  }

  // Basic UUID format validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(userId)) {
    throw new AIError(
      'Invalid user ID format',
      'validation',
      'high',
      { operation: 'validateUserId' },
      'Please sign in again to continue.'
    )
  }
}

export function validateAudioInput(audioData: string, duration?: number): void {
  if (!audioData || typeof audioData !== 'string') {
    throw new AIError(
      'Audio data is required',
      'validation',
      'low',
      { operation: 'validateAudioInput' },
      'Please record some audio to continue.'
    )
  }

  if (!audioData.startsWith('data:audio/')) {
    throw new AIError(
      'Invalid audio data format',
      'validation',
      'low',
      { operation: 'validateAudioInput' },
      'Please try recording again.'
    )
  }

  if (duration && (duration < 2 || duration > 20)) {
    throw new AIError(
      'Audio duration must be between 2 and 20 seconds',
      'validation',
      'low',
      { operation: 'validateAudioInput' },
      'Please record between 2 and 20 seconds of audio.'
    )
  }
}

export function createRetryWrapper<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  maxRetries: number = 3,
  baseDelay: number = 1000
) {
  return async (...args: T): Promise<R> => {
    let lastError: Error

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args)
      } catch (error) {
        lastError = error as Error
        
        if (attempt === maxRetries) {
          break
        }

        // Only retry on retryable errors
        if (error instanceof AIError && !error.retryable) {
          break
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw lastError!
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance()
