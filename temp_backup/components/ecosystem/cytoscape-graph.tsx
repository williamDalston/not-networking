'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ZoomIn, ZoomOut, RotateCcw, Filter, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GraphData, generateCytoscapeStyles, generateLayoutOptions } from '@/lib/graph-layout'
import { UserProfileModal } from './user-profile-modal'

interface CytoscapeGraphProps {
  data: GraphData
  onNodeClick?: (nodeId: string, nodeData: any) => void
  onEdgeClick?: (edgeId: string, edgeData: any) => void
  className?: string
}

export function CytoscapeGraph({ data, onNodeClick, onEdgeClick, className = '' }: CytoscapeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<any>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    const initializeCytoscape = async () => {
      try {
        // Dynamic import for Cytoscape (client-side only)
        const cytoscape = (await import('cytoscape')).default
        const coseBilkent = (await import('cytoscape-cose-bilkent')).default

        // Register layout
        cytoscape.use(coseBilkent)

        // Initialize Cytoscape
        const cy = cytoscape({
          container: containerRef.current,
          elements: data,
          style: generateCytoscapeStyles(),
          layout: generateLayoutOptions('force'),
          minZoom: 0.1,
          maxZoom: 3,
          wheelSensitivity: 0.1,
          boxSelectionEnabled: true,
          selectionType: 'additive'
        })

        cyRef.current = cy

        // Event listeners
        cy.on('tap', 'node', (event: any) => {
          const node = event.target
          setSelectedNode(node.data())
          onNodeClick?.(node.id(), node.data())
        })

        cy.on('tap', 'edge', (event: any) => {
          const edge = event.target
          onEdgeClick?.(edge.id(), edge.data())
        })

        cy.on('tap', (event: any) => {
          if (event.target === cy) {
            setSelectedNode(null)
          }
        })

        // Fit to container
        cy.fit()
        setIsLoading(false)

      } catch (error) {
        console.error('Failed to initialize Cytoscape:', error)
        setIsLoading(false)
      }
    }

    initializeCytoscape()

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy()
      }
    }
  }, [data, onNodeClick, onEdgeClick])

  const handleZoomIn = () => {
    if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() * 1.2)
    }
  }

  const handleZoomOut = () => {
    if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() * 0.8)
    }
  }

  const handleResetView = () => {
    if (cyRef.current) {
      cyRef.current.fit()
    }
  }

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleLayoutChange = (layoutType: 'force' | 'circle' | 'grid') => {
    if (cyRef.current) {
      const layout = cyRef.current.layout(generateLayoutOptions(layoutType))
      layout.run()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading network visualization...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : ''} ${className}`}>
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetView}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLayoutChange('force')}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
          >
            Force
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLayoutChange('circle')}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
          >
            Circle
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLayoutChange('grid')}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
          >
            Grid
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleFullscreen}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Legend</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300">Users</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">Skills</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-amber-500 transform rotate-45"></div>
            <span className="text-gray-700 dark:text-gray-300">Goals</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-violet-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Values</span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <h5 className="font-medium text-gray-900 dark:text-white mb-1">Connections</h5>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-0.5 bg-emerald-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Direct</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-0.5 bg-blue-500 border-dashed border-t"></div>
              <span className="text-gray-600 dark:text-gray-400">Skills</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-0.5 bg-amber-500 border-dotted border-t"></div>
              <span className="text-gray-600 dark:text-gray-400">Goals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Graph Container */}
      <div 
        ref={containerRef} 
        className={`w-full ${isFullscreen ? 'h-screen' : 'h-96'} rounded-lg border border-gray-200 dark:border-gray-700`}
      />

      {/* User Profile Modal */}
      {selectedNode && selectedNode.type === 'user' && (
        <UserProfileModal
          user={selectedNode.profile}
          isOpen={!!selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  )
}
