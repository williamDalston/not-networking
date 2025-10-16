'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface SliderInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  description?: string
  unit?: string
  showValue?: boolean
  showLabels?: boolean
  leftLabel?: string
  rightLabel?: string
  required?: boolean
  onAutoSave?: (value: number) => void
  className?: string
  color?: 'emerald' | 'blue' | 'gold' | 'purple'
}

export function SliderInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  description,
  unit = '',
  showValue = true,
  showLabels = true,
  leftLabel,
  rightLabel,
  required = false,
  onAutoSave,
  className = "",
  color = 'emerald'
}: SliderInputProps) {
  const [isValid, setIsValid] = useState(true)
  const [isDragging, setIsDragging] = useState(false)

  // Validation
  useEffect(() => {
    setIsValid(value >= min && value <= max)
  }, [value, min, max])

  // Auto-save
  useEffect(() => {
    if (onAutoSave && isValid) {
      const timeoutId = setTimeout(() => {
        onAutoSave(value)
      }, 500) // Save after 500ms of no interaction
      return () => clearTimeout(timeoutId)
    }
  }, [value, onAutoSave, isValid])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    onChange(newValue)
  }

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)

  const percentage = ((value - min) / (max - min)) * 100

  const colorClasses = {
    emerald: {
      track: 'bg-emerald-200 dark:bg-emerald-800',
      thumb: 'bg-emerald-600 hover:bg-emerald-700',
      ring: 'ring-emerald-500',
      text: 'text-emerald-600'
    },
    blue: {
      track: 'bg-blue-200 dark:bg-blue-800',
      thumb: 'bg-blue-600 hover:bg-blue-700',
      ring: 'ring-blue-500',
      text: 'text-blue-600'
    },
    gold: {
      track: 'bg-yellow-200 dark:bg-yellow-800',
      thumb: 'bg-yellow-600 hover:bg-yellow-700',
      ring: 'ring-yellow-500',
      text: 'text-yellow-600'
    },
    purple: {
      track: 'bg-purple-200 dark:bg-purple-800',
      thumb: 'bg-purple-600 hover:bg-purple-700',
      ring: 'ring-purple-500',
      text: 'text-purple-600'
    }
  }

  const currentColor = colorClasses[color]

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      )}

      {/* Value display */}
      {showValue && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: isDragging ? 1.1 : 1 }}
          className="text-center"
        >
          <span className={`
            text-3xl font-bold transition-colors duration-200
            ${currentColor.text}
          `}>
            {value}{unit}
          </span>
        </motion.div>
      )}

      {/* Slider container */}
      <div className="px-2">
        <div className="relative">
          {/* Track */}
          <div className={`
            h-2 rounded-full transition-colors duration-200
            ${currentColor.track}
          `}>
            {/* Progress fill */}
            <motion.div
              className={`
                h-full rounded-full transition-all duration-200
                ${currentColor.thumb.replace('hover:bg-', 'bg-')}
              `}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>

          {/* Slider input */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className={`
              absolute inset-0 w-full h-2 bg-transparent cursor-pointer appearance-none
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200
              [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2
              [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:dark:border-gray-800
              [&::-webkit-slider-thumb]:${currentColor.thumb.replace('hover:bg-', 'bg-')}
              [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:focus:scale-110
              [&::-webkit-slider-thumb]:focus:${currentColor.ring} [&::-webkit-slider-thumb]:focus:ring-4
              
              [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:${currentColor.thumb.replace('hover:bg-', 'bg-')}
              [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:transition-all
              
              [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full
              [&::-moz-range-track]:${currentColor.track}
              
              focus:outline-none focus:${currentColor.ring} focus:ring-4 focus:ring-opacity-20
            `}
          />
        </div>

        {/* Labels */}
        {showLabels && (leftLabel || rightLabel) && (
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
            <span>{leftLabel}</span>
            <span>{rightLabel}</span>
          </div>
        )}
      </div>

      {/* Min/Max values */}
      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>

      {/* Validation message */}
      {!isValid && required && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500"
        >
          Value must be between {min} and {max}
        </motion.div>
      )}
    </div>
  )
}
