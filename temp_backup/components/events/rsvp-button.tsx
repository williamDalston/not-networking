'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Clock, X, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RSVPButtonProps {
  eventId: string
  isRSVPed?: boolean
  rsvpStatus?: 'attending' | 'maybe' | 'not_attending'
  onRSVP?: (eventId: string, status: 'attending' | 'maybe' | 'not_attending') => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function RSVPButton({
  eventId,
  isRSVPed = false,
  rsvpStatus,
  onRSVP,
  disabled = false,
  size = 'md',
  className = ''
}: RSVPButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1 text-xs'
      case 'lg':
        return 'px-6 py-3 text-base'
      default:
        return 'px-4 py-2 text-sm'
    }
  }

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case 'attending':
        return {
          label: 'Attending',
          icon: <Check className="h-4 w-4" />,
          color: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          borderColor: 'border-emerald-600'
        }
      case 'maybe':
        return {
          label: 'Maybe',
          icon: <Clock className="h-4 w-4" />,
          color: 'bg-amber-600 hover:bg-amber-700 text-white',
          borderColor: 'border-amber-600'
        }
      case 'not_attending':
        return {
          label: 'Not Attending',
          icon: <X className="h-4 w-4" />,
          color: 'bg-red-600 hover:bg-red-700 text-white',
          borderColor: 'border-red-600'
        }
      default:
        return {
          label: 'RSVP',
          icon: null,
          color: 'bg-gray-600 hover:bg-gray-700 text-white',
          borderColor: 'border-gray-600'
        }
    }
  }

  const handleRSVP = async (status: 'attending' | 'maybe' | 'not_attending') => {
    if (!onRSVP || isLoading) return

    setIsLoading(true)
    try {
      await onRSVP(eventId, status)
      setShowOptions(false)
    } catch (error) {
      console.error('RSVP failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const config = getStatusConfig(rsvpStatus)
  const sizeClasses = getSizeClasses(size)

  if (showOptions && !disabled) {
    return (
      <div className={`relative ${className}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-10 min-w-[140px]"
        >
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRSVP('attending')}
              disabled={isLoading}
              className="w-full justify-start text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            >
              <Check className="h-4 w-4 mr-2" />
              Attending
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRSVP('maybe')}
              disabled={isLoading}
              className="w-full justify-start text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
            >
              <Clock className="h-4 w-4 mr-2" />
              Maybe
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRSVP('not_attending')}
              disabled={isLoading}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <X className="h-4 w-4 mr-2" />
              Not Attending
            </Button>
          </div>
        </motion.div>
        
        <Button
          variant="outline"
          onClick={() => setShowOptions(false)}
          className={`${sizeClasses} ${config.borderColor} ${config.color.replace('bg-', 'border-').replace('hover:bg-', 'hover:border-')}`}
        >
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={() => setShowOptions(true)}
      disabled={disabled || isLoading}
      className={`${sizeClasses} ${config.color} ${className}`}
    >
      {isLoading ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {config.icon && <span className="mr-2">{config.icon}</span>}
          {config.label}
        </>
      )}
    </Button>
  )
}

// Simplified version for quick RSVP
export function QuickRSVPButton({
  eventId,
  isRSVPed = false,
  rsvpStatus,
  onRSVP,
  disabled = false,
  className = ''
}: RSVPButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleQuickRSVP = async () => {
    if (!onRSVP || isLoading) return

    setIsLoading(true)
    try {
      const status = rsvpStatus === 'attending' ? 'not_attending' : 'attending'
      await onRSVP(eventId, status)
    } catch (error) {
      console.error('RSVP failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonConfig = () => {
    if (rsvpStatus === 'attending') {
      return {
        label: 'Attending',
        icon: <Check className="h-4 w-4" />,
        color: 'bg-emerald-600 hover:bg-emerald-700 text-white'
      }
    }
    return {
      label: 'RSVP',
      icon: null,
      color: 'bg-gray-600 hover:bg-gray-700 text-white'
    }
  }

  const config = getButtonConfig()

  return (
    <Button
      onClick={handleQuickRSVP}
      disabled={disabled || isLoading}
      className={`px-4 py-2 text-sm ${config.color} ${className}`}
    >
      {isLoading ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {config.icon && <span className="mr-2">{config.icon}</span>}
          {config.label}
        </>
      )}
    </Button>
  )
}
