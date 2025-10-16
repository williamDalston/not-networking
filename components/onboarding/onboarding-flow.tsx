'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { OnboardingStep, UserResponse, OnboardingState } from '@/lib/onboarding-engine'
import { StepRenderer } from './step-renderer'
import { ProgressIndicator } from './progress-indicator'
import { SocialProofBanner } from './social-proof-banner'
import { EngagementTracker } from './engagement-tracker'
import { CompletionCheckpoint } from './completion-checkpoint'
import { OnboardingWelcome } from './onboarding-welcome'
import { HelpTooltip } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { fadeIn, slideUp } from '@/lib/animations'

interface OnboardingFlowProps {
  userId: string
  userLocation?: string
  timezone?: string
}

export function OnboardingFlow({ userId, userLocation, timezone }: OnboardingFlowProps) {
  const router = useRouter()
  const [showWelcome, setShowWelcome] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<UserResponse[]>([])
  const [currentStepData, setCurrentStepData] = useState<OnboardingStep | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [engagementScore, setEngagementScore] = useState(0)
  const [socialProof, setSocialProof] = useState<string | null>(null)
  const [flowType, setFlowType] = useState<'reflective' | 'essential' | 'adaptive'>('adaptive')
  const [progressSaved, setProgressSaved] = useState(false)
  const [stepPreview, setStepPreview] = useState<string | null>(null)
  
  // Step timing tracking
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now())
  const [pausedTime, setPausedTime] = useState<number>(0)

  // Load initial step
  useEffect(() => {
    loadNextStep()
  }, [currentStep, responses])

  // Track engagement and generate social proof
  useEffect(() => {
    if (responses.length > 0) {
      updateEngagementScore()
      generateSocialProofForCurrentStep()
    }
  }, [responses])

  // Auto-save progress every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (responses.length > 0) {
        saveProgress()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [responses])

  const loadNextStep = useCallback(async () => {
    try {
      const response = await fetch('/api/onboarding/next-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          currentStep,
          responses,
          userLocation,
          timezone
        })
      })

      if (!response.ok) {
        throw new Error('Failed to load next step')
      }

      const data = await response.json()
      setCurrentStepData(data.step)
      setFlowType(data.flowType)
      
      // Reset step timing
      setStepStartTime(Date.now())
      setPausedTime(0)
    } catch (error) {
      console.error('Error loading next step:', error)
      // Fallback to essential flow
      setFlowType('essential')
    }
  }, [userId, currentStep, responses, userLocation, timezone])

  const handleStepComplete = useCallback(async (value: any, confidence?: number) => {
    const timeSpent = (Date.now() - stepStartTime - pausedTime) / 1000
    
    // Determine engagement level for this response
    const engagement = determineEngagementLevel(timeSpent, value, confidence)
    
    const response: UserResponse = {
      stepId: currentStepData!.id,
      value,
      timeSpent,
      confidence,
      engagement
    }

    const newResponses = [...responses, response]
    setResponses(newResponses)

    // Save progress
    await saveProgress(newResponses)

    // Check if this is a completion checkpoint
    if (currentStepData!.type === 'checkpoint') {
      const shouldContinue = await handleCompletionCheckpoint(value)
      if (!shouldContinue) {
        return // User chose to pause
      }
    }

    // Move to next step
    setCurrentStep(prev => prev + 1)
  }, [currentStepData, responses, stepStartTime, pausedTime])

  const saveProgress = useCallback(async (responsesToSave = responses) => {
    try {
      await fetch('/api/onboarding/save-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          responses: responsesToSave,
          currentStep
        })
      })
      
      setProgressSaved(true)
      toast.success('Progress saved', 'Your answers are automatically saved as you go')
      
      // Hide the saved indicator after 3 seconds
      setTimeout(() => setProgressSaved(false), 3000)
    } catch (error) {
      console.error('Error saving progress:', error)
      toast.error('Save failed', 'Your progress will be saved automatically')
    }
  }, [userId, responses, currentStep])

  const updateEngagementScore = useCallback(() => {
    const totalTime = responses.reduce((sum, r) => sum + r.timeSpent, 0)
    const avgTime = totalTime / responses.length
    const avgLength = responses.reduce((sum, r) => {
      const length = typeof r.value === 'string' ? r.value.length : 0
      return sum + length
    }, 0) / responses.length

    const score = (avgTime / 120) * 0.5 + (avgLength / 100) * 0.5
    setEngagementScore(Math.min(1, score))
  }, [responses])

  const generateSocialProofForCurrentStep = useCallback(async () => {
    if (!currentStepData) return

    try {
      const response = await fetch('/api/onboarding/social-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepId: currentStepData.id,
          userLocation
        })
      })

      if (response.ok) {
        const data = await response.json()
        setSocialProof(data.message)
      }
    } catch (error) {
      console.error('Error generating social proof:', error)
    }
  }, [currentStepData, userLocation])

  const handleCompletionCheckpoint = async (value: any): Promise<boolean> => {
    // Show completion options
    if (value === 'continue_later') {
      // Send user to dashboard with incomplete profile
      router.push('/dashboard?onboarding=paused')
      return false
    }
    return true // Continue with onboarding
  }

  const determineEngagementLevel = (
    timeSpent: number,
    value: any,
    confidence?: number
  ): 'low' | 'medium' | 'high' => {
    const expectedTime = currentStepData?.estimatedTime || 60
    const timeRatio = timeSpent / expectedTime
    
    const valueLength = typeof value === 'string' ? value.length : 0
    const lengthScore = Math.min(1, valueLength / 100)
    
    const confidenceScore = confidence || 0.5
    
    const overallScore = (timeRatio * 0.4) + (lengthScore * 0.4) + (confidenceScore * 0.2)
    
    if (overallScore > 0.7) return 'high'
    if (overallScore > 0.4) return 'medium'
    return 'low'
  }

  const handlePause = useCallback(() => {
    setPausedTime(prev => prev + (Date.now() - stepStartTime))
  }, [stepStartTime])

  const handleResume = useCallback(() => {
    setStepStartTime(Date.now())
  }, [])

  // Loading state
  if (!currentStepData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-gold-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-emerald-500 to-gold-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Preparing your discovery journey...</p>
        </motion.div>
      </div>
    )
  }

  const handleSkip = useCallback(() => {
    // Save current progress and redirect to dashboard
    saveProgress()
    router.push('/dashboard')
  }, [saveProgress, router])

  const handleStartOnboarding = useCallback(() => {
    setShowWelcome(false)
  }, [])

  const getStepPreview = useCallback(async (stepId: string) => {
    try {
      const response = await fetch('/api/onboarding/step-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId })
      })
      
      if (response.ok) {
        const data = await response.json()
        return data.preview
      }
    } catch (error) {
      console.error('Error getting step preview:', error)
    }
    return null
  }, [])

  const handleStepHover = useCallback(async () => {
    if (currentStepData?.id && !stepPreview) {
      const preview = await getStepPreview(currentStepData.id)
      setStepPreview(preview)
    }
  }, [currentStepData?.id, stepPreview, getStepPreview])

  // Show welcome screen first
  if (showWelcome) {
    return (
      <OnboardingWelcome 
        onStart={handleStartOnboarding}
        onSkip={handleSkip}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gold-50 dark:from-gray-900 dark:to-gray-800">
      {/* Progress Indicator */}
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={getTotalStepsForFlow(flowType)}
        flowType={flowType}
        engagementScore={engagementScore}
      />

      {/* Progress Saved Indicator */}
      {progressSaved && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          ✓ Progress saved
        </motion.div>
      )}

      {/* Social Proof Banner */}
      {socialProof && (
        <SocialProofBanner message={socialProof} />
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <EngagementTracker
              stepId={currentStepData.id}
              startTime={stepStartTime}
              onPause={handlePause}
              onResume={handleResume}
            />

            <StepRenderer
              step={currentStepData}
              onComplete={handleStepComplete}
              isLoading={isLoading}
              engagementScore={engagementScore}
              userLocation={userLocation}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Completion Checkpoint Modal */}
      {currentStepData.type === 'checkpoint' && (
        <CompletionCheckpoint
          onContinue={handleStepComplete}
          onPause={() => router.push('/dashboard?onboarding=paused')}
          progress={responses.length / getTotalStepsForFlow(flowType)}
        />
      )}
    </div>
  )
}

function getTotalStepsForFlow(flowType: string): number {
  switch (flowType) {
    case 'reflective': return 17
    case 'essential': return 10
    case 'adaptive': return 12
    default: return 10
  }
}
