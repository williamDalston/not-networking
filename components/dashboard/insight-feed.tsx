'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Target, 
  Calendar,
  ArrowRight,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Insight {
  id: string
  type: 'tip' | 'trend' | 'opportunity' | 'reminder'
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
  priority: 'low' | 'medium' | 'high'
  timestamp: string
}

interface InsightFeedProps {
  insights?: Insight[]
  className?: string
}

export function InsightFeed({ insights = sampleInsights, className = '' }: InsightFeedProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'tip':
        return <Lightbulb className="h-5 w-5" />
      case 'trend':
        return <TrendingUp className="h-5 w-5" />
      case 'opportunity':
        return <Target className="h-5 w-5" />
      case 'reminder':
        return <Calendar className="h-5 w-5" />
      default:
        return <Lightbulb className="h-5 w-5" />
    }
  }

  const getInsightColor = (type: string, priority: string) => {
    if (priority === 'high') {
      switch (type) {
        case 'tip':
          return 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-200'
        case 'trend':
          return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-200'
        case 'opportunity':
          return 'bg-gold-50 border-gold-200 text-gold-800 dark:bg-gold-900/20 dark:border-gold-700 dark:text-gold-200'
        case 'reminder':
          return 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-700 dark:text-purple-200'
      }
    }
    return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200'
  }

  const getIconColor = (type: string, priority: string) => {
    if (priority === 'high') {
      switch (type) {
        case 'tip':
          return 'text-emerald-600'
        case 'trend':
          return 'text-blue-600'
        case 'opportunity':
          return 'text-gold-600'
        case 'reminder':
          return 'text-purple-600'
      }
    }
    return 'text-gray-600'
  }

  const handleDismiss = (id: string) => {
    setDismissed(prev => new Set([...prev, id]))
  }

  const visibleInsights = insights.filter(insight => !dismissed.has(insight.id))

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          SAM Insights
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {visibleInsights.length} insights
        </div>
      </div>

      <AnimatePresence>
        {visibleInsights.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              No new insights at the moment. Check back later!
            </p>
          </motion.div>
        ) : (
          visibleInsights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative p-4 rounded-lg border
                ${getInsightColor(insight.type, insight.priority)}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`flex-shrink-0 ${getIconColor(insight.type, insight.priority)}`}>
                    {getInsightIcon(insight.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm opacity-90 leading-relaxed">
                      {insight.description}
                    </p>
                    
                    {insight.action && (
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          {insight.action.label}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs opacity-75">
                      {insight.timestamp}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDismiss(insight.id)}
                  className="flex-shrink-0 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  )
}

// Sample insights for development
const sampleInsights: Insight[] = [
  {
    id: '1',
    type: 'opportunity',
    title: 'Perfect Match Available',
    description: 'Sarah Johnson just joined and matches your growth marketing needs perfectly. She has 5+ years experience scaling B2B startups.',
    action: {
      label: 'View Profile',
      href: '/matches/123'
    },
    priority: 'high',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    type: 'tip',
    title: 'Networking Tip',
    description: 'Based on your profile, you might benefit from connecting with people who have complementary skills in design and user research.',
    priority: 'medium',
    timestamp: '1 day ago'
  },
  {
    id: '3',
    type: 'reminder',
    title: 'Follow Up Reminder',
    description: 'You connected with Alex Chen 3 days ago. Consider sending a follow-up message to continue the conversation.',
    action: {
      label: 'Send Message',
      href: '/messages/alex-chen'
    },
    priority: 'medium',
    timestamp: '2 days ago'
  },
  {
    id: '4',
    type: 'trend',
    title: 'Community Growth',
    description: 'The Ecosystem community has grown 40% this month. Your network is expanding with high-quality connections.',
    priority: 'low',
    timestamp: '3 days ago'
  }
]
