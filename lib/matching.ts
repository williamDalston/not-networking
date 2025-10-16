import { createServiceClient } from './supabase'
import { findSimilarUsers } from './embeddings'
import type { Database } from './supabase'

type User = Database['public']['Tables']['users']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']
type Match = Database['public']['Tables']['matches']['Row']
type Embedding = Database['public']['Tables']['embeddings']['Row']

export interface MatchCandidate {
  user_id: string
  similarity: number
  match_type: string
  features: Record<string, any>
}

export interface MatchExplanation {
  evidence_tray: {
    your_need: string
    their_strength: string
    shared_goal: string
  }
  narrative: string
  confidence_score: number
}

// ANN-based candidate generation
export async function generateCandidates(
  userId: string,
  limit: number = 200
): Promise<MatchCandidate[]> {
  // Validate inputs
  if (!userId || typeof userId !== 'string') {
    throw new Error('Valid userId is required')
  }
  
  if (limit <= 0 || limit > 1000) {
    throw new Error('Limit must be between 1 and 1000')
  }

  const supabase = createServiceClient()
  
  try {
    // Get user profile and preferences
    const { data: userProfile, error: profileError } = await supabase
      .from('mv_user_ann')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (profileError) {
      console.error('Database error fetching user profile:', profileError)
      throw new Error(`Failed to fetch user profile: ${profileError.message}`)
    }
    
    if (!userProfile) {
      throw new Error(`User profile not found for user: ${userId}`)
    }
    
    // Validate user has required data
    if (!userProfile.is_onboarded) {
      throw new Error('User must complete onboarding before matching')
    }
    
    const candidates: MatchCandidate[] = []
  
    // Need → Strength matching
    if (userProfile.needs && userProfile.needs.length > 0) {
      try {
        const needSimilarities = await findSimilarUsers(
          userId,
          'needs',
          Math.floor(limit * 0.4) // 40% of candidates
        )
        
        for (const similarity of needSimilarities) {
          candidates.push({
            user_id: similarity.user_id,
            similarity: similarity.similarity,
            match_type: 'need_strength',
            features: {
              need_strength_similarity: similarity.similarity,
              match_direction: 'need_to_strength'
            }
          })
        }
      } catch (error) {
        console.error('Error in need-strength matching:', error)
        // Continue with other matching types
      }
    }
    
    // Goal → Goal matching
    if (userProfile.goals && userProfile.goals.length > 0) {
      try {
        const goalSimilarities = await findSimilarUsers(
          userId,
          'goals',
          Math.floor(limit * 0.4) // 40% of candidates
        )
        
        for (const similarity of goalSimilarities) {
          candidates.push({
            user_id: similarity.user_id,
            similarity: similarity.similarity,
            match_type: 'goal_alignment',
            features: {
              goal_similarity: similarity.similarity,
              match_direction: 'goal_to_goal'
            }
          })
        }
      } catch (error) {
        console.error('Error in goal-goal matching:', error)
        // Continue with other matching types
      }
    }
    
    // Values matching
    if (userProfile.values && userProfile.values.length > 0) {
      try {
        const valueSimilarities = await findSimilarUsers(
          userId,
          'values',
          Math.floor(limit * 0.2) // 20% of candidates
        )
        
        for (const similarity of valueSimilarities) {
          candidates.push({
            user_id: similarity.user_id,
            similarity: similarity.similarity,
            match_type: 'values_alignment',
            features: {
              values_similarity: similarity.similarity,
              match_direction: 'values_to_values'
            }
          })
        }
      } catch (error) {
        console.error('Error in values matching:', error)
        // Continue with other matching types
      }
    }
    
    // Remove duplicates and sort by similarity
    const uniqueCandidates = new Map<string, MatchCandidate>()
    
    for (const candidate of candidates) {
      // Validate candidate data
      if (!candidate.user_id || typeof candidate.similarity !== 'number' || candidate.similarity < 0 || candidate.similarity > 1) {
        console.warn('Invalid candidate data:', candidate)
        continue
      }
      
      const existing = uniqueCandidates.get(candidate.user_id)
      if (!existing || candidate.similarity > existing.similarity) {
        uniqueCandidates.set(candidate.user_id, candidate)
      }
    }
    
    const finalCandidates = Array.from(uniqueCandidates.values())
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
    
    if (finalCandidates.length === 0) {
      console.warn(`No candidates found for user ${userId}. User may need more profile data.`)
    }
    
    return finalCandidates
    
  } catch (error) {
    console.error('Error in generateCandidates:', error)
    throw new Error(`Candidate generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Feature engineering for interpretable scoring
export async function computeFeatures(
  userId: string,
  candidateId: string,
  baseSimilarity: number
): Promise<Record<string, any>> {
  const supabase = createServiceClient()
  
  // Get both users' profiles
  const [userProfile, candidateProfile] = await Promise.all([
    supabase.from('mv_user_ann').select('*').eq('id', userId).single(),
    supabase.from('mv_user_ann').select('*').eq('id', candidateId).single()
  ])
  
  if (userProfile.error || !userProfile.data) {
    throw new Error('User profile not found')
  }
  
  if (candidateProfile.error || !candidateProfile.data) {
    throw new Error('Candidate profile not found')
  }
  
  const user = userProfile.data
  const candidate = candidateProfile.data
  
  const features: Record<string, any> = {
    // Base similarity
    base_similarity: baseSimilarity,
    
    // Reciprocity indicators
    need_strength_reciprocity: 0,
    strength_need_reciprocity: 0,
    
    // Readiness compatibility
    readiness_compatibility: Math.abs((user.readiness_level || 5) - (candidate.readiness_level || 5)),
    
    // Availability overlap
    availability_overlap: Math.min(user.weekly_availability || 5, candidate.weekly_availability || 5),
    
    // Location bonus
    location_bonus: user.location === candidate.location ? 1 : 0,
    
    // Role compatibility
    role_compatibility: computeRoleCompatibility(user.role, candidate.role),
    
    // Tag overlap (Jaccard similarity)
    tag_overlap: computeTagOverlap(user, candidate),
    
    // Reputation (placeholder - would be computed from feedback)
    reputation_score: 1.0,
    
    // Novelty penalty (how many times they've been matched)
    novelty_penalty: await getNoveltyPenalty(userId, candidateId)
  }
  
  // Compute reciprocity
  if (user.needs && candidate.strengths) {
    const needStrengthOverlap = computeArrayOverlap(user.needs, candidate.strengths)
    const strengthNeedOverlap = computeArrayOverlap(user.strengths || [], candidate.needs || [])
    
    features.need_strength_reciprocity = needStrengthOverlap
    features.strength_need_reciprocity = strengthNeedOverlap
  }
  
  return features
}

// Linear scoring model (v0)
export function computeLinearScore(features: Record<string, any>): number {
  const weights = {
    base_similarity: 0.3,
    need_strength_reciprocity: 0.2,
    strength_need_reciprocity: 0.2,
    readiness_compatibility: -0.1, // Negative weight (closer is better)
    availability_overlap: 0.1,
    location_bonus: 0.1,
    role_compatibility: 0.1,
    tag_overlap: 0.05,
    reputation_score: 0.05,
    novelty_penalty: -0.1 // Negative weight (less novelty is better)
  }
  
  let score = 0
  for (const [feature, value] of Object.entries(features)) {
    const weight = weights[feature as keyof typeof weights] || 0
    score += weight * (value || 0)
  }
  
  return Math.max(0, Math.min(1, score)) // Clamp to [0, 1]
}

// Generate match explanation
export async function generateExplanation(
  userId: string,
  candidateId: string,
  matchType: string,
  features: Record<string, any>
): Promise<MatchExplanation> {
  const supabase = createServiceClient()
  
  const [userProfile, candidateProfile] = await Promise.all([
    supabase.from('mv_user_ann').select('*').eq('id', userId).single(),
    supabase.from('mv_user_ann').select('*').eq('id', candidateId).single()
  ])
  
  if (userProfile.error || candidateProfile.error) {
    throw new Error('Failed to fetch profiles for explanation')
  }
  
  const user = userProfile.data!
  const candidate = candidateProfile.data!
  
  // Extract evidence snippets
  const evidenceTray = {
    your_need: user.needs?.[0] || 'No specific need mentioned',
    their_strength: candidate.strengths?.[0] || 'No specific strength mentioned',
    shared_goal: findSharedGoal(user.goals || [], candidate.goals || []) || 'No shared goals identified'
  }
  
  // Generate narrative using LLM (placeholder - would use OpenAI API)
  const narrative = await generateNarrative(user, candidate, matchType, features)
  
  const confidenceScore = Math.min(0.95, Math.max(0.1, features.base_similarity || 0.5))
  
  return {
    evidence_tray: evidenceTray,
    narrative,
    confidence_score: confidenceScore
  }
}

// Linear Programming allocation (capacitated max-weight bipartite matching)
export async function allocateMatches(
  userId: string,
  candidates: MatchCandidate[],
  weeklyCap: number = 3
): Promise<MatchCandidate[]> {
  // Simple greedy allocation for now
  // In production, this would use PuLP for optimal allocation
  
  const allocated: MatchCandidate[] = []
  const used = new Set<string>()
  
  // Sort by score (computed from features)
  const scoredCandidates = await Promise.all(
    candidates.map(async (candidate) => {
      const features = await computeFeatures(userId, candidate.user_id, candidate.similarity)
      const score = computeLinearScore(features)
      return { ...candidate, score, features }
    })
  )
  
  scoredCandidates.sort((a, b) => b.score - a.score)
  
  for (const candidate of scoredCandidates) {
    if (allocated.length >= weeklyCap) break
    if (used.has(candidate.user_id)) continue
    
    // Check if user is available (not already matched this week)
    const isAvailable = await checkUserAvailability(userId, candidate.user_id)
    if (!isAvailable) continue
    
    allocated.push(candidate)
    used.add(candidate.user_id)
  }
  
  return allocated
}

// Serendipity module with MMR diversity
export function applySerendipityModule(
  candidates: MatchCandidate[],
  explorationBudget: number = 0.15
): MatchCandidate[] {
  const explorationCount = Math.floor(candidates.length * explorationBudget)
  const exploitationCount = candidates.length - explorationCount
  
  // Simple MMR implementation
  const selected: MatchCandidate[] = []
  const remaining = [...candidates]
  
  // Add top exploitation candidates
  for (let i = 0; i < exploitationCount && remaining.length > 0; i++) {
    selected.push(remaining.shift()!)
  }
  
  // Add diverse exploration candidates
  for (let i = 0; i < explorationCount && remaining.length > 0; i++) {
    const diverseCandidate = selectDiverseCandidate(remaining, selected)
    if (diverseCandidate) {
      selected.push(diverseCandidate)
      const index = remaining.indexOf(diverseCandidate)
      remaining.splice(index, 1)
    }
  }
  
  return selected
}

// Helper functions
function computeRoleCompatibility(userRole: string, candidateRole: string): number {
  if (userRole === 'both' || candidateRole === 'both') return 1
  if (userRole === candidateRole) return 0.5
  if ((userRole === 'giver' && candidateRole === 'seeker') || 
      (userRole === 'seeker' && candidateRole === 'giver')) return 1
  return 0.2
}

function computeArrayOverlap(arr1: string[], arr2: string[]): number {
  if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return 0
  
  const set1 = new Set(arr1)
  const set2 = new Set(arr2)
  const intersection = new Set([...set1].filter(x => set2.has(x)))
  const union = new Set([...set1, ...set2])
  
  return intersection.size / union.size
}

function computeTagOverlap(user: any, candidate: any): number {
  const userTags = [
    ...(user.strengths || []),
    ...(user.needs || []),
    ...(user.goals || []),
    ...(user.values || [])
  ]
  
  const candidateTags = [
    ...(candidate.strengths || []),
    ...(candidate.needs || []),
    ...(candidate.goals || []),
    ...(candidate.values || [])
  ]
  
  return computeArrayOverlap(userTags, candidateTags)
}

async function getNoveltyPenalty(userId: string, candidateId: string): Promise<number> {
  const supabase = createServiceClient()
  
  const { count } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true })
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
    .or(`user_a_id.eq.${candidateId},user_b_id.eq.${candidateId}`)
  
  return Math.min(1, (count || 0) / 10) // Penalty increases with previous matches
}

function findSharedGoal(goals1: string[], goals2: string[]): string | null {
  const set2 = new Set(goals2)
  return goals1.find(goal => set2.has(goal)) || null
}

async function generateNarrative(
  user: any,
  candidate: any,
  matchType: string,
  features: Record<string, any>
): Promise<string> {
  // Placeholder narrative generation
  // In production, this would use OpenAI API with structured prompts
  
  const narratives = {
    need_strength: `${user.full_name || 'You'} need help with ${user.needs?.[0] || 'your goals'}, and ${candidate.full_name || 'they'} excel at ${candidate.strengths?.[0] || 'providing support'}. This creates a natural synergy for collaboration.`,
    goal_alignment: `${user.full_name || 'You'} and ${candidate.full_name || 'they'} share the goal of ${findSharedGoal(user.goals || [], candidate.goals || []) || 'making meaningful connections'}. Working together could accelerate progress for both of you.`,
    values_alignment: `${user.full_name || 'You'} and ${candidate.full_name || 'they'} share similar values around ${user.values?.[0] || 'collaboration'}, creating a strong foundation for a meaningful professional relationship.`
  }
  
  return narratives[matchType as keyof typeof narratives] || 
         `${user.full_name || 'You'} and ${candidate.full_name || 'they'} have complementary profiles that suggest potential for valuable collaboration.`
}

async function checkUserAvailability(userId: string, candidateId: string): Promise<boolean> {
  const supabase = createServiceClient()
  
  const thisWeek = new Date()
  thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay()) // Start of week
  
  const { count } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true })
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
    .gte('allocation_week', thisWeek.toISOString().split('T')[0])
  
  return (count || 0) < 3 // Weekly cap of 3 matches
}

function selectDiverseCandidate(
  remaining: MatchCandidate[],
  selected: MatchCandidate[]
): MatchCandidate | null {
  // Simple diversity selection - pick candidate with different match_type
  const selectedTypes = new Set(selected.map(s => s.match_type))
  
  for (const candidate of remaining) {
    if (!selectedTypes.has(candidate.match_type)) {
      return candidate
    }
  }
  
  // If all types are represented, pick randomly
  return remaining[Math.floor(Math.random() * remaining.length)]
}

// Main matching pipeline
export async function runMatchingPipeline(userId: string): Promise<MatchCandidate[]> {
  // 1. Generate candidates using ANN
  const candidates = await generateCandidates(userId, 100)
  
  // 2. Apply serendipity module
  const diverseCandidates = applySerendipityModule(candidates, 0.15)
  
  // 3. Allocate matches with capacity constraints
  const allocatedMatches = await allocateMatches(userId, diverseCandidates, 3)
  
  // 4. Generate explanations for each match
  const matchesWithExplanations = await Promise.all(
    allocatedMatches.map(async (candidate) => {
      const features = await computeFeatures(userId, candidate.user_id, candidate.similarity)
      const explanation = await generateExplanation(userId, candidate.user_id, candidate.match_type, features)
      
      return {
        ...candidate,
        explanation,
        final_score: computeLinearScore(features)
      }
    })
  )
  
  return matchesWithExplanations
}
