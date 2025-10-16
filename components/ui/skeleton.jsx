import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Skeleton = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('animate-pulse rounded-md bg-gray-200', className)}
    {...props}
  />
))
Skeleton.displayName = 'Skeleton'

export { Skeleton }
