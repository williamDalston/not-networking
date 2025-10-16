'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface ConfidenceInputProps {
  value?: number
  onChange: (value: number) => void
  question: string
  description?: string
}

export function ConfidenceInput({ value, onChange, question, description }: ConfidenceInputProps) {
  const [localValue, setLocalValue] = useState(value || 0.5)

  const handleChange = (newValue: number) => {
    setLocalValue(newValue)
    onChange(newValue)
  }

  const getConfidenceLabel = (val: number) => {
    if (val < 0.2) return 'Not sure at all'
    if (val < 0.4) return 'Somewhat unclear'
    if (val < 0.6) return 'Moderately clear'
    if (val < 0.8) return 'Pretty clear'
    return 'Very clear'
  }

  const getConfidenceColor = (val: number) => {
    if (val < 0.3) return 'text-red-500'
    if (val < 0.6) return 'text-yellow-500'
    return 'text-emerald-500'
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {question}
        </h3>
        {description && (
          <p className="text-gray-600 dark:text-gray-300">
            {description}
          </p>
        )}
      </div>

      {/* Confidence Slider */}
      <div className="px-4">
        <div className="relative">
          {/* Slider Track */}
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full relative">
            <motion.div
              className="h-2 bg-gradient-to-r from-red-400 via-yellow-400 to-emerald-500 rounded-full"
              style={{ width: `${localValue * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>

          {/* Slider Handle */}
          <motion.div
            className="absolute top-1/2 w-6 h-6 bg-white dark:bg-gray-800 border-2 border-emerald-500 rounded-full shadow-lg cursor-pointer transform -translate-y-1/2"
            style={{ left: `calc(${localValue * 100}% - 12px)` }}
            drag="x"
            dragConstraints={{ left: -12, right: 12 }}
            dragElastic={0.2}
            onDrag={(_, info) => {
              const containerWidth = 300 // Approximate container width
              const newValue = Math.max(0, Math.min(1, (info.point.x - 12) / (containerWidth - 24)))
              handleChange(newValue)
            }}
            whileDrag={{ scale: 1.1 }}
            whileHover={{ scale: 1.05 }}
          />

          {/* Slider Input (hidden, for accessibility) */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={localValue}
            onChange={(e) => handleChange(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Value Display */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            0%
          </span>
          <motion.span
            className={`text-lg font-semibold ${getConfidenceColor(localValue)}`}
            key={localValue}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {Math.round(localValue * 100)}%
          </motion.span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            100%
          </span>
        </div>

        {/* Confidence Label */}
        <motion.div
          className="text-center mt-3"
          key={localValue}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className={`font-medium ${getConfidenceColor(localValue)}`}>
            {getConfidenceLabel(localValue)}
          </p>
        </motion.div>
      </div>

      {/* Confidence Indicators */}
      <div className="flex justify-center space-x-8 text-sm">
        <div className="text-center">
          <div className="w-3 h-3 bg-red-400 rounded-full mx-auto mb-1" />
          <span className="text-gray-600 dark:text-gray-400">Unclear</span>
        </div>
        <div className="text-center">
          <div className="w-3 h-3 bg-yellow-400 rounded-full mx-auto mb-1" />
          <span className="text-gray-600 dark:text-gray-400">Moderate</span>
        </div>
        <div className="text-center">
          <div className="w-3 h-3 bg-emerald-400 rounded-full mx-auto mb-1" />
          <span className="text-gray-600 dark:text-gray-400">Clear</span>
        </div>
      </div>

      {/* Encouraging Message */}
      {localValue < 0.5 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
        >
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            💡 That's totally okay! SAM will help you explore and discover your strengths together.
          </p>
        </motion.div>
      )}

      {localValue > 0.7 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg"
        >
          <p className="text-emerald-700 dark:text-emerald-300 text-sm">
            🌟 Great! Your clarity will help SAM create more targeted matches.
          </p>
        </motion.div>
      )}
    </div>
  )
}
