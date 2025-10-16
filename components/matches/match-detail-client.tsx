'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, User, MapPin, Clock, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EvidenceTray } from './evidence-tray'
import { MatchNarrative } from './match-narrative'
import { ConfidenceBadge, ConfidenceProgress } from './confidence-badge'
import { ActionButtons, ActionButtonsMobile } from './action-buttons'

interface MatchDetailClientProps {
  matchId: string
}

interface MatchDetail {
  id: string
  match_user: {
    user_id: string
    display_name: string
    avatar_url?: string
    bio?: string
    work_on?: string
    progress_goal?: string
    strengths_text?: string
    needs_text?: string
    shared_values?: string[]
    value_creation_type?: string[]
    meaningful_progress_goals?: string[]
  }
  similarity_score: number
  match_type: 'need_strength' | 'goal_alignment' | 'values_alignment'
  features: any
  explanation: string
  status: string
  created_at: string
}

export function MatchDetailClient({ matchId }: MatchDetailClientProps) {
  const [match, setMatch] = useState<MatchDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDismissing, setIsDismissing] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    fetchMatchDetail()
  }, [matchId])

  const fetchMatchDetail = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/matches/${matchId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch match details')
      }
      
      const data = await response.json()
      setMatch(data.match)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (id: string) => {
    setIsConnecting(true)
    try {
      const response = await fetch(`/api/matches/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept' })
      })

      if (!response.ok) {
        throw new Error('Failed to connect')
      }

      // Redirect to dashboard or messaging
      router.push('/dashboard?connected=true')
    } catch (error) {
      console.error('Connection failed:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSave = async (id: string) => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/matches/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save' })
      })

      if (!response.ok) {
        throw new Error('Failed to save match')
      }

      // Show success message or update UI
      setMatch(prev => prev ? { ...prev, status: 'saved' } : null)
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDismiss = async (id: string) => {
    setIsDismissing(true)
    try {
      const response = await fetch(`/api/matches/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'decline' })
      })

      if (!response.ok) {
        throw new Error('Failed to dismiss match')
      }

      // Redirect back to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Dismiss failed:', error)
    } finally {
      setIsDismissing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading match details...</p>
        </div>
      </div>
    )
  }

  if (error || !match) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Match Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {error || 'This match could not be found or may have expired.'}
        </p>
        <Button onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    )
  }

  // Parse explanation if it's a string
  const explanation = typeof match.explanation === 'string' 
    ? JSON.parse(match.explanation) 
    : match.explanation

  // Generate evidence data
  const evidence = {
    your_need: "I need help with product strategy and user research", // This would come from user's profile
    their_strength: match.match_user.strengths_text || "Experienced in product development",
    shared_goal: match.match_user.progress_goal || "Building innovative products",
    shared_values: match.match_user.shared_values || ['Innovation', 'Collaboration'],
    connection_type: match.match_type
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Match Details
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Learn more about this potential connection
          </p>
        </div>

        <ConfidenceBadge score={match.similarity_score} />
      </div>

      {/* Match Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xl">
              {match.match_user.display_name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {match.match_user.display_name || 'Anonymous User'}
            </h2>
            
            {match.match_user.work_on && (
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {match.match_user.work_on}
              </p>
            )}

            {match.match_user.bio && (
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {match.match_user.bio}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Active today</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>In your network</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confidence Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ConfidenceProgress score={match.similarity_score} />
      </motion.div>

      {/* Evidence Tray */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <EvidenceTray
          evidence={evidence}
          explanation={explanation}
        />
      </motion.div>

      {/* Match Narrative */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <MatchNarrative
          narrative={explanation?.narrative || 'This is a great match based on your profiles.'}
          confidence={match.similarity_score}
          reasoning={explanation?.reasoning || [
            'Complementary skill sets',
            'Shared professional interests',
            'Similar career goals'
          ]}
          matchType={match.match_type}
        />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        {/* Desktop Actions */}
        <div className="hidden sm:block">
          <ActionButtons
            matchId={match.id}
            onConnect={handleConnect}
            onSave={handleSave}
            onDismiss={handleDismiss}
            isConnecting={isConnecting}
            isSaving={isSaving}
            isDismissing={isDismissing}
          />
        </div>

        {/* Mobile Actions */}
        <div className="sm:hidden">
          <ActionButtonsMobile
            matchId={match.id}
            onConnect={handleConnect}
            onSave={handleSave}
            onDismiss={handleDismiss}
            isConnecting={isConnecting}
            isSaving={isSaving}
            isDismissing={isDismissing}
          />
        </div>
      </motion.div>
    </div>
  )
}
