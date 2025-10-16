'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Users, Brain, TrendingUp, Calendar, Activity, RefreshCw, AlertCircle } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { useToast } from '@/components/ui/toast'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminAnalyticsPage() {
  const [healthData, setHealthData] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [runningMatching, setRunningMatching] = useState(false)
  const router = useRouter()
  const { addToast, ToastContainer } = useToast()

  useEffect(() => {
    // Check authentication and load admin data
    const loadAdminData = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push('/auth/signin')
          return
        }
        
        // Check if user is admin (you might want to add proper admin role checking)
        setUser(currentUser)

        // Load health metrics
        const healthResponse = await fetch('/api/admin/ai-health')
        if (healthResponse.ok) {
          const healthData = await healthResponse.json()
          setHealthData(healthData.health)
        }

      } catch (error) {
        console.error('Error loading admin data:', error)
        addToast('Failed to load admin data', 'error')
      } finally {
        setLoading(false)
      }
    }

    loadAdminData()
  }, [router, addToast])

  const runMatchingPipeline = async () => {
    setRunningMatching(true)
    try {
      const response = await fetch('/api/admin/run-matching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const result = await response.json()
        addToast(`Matching pipeline completed! Generated ${result.summary.totalMatchesGenerated} matches.`, 'success')
        
        // Refresh health data
        const healthResponse = await fetch('/api/admin/ai-health')
        if (healthResponse.ok) {
          const healthData = await healthResponse.json()
          setHealthData(healthData.health)
        }
      } else {
        throw new Error('Failed to run matching pipeline')
      }
    } catch (error) {
      console.error('Error running matching pipeline:', error)
      addToast('Failed to run matching pipeline', 'error')
    } finally {
      setRunningMatching(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout currentPath="/admin/analytics">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-64" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
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
    <DashboardLayout currentPath="/admin/analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Analytics</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                System health and performance metrics
              </p>
            </div>
          </div>
          
          <Button
            onClick={runMatchingPipeline}
            disabled={runningMatching}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${runningMatching ? 'animate-spin' : ''}`} />
            {runningMatching ? 'Running...' : 'Run Matching Pipeline'}
          </Button>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                System Status
              </CardTitle>
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                healthData?.status === 'healthy' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {healthData?.status === 'healthy' ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Healthy
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Issues Detected
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Last updated: {healthData?.timestamp ? new Date(healthData.timestamp).toLocaleString() : 'Never'}
            </p>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {healthData?.metrics?.totalUsers || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                  <Brain className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Matches</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {healthData?.metrics?.totalMatches || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Events</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {healthData?.metrics?.totalEvents || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Helpful Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {healthData?.metrics?.helpfulRate || 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Engagement */}
          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Onboarding Completion</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {healthData?.metrics?.onboardingCompletionRate || 0}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${healthData?.metrics?.onboardingCompletionRate || 0}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Active Profiles</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {healthData?.metrics?.totalProfiles || 0}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Feedback Responses</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {healthData?.metrics?.totalFeedback || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Matches</CardTitle>
            </CardHeader>
            <CardContent>
              {healthData?.recentMatches && healthData.recentMatches.length > 0 ? (
                <div className="space-y-3">
                  {healthData.recentMatches.slice(0, 5).map((match, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                            {Math.round(match.match_score * 100)}%
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Match #{match.id.slice(0, 8)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(match.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        match.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        match.status === 'declined' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {match.status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No recent matches</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Health Details */}
        <Card>
          <CardHeader>
            <CardTitle>System Health Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {healthData?.metrics?.totalUsers || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Registered Users</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {healthData?.metrics?.totalProfiles || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Completed Profiles</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {healthData?.metrics?.totalMatches || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Generated Matches</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ToastContainer />
    </DashboardLayout>
  )
}
