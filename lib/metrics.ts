import { createServiceClient } from './supabase'

export interface HealthMetrics {
  helpful_rate: number
  sustained_match_rate: number
  cds_median: number
  event_conversion: number
  ehs: number
  ghost_rate: number
  fairness_gap: number
  reciprocity_index: number
  coverage_score: number
}

export interface WeeklyMetrics {
  week: string
  total_matches: number
  feedback_count: number
  helpful_count: number
  helpful_rate_percent: number
  ghost_count: number
  ghost_rate_percent: number
}

export interface CoverageMetrics {
  tag: string
  user_count: number
  coverage_percent: number
}

// Calculate Connection Depth Score (CDS) - revised formula
export function calculateCDS(
  messageCount: number,
  spanWeeks: number,
  hasCalendarEvent: boolean,
  avgMessageLength: number,
  hasWeekendMessages: boolean
): number {
  const baseScore = Math.log(1 + messageCount) * Math.log(1 + spanWeeks)
  
  let qualityMultiplier = 1.0
  if (hasCalendarEvent) qualityMultiplier += 2.0
  if (avgMessageLength > 200) qualityMultiplier += 1.5
  if (hasWeekendMessages) qualityMultiplier += 1.2
  
  return baseScore * qualityMultiplier
}

// Calculate Ecosystem Health Score (EHS)
export async function calculateEHS(): Promise<number> {
  const supabase = createServiceClient()
  
  // Get all metrics in parallel
  const [helpfulRate, ghostRate, eventConversion, scaledCDS, secondOrderConnections] = await Promise.all([
    getHelpfulRate(),
    getGhostRate(),
    getEventConversionRate(),
    getScaledCDS(),
    getSecondOrderConnections()
  ])
  
  // Weighted blend
  const weights = {
    helpful_rate: 0.3,
    anti_ghost: 0.25,
    event_conversion: 0.2,
    scaled_cds: 0.15,
    second_order: 0.1
  }
  
  const ehs = (
    helpfulRate * weights.helpful_rate +
    (1 - ghostRate) * weights.anti_ghost +
    eventConversion * weights.event_conversion +
    scaledCDS * weights.scaled_cds +
    secondOrderConnections * weights.second_order
  ) * 100
  
  return Math.round(ehs)
}

// Get helpful rate from materialized view
export async function getHelpfulRate(): Promise<number> {
  const supabase = createServiceClient()
  
  const { data, error } = await supabase
    .from('v_helpful_rate')
    .select('*')
    .order('week', { ascending: false })
    .limit(1)
    .single()
  
  if (error || !data) {
    return 0
  }
  
  return data.helpful_rate_percent / 100
}

// Get ghost rate from materialized view
export async function getGhostRate(): Promise<number> {
  const supabase = createServiceClient()
  
  const { data, error } = await supabase
    .from('v_ghost_rate')
    .select('*')
    .order('week', { ascending: false })
    .limit(1)
    .single()
  
  if (error || !data) {
    return 0
  }
  
  return data.ghost_rate_percent / 100
}

// Calculate sustained match rate
export async function getSustainedMatchRate(): Promise<number> {
  const supabase = createServiceClient()
  
  // Get matches from last 14 days with at least 2 interactions or RSVP
  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
  
  const { data: matches, error: matchesError } = await supabase
    .from('matches')
    .select(`
      id,
      interactions (
        id
      ),
      rsvps (
        id
      )
    `)
    .gte('created_at', twoWeeksAgo.toISOString())
  
  if (matchesError || !matches) {
    return 0
  }
  
  const sustainedMatches = matches.filter(match => {
    const interactionCount = match.interactions?.length || 0
    const rsvpCount = match.rsvps?.length || 0
    return interactionCount >= 2 || rsvpCount >= 1
  })
  
  return matches.length > 0 ? sustainedMatches.length / matches.length : 0
}

// Calculate median CDS
export async function getMedianCDS(): Promise<number> {
  const supabase = createServiceClient()
  
  const { data: interactions, error } = await supabase
    .from('interactions')
    .select(`
      match_id,
      created_at,
      match:matches!inner (
        created_at,
        user_a_id,
        user_b_id
      )
    `)
    .eq('interaction_type', 'message')
  
  if (error || !interactions) {
    return 0
  }
  
  // Group by match and calculate CDS for each
  const matchGroups = new Map<string, any[]>()
  
  for (const interaction of interactions) {
    const matchId = interaction.match_id
    if (!matchGroups.has(matchId)) {
      matchGroups.set(matchId, [])
    }
    matchGroups.get(matchId)!.push(interaction)
  }
  
  const cdsScores: number[] = []
  
  for (const [matchId, matchInteractions] of matchGroups) {
    const messageCount = matchInteractions.length
    const firstMessage = matchInteractions[0]
    const lastMessage = matchInteractions[matchInteractions.length - 1]
    
    const spanDays = Math.ceil(
      (new Date(lastMessage.created_at).getTime() - new Date(firstMessage.created_at).getTime()) / (1000 * 60 * 60 * 24)
    )
    const spanWeeks = spanDays / 7
    
    // Calculate quality indicators
    const avgMessageLength = 100 // Placeholder - would calculate from actual message content
    const hasCalendarEvent = false // Placeholder - would check for calendar events
    const hasWeekendMessages = false // Placeholder - would check message timestamps
    
    const cds = calculateCDS(messageCount, spanWeeks, hasCalendarEvent, avgMessageLength, hasWeekendMessages)
    cdsScores.push(cds)
  }
  
  // Calculate median
  if (cdsScores.length === 0) return 0
  
  cdsScores.sort((a, b) => a - b)
  const middle = Math.floor(cdsScores.length / 2)
  
  return cdsScores.length % 2 === 0
    ? (cdsScores[middle - 1] + cdsScores[middle]) / 2
    : cdsScores[middle]
}

