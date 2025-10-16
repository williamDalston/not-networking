'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Network, Activity, TrendingUp, Eye, EyeOff } from 'lucide-react'
import { CytoscapeGraph } from './cytoscape-graph'
import { GraphFilters, QuickFilters } from './graph-filters'
import { transformUserDataToGraph, filterGraphData, calculateGraphStats, GraphData } from '@/lib/graph-layout'

interface EcosystemMapClientProps {
  className?: string
}

interface User {
  user_id: string
  display_name: string
  avatar_url?: string
  work_on?: string
  bio?: string
  strengths_text?: string
  needs_text?: string
  progress_goal?: string
  shared_values?: string[]
}

export function EcosystemMapClient({ className = '' }: EcosystemMapClientProps) {
  const [users, setUsers] = useState<User[]>([])
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] })
  const [filteredGraphData, setFilteredGraphData] = useState<GraphData>({ nodes: [], edges: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showStats, setShowStats] = useState(true)
  const [selectedNode, setSelectedNode] = useState<any>(null)

  useEffect(() => {
    fetchEcosystemData()
  }, [])

  useEffect(() => {
    if (users.length > 0) {
      const transformed = transformUserDataToGraph(users)
      setGraphData(transformed)
      setFilteredGraphData(transformed)
    }
  }, [users])

  const fetchEcosystemData = async () => {
    try {
      setLoading(true)
      
      // Fetch users from the ecosystem
      const response = await fetch('/api/ecosystem/users')
      
      if (!response.ok) {
        throw new Error('Failed to fetch ecosystem data')
      }
      
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error fetching ecosystem data:', error)
      setError(error instanceof Error ? error.message : 'Failed to load ecosystem map')
      
      // Fallback to sample data
      setUsers(generateSampleUsers())
    } finally {
      setLoading(false)
    }
  }

  const generateSampleUsers = (): User[] => {
    return [
      {
        user_id: '1',
        display_name: 'Alex Chen',
        work_on: 'Product Design',
        bio: 'Passionate about creating user-centered products',
        strengths_text: 'User Research, Design Systems, Prototyping',
        needs_text: 'Technical Implementation, Market Strategy',
        progress_goal: 'Launch a successful SaaS product',
        shared_values: ['Innovation', 'User Focus', 'Collaboration']
      },
      {
        user_id: '2',
        display_name: 'Sarah Johnson',
        work_on: 'Growth Marketing',
        bio: 'Helping startups scale through data-driven marketing',
        strengths_text: 'Growth Strategy, Analytics, Content Marketing',
        needs_text: 'Design Support, Product Development',
        progress_goal: 'Build a marketing agency',
        shared_values: ['Growth', 'Data-Driven', 'Impact']
      },
      {
        user_id: '3',
        display_name: 'David Park',
        work_on: 'Engineering Leadership',
        bio: 'Building scalable engineering teams and systems',
        strengths_text: 'System Architecture, Team Building, DevOps',
        needs_text: 'Product Strategy, User Research',
        progress_goal: 'Scale engineering team to 50+ people',
        shared_values: ['Technical Excellence', 'Team Building', 'Scale']
      },
      {
        user_id: '4',
        display_name: 'Maria Rodriguez',
        work_on: 'UX Research',
        bio: 'Understanding user behavior to inform product decisions',
        strengths_text: 'User Interviews, Usability Testing, Data Analysis',
        needs_text: 'Visual Design, Development Support',
        progress_goal: 'Lead UX research at a major tech company',
        shared_values: ['User Empathy', 'Evidence-Based', 'Inclusion']
      },
      {
        user_id: '5',
        display_name: 'James Wilson',
        work_on: 'Business Strategy',
        bio: 'Helping companies navigate complex business challenges',
        strengths_text: 'Strategic Planning, Financial Modeling, Partnerships',
        needs_text: 'Technical Implementation, Design',
        progress_goal: 'Start a consulting firm',
        shared_values: ['Strategy', 'Partnerships', 'Growth']
      }
    ]
  }

  const handleFiltersChange = (filters: {
    nodeTypes: string[]
    edgeTypes: string[]
    minConnections: number
  }) => {
    const filtered = filterGraphData(graphData, filters)
    setFilteredGraphData(filtered)
  }

  const handleNodeClick = (nodeId: string, nodeData: any) => {
    setSelectedNode(nodeData)
  }

  const handleEdgeClick = (edgeId: string, edgeData: any) => {
    console.log('Edge clicked:', edgeData)
  }

  const stats = calculateGraphStats(filteredGraphData)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading ecosystem map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Ecosystem Map
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Explore the network of connections, skills, and shared goals
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStats(!showStats)}
          >
            {showStats ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {showStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.nodeCounts.user || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Network className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Connections</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalEdges}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Skills</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.nodeCounts.skill || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Goals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.nodeCounts.goal || 0}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <QuickFilters onFiltersChange={handleFiltersChange} />
        <GraphFilters onFiltersChange={handleFiltersChange} />
      </div>

      {/* Graph Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CytoscapeGraph
          data={filteredGraphData}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          className="min-h-[500px]"
        />
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4"
        >
          <p className="text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> {error} Showing sample data for demonstration.
          </p>
        </motion.div>
      )}

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/10 dark:to-blue-900/10 rounded-lg p-6 border border-emerald-200 dark:border-emerald-700"
      >
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          How to Use the Ecosystem Map
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <h4 className="font-medium mb-2">Interacting with the Map:</h4>
            <ul className="space-y-1">
              <li>• Click and drag to pan around</li>
              <li>• Scroll to zoom in/out</li>
              <li>• Click nodes to see user profiles</li>
              <li>• Use filters to focus on specific types</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Understanding the Visual:</h4>
            <ul className="space-y-1">
              <li>• Green circles = Users</li>
              <li>• Blue squares = Skills</li>
              <li>• Gold diamonds = Goals</li>
              <li>• Purple triangles = Values</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
