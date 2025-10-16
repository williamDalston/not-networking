'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OrdinalScale } from './ordinal-scale'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  matchId: string
  matchUser: {
    name: string
    avatar?: string
  }
  onSubmit: (feedback: {
    rating: number
    outcome: string
    feedbackText?: string
  }) => Promise<void>
}

export function FeedbackModal({ 
  isOpen, 
  onClose, 
  matchId, 
  matchUser, 
  onSubmit 
}: FeedbackModalProps) {
  const [rating, setRating] = useState<number | undefined>()
  const [feedbackText, setFeedbackText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const getOutcomeFromRating = (rating: number): string => {
    switch (rating) {
      case 5: return 'collaboration'
      case 4: return 'insight'
      case 3: return 'good_chat'
      case 2: return 'didnt_click'
      case 1: return 'no_response'
      default: return 'good_chat'
    }
  }

  const handleSubmit = async () => {
    if (!rating) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        rating,
        outcome: getOutcomeFromRating(rating),
        feedbackText: feedbackText.trim() || undefined
      })
      setIsSubmitted(true)
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose()
        // Reset state
        setRating(undefined)
        setFeedbackText('')
        setIsSubmitted(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (isSubmitting) return
    onClose()
    // Reset state
    setRating(undefined)
    setFeedbackText('')
    setIsSubmitted(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {matchUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    How did it go with {matchUser.name}?
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your feedback helps improve future matches
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Thank you for your feedback!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    This helps SAM improve future matches for everyone.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {/* Rating Scale */}
                  <OrdinalScale
                    value={rating}
                    onChange={setRating}
                  />

                  {/* Optional Feedback Text */}
                  {rating && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Additional feedback (optional)
                        </label>
                        <textarea
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="Share any specific details about your interaction..."
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          rows={3}
                          maxLength={500}
                        />
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">
                            This feedback is anonymous and helps improve the matching algorithm.
                          </p>
                          <span className="text-xs text-gray-500">
                            {feedbackText.length}/500
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Privacy Note */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
                      🔒 Privacy Protected
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Your feedback is completely anonymous. The person you connected with won't see your specific rating or comments.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {!isSubmitted && (
              <div className="flex space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Skip for now
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!rating || isSubmitting}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Simplified version for quick feedback
export function QuickFeedbackModal({ 
  isOpen, 
  onClose, 
  matchUser, 
  onSubmit 
}: Omit<FeedbackModalProps, 'matchId'>) {
  const [rating, setRating] = useState<number | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!rating) return

    setIsSubmitting(true)
    try {
      const outcome = rating === 5 ? 'collaboration' : 
                     rating === 4 ? 'insight' : 
                     rating === 3 ? 'good_chat' : 
                     rating === 2 ? 'didnt_click' : 'no_response'

      await onSubmit({
        rating,
        outcome,
      })
      onClose()
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Quick feedback for {matchUser.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                How did your interaction go?
              </p>
            </div>

            <OrdinalScale
              value={rating}
              onChange={setRating}
              className="mb-6"
            />

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Skip
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!rating || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