// Get scaled CDS for EHS calculation
async function getScaledCDS(): Promise<number> {
  const medianCDS = await getMedianCDS()
  // Scale to 0-1 range (assuming max CDS of 10)
  return Math.min(1, medianCDS / 10)
}

// Get event conversion rate
export async function getEventConversionRate(): Promise<number> {
  const supabase = createServiceClient()
  
  const { data: events, error } = await supabase
    .from('events')
    .select(`
      id,
      rsvps (
        id,
        status
      )
    `)
    .eq('status', 'completed')
  
  if (error || !events) {
    return 0
  }
  
  let totalRSVPs = 0
  let attendingRSVPs = 0
  
  for (const event of events) {
    const rsvps = event.rsvps || []
    totalRSVPs += rsvps.length
    attendingRSVPs += rsvps.filter(rsvp => rsvp.status === 'attending').length
  }
  
  return totalRSVPs > 0 ? attendingRSVPs / totalRSVPs : 0
}

// Get second-order connections count
export async function getSecondOrderConnections(): Promise<number> {
  const supabase = createServiceClient()
  
  const { data: connections, error } = await supabase
    .from('matches')
    .select('user_a_id, user_b_id')
    .eq('status', 'accepted')
  
  if (error || !connections) {
    return 0
  }
  
  // Build adjacency list
  const adjacencyList = new Map<string, Set<string>>()
  
  for (const connection of connections) {
    if (!adjacencyList.has(connection.user_a_id)) {
      adjacencyList.set(connection.user_a_id, new Set())
    }
    if (!adjacencyList.has(connection.user_b_id)) {
      adjacencyList.set(connection.user_b_id, new Set())
    }
    
    adjacencyList.get(connection.user_a_id)!.add(connection.user_b_id)
    adjacencyList.get(connection.user_b_id)!.add(connection.user_a_id)
  }
  
  // Count second-order connections
  let secondOrderCount = 0
  const totalUsers = adjacencyList.size
  
  for (const [user, directConnections] of adjacencyList) {
    const secondOrderConnections = new Set<string>()
    
    for (const directConnection of directConnections) {
      const indirectConnections = adjacencyList.get(directConnection)
      if (indirectConnections) {
        for (const indirectConnection of indirectConnections) {
          if (indirectConnection !== user && !directConnections.has(indirectConnection)) {
            secondOrderConnections.add(indirectConnection)
          }
        }
      }
    }
    
    secondOrderCount += secondOrderConnections.size
  }
  
  // Normalize by total possible second-order connections
  const maxPossibleSecondOrder = totalUsers * (totalUsers - 1) / 2
  return maxPossibleSecondOrder > 0 ? secondOrderCount / maxPossibleSecondOrder : 0
}

// Calculate fairness gap across cohorts
export async function getFairnessGap(): Promise<number> {
  const supabase = createServiceClient()
  
  // Get helpful rates by role
  const { data: roleMetrics, error } = await supabase
    .from('v_helpful_rate')
    .select(`
      *,
      matches!inner (
        users!matches_user_a_id_fkey (
          role
        )
      )
    `)
    .order('week', { ascending: false })
    .limit(4) // Last 4 weeks
  
  if (error || !roleMetrics) {
    return 0
  }
  
  // Group by role and calculate helpful rates
  const roleRates = new Map<string, number[]>()
  
  for (const weekData of roleMetrics) {
    // This is simplified - in practice, you'd need more complex aggregation
    // based on the actual match and feedback data
  }
  
  // Calculate max gap between roles
  const rates = Array.from(roleRates.values()).map(rates => 
    rates.reduce((a, b) => a + b, 0) / rates.length
  )
  
  if (rates.length < 2) return 0
  
  const maxRate = Math.max(...rates)
  const minRate = Math.min(...rates)
  
  return maxRate - minRate
}

