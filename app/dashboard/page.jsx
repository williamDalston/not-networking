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
  const { addToast } = useToast()

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
          <h1 className="mb-2">
            Welcome back, {user?.user_metadata?.full_name || 'there'}! 👋
          </h1>
          <p className="text-lead text-gray-600 dark:text-gray-300">
            Here's what's happening in your professional ecosystem
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-6 card-hover group"
          >
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="ml-4">
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Connections</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalConnections}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6 card-hover group"
          >
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-sky-100 to-sky-200 dark:from-sky-900 dark:to-sky-800 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <Brain className="h-6 w-6 text-sky-600 dark:text-sky-400" />
              </div>
              <div className="ml-4">
                <p className="text-xs text-gray-600 dark:text-gray-400">AI Matches</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.aiMatches}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card p-6 card-hover group"
          >
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900 dark:to-violet-800 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <Calendar className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="ml-4">
                <p className="text-xs text-gray-600 dark:text-gray-400">Events</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.events}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card p-6 card-hover group"
          >
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-gold-100 to-gold-200 dark:from-gold-900 dark:to-gold-800 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <TrendingUp className="h-6 w-6 text-gold-600 dark:text-gold-400" />
              </div>
              <div className="ml-4">
                <p className="text-xs text-gray-600 dark:text-gray-400">Growth Score</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.growthScore}%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Tabs */}
        <div className="mb-8">
          <div className="glass-card p-2 rounded-xl">
            <nav className="flex space-x-2">
              {[
                { id: 'overview', label: 'Overview', icon: Target },
                { id: 'matches', label: 'Matches', icon: Users },
                { id: 'events', label: 'Events', icon: Calendar },
                { id: 'messages', label: 'Messages', icon: MessageCircle }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-4 rounded-lg font-medium text-xs flex items-center transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700'
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
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-6 card-hover"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Matches</h3>
                <button
                  onClick={generateNewMatches}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:scale-105 transition-transform"
                >
                  Generate New
                </button>
              </div>
              <div className="space-y-4">
                {matches.slice(0, 2).map((match) => {
                  const otherUser = match.user1_id === user.id ? match.user2 : match.user1
                  return (
                    <motion.div 
                      key={match.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg">
                          {otherUser?.full_name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{otherUser?.full_name || 'Unknown User'}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{otherUser?.email}</p>
                        <div className="flex items-center mt-1">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{Math.round(match.match_score * 100)}% match</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
                {matches.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No matches yet</p>
                    <button
                      onClick={generateNewMatches}
                      className="btn-primary text-sm"
                    >
                      Generate your first matches
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card p-6 card-hover"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Upcoming Events</h3>
              <div className="space-y-4">
                {events.slice(0, 3).map((event, index) => (
                  <motion.div 
                    key={event.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20 rounded-xl hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900 dark:to-violet-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <Calendar className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{new Date(event.start_time).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-300">{event.event_rsvps?.length || 0} attendees</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 dark:from-emerald-900 dark:to-emerald-800 dark:text-emerald-200">
                        {event.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
                {events.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900 dark:to-violet-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">No upcoming events</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'matches' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your AI Matches</h2>
              <button
                onClick={generateNewMatches}
                className="btn-gradient px-6 py-3"
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
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-12 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-full flex items-center justify-center mx-auto mb-6 animate-heartbeat">
                  <Brain className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">No matches yet</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                  Complete your profile to get personalized AI matches that will help you grow your professional network
                </p>
                <button
                  onClick={generateNewMatches}
                  className="btn-gradient px-8 py-3"
                >
                  Generate Matches
                </button>
              </motion.div>
            )}
          </motion.div>
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
    </DashboardLayout>
  )
}