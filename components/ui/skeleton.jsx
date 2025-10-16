import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Skeleton = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
      className
    )}
    {...props}
  />
))
Skeleton.displayName = 'Skeleton'

const SkeletonCard = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border border-gray-200 dark:border-gray-700 p-6',
      className
    )}
    {...props}
  >
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
))
SkeletonCard.displayName = 'SkeletonCard'

const SkeletonText = forwardRef(({ lines = 3, className, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-2', className)} {...props}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn(
          'h-4',
          i === lines - 1 ? 'w-2/3' : 'w-full'
        )}
      />
    ))}
  </div>
))
SkeletonText.displayName = 'SkeletonText'

const SkeletonAvatar = forwardRef(({ size = 'md', className, ...props }, ref) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  }

  return (
    <Skeleton
      ref={ref}
      className={cn('rounded-full', sizes[size], className)}
      {...props}
    />
  )
})
SkeletonAvatar.displayName = 'SkeletonAvatar'

const SkeletonButton = forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn('h-10 w-24 rounded-xl', className)}
    {...props}
  />
))
SkeletonButton.displayName = 'SkeletonButton'

export { 
  Skeleton, 
  SkeletonCard, 
  SkeletonText, 
  SkeletonAvatar, 
  SkeletonButton 
}