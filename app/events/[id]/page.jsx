'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, Users, Clock, ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { useToast } from '@/components/ui/toast'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function EventDetailPage({ params }) {
  const [event, setEvent] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rsvpLoading, setRsvpLoading] = useState(false)
  const router = useRouter()
  const { addToast } = useToast()

  useEffect(() => {
    // Check authentication and load event data
    const loadEventData = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push('/auth/signin')
          return
        }
        setUser(currentUser)

        // Load event details
        const eventResponse = await fetch(`/api/events/${params.id}`)
        if (eventResponse.ok) {
          const eventData = await eventResponse.json()
          setEvent(eventData.event)
        } else {
          throw new Error('Event not found')
        }

      } catch (error) {
        console.error('Error loading event data:', error)
        addToast('Failed to load event details', 'error')
        router.push('/events')
      } finally {
        setLoading(false)
      }
    }

    loadEventData()
  }, [params.id, router, addToast])

  const handleRSVP = async (status) => {
    if (!user || !event) return
    
    setRsvpLoading(true)
    try {
      const response = await fetch(`/api/events/${event.id}/rsvp`, {
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
        const existingRSVP = event.event_rsvps?.find(rsvp => rsvp.user_id === user.id)
        if (existingRSVP) {
          existingRSVP.status = status
        } else {
          event.event_rsvps = [...(event.event_rsvps || []), {
            user_id: user.id,
            status: status
          }]
        }
        setEvent({ ...event })
        addToast(`RSVP ${status} successfully!`, 'success')
      } else {
        throw new Error('Failed to RSVP')
      }
    } catch (error) {
      console.error('Error RSVPing to event:', error)
      addToast('Failed to RSVP to event', 'error')
    } finally {
      setRsvpLoading(false)
    }
  }

  const getUserRSVPStatus = () => {
    if (!user || !event) return null
    const rsvp = event.event_rsvps?.find(rsvp => rsvp.user_id === user.id)
    return rsvp?.status || null
  }

  const isUpcoming = event ? new Date(event.start_time) > new Date() : false
  const rsvpStatus = getUserRSVPStatus()

  if (loading) {
    return (
      <DashboardLayout currentPath="/events">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-64" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!event) {
    return (
      <DashboardLayout currentPath="/events">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Event Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPath="/events">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/events">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{event.title}</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {event.description || 'Join us for this professional event'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Calendar className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-sm">
                        {new Date(event.start_time).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Clock className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-sm">
                        {new Date(event.start_time).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {new Date(event.end_time).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <MapPin className="h-5 w-5 mr-3" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm">{event.location}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Users className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">Attendees</p>
                      <p className="text-sm">
                        {event.event_rsvps?.length || 0} confirmed
                        {event.max_attendees && ` / ${event.max_attendees} max`}
                      </p>
                    </div>
                  </div>
                </div>

                {event.virtual_link && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Virtual Event Link:
                    </p>
                    <a
                      href={event.virtual_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Join Virtual Event →
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Event Description */}
            {event.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About This Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {event.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* RSVP Card */}
            <Card>
              <CardHeader>
                <CardTitle>RSVP</CardTitle>
              </CardHeader>
              <CardContent>
                {isUpcoming ? (
                  <div className="space-y-3">
                    {rsvpStatus === 'yes' ? (
                      <div className="text-center">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                        <p className="font-medium text-green-600">You're attending!</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          We'll send you a reminder before the event.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          onClick={() => handleRSVP('no')}
                          disabled={rsvpLoading}
                        >
                          Change to Not Attending
                        </Button>
                      </div>
                    ) : rsvpStatus === 'no' ? (
                      <div className="text-center">
                        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                        <p className="font-medium text-red-600">Not attending</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          That's okay! Check out other events.
                        </p>
                        <Button
                          size="sm"
                          onClick={() => handleRSVP('yes')}
                          disabled={rsvpLoading}
                        >
                          Change to Attending
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          className="w-full"
                          onClick={() => handleRSVP('yes')}
                          disabled={rsvpLoading}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          I'll Attend
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleRSVP('no')}
                          disabled={rsvpLoading}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Can't Make It
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="font-medium text-gray-600 dark:text-gray-300">Event has passed</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      This event has already occurred.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Attendees */}
            <Card>
              <CardHeader>
                <CardTitle>Attendees ({event.event_rsvps?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {event.event_rsvps && event.event_rsvps.length > 0 ? (
                  <div className="space-y-2">
                    {event.event_rsvps.slice(0, 10).map((rsvp, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                            {rsvp.user?.full_name?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {rsvp.user?.full_name || 'Anonymous User'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {rsvp.status === 'yes' ? 'Attending' : 'Not attending'}
                          </p>
                        </div>
                      </div>
                    ))}
                    {event.event_rsvps.length > 10 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        +{event.event_rsvps.length - 10} more attendees
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    No attendees yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
    </DashboardLayout>
  )
}
