'use client'

import { motion } from 'framer-motion'

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  flowType: 'reflective' | 'essential' | 'adaptive'
  engagementScore: number
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  flowType,
  engagementScore
}: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100
  const stepsRemaining = totalSteps - currentStep
  const estimatedTimeRemaining = stepsRemaining * 2 // Rough estimate: 2 minutes per step

  const getFlowDescription = () => {
    switch (flowType) {
      case 'reflective':
        return 'Deep Discovery'
      case 'essential':
        return 'Quick Setup'
      case 'adaptive':
        return 'Guided Journey'
      default:
        return 'Discovery'
    }
  }

  const getEncouragingMessage = () => {
    if (progress < 25) {
      return 'You\'re just getting started 🌱'
    } else if (progress < 50) {
      return 'You\'re doing beautifully ✨'
    } else if (progress < 75) {
      return 'Almost there! 🌟'
    } else {
      return 'Final touches... 🎯'
    }
  }

  return (
    <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Flow Type & Progress */}
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {getFlowDescription()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-500">
              {currentStep} of {totalSteps}
            </div>
          </div>

          {/* Center: Progress Bar */}
          <div className="flex-1 mx-6 max-w-md">
            <div className="relative">
              {/* Background */}
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                {/* Progress Fill */}
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-gold-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
                
                {/* Engagement Glow */}
                {engagementScore > 0.7 && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-gold-400 rounded-full opacity-30"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>

              {/* Progress Percentage */}
              <motion.div
                className="absolute -top-6 left-0 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {Math.round(progress)}%
              </motion.div>
            </div>
          </div>

          {/* Right: Time & Encouragement */}
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-500">
              ~{estimatedTimeRemaining} min left
            </div>
            <motion.div
              className="text-xs text-emerald-600 dark:text-emerald-400 font-medium"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {getEncouragingMessage()}
            </motion.div>
          </div>
        </div>

        {/* Engagement Indicator */}
        {engagementScore > 0.7 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-2 text-center"
          >
            <div className="inline-flex items-center space-x-2 text-sm text-emerald-600 dark:text-emerald-400">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>Thoughtful responses detected</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
