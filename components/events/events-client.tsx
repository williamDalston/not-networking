'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Plus, Filter, Search, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EventCard, EventCardCompact } from './event-card'
import { QRCheckIn } from './qr-checkin'

interface EventsClientProps {
  className?: string
}

interface Event {
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

export function EventsClient({ className = '' }: EventsClientProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'my_events'>('upcoming')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showQRCheckIn, setShowQRCheckIn] = useState(false)
  const [selectedEventForCheckIn, setSelectedEventForCheckIn] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, selectedFilter])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/events')
      
      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }
      
      const data = await response.json()
      setEvents(data.events || [])
    } catch (error) {
      console.error('Error fetching events:', error)
      setError(error instanceof Error ? error.message : 'Failed to load events')
      
      // Fallback to sample data
      setEvents(generateSampleEvents())
    } finally {
      setLoading(false)
    }
  }

  const generateSampleEvents = (): Event[] => {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    return [
      {
        id: '1',
        title: 'Ecosystem Mixer: Tech & Design',
        description: 'Join us for an evening of networking with fellow tech and design professionals. Food and drinks provided.',
        start_time: tomorrow.toISOString(),
        end_time: new Date(tomorrow.getTime() + 3 * 60 * 60 * 1000).toISOString(),
        location: 'WeWork SOMA, San Francisco',
        location_type: 'in_person',
        max_attendees: 50,
        current_attendees: 23,
        event_type: 'networking',
        status: 'upcoming',
        organizer: {
          name: 'Sarah Chen',
          avatar_url: undefined
        },
        is_rsvped: true,
        rsvp_status: 'attending'
      },
      {
        id: '2',
        title: 'Building Better Products Workshop',
        description: 'Learn user-centered design principles and product strategy from industry experts.',
        start_time: new Date(nextWeek.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(nextWeek.getTime() + 5 * 60 * 60 * 1000).toISOString(),
        location: 'Virtual Event',
        location_type: 'virtual',
        max_attendees: 100,
        current_attendees: 67,
        event_type: 'workshop',
        status: 'upcoming',
        organizer: {
          name: 'David Park',
          avatar_url: undefined
        },
        is_rsvped: false
      },
      {
        id: '3',
        title: 'Coffee Chat: Startup Founders',
        description: 'Casual coffee meetup for startup founders to share experiences and connect.',
        start_time: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
        location: 'Blue Bottle Coffee, Mission District',
        location_type: 'in_person',
        max_attendees: 20,
        current_attendees: 15,
        event_type: 'social',
        status: 'ongoing',
        organizer: {
          name: 'Maria Rodriguez',
          avatar_url: undefined
        },
        is_rsvped: true,
        rsvp_status: 'attending'
      },
      {
        id: '4',
        title: 'AI & Machine Learning Panel',
        description: 'Discussion on the latest trends in AI and ML with industry leaders.',
        start_time: new Date(nextWeek.getTime() + 6 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(nextWeek.getTime() + 8 * 60 * 60 * 1000).toISOString(),
        location: 'Virtual Event',
        location_type: 'virtual',
        max_attendees: 200,
        current_attendees: 134,
        event_type: 'learning',
        status: 'upcoming',
        organizer: {
          name: 'Alex Chen',
          avatar_url: undefined
        },
        is_rsvped: false
      }
    ]
  }

  const filterEvents = () => {
    let filtered = events

    // Apply status filter
    if (selectedFilter === 'upcoming') {
      filtered = filtered.filter(event => 
        event.status === 'upcoming' || event.status === 'ongoing'
      )
    } else if (selectedFilter === 'my_events') {
      filtered = filtered.filter(event => event.is_rsvped)
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredEvents(filtered)
  }

  const handleRSVP = async (eventId: string, status: 'attending' | 'maybe' | 'not_attending') => {
    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (!response.ok) {
        throw new Error('Failed to update RSVP')
      }

      // Update local state
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { 
              ...event, 
              is_rsvped: status !== 'not_attending',
              rsvp_status: status 
            }
          : event
      ))
    } catch (error) {
      console.error('RSVP failed:', error)
    }
  }

  const handleCheckIn = async (eventId: string, attendeeId?: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendeeId })
      })

      if (!response.ok) {
        throw new Error('Failed to check in')
      }

      // Update local state
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { 
              ...event, 
              current_attendees: event.current_attendees + 1 
            }
          : event
      ))
    } catch (error) {
      console.error('Check-in failed:', error)
      throw error
    }
  }

  const openCheckIn = (eventId: string) => {
    setSelectedEventForCheckIn(eventId)
    setShowQRCheckIn(true)
  }

  const closeCheckIn = () => {
    setShowQRCheckIn(false)
    setSelectedEventForCheckIn(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Events
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connect with the community through events and meetups
          </p>
        </div>

        <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800">
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="flex space-x-2">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="upcoming">Upcoming</option>
            <option value="my_events">My Events</option>
            <option value="all">All Events</option>
          </select>

          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="px-3"
          >
            {viewMode === 'grid' ? 'List' : 'Grid'}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredEvents.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">My RSVPs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {events.filter(e => e.is_rsvped).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredEvents.filter(e => {
                  const eventDate = new Date(e.start_time)
                  const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                  return eventDate <= weekFromNow
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Attendees</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredEvents.reduce((sum, event) => sum + event.current_attendees, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No events found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'No events match your current filters.'}
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create First Event
          </Button>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredEvents.map((event) => (
            viewMode === 'grid' ? (
              <EventCard
                key={event.id}
                event={event}
                onRSVP={handleRSVP}
                onViewDetails={(id) => console.log('View details:', id)}
                onCheckIn={openCheckIn}
              />
            ) : (
              <EventCardCompact
                key={event.id}
                event={event}
                onRSVP={handleRSVP}
                onViewDetails={(id) => console.log('View details:', id)}
              />
            )
          ))}
        </div>
      )}

      {/* QR Check-In Modal */}
      {showQRCheckIn && selectedEventForCheckIn && (
        <QRCheckIn
          eventId={selectedEventForCheckIn}
          isOpen={showQRCheckIn}
          onClose={closeCheckIn}
          onCheckIn={handleCheckIn}
        />
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4"
        >
          <p className="text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> {error} Showing sample data for demonstration.
          </p>
        </motion.div>
      )}
    </div>
  )
}
