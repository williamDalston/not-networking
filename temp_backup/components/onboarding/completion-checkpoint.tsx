'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Clock, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface CompletionCheckpointProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
  onPause: () => void
  currentStep: number
  totalSteps: number
  timeSpent: number // in seconds
  engagementScore: number // 0-1
}

export function CompletionCheckpoint({
  isOpen,
  onClose,
  onContinue,
  onPause,
  currentStep,
  totalSteps,
  timeSpent,
  engagementScore
}: CompletionCheckpointProps) {
  const [selectedMood, setSelectedMood] = useState<string>('')

  const moodOptions = [
    { id: 'clarifying', label: 'Clarifying', emoji: '💡', description: 'This is helping me understand myself better' },
    { id: 'vulnerable', label: 'Vulnerable', emoji: '🫂', description: 'This feels a bit personal but important' },
    { id: 'exciting', emoji: '✨', label: 'Exciting', description: 'I love thinking about my goals and values' },
    { id: 'uncertain', emoji: '🤔', label: 'Uncertain', description: 'I\'m not sure about some of my answers' }
  ]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const getEngagementLevel = (score: number) => {
    if (score >= 0.8) return { level: 'High', color: 'text-emerald-600', description: 'You\'re really engaged!' }
    if (score >= 0.6) return { level: 'Medium', color: 'text-blue-600', description: 'You\'re doing well' }
    return { level: 'Low', color: 'text-yellow-600', description: 'Take your time' }
  }

  const engagement = getEngagementLevel(engagementScore)

  const handleContinue = () => {
    onContinue()
    onClose()
  }

  const handlePause = () => {
    onPause()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-md glass-card p-6">
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </motion.div>

                <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">
                  Great progress!
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  You've completed {currentStep} of {totalSteps} steps
                </p>
              </div>

              {/* Progress stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatTime(timeSpent)}
                  </div>
                  <div className="text-xs text-gray-500">Time spent</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className={`text-2xl font-bold ${engagement.color}`}>
                    {engagement.level}
                  </div>
                  <div className="text-xs text-gray-500">Engagement</div>
                </div>
              </div>

              {/* Mood check-in */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  How does this feel right now?
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(mood.id)}
                      className={`
                        p-3 rounded-lg border-2 text-left transition-all duration-200
                        ${selectedMood === mood.id
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                        }
                      `}
                    >
                      <div className="text-lg mb-1">{mood.emoji}</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {mood.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
                >
                  <span>Keep going</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  onClick={handlePause}
                  variant="outline"
                  className="w-full"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Take a break</span>
                </Button>
              </div>

              {/* Encouragement */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg"
              >
                <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                  {engagement.description} Your ecosystem is taking shape 🌱
                </p>
              </motion.div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
