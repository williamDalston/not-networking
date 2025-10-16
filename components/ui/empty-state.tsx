'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { fadeIn, slideUp } from '@/lib/animations'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeConfig = {
  sm: {
    container: 'py-8',
    icon: 'h-12 w-12',
    title: 'text-lg',
    description: 'text-sm',
    spacing: 'space-y-3',
  },
  md: {
    container: 'py-12',
    icon: 'h-16 w-16',
    title: 'text-xl',
    description: 'text-base',
    spacing: 'space-y-4',
  },
  lg: {
    container: 'py-16',
    icon: 'h-20 w-20',
    title: 'text-2xl',
    description: 'text-lg',
    spacing: 'space-y-6',
  },
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'md',
}) => {
  const config = sizeConfig[size]

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className={cn(
        'flex flex-col items-center justify-center text-center',
        config.container,
        className
      )}
    >
      <div className={cn('flex flex-col items-center', config.spacing)}>
        {icon && (
          <motion.div
            variants={slideUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
            className={cn(
              'flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600',
              config.icon
            )}
          >
            {icon}
          </motion.div>
        )}

        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <h3 className={cn('font-semibold text-gray-900 dark:text-white', config.title)}>
            {title}
          </h3>
          <p className={cn('text-gray-600 dark:text-gray-400 max-w-md', config.description)}>
            {description}
          </p>
        </motion.div>

        {(action || secondaryAction) && (
          <motion.div
            variants={slideUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            {action && (
              <Button onClick={action.onClick}>
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button variant="outline" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// Pre-configured empty states for common scenarios
export const EmptyStates = {
  NoMatches: () => (
    <EmptyState
      icon={
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      }
      title="No matches yet"
      description="We're working on finding people who align with your goals and values. Check back soon!"
      action={{
        label: 'Update my profile',
        onClick: () => window.location.href = '/profile/edit'
      }}
    />
  ),

  NoEvents: () => (
    <EmptyState
      icon={
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      }
      title="No upcoming events"
      description="There are no events scheduled at the moment. Be the first to create one!"
      action={{
        label: 'Create event',
        onClick: () => window.location.href = '/events/create'
      }}
    />
  ),

  NoConnections: () => (
    <EmptyState
      icon={
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      }
      title="No connections yet"
      description="Start building your network by connecting with people who share your interests and goals."
      action={{
        label: 'Browse matches',
        onClick: () => window.location.href = '/matches'
      }}
    />
  ),

  NoFeedback: () => (
    <EmptyState
      icon={
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      }
      title="No feedback yet"
      description="Your feedback helps us improve the matching algorithm and create better connections."
      action={{
        label: 'View matches',
        onClick: () => window.location.href = '/matches'
      }}
    />
  ),

  NoNotifications: () => (
    <EmptyState
      icon={
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7H4l5-5v5zM15 7h5l-5-5v5zM9 17H4l5 5v-5z" />
        </svg>
      }
      title="All caught up!"
      description="You don't have any new notifications. We'll let you know when something important happens."
    />
  ),

  Loading: () => (
    <EmptyState
      icon={
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      }
      title="Loading..."
      description="Please wait while we fetch your data."
      size="md"
    />
  ),

  Error: ({ onRetry }: { onRetry?: () => void }) => (
    <EmptyState
      icon={
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      }
      title="Something went wrong"
      description="We encountered an error while loading your data. Please try again."
      action={onRetry ? {
        label: 'Try again',
        onClick: onRetry
      } : undefined}
      secondaryAction={{
        label: 'Contact support',
        onClick: () => window.location.href = '/contact'
      }}
    />
  ),

  Search: ({ query }: { query: string }) => (
    <EmptyState
      icon={
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      title={`No results for "${query}"`}
      description="Try adjusting your search terms or browse all available options."
      action={{
        label: 'Clear search',
        onClick: () => window.location.reload()
      }}
    />
  ),
}