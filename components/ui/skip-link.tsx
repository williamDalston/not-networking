'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SkipLinkProps {
  href?: string
  children: React.ReactNode
  className?: string
}

export const SkipToMainContent: React.FC<SkipLinkProps> = ({
  href = '#main-content',
  children = 'Skip to main content',
  className,
}) => {
  return (
    <a
      href={href}
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50',
        'px-4 py-2 bg-emerald-600 text-white rounded-md shadow-lg',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
        className
      )}
      onClick={(e) => {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' })
          target.focus()
        }
      }}
    >
      {children}
    </a>
  )
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  href,
  children,
  className,
}) => {
  return (
    <a
      href={href}
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50',
        'px-4 py-2 bg-emerald-600 text-white rounded-md shadow-lg',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
        className
      )}
    >
      {children}
    </a>
  )
}