'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface EngagementTrackerProps {
  stepId: string
  startTime: number
  onPause: () => void
  onResume: () => void
}

export function EngagementTracker({
  stepId,
  startTime,
  onPause,
  onResume
}: EngagementTrackerProps) {
  const [isPaused, setIsPaused] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityRef = useRef<number>(Date.now())

  // Track time spent
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeSpent((Date.now() - startTime) / 1000)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [startTime, isPaused])

  // Detect inactivity
  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now()
      setIsVisible(true)
    }

    const checkInactivity = () => {
      const timeSinceActivity = Date.now() - lastActivityRef.current
      
      // If inactive for more than 2 minutes, show pause suggestion
      if (timeSinceActivity > 120000 && !isPaused) {
        setIsVisible(false)
      }
    }

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    const inactivityInterval = setInterval(checkInactivity, 30000) // Check every 30 seconds

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
      clearInterval(inactivityInterval)
    }
  }, [isPaused])

  const handlePause = () => {
    setIsPaused(true)
    onPause()
  }

  const handleResume = () => {
    setIsPaused(false)
    onResume()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Don't show for very short steps
  if (timeSpent < 30) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-[200px]">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isPaused ? 'Paused' : 'Time spent'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            {formatTime(timeSpent)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mb-3">
          <motion.div
            className="h-1 bg-gradient-to-r from-emerald-500 to-gold-500 rounded-full"
            style={{ width: `${Math.min(100, (timeSpent / 300) * 100)}%` }} // 5 minutes max
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2">
          {isPaused ? (
            <button
              onClick={handleResume}
              className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              Resume
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Pause
            </button>
          )}

          {timeSpent > 180 && !isPaused && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setIsVisible(false)}
              className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              Hide
            </motion.button>
          )}
        </div>

        {/* Encouraging message for long engagement */}
        {timeSpent > 120 && !isPaused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 text-center"
          >
            🌱 Taking your time helps SAM understand you better
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
