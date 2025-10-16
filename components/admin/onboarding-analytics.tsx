'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Clock, TrendingUp, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

interface OnboardingMetrics {
  totalUsers: number
  completedUsers: number
  completionRate: number
  averageTime: number
  flowDistribution: {
    reflective: number
    essential: number
    adaptive: number
  }
  stepCompletion: Array<{
    step: string
    completionRate: number
    averageTime: number
  }>
  engagementLevels: {
    high: number
    medium: number
    low: number
  }
}

export function OnboardingAnalytics() {
  const [metrics, setMetrics] = useState<OnboardingMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d')

  useEffect(() => {
    fetchMetrics()
  }, [timeRange])

  const fetchMetrics = async () => {
    setIsLoading(true)
    try {
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data for demonstration
      setMetrics({
        totalUsers: 127,
        completedUsers: 98,
        completionRate: 77.2,
        averageTime: 1240, // seconds
        flowDistribution: {
          reflective: 23,
          essential: 45,
          adaptive: 59
        },
        stepCompletion: [
          { step: 'welcome', completionRate: 100, averageTime: 30 },
          { step: 'current_work', completionRate: 95, averageTime: 120 },
          { step: 'work_confidence', completionRate: 94, averageTime: 45 },
          { step: 'strengths_confidence', completionRate: 92, averageTime: 35 },
          { step: 'strengths_text', completionRate: 89, averageTime: 180 },
          { step: 'needs_text', completionRate: 87, averageTime: 165 },
          { step: 'progress_type', completionRate: 85, averageTime: 120 },
          { step: 'shared_values', completionRate: 83, averageTime: 90 },
          { step: 'time_commitment', completionRate: 81, averageTime: 60 },
          { step: 'completion_checkpoint', completionRate: 77, averageTime: 60 }
        ],
        engagementLevels: {
          high: 34,
          medium: 48,
          low: 18
        }
      })
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Loading onboarding analytics...</p>
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-gray-600">Failed to load analytics data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {(['24h', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics.totalUsers}
              </p>
            </div>
            <Users className="h-8 w-8 text-emerald-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics.completionRate.toFixed(1)}%
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.floor(metrics.averageTime / 60)}m
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Engagement</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round((metrics.engagementLevels.high / metrics.totalUsers) * 100)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-gold-500" />
          </div>
        </motion.div>
      </div>

      {/* Flow Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Flow Distribution
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(metrics.flowDistribution).map(([flow, count]) => (
            <div key={flow} className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {count}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {flow}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Step Completion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Step Completion Rates
        </h3>
        <div className="space-y-3">
          {metrics.stepCompletion.map((step, index) => (
            <div key={step.step} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {step.step.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {step.completionRate}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.floor(step.averageTime / 60)}m avg
                  </div>
                </div>
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      step.completionRate >= 90 ? 'bg-emerald-500' :
                      step.completionRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${step.completionRate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Engagement Levels */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          User Engagement Levels
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(metrics.engagementLevels).map(([level, count]) => {
            const percentage = Math.round((count / metrics.totalUsers) * 100)
            const color = level === 'high' ? 'emerald' : level === 'medium' ? 'yellow' : 'red'
            
            return (
              <div key={level} className="text-center">
                <div className={`text-2xl font-bold text-${color}-600`}>
                  {percentage}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {level} engagement
                </div>
                <div className="text-xs text-gray-500">
                  {count} users
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
