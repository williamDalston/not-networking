'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Users, MessageCircle, Star, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { useToast } from '@/components/ui/toast'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MatchDetailPage({ params }) {
  const [match, setMatch] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const router = useRouter()
  const { addToast, ToastContainer } = useToast()

  useEffect(() => {
    // Check authentication and load match data
    const loadMatchData = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push('/auth/signin')
          return
        }
        setUser(currentUser)

        // Load match details
        const matchResponse = await fetch(`/api/matches/${params.id}`)
        if (matchResponse.ok) {
          const matchData = await matchResponse.json()
          setMatch(matchData.match)
        } else {
          throw new Error('Match not found')
        }

      } catch (error) {
        console.error('Error loading match data:', error)
        addToast('Failed to load match details', 'error')
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadMatchData()
  }, [params.id, router, addToast])

  const handleFeedback = async (helpful) => {
    if (!user || !match) return
    
    setFeedbackLoading(true)
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId: match.id,
          userId: user.id,
          feedback: {
            helpful: helpful,
            text: helpful ? 'This match was helpful!' : 'This match was not helpful.',
            rating: helpful ? 5 : 1
          }
        })
      })

      if (response.ok) {
        addToast('Thank you for your feedback!', 'success')
      } else {
        throw new Error('Failed to submit feedback')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      addToast('Failed to submit feedback', 'error')
    } finally {
      setFeedbackLoading(false)
    }
  }

  const getOtherUser = () => {
    if (!match || !user) return null
    return match.user1_id === user.id ? match.user2 : match.user1
  }

  const getMatchScoreColor = (score) => {
    if (score >= 0.8) return 'text-green-600'
    if (score >= 0.6) return 'text-yellow-600'
    return 'text-orange-600'
  }

  const getMatchScoreLabel = (score) => {
    if (score >= 0.8) return 'Excellent Match'
    if (score >= 0.6) return 'Good Match'
    return 'Potential Match'
  }

  if (loading) {
    return (
      <DashboardLayout currentPath="/matches">
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

  if (!match) {
    return (
      <DashboardLayout currentPath="/matches">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Match Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            The match you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const otherUser = getOtherUser()
  const matchScore = Math.round(match.match_score * 100)

  return (
    <DashboardLayout currentPath="/matches">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Match with {otherUser?.full_name || 'Unknown User'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              AI-powered professional connection
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Match Overview */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Match Overview</CardTitle>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getMatchScoreColor(match.match_score)}`}>
                      {matchScore}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {getMatchScoreLabel(match.match_score)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        matchScore >= 80 ? 'bg-green-500' : 
                        matchScore >= 60 ? 'bg-yellow-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${matchScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {match.explanation || 'This match shows potential for meaningful professional connection based on complementary skills and shared values.'}
                </p>
              </CardContent>
            </Card>

            {/* Evidence */}
            {match.evidence && (
              <Card>
                <CardHeader>
                  <CardTitle>Why This Match?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {match.evidence.complementary_matches && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Complementary Skills</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Your strengths align with their areas for growth, creating mutual value.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {match.evidence.shared_goals && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Shared Goals</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            You both have similar professional objectives and can support each other.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {match.evidence.aligned_values && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Aligned Values</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Your core values align well, creating a strong foundation for collaboration.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {match.evidence.industry_overlap && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Industry Experience</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            You're both in related industries, opening opportunities for knowledge sharing.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Profile
                    </Button>
                    <Button variant="outline">
                      <Star className="h-4 w-4 mr-2" />
                      Save Match
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Other User Profile */}
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xl">
                      {otherUser?.full_name?.charAt(0) || '?'}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {otherUser?.full_name || 'Unknown User'}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {otherUser?.email}
                  </p>
                  
                  <Link href={`/profile/${otherUser?.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Full Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Feedback */}
            <Card>
              <CardHeader>
                <CardTitle>Was this match helpful?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() => handleFeedback(true)}
                    disabled={feedbackLoading}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Yes, helpful
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleFeedback(false)}
                    disabled={feedbackLoading}
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Not helpful
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                  Your feedback helps improve our matching algorithm
                </p>
              </CardContent>
            </Card>

            {/* Match Details */}
            <Card>
              <CardHeader>
                <CardTitle>Match Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Created</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(match.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Status</span>
                  <span className={`font-medium ${
                    match.status === 'accepted' ? 'text-green-600' :
                    match.status === 'declined' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Expires</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(match.expires_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <ToastContainer />
    </DashboardLayout>
  )
}
