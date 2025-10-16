'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyStates } from '@/components/ui/empty-state'
import { fadeIn, slideUp } from '@/lib/animations'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorFallbackProps {
  error?: Error
  resetError: () => void
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo,
    })

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo)

    // Log to external error reporting service
    if (typeof window !== 'undefined') {
      // Example: Sentry.captureException(error)
      console.error('Error details:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      })
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

// Default error fallback component
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const [isRetrying, setIsRetrying] = React.useState(false)

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      // Wait a moment to show the retry state
      await new Promise(resolve => setTimeout(resolve, 1000))
      resetError()
    } finally {
      setIsRetrying(false)
    }
  }

  const handleGoHome = () => {
    window.location.href = '/dashboard'
  }

  const handleReportBug = () => {
    // Open email client or bug reporting tool
    const subject = encodeURIComponent('Bug Report - The Ecosystem × SAM AI')
    const body = encodeURIComponent(`
Error Details:
${error?.message || 'Unknown error'}

Stack Trace:
${error?.stack || 'No stack trace available'}

User Agent:
${navigator.userAgent}

URL:
${window.location.href}

Please describe what you were doing when this error occurred:
`)
    
    window.open(`mailto:support@ecosystem-ai.com?subject=${subject}&body=${body}`)
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-md w-full">
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center"
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>

          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We encountered an unexpected error. Don't worry, your data is safe.
          </p>

          {error && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                Technical Details
              </summary>
              <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-700 dark:text-gray-300 overflow-auto">
                {error.message}
              </div>
            </details>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleRetry}
              loading={isRetrying}
              className="w-full"
              rightIcon={<RefreshCw className="h-4 w-4" />}
            >
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </Button>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleGoHome}
                className="flex-1"
                leftIcon={<Home className="h-4 w-4" />}
              >
                Go Home
              </Button>
              
              <Button
                variant="outline"
                onClick={handleReportBug}
                className="flex-1"
                leftIcon={<Bug className="h-4 w-4" />}
              >
                Report Bug
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Hook for using error boundaries in functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const handleError = React.useCallback((error: Error) => {
    setError(error)
    console.error('Error caught by useErrorHandler:', error)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { handleError, resetError }
}

// Higher-order component for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Route-level error boundary
export function RouteErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log route-level errors
        console.error('Route error:', error, errorInfo)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

// Component-level error boundary for specific components
export function ComponentErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Component Error</span>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            This component encountered an error and couldn't render.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={resetError}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

export { ErrorBoundary }
