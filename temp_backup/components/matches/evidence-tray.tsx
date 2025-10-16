'use client'

import { motion } from 'framer-motion'
import { Quote, Users, Target, Heart, ArrowRight } from 'lucide-react'

interface EvidenceTrayProps {
  evidence: {
    your_need: string
    their_strength: string
    shared_goal: string
    shared_values: string[]
    connection_type: 'need_strength' | 'goal_alignment' | 'values_alignment'
  }
  explanation: {
    narrative: string
    confidence_score: number
    reasoning: string[]
  }
  className?: string
}

export function EvidenceTray({ evidence, explanation, className = '' }: EvidenceTrayProps) {
  const getConnectionIcon = (type: string) => {
    switch (type) {
      case 'need_strength':
        return <Users className="h-5 w-5 text-emerald-600" />
      case 'goal_alignment':
        return <Target className="h-5 w-5 text-blue-600" />
      case 'values_alignment':
        return <Heart className="h-5 w-5 text-purple-600" />
      default:
        return <Users className="h-5 w-5 text-gray-600" />
    }
  }

  const getConnectionColor = (type: string) => {
    switch (type) {
      case 'need_strength':
        return 'border-emerald-200 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/20'
      case 'goal_alignment':
        return 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
      case 'values_alignment':
        return 'border-purple-200 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/20'
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/20'
    }
  }

  const getConnectionLabel = (type: string) => {
    switch (type) {
      case 'need_strength':
        return 'Need ↔ Strength Match'
      case 'goal_alignment':
        return 'Goal Alignment'
      case 'values_alignment':
        return 'Values Alignment'
      default:
        return 'Connection'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Connection Type Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg border ${getConnectionColor(evidence.connection_type)}`}
      >
        <div className="flex items-center space-x-3">
          {getConnectionIcon(evidence.connection_type)}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {getConnectionLabel(evidence.connection_type)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              SAM identified this connection based on your profiles
            </p>
          </div>
        </div>
      </motion.div>

      {/* Evidence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Your Need */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">You</span>
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white">Your Need</h4>
          </div>
          <div className="relative">
            <Quote className="absolute -top-2 -left-2 h-6 w-6 text-blue-300 dark:text-blue-600" />
            <p className="text-sm text-gray-700 dark:text-gray-300 pl-4 leading-relaxed">
              {evidence.your_need}
            </p>
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden md:flex items-center justify-center"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
            <ArrowRight className="h-4 w-4 text-white" />
          </div>
        </motion.div>

        {/* Their Strength */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
              <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">Them</span>
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white">Their Strength</h4>
          </div>
          <div className="relative">
            <Quote className="absolute -top-2 -left-2 h-6 w-6 text-emerald-300 dark:text-emerald-600" />
            <p className="text-sm text-gray-700 dark:text-gray-300 pl-4 leading-relaxed">
              {evidence.their_strength}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Shared Goal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 bg-gradient-to-r from-gold-50 to-gold-100 dark:from-gold-900/20 dark:to-gold-800/20 rounded-lg border border-gold-200 dark:border-gold-700"
      >
        <div className="flex items-center space-x-2 mb-3">
          <Target className="h-5 w-5 text-gold-600" />
          <h4 className="font-medium text-gray-900 dark:text-white">Shared Goal</h4>
        </div>
        <div className="relative">
          <Quote className="absolute -top-2 -left-2 h-6 w-6 text-gold-300 dark:text-gold-600" />
          <p className="text-sm text-gray-700 dark:text-gray-300 pl-4 leading-relaxed">
            {evidence.shared_goal}
          </p>
        </div>
      </motion.div>

      {/* Shared Values */}
      {evidence.shared_values && evidence.shared_values.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-2 mb-3">
            <Heart className="h-5 w-5 text-purple-600" />
            <h4 className="font-medium text-gray-900 dark:text-white">Shared Values</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {evidence.shared_values.map((value, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
              >
                {value}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* SAM's Narrative */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/10 dark:to-blue-900/10 rounded-xl border border-emerald-200 dark:border-emerald-700"
      >
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">SAM</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">SAM's Analysis</h4>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">{(explanation.confidence_score * 100).toFixed(0)}% confident</span>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {explanation.narrative}
            </p>
            
            {/* Reasoning Points */}
            {explanation.reasoning && explanation.reasoning.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white">Key Reasoning:</h5>
                <ul className="space-y-1">
                  {explanation.reasoning.map((reason, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
