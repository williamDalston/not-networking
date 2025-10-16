'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatRelativeTime } from '@/lib/utils'

export default function MatchCard({ match, onAccept, onDecline, onViewDetails }) {
  const [loading, setLoading] = useState('')

  const otherUser = match.user1_id === match.currentUserId ? match.user2 : match.user1
  const isAccepted = match.status === 'accepted'
  const isDeclined = match.status === 'declined'

  const handleAction = async (action) => {
    setLoading(action)
    try {
      if (action === 'accept') {
        await onAccept(match.id)
      } else if (action === 'decline') {
        await onDecline(match.id)
      }
    } finally {
      setLoading('')
    }
  }

  return (
    <Card variant="glass" className="w-full max-w-md mx-auto card-hover group relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg">
              {otherUser?.full_name?.charAt(0) || '?'}
            </span>
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{otherUser?.full_name || 'Unknown User'}</CardTitle>
            <p className="text-sm text-gray-500">{otherUser?.email}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end mb-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
              <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {Math.round(match.match_score * 100)}% match
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {formatRelativeTime(match.created_at)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 relative z-10">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Why this match?</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {match.explanation || 'This match shows potential for meaningful professional connection.'}
            </p>
          </div>

          {match.evidence && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Evidence</h4>
              <div className="space-y-1">
                {match.evidence.complementary_matches && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Complementary skills and needs
                  </div>
                )}
                {match.evidence.shared_goals && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    Shared professional goals
                  </div>
                )}
                {match.evidence.aligned_values && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    Aligned values and principles
                  </div>
                )}
                {match.evidence.industry_overlap && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                    Related industry experience
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex space-x-2 pt-2">
            {!isAccepted && !isDeclined && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction('decline')}
                  disabled={loading === 'decline'}
                  className="flex-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {loading === 'decline' ? 'Declining...' : 'Skip'}
                </Button>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => handleAction('accept')}
                  disabled={loading === 'accept'}
                  className="flex-1"
                >
                  {loading === 'accept' ? 'Accepting...' : 'Connect'}
                </Button>
              </>
            )}
            
            {isAccepted && (
              <div className="flex-1 text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 dark:from-emerald-900 dark:to-emerald-800 dark:text-emerald-200">
                  ✓ Connected
                </span>
              </div>
            )}
            
            {isDeclined && (
              <div className="flex-1 text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 dark:from-gray-700 dark:to-gray-600 dark:text-gray-200">
                  Skipped
                </span>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(match.id)}
              className="ml-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
