'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, Clock, ExternalLink, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RSVPButton } from './rsvp-button'

interface EventCardProps {
  event: {
    id: string
    title: string
    description: string
    start_time: string
    end_time?: string
    location: string
    location_type: 'in_person' | 'virtual' | 'hybrid'
    max_attendees?: number
    current_attendees: number
    event_type: 'networking' | 'workshop' | 'social' | 'learning'
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
    organizer: {
      name: string
      avatar_url?: string
    }
    is_rsvped?: boolean
    rsvp_status?: 'attending' | 'maybe' | 'not_attending'
  }
  onRSVP?: (eventId: string, status: 'attending' | 'maybe' | 'not_attending') => void
  onViewDetails?: (eventId: string) => void
  onCheckIn?: (eventId: string) => void
  className?: string
}

export function EventCard({ 
  event, 
  onRSVP, 
  onViewDetails, 
  onCheckIn, 
  className = '' 
}: EventCardProps) {
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'networking':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200'
      case 'workshop':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
      case 'social':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200'
      case 'learning':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200'
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'networking':
        return <Users className="h-4 w-4" />
      case 'workshop':
        return <ExternalLink className="h-4 w-4" />
      case 'social':
        return <Users className="h-4 w-4" />
      case 'learning':
        return <ExternalLink className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'text-emerald-600 dark:text-emerald-400'
      case 'ongoing':
        return 'text-blue-600 dark:text-blue-400'
      case 'completed':
        return 'text-gray-500 dark:text-gray-400'
      case 'cancelled':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    }
  }

  const { date, time } = formatEventDate(event.start_time)

  const isEventToday = () => {
    const today = new Date()
    const eventDate = new Date(event.start_time)
    return today.toDateString() === eventDate.toDateString()
  }

  const isEventOngoing = () => {
    const now = new Date()
    const startTime = new Date(event.start_time)
    const endTime = event.end_time ? new Date(event.end_time) : new Date(startTime.getTime() + 2 * 60 * 60 * 1000) // Default 2 hours
    
    return now >= startTime && now <= endTime
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.event_type)}`}>
              {getEventTypeIcon(event.event_type)}
              <span className="ml-1 capitalize">{event.event_type}</span>
            </span>
            <span className={`text-xs font-medium ${getStatusColor(event.status)}`}>
              {event.status === 'ongoing' ? 'Live Now' : 
               event.status === 'upcoming' && isEventToday() ? 'Today' : 
               event.status}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {event.title}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {event.description}
          </p>
        </div>

        {/* Organizer Avatar */}
        <div className="flex-shrink-0 ml-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-xs">
              {event.organizer.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="space-y-3 mb-4">
        {/* Date & Time */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4" />
          <span>{date} at {time}</span>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="h-4 w-4" />
          <span className="capitalize">
            {event.location_type === 'virtual' ? 'Virtual Event' : event.location}
          </span>
        </div>

        {/* Attendees */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Users className="h-4 w-4" />
          <span>
            {event.current_attendees} attending
            {event.max_attendees && ` / ${event.max_attendees} max`}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {isEventOngoing() && event.is_rsvped && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCheckIn?.(event.id)}
              className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            >
              <QrCode className="h-4 w-4 mr-1" />
              Check In
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(event.id)}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Details
          </Button>
        </div>

        <RSVPButton
          eventId={event.id}
          isRSVPed={event.is_rsvped}
          rsvpStatus={event.rsvp_status}
          onRSVP={onRSVP}
          disabled={event.status === 'completed' || event.status === 'cancelled'}
        />
      </div>
    </motion.div>
  )
}

// Compact version for lists
export function EventCardCompact({ 
  event, 
  onRSVP, 
  onViewDetails, 
  className = '' 
}: Omit<EventCardProps, 'onCheckIn'>) {
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    }
  }

  const { date, time } = formatEventDate(event.start_time)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow duration-200 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 dark:text-white truncate">
            {event.title}
          </h4>
          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
            <span>{date}</span>
            <span>{time}</span>
            <span className="capitalize">{event.location_type}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails?.(event.id)}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <RSVPButton
            eventId={event.id}
            isRSVPed={event.is_rsvped}
            rsvpStatus={event.rsvp_status}
            onRSVP={onRSVP}
            size="sm"
          />
        </div>
      </div>
    </motion.div>
  )
}
