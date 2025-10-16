'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Activity, Zap, Database, Shield } from 'lucide-react'
import { AISystemHealth, ValidationResult } from '@/lib/ai-validation'

export function AIHealthDashboard() {
  const [health, setHealth] = useState<AISystemHealth | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      runHealthCheck()
    }, 30000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  // Initial health check
  useEffect(() => {
    runHealthCheck()
  }, [])

  const runHealthCheck = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/ai-health')
      if (response.ok) {
        const data = await response.json()
        setHealth(data)
        setLastChecked(new Date())
      }
    } catch (error) {
      console.error('Health check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const runComponentTest = async (component: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/ai-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ component })
      })
      
      if (response.ok) {
        const data = await response.json()
        // Update the specific component results
        setHealth(prev => prev ? {
          ...prev,
          components: {
            ...prev.components,
            [component]: data.results
          }
        } : null)
      }
    } catch (error) {
      console.error('Component test failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200'
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTestIcon = (test: string) => {
    if (test.includes('embedding')) return <Zap className="h-4 w-4" />
    if (test.includes('matching')) return <Database className="h-4 w-4" />
    if (test.includes('error')) return <Shield className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  if (!health) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Loading AI system health...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            AI System Health
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time monitoring of SAM AI components
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="auto-refresh"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="auto-refresh" className="text-sm text-gray-600">
              Auto-refresh
            </label>
          </div>
          
          <button
            onClick={runHealthCheck}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Overall Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl border-2 ${getHealthColor(health.overall)}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getHealthIcon(health.overall)}
            <div>
              <h3 className="text-lg font-semibold">
                Overall System Status: {health.overall.toUpperCase()}
              </h3>
              <p className="text-sm opacity-75">
                Last checked: {lastChecked?.toLocaleTimeString() || 'Never'}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold">
              {Object.values(health.components).flat().filter(r => r.passed).length} / {Object.values(health.components).flat().length}
            </div>
            <div className="text-sm opacity-75">Tests Passing</div>
          </div>
        </div>
      </motion.div>

      {/* Recommendations */}
      {health.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
        >
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Recommendations
          </h4>
          <ul className="space-y-1">
            {health.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-blue-800 dark:text-blue-200">
                {rec}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Component Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(health.components).map(([component, results]) => {
          const passedTests = results.filter(r => r.passed).length
          const totalTests = results.length
          const status = passedTests === totalTests ? 'healthy' : passedTests > totalTests / 2 ? 'degraded' : 'critical'
          
          return (
            <motion.div
              key={component}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getTestIcon(component)}
                  <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                    {component}
                  </h3>
                </div>
                {getHealthIcon(status)}
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Tests Passing</span>
                  <span>{passedTests}/{totalTests}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${
                      status === 'healthy' ? 'bg-emerald-500' :
                      status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(passedTests / totalTests) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  />
                </div>
              </div>
              
              <button
                onClick={() => runComponentTest(component)}
                disabled={isLoading}
                className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test Component'}
              </button>
            </motion.div>
          )
        })}
      </div>

      {/* Detailed Test Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Detailed Test Results
        </h3>
        
        {Object.entries(health.components).map(([component, results]) => (
          <div key={component} className="glass-card p-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 capitalize">
              {component} Tests
            </h4>
            
            <div className="space-y-3">
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    result.passed 
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700'
                      : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {result.passed ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {result.test.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {result.message}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {result.duration}ms
                    </div>
                    {result.details && (
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {JSON.stringify(result.details).slice(0, 50)}...
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
