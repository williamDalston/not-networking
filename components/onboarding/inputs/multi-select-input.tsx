'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus } from 'lucide-react'

interface MultiSelectOption {
  id: string
  label: string
  description?: string
  color?: string
}

interface MultiSelectInputProps {
  value: string[]
  onChange: (value: string[]) => void
  options: MultiSelectOption[]
  maxSelections?: number
  minSelections?: number
  required?: boolean
  label?: string
  description?: string
  allowCustom?: boolean
  placeholder?: string
  onAutoSave?: (value: string[]) => void
  className?: string
}

export function MultiSelectInput({
  value,
  onChange,
  options,
  maxSelections = 5,
  minSelections = 1,
  required = false,
  label,
  description,
  allowCustom = false,
  placeholder = "Select options...",
  onAutoSave,
  className = ""
}: MultiSelectInputProps) {
  const [isValid, setIsValid] = useState(true)
  const [customValue, setCustomValue] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  // Validation
  useEffect(() => {
    const valid = !required || (value.length >= minSelections && value.length <= maxSelections)
    setIsValid(valid)
  }, [value, required, minSelections, maxSelections])

  // Auto-save
  useEffect(() => {
    if (onAutoSave && value.length > 0 && isValid) {
      const timeoutId = setTimeout(() => {
        onAutoSave(value)
      }, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [value, onAutoSave, isValid])

  const handleSelect = (optionId: string) => {
    if (value.includes(optionId)) {
      // Remove selection
      onChange(value.filter(id => id !== optionId))
    } else {
      // Add selection (if under max limit)
      if (value.length < maxSelections) {
        onChange([...value, optionId])
      }
    }
  }

  const handleCustomAdd = () => {
    if (customValue.trim() && !value.includes(customValue.trim())) {
      onChange([...value, customValue.trim()])
      setCustomValue('')
      setShowCustomInput(false)
    }
  }

  const handleRemove = (optionId: string) => {
    onChange(value.filter(id => id !== optionId))
  }

  const selectedOptions = options.filter(option => value.includes(option.id))
  const customOptions = value.filter(val => !options.find(opt => opt.id === val))

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

      {/* Selected items */}
      <AnimatePresence>
        {value.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {selectedOptions.map((option) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`
                  inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
                  bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200
                  border border-emerald-200 dark:border-emerald-700
                `}
              >
                <span>{option.label}</span>
                <button
                  onClick={() => handleRemove(option.id)}
                  className="ml-2 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            ))}
            
            {customOptions.map((customVal) => (
              <motion.div
                key={customVal}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
              >
                <span>{customVal}</span>
                <button
                  onClick={() => handleRemove(customVal)}
                  className="ml-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection count */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {value.length} of {maxSelections} selected
        {minSelections > 1 && ` (minimum ${minSelections})`}
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => (
          <motion.button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            disabled={!value.includes(option.id) && value.length >= maxSelections}
            className={`
              p-4 rounded-lg border-2 text-left transition-all duration-200
              ${value.includes(option.id)
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600'
              }
              ${!value.includes(option.id) && value.length >= maxSelections
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:shadow-sm'
              }
            `}
            whileHover={{ scale: value.includes(option.id) || value.length >= maxSelections ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {option.description}
                  </div>
                )}
              </div>
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center ml-3
                ${value.includes(option.id)
                  ? 'border-emerald-500 bg-emerald-500'
                  : 'border-gray-300 dark:border-gray-600'
                }
              `}>
                {value.includes(option.id) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Custom input */}
      {allowCustom && (
        <div className="space-y-2">
          {!showCustomInput ? (
            <button
              onClick={() => setShowCustomInput(true)}
              disabled={value.length >= maxSelections}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-emerald-600 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              <span>Add custom option</span>
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex space-x-2"
            >
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Enter custom option..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleCustomAdd()}
                autoFocus
              />
              <button
                onClick={handleCustomAdd}
                disabled={!customValue.trim() || value.length >= maxSelections}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowCustomInput(false)
                  setCustomValue('')
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* Validation message */}
      {!isValid && required && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-red-500"
        >
          <span>
            {value.length < minSelections
              ? `Please select at least ${minSelections} option${minSelections > 1 ? 's' : ''}`
              : `Please select no more than ${maxSelections} options`
            }
          </span>
        </motion.div>
      )}
    </div>
  )
}
