'use client'

import { motion } from 'framer-motion'
import { Brain, Zap, Target, Users } from 'lucide-react'

interface MatchNarrativeProps {
  narrative: string
  confidence: number
  reasoning: string[]
  matchType: 'need_strength' | 'goal_alignment' | 'values_alignment'
  className?: string
}

export function MatchNarrative({ 
  narrative, 
  confidence, 
  reasoning, 
  matchType, 
  className = '' 
}: MatchNarrativeProps) {
  const getMatchTypeInfo = (type: string) => {
    switch (type) {
      case 'need_strength':
        return {
          icon: <Users className="h-5 w-5" />,
          label: 'Complementary Skills',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
          borderColor: 'border-emerald-200 dark:border-emerald-700'
        }
      case 'goal_alignment':
        return {
          icon: <Target className="h-5 w-5" />,
          label: 'Shared Objectives',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          borderColor: 'border-blue-200 dark:border-blue-700'
        }
      case 'values_alignment':
        return {
          icon: <Heart className="h-5 w-5" />,
          label: 'Common Values',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100 dark:bg-purple-900/30',
          borderColor: 'border-purple-200 dark:border-purple-700'
        }
      default:
        return {
          icon: <Brain className="h-5 w-5" />,
          label: 'AI Match',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100 dark:bg-gray-900/30',
          borderColor: 'border-gray-200 dark:border-gray-700'
        }
    }
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-emerald-600'
    if (score >= 0.6) return 'text-blue-600'
    if (score >= 0.4) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceLabel = (score: number) => {
    if (score >= 0.8) return 'Very High'
    if (score >= 0.6) return 'High'
    if (score >= 0.4) return 'Medium'
    return 'Low'
  }

  const matchInfo = getMatchTypeInfo(matchType)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-4 ${className}`}
    >
      {/* Match Type Header */}
      <div className={`p-4 rounded-lg border ${matchInfo.bgColor} ${matchInfo.borderColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`${matchInfo.color}`}>
              {matchInfo.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {matchInfo.label}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                SAM identified this connection type
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-lg font-bold ${getConfidenceColor(confidence)}`}>
              {(confidence * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-500">
              {getConfidenceLabel(confidence)} confidence
            </div>
          </div>
        </div>
      </div>

      {/* Main Narrative */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              SAM's Analysis
            </h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {narrative}
            </p>
          </div>
        </div>
      </div>

      {/* Reasoning Breakdown */}
      {reasoning && reasoning.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="h-4 w-4 text-gold-600" />
            <h5 className="font-medium text-gray-900 dark:text-white">
              Key Reasoning Points
            </h5>
          </div>
          <div className="space-y-2">
            {reasoning.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    {index + 1}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {reason}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Confidence Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="p-3 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/10 dark:to-blue-900/10 rounded-lg border border-emerald-200 dark:border-emerald-700"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              confidence >= 0.8 ? 'bg-emerald-500' :
              confidence >= 0.6 ? 'bg-blue-500' :
              confidence >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Match Confidence
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${
                  confidence >= 0.8 ? 'bg-emerald-500' :
                  confidence >= 0.6 ? 'bg-blue-500' :
                  confidence >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${confidence * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <span className={`text-sm font-medium ${getConfidenceColor(confidence)}`}>
              {getConfidenceLabel(confidence)}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
