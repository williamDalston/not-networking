import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Button = forwardRef(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:scale-105 active:scale-95',
        {
          // Primary variants
          'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-lg hover:shadow-emerald-500/25': variant === 'default',
          'bg-gradient-to-r from-emerald-500 via-emerald-600 to-gold-500 hover:from-emerald-600 hover:via-emerald-700 hover:to-gold-600 text-white shadow-lg hover:shadow-emerald-500/25': variant === 'gradient',
          'bg-gradient-to-r from-emerald-500 via-emerald-600 to-gold-500 hover:from-emerald-600 hover:via-emerald-700 hover:to-gold-600 text-white shadow-lg hover:shadow-emerald-500/25 relative overflow-hidden group': variant === 'magic',
          
          // Secondary variants
          'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm hover:shadow-gray-500/10 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 dark:border-gray-600': variant === 'secondary',
          'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100': variant === 'ghost',
          'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 hover:text-gray-900 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-100': variant === 'outline',
          
          // Accent variants
          'bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 text-white shadow-lg hover:shadow-violet-500/25': variant === 'violet',
          'bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white shadow-lg hover:shadow-sky-500/25': variant === 'sky',
          'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white shadow-lg hover:shadow-rose-500/25': variant === 'rose',
          
          // Destructive
          'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg hover:shadow-red-500/25': variant === 'destructive',
          
          // Link
          'text-emerald-600 hover:text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300': variant === 'link'
        },
        {
          'h-10 py-2 px-4': size === 'default',
          'h-9 px-3 text-xs': size === 'sm',
          'h-11 px-8 text-base': size === 'lg',
          'h-12 px-10 text-lg': size === 'xl',
          'h-10 w-10': size === 'icon'
        },
        className
      )}
      ref={ref}
      {...props}
    >
      {variant === 'magic' && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-600"></span>
      )}
      {props.children}
    </button>
  )
})

Button.displayName = 'Button'

export { Button }