'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface TextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  minLength?: number
  required?: boolean
  label?: string
  description?: string
  autoSave?: boolean
  onAutoSave?: (value: string) => void
  className?: string
}

export function TextInput({
  value,
  onChange,
  placeholder = "Type your answer here...",
  maxLength = 280,
  minLength = 10,
  required = false,
  label,
  description,
  autoSave = true,
  onAutoSave,
  className = ""
}: TextInputProps) {
  const [isValid, setIsValid] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasSaved, setHasSaved] = useState(false)

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && onAutoSave && value.length > 0 && isValid) {
      const timeoutId = setTimeout(async () => {
        setIsSaving(true)
        try {
          await onAutoSave(value)
          setHasSaved(true)
          setTimeout(() => setHasSaved(false), 2000)
        } catch (error) {
          console.error('Auto-save failed:', error)
        } finally {
          setIsSaving(false)
        }
      }, 1000) // Save after 1 second of no typing

      return () => clearTimeout(timeoutId)
    }
  }, [value, autoSave, onAutoSave, isValid])

  // Validation
  useEffect(() => {
    const valid = !required || (value.length >= minLength && value.length <= maxLength)
    setIsValid(valid)
  }, [value, required, minLength, maxLength])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (newValue.length <= maxLength) {
      onChange(newValue)
    }
  }

  const remainingChars = maxLength - value.length
  const isNearLimit = remainingChars < 20

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      )}

      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          rows={4}
          className={`
            w-full px-4 py-3 border rounded-lg resize-none
            bg-white dark:bg-gray-800 
            text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            focus:ring-2 focus:ring-emerald-500 focus:border-transparent
            transition-all duration-200
            ${!isValid ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}
            ${isNearLimit ? 'border-yellow-300 dark:border-yellow-600' : ''}
          `}
        />
        
        {/* Auto-save indicator */}
        <div className="absolute top-3 right-3 flex items-center space-x-1">
          {isSaving && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
            />
          )}
          {hasSaved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-emerald-500"
            >
              <CheckCircle className="h-4 w-4" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Character count and validation */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          {!isValid && required && value.length > 0 && (
            <div className="flex items-center space-x-1 text-red-500">
              <AlertCircle className="h-3 w-3" />
              <span>
                {value.length < minLength 
                  ? `Minimum ${minLength} characters required`
                  : `Maximum ${maxLength} characters allowed`
                }
              </span>
            </div>
          )}
        </div>
        
        <div className={`text-sm ${isNearLimit ? 'text-yellow-600' : 'text-gray-500'}`}>
          {remainingChars} characters remaining
        </div>
      </div>

      {/* Progress indicator */}
      {maxLength > 0 && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
          <motion.div
            className={`h-1 rounded-full ${
              remainingChars < 20 ? 'bg-yellow-500' : 'bg-emerald-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${(value.length / maxLength) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </div>
  )
}
