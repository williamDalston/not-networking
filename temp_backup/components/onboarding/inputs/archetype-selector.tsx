'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ArchetypeSelectorProps {
  type: 'strengths' | 'needs'
  onSelect: (value: string) => void
  onCustomInput: () => void
}

const STRENGTH_ARCHETYPES = [
  {
    id: 'facilitator',
    title: 'Facilitator',
    description: 'I help groups work together effectively',
    icon: '👥',
    examples: ['Workshop design', 'Meeting facilitation', 'Conflict resolution']
  },
  {
    id: 'builder',
    title: 'Builder',
    description: 'I create and make things',
    icon: '🔨',
    examples: ['Product development', 'Technical implementation', 'Design systems']
  },
  {
    id: 'connector',
    title: 'Connector',
    description: 'I bring people and ideas together',
    icon: '🔗',
    examples: ['Network building', 'Partnership development', 'Community organizing']
  },
  {
    id: 'synthesizer',
    title: 'Synthesizer',
    description: 'I distill complex information',
    icon: '🧠',
    examples: ['Research analysis', 'Strategy development', 'Knowledge synthesis']
  },
  {
    id: 'nurturer',
    title: 'Nurturer',
    description: 'I help others grow and develop',
    icon: '🌱',
    examples: ['Mentoring', 'Coaching', 'Team development']
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'I find new opportunities and paths',
    icon: '🗺️',
    examples: ['Market research', 'Trend analysis', 'Innovation scouting']
  },
  {
    id: 'communicator',
    title: 'Communicator',
    description: 'I make ideas clear and compelling',
    icon: '📢',
    examples: ['Storytelling', 'Writing', 'Presentation design']
  },
  {
    id: 'problem_solver',
    title: 'Problem Solver',
    description: 'I tackle complex challenges',
    icon: '🧩',
    examples: ['Debugging', 'Process optimization', 'Crisis management']
  }
]

const NEED_ARCHETYPES = [
  {
    id: 'technical',
    title: 'Technical Support',
    description: 'Help with implementation and technical challenges',
    icon: '⚙️',
    examples: ['Code review', 'System architecture', 'Technical mentorship']
  },
  {
    id: 'business',
    title: 'Business Strategy',
    description: 'Guidance on business and growth strategy',
    icon: '📈',
    examples: ['Go-to-market strategy', 'Revenue models', 'Market analysis']
  },
  {
    id: 'creative',
    title: 'Creative Direction',
    description: 'Support with creative and design decisions',
    icon: '🎨',
    examples: ['Brand identity', 'Visual design', 'Content strategy']
  },
  {
    id: 'leadership',
    title: 'Leadership Development',
    description: 'Mentorship in leadership and management',
    icon: '👑',
    examples: ['Team management', 'Decision making', 'Vision setting']
  },
  {
    id: 'product',
    title: 'Product Development',
    description: 'Feedback on product and feature development',
    icon: '🚀',
    examples: ['User research', 'Feature prioritization', 'Product strategy']
  },
  {
    id: 'connections',
    title: 'Network & Connections',
    description: 'Access to people and opportunities',
    icon: '🤝',
    examples: ['Industry connections', 'Partnership opportunities', 'Talent sourcing']
  },
  {
    id: 'clarity',
    title: 'Clarity & Focus',
    description: 'Help finding direction and priorities',
    icon: '🎯',
    examples: ['Goal setting', 'Priority alignment', 'Decision making']
  },
  {
    id: 'accountability',
    title: 'Accountability',
    description: 'Support staying on track with goals',
    icon: '📋',
    examples: ['Progress tracking', 'Habit formation', 'Goal achievement']
  }
]

export function ArchetypeSelector({ type, onSelect, onCustomInput }: ArchetypeSelectorProps) {
  const [selectedArchetypes, setSelectedArchetypes] = useState<string[]>([])
  const [showExamples, setShowExamples] = useState<string | null>(null)

  const archetypes = type === 'strengths' ? STRENGTH_ARCHETYPES : NEED_ARCHETYPES

  const handleArchetypeSelect = (archetypeId: string) => {
    if (selectedArchetypes.includes(archetypeId)) {
      setSelectedArchetypes(prev => prev.filter(id => id !== archetypeId))
    } else {
      setSelectedArchetypes(prev => [...prev, archetypeId])
    }
  }

  const handleContinue = () => {
    if (selectedArchetypes.length > 0) {
      // Generate text from selected archetypes
      const selectedArchetypeData = archetypes.filter(a => selectedArchetypes.includes(a.id))
      const text = selectedArchetypeData.map(a => a.title.toLowerCase()).join(', ')
      onSelect(text)
    }
  }

  const canContinue = selectedArchetypes.length > 0

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Let's explore together — select what feels right
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Choose 1-3 that resonate with you, or write your own.
        </p>
      </div>

      {/* Archetype Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {archetypes.map((archetype) => (
          <motion.div
            key={archetype.id}
            className={`relative cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 ${
              selectedArchetypes.includes(archetype.id)
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600'
            }`}
            onClick={() => handleArchetypeSelect(archetype.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Selection Indicator */}
            {selectedArchetypes.includes(archetype.id) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
              >
                <span className="text-white text-sm">✓</span>
              </motion.div>
            )}

            {/* Archetype Content */}
            <div className="text-center">
              <div className="text-2xl mb-2">{archetype.icon}</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                {archetype.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {archetype.description}
              </p>
              
              {/* Examples Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowExamples(showExamples === archetype.id ? null : archetype.id)
                }}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {showExamples === archetype.id ? 'Hide examples' : 'Show examples'}
              </button>
            </div>

            {/* Examples Dropdown */}
            <AnimatePresence>
              {showExamples === archetype.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600"
                >
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    {archetype.examples.map((example, index) => (
                      <div key={index}>• {example}</div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Selected Count */}
      {selectedArchetypes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            {selectedArchetypes.length} selected • Choose 1-3 total
          </p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="ecosystem-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue with selected
        </button>

        <button
          onClick={onCustomInput}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Or write my own →
        </button>
      </div>

      {/* Encouraging Message */}
      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-blue-700 dark:text-blue-300 text-sm">
          💡 These archetypes help SAM understand your unique strengths and needs. 
          There's no wrong answer — choose what feels most true to you.
        </p>
      </div>
    </div>
  )
}
