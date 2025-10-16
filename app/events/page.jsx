'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, Users, Clock, Plus, Filter } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { useToast } from '@/components/ui/toast'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, upcoming, past
  const router = useRouter()
  const { addToast, ToastContainer } = useToast()

  useEffect(() => {
    // Check authentication and load events
    const loadEventsData = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push('/auth/signin')
          return
        }
        setUser(currentUser)

        // Load events
        const eventsResponse = await fetch('/api/events')
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json()
          setEvents(eventsData.events || [])
        }

      } catch (error) {
        console.error('Error loading events data:', error)
        addToast('Failed to load events data', 'error')
      } finally {
        setLoading(false)
      }
    }

    loadEventsData()
  }, [router, addToast])

  const handleRSVP = async (eventId, status) => {
    if (!user) return
    
    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          status: status
        })
      })

      if (response.ok) {
        // Update local state
        setEvents(prev => prev.map(event => {
          if (event.id === eventId) {
            const existingRSVP = event.event_rsvps?.find(rsvp => rsvp.user_id === user.id)
            if (existingRSVP) {
              existingRSVP.status = status
            } else {
              event.event_rsvps = [...(event.event_rsvps || []), {
                user_id: user.id,
                status: status
              }]
            }
          }
          return event
        }))
        addToast(`RSVP ${status} successfully!`, 'success')
      } else {
        throw new Error('Failed to RSVP')
      }
    } catch (error) {
      console.error('Error RSVPing to event:', error)
      addToast('Failed to RSVP to event', 'error')
    }
  }

  const filteredEvents = events.filter(event => {
    const now = new Date()
    const eventDate = new Date(event.start_time)
    
    switch (filter) {
      case 'upcoming':
        return eventDate > now
      case 'past':
        return eventDate <= now
      default:
        return true
    }
  })

  const getUserRSVPStatus = (event) => {
    if (!user) return null
    const rsvp = event.event_rsvps?.find(rsvp => rsvp.user_id === user.id)
    return rsvp?.status || null
  }

  if (loading) {
    return (
      <DashboardLayout currentPath="/events">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPath="/events">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Events</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Discover and join professional events in your ecosystem
            </p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Filters */}
        <div className="flex space-x-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All Events
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'default' : 'outline'}
            onClick={() => setFilter('upcoming')}
            size="sm"
          >
            Upcoming
          </Button>
          <Button
            variant={filter === 'past' ? 'default' : 'outline'}
            onClick={() => setFilter('past')}
            size="sm"
          >
            Past Events
          </Button>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const rsvpStatus = getUserRSVPStatus(event)
              const isUpcoming = new Date(event.start_time) > new Date()
              
              return (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(event.start_time).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Clock className="h-4 w-4 mr-2" />
                        {new Date(event.start_time).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {new Date(event.end_time).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <MapPin className="h-4 w-4 mr-2" />
                          {event.location}
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Users className="h-4 w-4 mr-2" />
                        {event.event_rsvps?.length || 0} attendees
                        {event.max_attendees && ` / ${event.max_attendees} max`}
                      </div>
                    </div>

                    {/* RSVP Actions */}
                    {isUpcoming && (
                      <div className="flex space-x-2">
                        {rsvpStatus === 'yes' ? (
                          <div className="flex-1 text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              ✓ Attending
                            </span>
                          </div>
                        ) : rsvpStatus === 'no' ? (
                          <div className="flex-1 text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                              Not Attending
                            </span>
                          </div>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => handleRSVP(event.id, 'yes')}
                            >
                              RSVP Yes
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleRSVP(event.id, 'no')}
                            >
                              Decline
                            </Button>
                          </>
                        )}
                      </div>
                    )}

                    {/* Event Details Link */}
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                      <Link
                        href={`/events/${event.id}`}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No events found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {filter === 'all' 
                ? 'There are no events available at the moment.'
                : `No ${filter} events found.`
              }
            </p>
            <Button
              onClick={() => setFilter('all')}
              variant="outline"
            >
              View All Events
            </Button>
          </div>
        )}
      </div>
      
      <ToastContainer />
    </DashboardLayout>
  )
}
