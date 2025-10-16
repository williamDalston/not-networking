import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Card = forwardRef(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl text-gray-950 transition-all duration-200',
      {
        'border border-gray-200 bg-white shadow-sm hover:shadow-md dark:border-gray-700 dark:bg-gray-800': variant === 'default',
        'border border-emerald-200 bg-white shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/20 dark:border-emerald-800 dark:bg-gray-800': variant === 'emerald',
        'border border-violet-200 bg-white shadow-lg shadow-violet-500/10 hover:shadow-xl hover:shadow-violet-500/20 dark:border-violet-800 dark:bg-gray-800': variant === 'violet',
        'border border-sky-200 bg-white shadow-lg shadow-sky-500/10 hover:shadow-xl hover:shadow-sky-500/20 dark:border-sky-800 dark:bg-gray-800': variant === 'sky',
        'bg-white/10 backdrop-blur-md border border-white/20 shadow-xl shadow-black/5 dark:bg-gray-900/10 dark:border-gray-700/20 dark:shadow-black/20': variant === 'glass',
        'bg-gradient-to-br from-emerald-50 to-gold-50 border border-emerald-200 shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/20 dark:from-emerald-900/10 dark:to-gold-900/10 dark:border-emerald-800': variant === 'gradient'
      },
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-500', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
