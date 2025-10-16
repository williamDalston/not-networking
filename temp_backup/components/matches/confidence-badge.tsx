'use client'

import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react'

interface ConfidenceBadgeProps {
  score: number
  label?: string
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ConfidenceBadge({ 
  score, 
  label, 
  showIcon = true, 
  size = 'md',
  className = '' 
}: ConfidenceBadgeProps) {
  const getScoreInfo = (score: number) => {
    if (score >= 0.9) {
      return {
        level: 'Excellent',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
        borderColor: 'border-emerald-200 dark:border-emerald-700',
        icon: <CheckCircle className="h-4 w-4" />,
        description: 'Very high confidence match'
      }
    } else if (score >= 0.8) {
      return {
        level: 'High',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
        borderColor: 'border-emerald-200 dark:border-emerald-700',
        icon: <CheckCircle className="h-4 w-4" />,
        description: 'High confidence match'
      }
    } else if (score >= 0.7) {
      return {
        level: 'Good',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        borderColor: 'border-blue-200 dark:border-blue-700',
        icon: <TrendingUp className="h-4 w-4" />,
        description: 'Good confidence match'
      }
    } else if (score >= 0.6) {
      return {
        level: 'Fair',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        borderColor: 'border-yellow-200 dark:border-yellow-700',
        icon: <Clock className="h-4 w-4" />,
        description: 'Fair confidence match'
      }
    } else {
      return {
        level: 'Low',
        color: 'text-red-600',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        borderColor: 'border-red-200 dark:border-red-700',
        icon: <AlertCircle className="h-4 w-4" />,
        description: 'Low confidence match'
      }
    }
  }

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs'
      case 'lg':
        return 'px-4 py-2 text-base'
      default:
        return 'px-3 py-1.5 text-sm'
    }
  }

  const scoreInfo = getScoreInfo(score)
  const sizeClasses = getSizeClasses(size)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center space-x-2 rounded-full border ${scoreInfo.bgColor} ${scoreInfo.borderColor} ${sizeClasses} ${className}`}
    >
      {showIcon && (
        <div className={scoreInfo.color}>
          {scoreInfo.icon}
        </div>
      )}
      
      <div className="flex items-center space-x-1">
        <span className={`font-medium ${scoreInfo.color}`}>
          {scoreInfo.level}
        </span>
        <span className={`font-bold ${scoreInfo.color}`}>
          {(score * 100).toFixed(0)}%
        </span>
      </div>

      {label && (
        <span className="text-gray-600 dark:text-gray-400">
          {label}
        </span>
      )}
    </motion.div>
  )
}

// Compact version for use in lists/cards
export function ConfidenceBadgeCompact({ score, className = '' }: { score: number, className?: string }) {
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-emerald-600'
    if (score >= 0.6) return 'text-blue-600'
    if (score >= 0.4) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center space-x-1 ${className}`}
    >
      <div className={`w-2 h-2 rounded-full ${getScoreColor(score).replace('text-', 'bg-')}`} />
      <span className={`text-xs font-medium ${getScoreColor(score)}`}>
        {(score * 100).toFixed(0)}%
      </span>
    </motion.div>
  )
}

// Progress bar version
export function ConfidenceProgress({ score, className = '' }: { score: number, className?: string }) {
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-emerald-500'
    if (score >= 0.6) return 'bg-blue-500'
    if (score >= 0.4) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 0.9) return 'Excellent'
    if (score >= 0.8) return 'High'
    if (score >= 0.7) return 'Good'
    if (score >= 0.6) return 'Fair'
    return 'Low'
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-900 dark:text-white">
          Match Confidence
        </span>
        <span className={`font-bold ${getScoreColor(score).replace('bg-', 'text-')}`}>
          {getScoreLabel(score)} ({(score * 100).toFixed(0)}%)
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full ${getScoreColor(score)}`}
          initial={{ width: 0 }}
          animate={{ width: `${score * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
