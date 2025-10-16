'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, Brain, Target, Zap, Shield, TrendingUp, Calendar, MessageCircle, Settings } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { useToast } from '@/components/ui/toast'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import MatchCard from '@/components/dashboard/match-card'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState(null)
  const [matches, setMatches] = useState([])
  const [events, setEvents] = useState([])
  const [stats, setStats] = useState({
    totalConnections: 0,
    aiMatches: 0,
    events: 0,
    growthScore: 0
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { addToast, ToastContainer } = useToast()

  useEffect(() => {
    // Check authentication and load data
    const loadDashboardData = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push('/auth/signin')
          return
        }
        setUser(currentUser)

        // Load matches
        const matchesResponse = await fetch(`/api/matches?userId=${currentUser.id}`)
        if (matchesResponse.ok) {
          const matchesData = await matchesResponse.json()
          setMatches(matchesData.matches || [])
        }

        // Load events
        const eventsResponse = await fetch('/api/events')
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json()
          setEvents(eventsData.events || [])
        }

        // Update stats
        setStats({
          totalConnections: matches.length,
          aiMatches: matches.length,
          events: events.length,
          growthScore: 85 // This would be calculated from user activity
        })

      } catch (error) {
        console.error('Error loading dashboard data:', error)
        addToast('Failed to load dashboard data', 'error')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [router, addToast])

  const handleAcceptMatch = async (matchId) => {
    try {
      const response = await fetch(`/api/matches/${matchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          status: 'accepted'
        })
      })

      if (response.ok) {
        setMatches(prev => prev.map(match => 
          match.id === matchId ? { ...match, status: 'accepted' } : match
        ))
        addToast('Match accepted!', 'success')
      } else {
        throw new Error('Failed to accept match')
      }
    } catch (error) {
      console.error('Error accepting match:', error)
      addToast('Failed to accept match', 'error')
    }
  }

  const handleDeclineMatch = async (matchId) => {
    try {
      const response = await fetch(`/api/matches/${matchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          status: 'declined'
        })
      })

      if (response.ok) {
        setMatches(prev => prev.map(match => 
          match.id === matchId ? { ...match, status: 'declined' } : match
        ))
        addToast('Match declined', 'info')
      } else {
        throw new Error('Failed to decline match')
      }
    } catch (error) {
      console.error('Error declining match:', error)
      addToast('Failed to decline match', 'error')
    }
  }

  const handleViewMatchDetails = (matchId) => {
    router.push(`/matches/${matchId}`)
  }

  const generateNewMatches = async () => {
    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          limit: 3
        })
      })

      if (response.ok) {
        const result = await response.json()
        setMatches(prev => [...result.matches, ...prev])
        addToast('New matches generated!', 'success')
      } else {
        throw new Error('Failed to generate matches')
      }
    } catch (error) {
      console.error('Error generating matches:', error)
      addToast('Failed to generate new matches', 'error')
    }
  }

  if (loading) {
    return (
      <DashboardLayout currentPath="/dashboard">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPath="/dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.user_metadata?.full_name || 'there'}! 👋
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Here's what's happening in your professional ecosystem
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Connections</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalConnections}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Matches</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.aiMatches}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Events</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.events}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
            <div className="flex items-center">
              <div className="p-3 bg-gold-100 dark:bg-gold-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-gold-600 dark:text-gold-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Growth Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.growthScore}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: Target },
                { id: 'matches', label: 'Matches', icon: Users },
                { id: 'events', label: 'Events', icon: Calendar },
                { id: 'messages', label: 'Messages', icon: MessageCircle }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Matches */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Matches</h3>
                <button
                  onClick={generateNewMatches}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Generate New
                </button>
              </div>
              <div className="space-y-4">
                {matches.slice(0, 2).map((match) => {
                  const otherUser = match.user1_id === user.id ? match.user2 : match.user1
                  return (
                    <div key={match.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          {otherUser?.full_name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{otherUser?.full_name || 'Unknown User'}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{otherUser?.email}</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">{Math.round(match.match_score * 100)}% match</p>
                      </div>
                    </div>
                  )
                })}
                {matches.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No matches yet</p>
                    <button
                      onClick={generateNewMatches}
                      className="mt-2 text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Generate your first matches
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {events.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{new Date(event.start_time).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-300">{event.event_rsvps?.length || 0} attendees</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                        {event.status}
                      </span>
                    </div>
                  </div>
                ))}
                {events.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No upcoming events</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your AI Matches</h2>
              <button
                onClick={generateNewMatches}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Generate New Matches
              </button>
            </div>
            
            {matches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={{
                      ...match,
                      currentUserId: user.id
                    }}
                    onAccept={handleAcceptMatch}
                    onDecline={handleDeclineMatch}
                    onViewDetails={handleViewMatchDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 text-center">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No matches yet</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Complete your profile to get personalized AI matches
                </p>
                <button
                  onClick={generateNewMatches}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Generate Matches
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Events</h2>
              <Link
                href="/events"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                View All Events
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{new Date(event.start_time).toLocaleDateString()}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{event.event_rsvps?.length || 0} attendees</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h2>
            <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No messages yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Start connecting with your matches to begin conversations
              </p>
              <button
                onClick={() => setActiveTab('matches')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Browse Matches
              </button>
            </div>
          </div>
        )}
      </div>
      
      <ToastContainer />
    </DashboardLayout>
  )
}