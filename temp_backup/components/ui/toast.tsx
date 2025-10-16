'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast as toastVariants } from '@/lib/animations'

export interface ToastProps {
  id: string
  title?: string
  description?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  onClose?: () => void
}

const ToastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const ToastColors = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    title: 'text-green-800 dark:text-green-200',
    description: 'text-green-700 dark:text-green-300',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-800 dark:text-red-200',
    description: 'text-red-700 dark:text-red-300',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    title: 'text-yellow-800 dark:text-yellow-200',
    description: 'text-yellow-700 dark:text-yellow-300',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-800 dark:text-blue-200',
    description: 'text-blue-700 dark:text-blue-300',
  },
}

interface ToastComponentProps extends ToastProps {
  onClose: () => void
}

const ToastComponent = React.forwardRef<HTMLDivElement, ToastComponentProps>(
  ({ title, description, type = 'info', action, onClose, duration = 5000 }, ref) => {
    const Icon = ToastIcons[type]
    const colors = ToastColors[type]
    const [progress, setProgress] = React.useState(100)

    // Auto-dismiss timer
    React.useEffect(() => {
      if (duration === 0) return // Don't auto-dismiss if duration is 0

      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            onClose()
            return 0
          }
          return prev - (100 / (duration / 100))
        })
      }, 100)

      return () => clearInterval(interval)
    }, [duration, onClose])

    return (
      <motion.div
        ref={ref}
        variants={toastVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={cn(
          'relative w-full max-w-sm rounded-lg border p-4 shadow-lg',
          colors.bg,
          colors.border
        )}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-start space-x-3">
          <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', colors.icon)} />
          
          <div className="flex-1 min-w-0">
            {title && (
              <p className={cn('text-sm font-medium', colors.title)}>
                {title}
              </p>
            )}
            {description && (
              <p className={cn('mt-1 text-sm', colors.description)}>
                {description}
              </p>
            )}
            {action && (
              <button
                onClick={action.onClick}
                className={cn(
                  'mt-2 text-sm font-medium underline underline-offset-2 hover:no-underline',
                  colors.title
                )}
              >
                {action.label}
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className={cn(
              'flex-shrink-0 rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/5 transition-colors',
              colors.icon
            )}
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress bar */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10 rounded-b-lg overflow-hidden">
            <motion.div
              className={cn('h-full', colors.icon.replace('text-', 'bg-'))}
              initial={{ width: '100%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        )}
      </motion.div>
    )
  }
)

ToastComponent.displayName = 'ToastComponent'

// Toast Provider and Context
interface ToastContextValue {
  toasts: ToastProps[]
  toast: (props: Omit<ToastProps, 'id'>) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Toast Provider Component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const toast = React.useCallback((props: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...props, id }])
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const value = React.useMemo(() => ({
    toasts,
    toast,
    dismiss,
  }), [toasts, toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

// Toast Container
interface ToastContainerProps {
  toasts: ToastProps[]
  onDismiss: (id: string) => void
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            {...toast}
            onClose={() => onDismiss(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Convenience functions for different toast types
export const toast = {
  success: (title: string, description?: string, options?: Partial<ToastProps>) => 
    useToast().toast({ title, description, type: 'success', ...options }),
  error: (title: string, description?: string, options?: Partial<ToastProps>) => 
    useToast().toast({ title, description, type: 'error', ...options }),
  warning: (title: string, description?: string, options?: Partial<ToastProps>) => 
    useToast().toast({ title, description, type: 'warning', ...options }),
  info: (title: string, description?: string, options?: Partial<ToastProps>) => 
    useToast().toast({ title, description, type: 'info', ...options }),
}