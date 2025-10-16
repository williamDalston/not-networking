// Graph data transformation and layout utilities for Cytoscape

export interface GraphNode {
  data: {
    id: string
    label: string
    type: 'user' | 'skill' | 'goal' | 'value'
    size?: number
    color?: string
    profile?: {
      display_name: string
      avatar_url?: string
      work_on?: string
      bio?: string
    }
  }
  position?: {
    x: number
    y: number
  }
}

export interface GraphEdge {
  data: {
    id: string
    source: string
    target: string
    type: 'need_strength' | 'goal_alignment' | 'values_alignment' | 'connection'
    weight?: number
    label?: string
    color?: string
  }
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

// Transform user data into graph format
export function transformUserDataToGraph(users: any[]): GraphData {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []
  const nodeIdCounter = { users: 0, skills: 0, goals: 0, values: 0 }

  users.forEach((user, userIndex) => {
    const userId = `user_${user.user_id}`
    
    // Add user node
    nodes.push({
      data: {
        id: userId,
        label: user.display_name || 'Anonymous',
        type: 'user',
        size: 40,
        color: '#10b981', // emerald-500
        profile: {
          display_name: user.display_name || 'Anonymous',
          avatar_url: user.avatar_url,
          work_on: user.work_on,
          bio: user.bio
        }
      },
      position: {
        x: Math.cos((userIndex / users.length) * 2 * Math.PI) * 200,
        y: Math.sin((userIndex / users.length) * 2 * Math.PI) * 200
      }
    })

    // Add skill nodes and edges
    if (user.strengths_text) {
      const skills = user.strengths_text.split(',').map((s: string) => s.trim()).filter(Boolean)
      skills.forEach((skill: string) => {
        const skillId = `skill_${nodeIdCounter.skills++}`
        nodes.push({
          data: {
            id: skillId,
            label: skill,
            type: 'skill',
            size: 20,
            color: '#3b82f6' // blue-500
          }
        })
        edges.push({
          data: {
            id: `${userId}_${skillId}`,
            source: userId,
            target: skillId,
            type: 'need_strength',
            weight: 1,
            label: 'strength',
            color: '#3b82f6'
          }
        })
      })
    }

    // Add goal nodes and edges
    if (user.progress_goal) {
      const goalId = `goal_${nodeIdCounter.goals++}`
      nodes.push({
        data: {
          id: goalId,
          label: user.progress_goal,
          type: 'goal',
          size: 25,
          color: '#f59e0b' // amber-500
        }
      })
      edges.push({
        data: {
          id: `${userId}_${goalId}`,
          source: userId,
          target: goalId,
          type: 'goal_alignment',
          weight: 1,
          label: 'goal',
          color: '#f59e0b'
        }
      })
    }

    // Add value nodes and edges
    if (user.shared_values && user.shared_values.length > 0) {
      user.shared_values.forEach((value: string) => {
        const valueId = `value_${nodeIdCounter.values++}`
        nodes.push({
          data: {
            id: valueId,
            label: value,
            type: 'value',
            size: 18,
            color: '#8b5cf6' // violet-500
          }
        })
        edges.push({
          data: {
            id: `${userId}_${valueId}`,
            source: userId,
            target: valueId,
            type: 'values_alignment',
            weight: 1,
            label: 'value',
            color: '#8b5cf6'
          }
        })
      })
    }
  })

  // Add connections between users based on matches
  // This would be populated from actual match data
  // For now, we'll create some sample connections
  for (let i = 0; i < Math.min(users.length, 5); i++) {
    const sourceUserId = `user_${users[i].user_id}`
    const targetIndex = (i + 1) % users.length
    const targetUserId = `user_${users[targetIndex].user_id}`
    
    edges.push({
      data: {
        id: `${sourceUserId}_${targetUserId}`,
        source: sourceUserId,
        target: targetUserId,
        type: 'connection',
        weight: 2,
        label: 'connected',
        color: '#10b981'
      }
    })
  }

  return { nodes, edges }
}

// Generate Cytoscape styles
export function generateCytoscapeStyles() {
  return [
    {
      selector: 'node',
      style: {
        'background-color': 'data(color)',
        'label': 'data(label)',
        'width': 'data(size)',
        'height': 'data(size)',
        'font-size': '12px',
        'text-valign': 'center',
        'text-halign': 'center',
        'color': '#ffffff',
        'text-outline-width': 2,
        'text-outline-color': '#000000',
        'border-width': 2,
        'border-color': '#ffffff'
      }
    },
    {
      selector: 'node[type="user"]',
      style: {
        'shape': 'ellipse',
        'width': 'data(size)',
        'height': 'data(size)',
        'font-size': '14px',
        'font-weight': 'bold'
      }
    },
    {
      selector: 'node[type="skill"]',
      style: {
        'shape': 'rectangle',
        'width': 'data(size)',
        'height': 'data(size)',
        'font-size': '10px'
      }
    },
    {
      selector: 'node[type="goal"]',
      style: {
        'shape': 'diamond',
        'width': 'data(size)',
        'height': 'data(size)',
        'font-size': '10px'
      }
    },
    {
      selector: 'node[type="value"]',
      style: {
        'shape': 'triangle',
        'width': 'data(size)',
        'height': 'data(size)',
        'font-size': '9px'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 'data(weight)',
        'line-color': 'data(color)',
        'target-arrow-color': 'data(color)',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'opacity': 0.8
      }
    },
    {
      selector: 'edge[type="connection"]',
      style: {
        'line-style': 'solid',
        'width': 3,
        'opacity': 1
      }
    },
    {
      selector: 'edge[type="need_strength"]',
      style: {
        'line-style': 'dashed',
        'width': 1,
        'opacity': 0.6
      }
    },
    {
      selector: 'edge[type="goal_alignment"]',
      style: {
        'line-style': 'dotted',
        'width': 2,
        'opacity': 0.7
      }
    },
    {
      selector: 'edge[type="values_alignment"]',
      style: {
        'line-style': 'solid',
        'width': 1,
        'opacity': 0.5
      }
    },
    {
      selector: 'node:selected',
      style: {
        'border-width': 4,
        'border-color': '#f59e0b',
        'background-color': 'data(color)'
      }
    },
    {
      selector: 'edge:selected',
      style: {
        'line-color': '#f59e0b',
        'width': 4,
        'opacity': 1
      }
    }
  ]
}

// Generate Cytoscape layout options
export function generateLayoutOptions(type: 'force' | 'circle' | 'grid' = 'force') {
  const baseOptions = {
    name: 'cose-bilkent',
    animate: true,
    animationDuration: 1000,
    randomize: true,
    fit: true,
    padding: 30,
    nodeRepulsion: 4000,
    idealEdgeLength: 100,
    edgeElasticity: 0.45,
    nestingFactor: 0.1,
    gravity: 0.25,
    numIter: 2500,
    tile: true,
    tilingPaddingVertical: 10,
    tilingPaddingHorizontal: 10,
    gravityRangeCompound: 1.5,
    gravityCompound: 1.0,
    gravityRange: 3.8,
    initialEnergyOnIncremental: 0.5
  }

  switch (type) {
    case 'circle':
      return {
        name: 'circle',
        animate: true,
        animationDuration: 1000,
        fit: true,
        padding: 30,
        radius: 200
      }
    case 'grid':
      return {
        name: 'grid',
        animate: true,
        animationDuration: 1000,
        fit: true,
        padding: 30,
        cols: 4,
        rows: 4
      }
    default:
      return baseOptions
  }
}

// Filter graph data
export function filterGraphData(
  graphData: GraphData,
  filters: {
    nodeTypes?: string[]
    edgeTypes?: string[]
    minConnections?: number
  }
): GraphData {
  let filteredNodes = [...graphData.nodes]
  let filteredEdges = [...graphData.edges]

  // Filter by node types
  if (filters.nodeTypes && filters.nodeTypes.length > 0) {
    filteredNodes = filteredNodes.filter(node => 
      filters.nodeTypes!.includes(node.data.type)
    )
  }

  // Filter by edge types
  if (filters.edgeTypes && filters.edgeTypes.length > 0) {
    filteredEdges = filteredEdges.filter(edge => 
      filters.edgeTypes!.includes(edge.data.type)
    )
  }

  // Filter by minimum connections
  if (filters.minConnections && filters.minConnections > 0) {
    const nodeConnections = new Map<string, number>()
    
    filteredEdges.forEach(edge => {
      nodeConnections.set(edge.data.source, (nodeConnections.get(edge.data.source) || 0) + 1)
      nodeConnections.set(edge.data.target, (nodeConnections.get(edge.data.target) || 0) + 1)
    })

    const connectedNodeIds = new Set(
      Array.from(nodeConnections.entries())
        .filter(([_, count]) => count >= filters.minConnections!)
        .map(([nodeId, _]) => nodeId)
    )

    filteredNodes = filteredNodes.filter(node => connectedNodeIds.has(node.data.id))
    filteredEdges = filteredEdges.filter(edge => 
      connectedNodeIds.has(edge.data.source) && connectedNodeIds.has(edge.data.target)
    )
  }

  return {
    nodes: filteredNodes,
    edges: filteredEdges
  }
}

// Calculate graph statistics
export function calculateGraphStats(graphData: GraphData) {
  const nodeCounts = graphData.nodes.reduce((acc, node) => {
    acc[node.data.type] = (acc[node.data.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const edgeCounts = graphData.edges.reduce((acc, edge) => {
    acc[edge.data.type] = (acc[edge.data.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    totalNodes: graphData.nodes.length,
    totalEdges: graphData.edges.length,
    nodeCounts,
    edgeCounts,
    density: graphData.nodes.length > 1 
      ? graphData.edges.length / (graphData.nodes.length * (graphData.nodes.length - 1) / 2)
      : 0
  }
}
