'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from './ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Log to error reporting service
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    this.setState({
      error,
      errorInfo
    })
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We're sorry, but something unexpected happened. This has been reported to our team.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-left">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Error Details (Development):
                </h3>
                <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto">
                  {this.state.error.message}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Button>
            </div>

            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              If this problem persists, please contact support.
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook-based error boundary for functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const handleError = React.useCallback((error: Error) => {
    console.error('Error caught by useErrorHandler:', error)
    setError(error)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { handleError, resetError }
}

// Simple error fallback component
export function ErrorFallback({ 
  error, 
  resetError 
}: { 
  error: Error
  resetError: () => void 
}) {
  return (
    <div className="min-h-[200px] flex items-center justify-center p-4">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {error.message || 'An unexpected error occurred'}
        </p>
        <Button
          onClick={resetError}
          variant="outline"
          className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  )
}

// Page-level error boundary
export function PageErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to external service in production
        if (process.env.NODE_ENV === 'production') {
          // Example: log to Sentry, LogRocket, etc.
          console.error('Page Error:', error, errorInfo)
        }
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

// Component-level error boundary for smaller components
export function ComponentErrorBoundary({ 
  children, 
  fallback 
}: { 
  children: ReactNode
  fallback?: ReactNode 
}) {
  return (
    <ErrorBoundary
      fallback={fallback || (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">Something went wrong with this component</p>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}
