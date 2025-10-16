'use client'

import { motion } from 'framer-motion'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

interface GrowthGraphProps {
  data: {
    area: string
    current: number
    potential: number
  }[]
  className?: string
}

export function GrowthGraph({ data, className = '' }: GrowthGraphProps) {
  const chartData = data.map(item => ({
    ...item,
    fullMark: 10
  }))

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Growth Areas
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your current progress across 7 key life areas
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis 
              dataKey="area" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              className="dark:text-gray-300"
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 10]} 
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false}
            />
            <Radar
              name="Current"
              dataKey="current"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name="Potential"
              dataKey="potential"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.2}
              strokeWidth={1}
              strokeDasharray="5 5"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Current</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gold-500 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Potential</span>
        </div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700"
      >
        <h4 className="text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-2">
          💡 Growth Insight
        </h4>
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          Your strongest areas are{' '}
          <span className="font-medium">
            {data
              .sort((a, b) => b.current - a.current)
              .slice(0, 2)
              .map(item => item.area)
              .join(' and ')
            }
          </span>
          . Consider how these strengths can support your growth in other areas.
        </p>
      </motion.div>
    </div>
  )
}

// Sample data for development
export const sampleGrowthData = [
  { area: 'Career', current: 7, potential: 9 },
  { area: 'Health', current: 6, potential: 8 },
  { area: 'Relationships', current: 8, potential: 9 },
  { area: 'Learning', current: 7, potential: 10 },
  { area: 'Creativity', current: 5, potential: 8 },
  { area: 'Finance', current: 6, potential: 7 },
  { area: 'Spirituality', current: 4, potential: 6 },
]
