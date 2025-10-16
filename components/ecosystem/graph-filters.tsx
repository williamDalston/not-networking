'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, X, Users, Target, Heart, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GraphFiltersProps {
  onFiltersChange: (filters: {
    nodeTypes: string[]
    edgeTypes: string[]
    minConnections: number
  }) => void
  className?: string
}

export function GraphFilters({ onFiltersChange, className = '' }: GraphFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedNodeTypes, setSelectedNodeTypes] = useState<string[]>(['user', 'skill', 'goal', 'value'])
  const [selectedEdgeTypes, setSelectedEdgeTypes] = useState<string[]>(['connection', 'need_strength', 'goal_alignment', 'values_alignment'])
  const [minConnections, setMinConnections] = useState(0)

  const nodeTypeOptions = [
    { id: 'user', label: 'Users', icon: <Users className="h-4 w-4" />, color: 'bg-emerald-500' },
    { id: 'skill', label: 'Skills', icon: <Zap className="h-4 w-4" />, color: 'bg-blue-500' },
    { id: 'goal', label: 'Goals', icon: <Target className="h-4 w-4" />, color: 'bg-amber-500' },
    { id: 'value', label: 'Values', icon: <Heart className="h-4 w-4" />, color: 'bg-violet-500' }
  ]

  const edgeTypeOptions = [
    { id: 'connection', label: 'Direct Connections', color: 'bg-emerald-500' },
    { id: 'need_strength', label: 'Need ↔ Strength', color: 'bg-blue-500' },
    { id: 'goal_alignment', label: 'Goal Alignment', color: 'bg-amber-500' },
    { id: 'values_alignment', label: 'Values Alignment', color: 'bg-violet-500' }
  ]

  const handleNodeTypeToggle = (nodeType: string) => {
    const newTypes = selectedNodeTypes.includes(nodeType)
      ? selectedNodeTypes.filter(t => t !== nodeType)
      : [...selectedNodeTypes, nodeType]
    
    setSelectedNodeTypes(newTypes)
    applyFilters(newTypes, selectedEdgeTypes, minConnections)
  }

  const handleEdgeTypeToggle = (edgeType: string) => {
    const newTypes = selectedEdgeTypes.includes(edgeType)
      ? selectedEdgeTypes.filter(t => t !== edgeType)
      : [...selectedEdgeTypes, edgeType]
    
    setSelectedEdgeTypes(newTypes)
    applyFilters(selectedNodeTypes, newTypes, minConnections)
  }

  const handleMinConnectionsChange = (value: number) => {
    setMinConnections(value)
    applyFilters(selectedNodeTypes, selectedEdgeTypes, value)
  }

  const applyFilters = (nodeTypes: string[], edgeTypes: string[], connections: number) => {
    onFiltersChange({
      nodeTypes,
      edgeTypes,
      minConnections: connections
    })
  }

  const clearAllFilters = () => {
    setSelectedNodeTypes(['user', 'skill', 'goal', 'value'])
    setSelectedEdgeTypes(['connection', 'need_strength', 'goal_alignment', 'values_alignment'])
    setMinConnections(0)
    applyFilters(['user', 'skill', 'goal', 'value'], ['connection', 'need_strength', 'goal_alignment', 'values_alignment'], 0)
  }

  const hasActiveFilters = selectedNodeTypes.length < 4 || selectedEdgeTypes.length < 4 || minConnections > 0

  return (
    <div className={`relative ${className}`}>
      {/* Filter Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative ${hasActiveFilters ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : ''}`}
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
        {hasActiveFilters && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full"></div>
        )}
      </Button>

      {/* Filter Panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Graph Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Node Types */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Node Types</h4>
              <div className="space-y-2">
                {nodeTypeOptions.map((option) => (
                  <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedNodeTypes.includes(option.id)}
                      onChange={() => handleNodeTypeToggle(option.id)}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className={`w-4 h-4 rounded ${option.color}`}></div>
                    <div className="flex items-center space-x-2">
                      {option.icon}
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {option.label}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Edge Types */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Connection Types</h4>
              <div className="space-y-2">
                {edgeTypeOptions.map((option) => (
                  <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedEdgeTypes.includes(option.id)}
                      onChange={() => handleEdgeTypeToggle(option.id)}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className={`w-4 h-0.5 ${option.color}`}></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Minimum Connections */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Minimum Connections: {minConnections}
              </h4>
              <input
                type="range"
                min="0"
                max="10"
                value={minConnections}
                onChange={(e) => handleMinConnectionsChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>5</span>
                <span>10+</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="flex-1"
              >
                Clear All
              </Button>
              <Button
                size="sm"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Apply
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Quick filter buttons for common scenarios
export function QuickFilters({ onFiltersChange, className = '' }: GraphFiltersProps) {
  const quickFilterPresets = [
    {
      id: 'all',
      label: 'All',
      filters: {
        nodeTypes: ['user', 'skill', 'goal', 'value'],
        edgeTypes: ['connection', 'need_strength', 'goal_alignment', 'values_alignment'],
        minConnections: 0
      }
    },
    {
      id: 'users-only',
      label: 'Users Only',
      filters: {
        nodeTypes: ['user'],
        edgeTypes: ['connection'],
        minConnections: 0
      }
    },
    {
      id: 'skills',
      label: 'Skills & Goals',
      filters: {
        nodeTypes: ['user', 'skill', 'goal'],
        edgeTypes: ['need_strength', 'goal_alignment'],
        minConnections: 0
      }
    },
    {
      id: 'well-connected',
      label: 'Well Connected',
      filters: {
        nodeTypes: ['user', 'skill', 'goal', 'value'],
        edgeTypes: ['connection', 'need_strength', 'goal_alignment', 'values_alignment'],
        minConnections: 3
      }
    }
  ]

  const handlePresetClick = (preset: any) => {
    onFiltersChange(preset.filters)
  }

  return (
    <div className={`flex space-x-2 ${className}`}>
      {quickFilterPresets.map((preset) => (
        <Button
          key={preset.id}
          variant="outline"
          size="sm"
          onClick={() => handlePresetClick(preset)}
          className="text-xs"
        >
          {preset.label}
        </Button>
      ))}
    </div>
  )
}
