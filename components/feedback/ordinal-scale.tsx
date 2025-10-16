'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Lightbulb, MessageCircle, Frown, Ghost } from 'lucide-react'

interface OrdinalScaleProps {
  value?: number
  onChange: (value: number) => void
  className?: string
}

const RATINGS = [
  {
    value: 5,
    label: 'Collaboration',
    description: 'We worked together on something meaningful',
    emoji: '🤝',
    icon: <CheckCircle className="h-6 w-6" />,
    color: 'bg-emerald-500 hover:bg-emerald-600',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20'
  },
  {
    value: 4,
    label: 'Insight',
    description: 'Great conversation with valuable insights',
    emoji: '💡',
    icon: <Lightbulb className="h-6 w-6" />,
    color: 'bg-blue-500 hover:bg-blue-600',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    value: 3,
    label: 'Good chat',
    description: 'Nice conversation, nothing special',
    emoji: '💬',
    icon: <MessageCircle className="h-6 w-6" />,
    color: 'bg-amber-500 hover:bg-amber-600',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20'
  },
  {
    value: 2,
    label: "Didn't click",
    description: 'Conversation was okay but no real connection',
    emoji: '😐',
    icon: <Frown className="h-6 w-6" />,
    color: 'bg-yellow-500 hover:bg-yellow-600',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
  },
  {
    value: 1,
    label: 'No response',
    description: 'They never responded to my message',
    emoji: '👻',
    icon: <Ghost className="h-6 w-6" />,
    color: 'bg-red-500 hover:bg-red-600',
    borderColor: 'border-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50 dark:bg-red-900/20'
  }
]

export function OrdinalScale({ value, onChange, className = '' }: OrdinalScaleProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          How did this connection go?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your feedback helps SAM learn and improve future matches
        </p>
      </div>

      <div className="space-y-3">
        {RATINGS.map((rating, index) => (
          <motion.button
            key={rating.value}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onChange(rating.value)}
            className={`
              w-full p-4 rounded-lg border-2 transition-all duration-200 text-left
              ${value === rating.value
                ? `${rating.borderColor} ${rating.bgColor}`
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
              }
            `}
          >
            <div className="flex items-center space-x-4">
              {/* Rating Number */}
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg
                ${value === rating.value ? rating.color : 'bg-gray-400'}
              `}>
                {rating.value}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <span className="text-2xl">{rating.emoji}</span>
                  <h4 className={`font-semibold ${value === rating.value ? rating.textColor : 'text-gray-900 dark:text-white'}`}>
                    {rating.label}
                  </h4>
                </div>
                <p className={`text-sm ${value === rating.value ? rating.textColor : 'text-gray-600 dark:text-gray-400'}`}>
                  {rating.description}
                </p>
              </div>

              {/* Selection Indicator */}
              {value === rating.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-emerald-600"
                >
                  {rating.icon}
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Additional Context */}
      {value && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Why this matters:</strong> Your feedback helps SAM understand what makes connections successful. 
            This information improves future matches for you and others in the ecosystem.
          </p>
        </motion.div>
      )}
    </div>
  )
}

// Compact version for use in smaller spaces
export function OrdinalScaleCompact({ value, onChange, className = '' }: OrdinalScaleProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          How did it go?
        </span>
        {value && (
          <span className="text-xs text-gray-500">
            {RATINGS.find(r => r.value === value)?.label}
          </span>
        )}
      </div>

      <div className="flex space-x-2">
        {RATINGS.map((rating) => (
          <button
            key={rating.value}
            onClick={() => onChange(rating.value)}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-200
              ${value === rating.value 
                ? rating.color 
                : 'bg-gray-400 hover:bg-gray-500'
              }
            `}
            title={rating.label}
          >
            {rating.value}
          </button>
        ))}
      </div>
    </div>
  )
}

// Horizontal version
export function OrdinalScaleHorizontal({ value, onChange, className = '' }: OrdinalScaleProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="text-center">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          Connection Quality
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Rate your experience with this match
        </p>
      </div>

      <div className="flex justify-between">
        {RATINGS.map((rating) => (
          <motion.button
            key={rating.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(rating.value)}
            className={`
              flex flex-col items-center space-y-2 p-3 rounded-lg transition-all duration-200
              ${value === rating.value
                ? `${rating.bgColor} ${rating.borderColor} border-2`
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }
            `}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
              ${value === rating.value ? rating.color : 'bg-gray-400'}
            `}>
              {rating.value}
            </div>
            <div className="text-center">
              <div className="text-lg">{rating.emoji}</div>
              <div className={`text-xs font-medium ${value === rating.value ? rating.textColor : 'text-gray-700 dark:text-gray-300'}`}>
                {rating.label}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
