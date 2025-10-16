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
    <Card className="w-full max-w-md mx-auto hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-semibold text-lg">
              {otherUser?.full_name?.charAt(0) || '?'}
            </span>
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{otherUser?.full_name || 'Unknown User'}</CardTitle>
            <p className="text-sm text-gray-500">{otherUser?.email}</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-green-600">
              {Math.round(match.match_score * 100)}% match
            </div>
            <div className="text-xs text-gray-400">
              {formatRelativeTime(match.created_at)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
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
                  className="flex-1"
                >
                  {loading === 'decline' ? 'Declining...' : 'Skip'}
                </Button>
                <Button
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
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✓ Connected
                </span>
              </div>
            )}
            
            {isDeclined && (
              <div className="flex-1 text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  Skipped
                </span>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(match.id)}
              className="ml-2"
            >
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
