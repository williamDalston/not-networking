'use client'

import { motion } from 'framer-motion'
import { Users, ArrowRight, MessageCircle, Calendar, Star, Heart, Bookmark, X, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'

interface MatchCardProps {
  match: {
    id: string
    name: string
    title: string
    avatar?: string
    similarity: number
    matchType: 'need_strength' | 'goal_alignment' | 'values_alignment'
    explanation: string
    sharedValues: string[]
    reasonChips: string[]
    lastActive: string
  }
  onConnect?: (matchId: string) => void
  onSave?: (matchId: string) => void
  onDismiss?: (matchId: string) => void
}

export function MatchCard({ match, onConnect, onSave, onDismiss }: MatchCardProps) {
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const getMatchTypeColor = (type: string) => {
    switch (type) {
      case 'need_strength':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200'
      case 'goal_alignment':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
      case 'values_alignment':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200'
    }
  }

  const getMatchTypeLabel = (type: string) => {
    switch (type) {
      case 'need_strength':
        return 'Need ↔ Strength'
      case 'goal_alignment':
        return 'Goal Alignment'
      case 'values_alignment':
        return 'Values Match'
      default:
        return 'Match'
    }
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    onSave?.(match.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      className="relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group"
      onMouseEnter={() => setShowQuickActions(true)}
      onMouseLeave={() => setShowQuickActions(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-lg">
              {match.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {match.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {match.title}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchTypeColor(match.matchType)}`}>
            {getMatchTypeLabel(match.matchType)}
          </span>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{(match.similarity * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {match.explanation}
        </p>
      </div>

      {/* Reason chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {match.reasonChips.map((chip, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
          >
            {chip}
          </motion.span>
        ))}
      </div>

      {/* Shared values */}
      {match.sharedValues.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            Shared Values
          </h4>
          <div className="flex flex-wrap gap-1">
            {match.sharedValues.map((value, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded text-xs"
              >
                {value}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Active {match.lastActive}</span>
          </div>
        </div>

        {/* Quick Actions (shown on hover) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: showQuickActions ? 1 : 0,
            scale: showQuickActions ? 1 : 0.8
          }}
          transition={{ duration: 0.2 }}
          className="absolute top-4 right-4 flex space-x-1"
        >
          <button
            onClick={handleSave}
            className={`p-2 rounded-full transition-colors ${
              isSaved 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save for later'}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => onDismiss?.(match.id)}
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors"
            title="Not interested"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>

        {/* Regular Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSave?.(match.id)}
            className="text-gray-600 hover:text-gray-900"
          >
            Save
          </Button>
          <Link href={`/matches/${match.id}`}>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Connect
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// Sample data for development
export const sampleMatchData = [
  {
    id: '1',
    name: 'Alex Chen',
    title: 'Product Designer',
    similarity: 0.87,
    matchType: 'need_strength' as const,
    explanation: 'Alex excels at user research and design systems, which perfectly complements your need for design expertise in your startup. You both share a passion for creating user-centered products.',
    sharedValues: ['Innovation', 'User Focus', 'Collaboration'],
    reasonChips: ['Design expertise', 'Startup experience', 'User research'],
    lastActive: '2h ago'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    title: 'Marketing Strategist',
    similarity: 0.82,
    matchType: 'goal_alignment' as const,
    explanation: 'Both of you are focused on scaling early-stage companies and building sustainable growth strategies. Sarah has successfully launched 3 products and can help with your go-to-market challenges.',
    sharedValues: ['Growth', 'Strategy', 'Impact'],
    reasonChips: ['Growth marketing', 'Product launch', 'Strategy'],
    lastActive: '1h ago'
  },
  {
    id: '3',
    name: 'David Park',
    title: 'Technical Lead',
    similarity: 0.79,
    matchType: 'values_alignment' as const,
    explanation: 'You share core values around building ethical technology and mentoring others. David leads a team of engineers and is passionate about creating inclusive engineering cultures.',
    sharedValues: ['Ethics', 'Mentorship', 'Inclusion'],
    reasonChips: ['Engineering leadership', 'Team building', 'Ethical tech'],
    lastActive: '30m ago'
  }
]
