'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

// Enhanced Tooltip with custom styling
interface EnhancedTooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delayDuration?: number
  disableHoverableContent?: boolean
  className?: string
  contentClassName?: string
}

export const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({
  children,
  content,
  side = 'top',
  align = 'center',
  delayDuration = 300,
  disableHoverableContent = false,
  className,
  contentClassName,
}) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild className={className}>
          {children}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={cn(
            'max-w-xs bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-0 shadow-lg',
            contentClassName
          )}
          sideOffset={8}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-gray-900 dark:fill-gray-100" />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Icon Tooltip - commonly used for help icons
interface IconTooltipProps {
  icon: React.ReactNode
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}

export const IconTooltip: React.FC<IconTooltipProps> = ({
  icon,
  content,
  side = 'top',
  className,
}) => {
  return (
    <EnhancedTooltip content={content} side={side}>
      <button
        type="button"
        className={cn(
          'inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors',
          className
        )}
        aria-label="Show help information"
      >
        {icon}
      </button>
    </EnhancedTooltip>
  )
}

// Help Tooltip with question mark icon
interface HelpTooltipProps {
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  side = 'top',
  className,
}) => {
  return (
    <IconTooltip
      icon="?"
      content={content}
      side={side}
      className={className}
    />
  )
}

// Keyboard shortcut tooltip
interface KeyboardTooltipProps {
  children: React.ReactNode
  shortcut: string
  description?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export const KeyboardTooltip: React.FC<KeyboardTooltipProps> = ({
  children,
  shortcut,
  description,
  side = 'top',
}) => {
  const content = (
    <div className="space-y-1">
      {description && (
        <div className="text-xs text-gray-300 dark:text-gray-700">
          {description}
        </div>
      )}
      <div className="flex items-center space-x-1">
        <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 dark:bg-gray-300 text-gray-200 dark:text-gray-800 rounded border">
          {shortcut}
        </kbd>
      </div>
    </div>
  )

  return (
    <EnhancedTooltip content={content} side={side}>
      {children}
    </EnhancedTooltip>
  )
}

// Rich tooltip with title and description
interface RichTooltipProps {
  children: React.ReactNode
  title: string
  description?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  className?: string
}

export const RichTooltip: React.FC<RichTooltipProps> = ({
  children,
  title,
  description,
  side = 'top',
  align = 'center',
  className,
}) => {
  const content = (
    <div className="space-y-1">
      <div className="font-medium text-white dark:text-gray-900">
        {title}
      </div>
      {description && (
        <div className="text-sm text-gray-300 dark:text-gray-700">
          {description}
        </div>
      )}
    </div>
  )

  return (
    <EnhancedTooltip
      content={content}
      side={side}
      align={align}
      className={className}
    >
      {children}
    </EnhancedTooltip>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }