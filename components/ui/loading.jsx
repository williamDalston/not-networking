'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function LoadingSpinner({ size = 'md', className, ...props }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  return (
    <motion.div
      className={cn('animate-spin rounded-full border-2 border-gray-300 border-t-emerald-600', sizes[size], className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      {...props}
    />
  )
}

export function LoadingDots({ className, ...props }) {
  return (
    <div className={cn('flex space-x-1', className)} {...props}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 bg-emerald-600 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  )
}

export function LoadingPulse({ className, ...props }) {
  return (
    <motion.div
      className={cn('h-4 bg-gray-200 rounded', className)}
      animate={{
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      {...props}
    />
  )
}

export function LoadingCard({ className, ...props }) {
  return (
    <div className={cn('glass-card p-6', className)} {...props}>
      <div className="animate-pulse space-y-4">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  )
}

export function LoadingPage({ message = 'Loading...', className, ...props }) {
  return (
    <div className={cn('min-h-screen flex items-center justify-center gradient-bg', className)} {...props}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-gold-500 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' }
          }}
        >
          <span className="text-2xl">🌱</span>
        </motion.div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{message}</h2>
        <LoadingDots className="justify-center" />
      </motion.div>
    </div>
  )
}