// Calculate reciprocity index
export async function getReciprocityIndex(): Promise<number> {
  const supabase = createServiceClient()
  
  // Get feedback where one user provided feedback but the other didn't
  const { data: feedback, error } = await supabase
    .from('feedback')
    .select(`
      match_id,
      user_id,
      other_user_id,
      rating
    `)
  
  if (error || !feedback) {
    return 0
  }
  
  // Group by match
  const matchFeedback = new Map<string, any[]>()
  
  for (const f of feedback) {
    if (!matchFeedback.has(f.match_id)) {
      matchFeedback.set(f.match_id, [])
    }
    matchFeedback.get(f.match_id)!.push(f)
  }
  
  let reciprocalMatches = 0
  let totalMatches = matchFeedback.size
  
  for (const [matchId, feedbacks] of matchFeedback) {
    if (feedbacks.length === 2) {
      reciprocalMatches++
    }
  }
  
  return totalMatches > 0 ? reciprocalMatches / totalMatches : 0
}

// Get coverage diversity metrics
export async function getCoverageMetrics(): Promise<CoverageMetrics[]> {
  const supabase = createServiceClient()
  
  const { data, error } = await supabase
    .from('v_coverage_diversity')
    .select('*')
    .order('user_count', { ascending: false })
  
  if (error || !data) {
    return []
  }
  
  return data
}

// Get weekly metrics for dashboard
export async function getWeeklyMetrics(weeks: number = 12): Promise<WeeklyMetrics[]> {
  const supabase = createServiceClient()
  
  const { data, error } = await supabase
    .from('v_helpful_rate')
    .select('*')
    .order('week', { ascending: false })
    .limit(weeks)
  
  if (error || !data) {
    return []
  }
  
  return data.map(row => ({
    week: row.week,
    total_matches: row.total_matches,
    feedback_count: row.feedback_count,
    helpful_count: row.helpful_count,
    helpful_rate_percent: row.helpful_rate_percent,
    ghost_count: 0, // Would need to join with ghost rate view
    ghost_rate_percent: 0
  }))
}

// Get comprehensive health metrics
export async function getHealthMetrics(): Promise<HealthMetrics> {
  const [
    helpfulRate,
    sustainedMatchRate,
    medianCDS,
    eventConversion,
    ehs,
    ghostRate,
    fairnessGap,
    reciprocityIndex
  ] = await Promise.all([
    getHelpfulRate(),
    getSustainedMatchRate(),
    getMedianCDS(),
    getEventConversionRate(),
    calculateEHS(),
    getGhostRate(),
    getFairnessGap(),
    getReciprocityIndex()
  ])
  
  // Calculate coverage score
  const coverageMetrics = await getCoverageMetrics()
  const coverageScore = coverageMetrics.length > 0 
    ? coverageMetrics.reduce((sum, metric) => sum + metric.coverage_percent, 0) / coverageMetrics.length
    : 0
  
  return {
    helpful_rate: Math.round(helpfulRate * 100) / 100,
    sustained_match_rate: Math.round(sustainedMatchRate * 100) / 100,
    cds_median: Math.round(medianCDS * 100) / 100,
    event_conversion: Math.round(eventConversion * 100) / 100,
    ehs: Math.round(ehs),
    ghost_rate: Math.round(ghostRate * 100) / 100,
    fairness_gap: Math.round(fairnessGap * 100) / 100,
    reciprocity_index: Math.round(reciprocityIndex * 100) / 100,
    coverage_score: Math.round(coverageScore * 100) / 100
  }
}

// Check if metrics meet pilot success criteria
export function checkPilotSuccess(metrics: HealthMetrics): {
  passed: boolean
  criteria: Record<string, { target: number; actual: number; passed: boolean }>
} {
  const criteria = {
    helpful_rate: { target: 0.18, actual: metrics.helpful_rate, passed: metrics.helpful_rate >= 0.18 },
    sustained_match_rate: { target: 0.30, actual: metrics.sustained_match_rate, passed: metrics.sustained_match_rate >= 0.30 },
    cds_median: { target: 4.0, actual: metrics.cds_median, passed: metrics.cds_median >= 4.0 },
    event_conversion: { target: 0.25, actual: metrics.event_conversion, passed: metrics.event_conversion >= 0.25 },
    ehs: { target: 65, actual: metrics.ehs, passed: metrics.ehs >= 65 }
  }
  
  const passed = Object.values(criteria).every(c => c.passed)
  
  return { passed, criteria }
}

// Check guardrails
export function checkGuardrails(metrics: HealthMetrics): {
  passed: boolean
  violations: string[]
} {
  const violations: string[] = []
  
  if (metrics.ghost_rate > 0.35) {
    violations.push(`Ghost rate ${(metrics.ghost_rate * 100).toFixed(1)}% exceeds 35% limit`)
  }
  
  if (metrics.fairness_gap > 0.06) {
    violations.push(`Fairness gap ${(metrics.fairness_gap * 100).toFixed(1)}pp exceeds 6pp limit`)
  }
  
  if (metrics.reciprocity_index < 0.90) {
    violations.push(`Reciprocity index ${(metrics.reciprocity_index * 100).toFixed(1)}% below 90% target`)
  }
  
  return {
    passed: violations.length === 0,
    violations
  }
}
