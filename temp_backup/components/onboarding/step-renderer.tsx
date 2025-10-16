'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { OnboardingStep } from '@/lib/onboarding-engine'
import { TextInput } from './inputs/text-input'
import { ConfidenceInput } from './inputs/confidence-input'
import { MultiSelectInput } from './inputs/multi-select-input'
import { SliderInput } from './inputs/slider-input'
import { AudioInput } from './inputs/audio-input'
import { ArchetypeSelector } from './inputs/archetype-selector'

interface StepRendererProps {
  step: OnboardingStep
  onComplete: (value: any, confidence?: number) => void
  isLoading: boolean
  engagementScore: number
  userLocation?: string
}

export function StepRenderer({
  step,
  onComplete,
  isLoading,
  engagementScore,
  userLocation
}: StepRendererProps) {
  const [currentValue, setCurrentValue] = useState<any>(null)
  const [confidence, setConfidence] = useState<number | undefined>(undefined)
  const [showArchetypes, setShowArchetypes] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Reset state when step changes
  useEffect(() => {
    setCurrentValue(null)
    setConfidence(undefined)
    setShowArchetypes(false)
    setIsProcessing(false)
  }, [step.id])

  // Handle confidence-first flow
  useEffect(() => {
    if (step.type === 'confidence' && step.id.includes('strengths')) {
      // This is a confidence question before strengths input
      if (confidence !== undefined && confidence < 0.7) {
        setShowArchetypes(true)
      }
    }
  }, [confidence, step.id])

  const handleSubmit = async () => {
    if (isProcessing) return

    setIsProcessing(true)

    try {
      // If this is a confidence step, we need to get the actual value next
      if (step.type === 'confidence' && step.id.includes('strengths')) {
        // Don't complete yet, just set confidence and show archetypes
        return
      }

      // Validate required fields
      if (step.required && !currentValue) {
        // Show validation message
        return
      }

      // Process the value if needed
      let processedValue = currentValue

      // Special handling for different step types
      if (step.id === 'ecosystem_compact') {
        // Validate that all three checkboxes are selected
        if (!Array.isArray(currentValue) || currentValue.length < 3) {
          // Show validation message
          return
        }
      }

      if (step.id === 'human_detail' && typeof currentValue === 'string') {
        // Process audio transcription if needed
        if (currentValue.startsWith('audio:')) {
          // Handle audio processing
          processedValue = await processAudioTranscription(currentValue)
        }
      }

      await onComplete(processedValue, confidence)
    } catch (error) {
      console.error('Error processing step:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const processAudioTranscription = async (audioData: string): Promise<string> => {
    try {
      const response = await fetch('/api/onboarding/transcribe-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioData })
      })

      if (!response.ok) {
        throw new Error('Transcription failed')
      }

      const data = await response.json()
      return data.transcription
    } catch (error) {
      console.error('Audio transcription error:', error)
      return 'Audio transcription failed'
    }
  }

  const getStepTitle = () => {
    if (step.id === 'welcome') {
      return 'Welcome to The Ecosystem 🌱'
    }
    return step.title
  }

  const getStepDescription = () => {
    if (step.id === 'welcome') {
      return 'This isn\'t a social network. It\'s a mirror for your growth.'
    }
    return step.description
  }

  const renderInput = () => {
    // Handle confidence-first flow for strengths
    if (step.id === 'strengths_confidence') {
      return (
        <ConfidenceInput
          value={confidence}
          onChange={setConfidence}
          question="How clear are you on your strengths right now?"
          description="This helps SAM know how to support you."
        />
      )
    }

    // Show archetypes if confidence is low
    if (showArchetypes && step.id === 'strengths_text') {
      return (
        <ArchetypeSelector
          type="strengths"
          onSelect={(value) => {
            setCurrentValue(value)
            setShowArchetypes(false)
          }}
          onCustomInput={() => setShowArchetypes(false)}
        />
      )
    }

    // Render based on step type
    switch (step.type) {
      case 'text':
        return (
          <TextInput
            value={currentValue}
            onChange={setCurrentValue}
            placeholder={getPlaceholder(step.id)}
            maxLength={getMaxLength(step.id)}
            multiline={step.id === 'human_detail'}
          />
        )

      case 'confidence':
        return (
          <ConfidenceInput
            value={confidence}
            onChange={setConfidence}
            question={step.title}
            description={step.description}
          />
        )

      case 'multiselect':
        return (
          <MultiSelectInput
            value={currentValue}
            onChange={setCurrentValue}
            options={getOptions(step.id)}
            maxSelections={getMaxSelections(step.id)}
          />
        )

      case 'slider':
        return (
          <SliderInput
            value={currentValue}
            onChange={setCurrentValue}
            min={0}
            max={1}
            step={0.1}
            label={step.title}
            description={step.description}
          />
        )

      case 'audio':
        return (
          <AudioInput
            value={currentValue}
            onChange={setCurrentValue}
            placeholder="Tell me something that makes you smile..."
            maxDuration={20}
          />
        )

      default:
        return null
    }
  }

  const getPlaceholder = (stepId: string): string => {
    const placeholders: Record<string, string> = {
      current_work: 'Launching a local arts platform...',
      progress_vision: 'I want to build a community of creators who...',
      strengths_text: 'I\'m really good at bringing people together...',
      needs_text: 'I could use help with technical implementation...',
      human_detail: 'I always take photos of clouds before big decisions...'
    }
    return placeholders[stepId] || 'Share your thoughts...'
  }

  const getMaxLength = (stepId: string): number => {
    const maxLengths: Record<string, number> = {
      current_work: 280,
      progress_vision: 500,
      strengths_text: 300,
      needs_text: 300,
      human_detail: 1000
    }
    return maxLengths[stepId] || 500
  }

  const getOptions = (stepId: string): Array<{ value: string; label: string; description?: string }> => {
    const optionsMap: Record<string, Array<{ value: string; label: string; description?: string }>> = {
      ecosystem_compact: [
        { value: 'curiosity', label: 'I\'ll approach others with openness' },
        { value: 'generosity', label: 'I\'ll ask for what I need clearly and kindly' },
        { value: 'feedback', label: 'I\'ll offer help when I can' }
      ],
      value_creation: [
        { value: 'builder', label: 'Builder', description: 'I make things' },
        { value: 'connector', label: 'Connector', description: 'I bring people together' },
        { value: 'synthesizer', label: 'Synthesizer', description: 'I distill ideas' },
        { value: 'nurturer', label: 'Nurturer', description: 'I develop others' },
        { value: 'explorer', label: 'Explorer', description: 'I find what\'s next' }
      ],
      progress_type: [
        { value: 'launching', label: 'Launching something new' },
        { value: 'momentum', label: 'Building steady momentum' },
        { value: 'learning', label: 'Deep learning or mastery' },
        { value: 'network', label: 'Expanding network intentionally' },
        { value: 'supporting', label: 'Supporting others\' growth' }
      ],
      shared_values: [
        { value: 'curiosity', label: 'Curiosity' },
        { value: 'kindness', label: 'Kindness' },
        { value: 'integrity', label: 'Integrity' },
        { value: 'ambition', label: 'Ambition' },
        { value: 'playfulness', label: 'Playfulness' },
        { value: 'depth', label: 'Depth' },
        { value: 'honesty', label: 'Honesty' },
        { value: 'balance', label: 'Balance' }
      ],
      connection_preferences: [
        { value: 'one_on_one', label: 'One-on-one conversations' },
        { value: 'small_groups', label: 'Small group discussions' },
        { value: 'casual_events', label: 'Casual events' },
        { value: 'online_collab', label: 'Online collaboration' },
        { value: 'projects', label: 'Project-based work' }
      ],
      time_commitment: [
        { value: 'monthly', label: 'One deep conversation per month' },
        { value: 'weekly', label: 'A few short check-ins each week' },
        { value: 'active', label: 'Active collaboration on projects' },
        { value: 'exploring', label: 'I\'m exploring — let\'s see what fits' }
      ]
    }
    return optionsMap[stepId] || []
  }

  const getMaxSelections = (stepId: string): number => {
    const maxSelections: Record<string, number> = {
      ecosystem_compact: 3, // Must select all three
      value_creation: 3,
      progress_type: 3,
      shared_values: 5,
      connection_preferences: 5,
      time_commitment: 1
    }
    return maxSelections[stepId] || 1
  }

  const canSubmit = () => {
    if (step.required && !currentValue) return false
    if (step.id === 'ecosystem_compact' && (!Array.isArray(currentValue) || currentValue.length < 3)) return false
    if (step.type === 'confidence' && confidence === undefined) return false
    return true
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-4">
          {getStepTitle()}
        </h1>
        {getStepDescription() && (
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            {getStepDescription()}
          </p>
        )}
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 mb-8"
      >
        {renderInput()}
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
      >
        <button
          onClick={handleSubmit}
          disabled={!canSubmit() || isProcessing}
          className="ecosystem-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Processing...</span>
            </div>
          ) : (
            'Continue'
          )}
        </button>

        {!step.required && (
          <button
            onClick={() => onComplete(null)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Skip for now
          </button>
        )}
      </motion.div>

      {/* Engagement Indicator */}
      {engagementScore > 0.7 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            🌱 Your thoughtful responses help SAM create better matches
          </p>
        </motion.div>
      )}
    </div>
  )
}
