import { supabaseAdmin } from './supabase'
import { findSimilarUsers, calculateSimilarityScore } from './embeddings'
import { calculateMatchScore, generateMatchExplanation } from './utils'

export async function generateMatches(userId, limit = 3) {
  try {
    // Get user profile
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (profileError || !userProfile) {
      throw new Error('User profile not found')
    }
    
    // Get user's basic info
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (userError || !user) {
      throw new Error('User not found')
    }
    
    // Get existing matches to avoid duplicates
    const { data: existingMatches, error: matchesError } = await supabaseAdmin
      .from('matches')
      .select('user1_id, user2_id')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    
    if (matchesError) {
      throw matchesError
    }
    
    const existingUserIds = new Set()
    existingMatches?.forEach(match => {
      if (match.user1_id === userId) {
        existingUserIds.add(match.user2_id)
      } else {
        existingUserIds.add(match.user1_id)
      }
    })
    
    // Find candidate matches using different strategies
    const candidates = new Map()
    
    // Strategy 1: Complementary strengths/needs (40% of candidates)
    if (userProfile.strengths && userProfile.needs) {
      const strengthMatches = await findSimilarUsers(userId, 'strengths', 20)
      const needMatches = await findSimilarUsers(userId, 'needs', 20)
      
      // Find users who need our strengths
      for (const match of strengthMatches) {
        if (!existingUserIds.has(match.user_id) && match.user_id !== userId) {
          const score = match.similarity * 0.4
          candidates.set(match.user_id, {
            userId: match.user_id,
            score: score,
            reason: 'complementary_strengths'
          })
        }
      }
      
      // Find users who have what we need
      for (const match of needMatches) {
        if (!existingUserIds.has(match.user_id) && match.user_id !== userId) {
          const score = match.similarity * 0.4
          candidates.set(match.user_id, {
            userId: match.user_id,
            score: score,
            reason: 'complementary_needs'
          })
        }
      }
    }
    
    // Strategy 2: Shared goals (40% of candidates)
    if (userProfile.goals) {
      const goalMatches = await findSimilarUsers(userId, 'goals', 20)
      
      for (const match of goalMatches) {
        if (!existingUserIds.has(match.user_id) && match.user_id !== userId) {
          const score = match.similarity * 0.4
          candidates.set(match.user_id, {
            userId: match.user_id,
            score: score,
            reason: 'shared_goals'
          })
        }
      }
    }
    
    // Strategy 3: Aligned values (20% of candidates)
    if (userProfile.values) {
      const valueMatches = await findSimilarUsers(userId, 'values', 10)
      
      for (const match of valueMatches) {
        if (!existingUserIds.has(match.user_id) && match.user_id !== userId) {
          const score = match.similarity * 0.2
          candidates.set(match.user_id, {
            userId: match.user_id,
            score: score,
            reason: 'aligned_values'
          })
        }
      }
    }
    
    // Get detailed profiles for top candidates
    const candidateIds = Array.from(candidates.keys()).slice(0, limit * 3) // Get more candidates for scoring
    
    if (candidateIds.length === 0) {
      return []
    }
    
    const { data: candidateProfiles, error: candidatesError } = await supabaseAdmin
      .from('profiles')
      .select('*, users!inner(*)')
      .in('user_id', candidateIds)
    
    if (candidatesError) {
      throw candidatesError
    }
    
    // Score and rank candidates
    const scoredCandidates = candidateProfiles?.map(candidate => {
      const baseScore = candidates.get(candidate.user_id)?.score || 0
      const detailedScore = calculateMatchScore(userProfile, candidate)
      const finalScore = (baseScore + detailedScore) / 2
      
      return {
        ...candidate,
        matchScore: finalScore,
        matchReason: candidates.get(candidate.user_id)?.reason || 'general_compatibility'
      }
    }).sort((a, b) => b.matchScore - a.matchScore) || []
    
    // Create matches for top candidates
    const matches = []
    for (let i = 0; i < Math.min(limit, scoredCandidates.length); i++) {
      const candidate = scoredCandidates[i]
      
      // Generate match explanation
      const explanation = generateMatchExplanation({
        evidence: {
          complementary_matches: candidate.matchReason.includes('complementary'),
          shared_goals: candidate.matchReason.includes('goals'),
          aligned_values: candidate.matchReason.includes('values'),
          industry_overlap: userProfile.industry === candidate.industry
        }
      }, userProfile, candidate)
      
      // Create match record
      const { data: match, error: matchError } = await supabaseAdmin
        .from('matches')
        .insert({
          user1_id: userId,
          user2_id: candidate.user_id,
          match_score: candidate.matchScore,
          explanation: explanation,
          evidence: {
            reason: candidate.matchReason,
            score_breakdown: {
              base_score: baseScore,
              detailed_score: detailedScore,
              final_score: candidate.matchScore
            }
          }
        })
        .select()
        .single()
      
      if (matchError) {
        console.error('Error creating match:', matchError)
        continue
      }
      
      matches.push(match)
    }
    
    return matches
  } catch (error) {
    console.error('Error generating matches:', error)
    throw error
  }
}

export async function getMatchesForUser(userId) {
  try {
    const { data: matches, error } = await supabaseAdmin
      .from('matches')
      .select(`
        *,
        user1:users!matches_user1_id_fkey(*),
        user2:users!matches_user2_id_fkey(*)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    
    if (error) {
      throw error
    }
    
    return matches || []
  } catch (error) {
    console.error('Error getting matches:', error)
    throw error
  }
}

export async function updateMatchStatus(matchId, userId, status) {
  try {
    const { data: match, error } = await supabaseAdmin
      .from('matches')
      .update({ status })
      .eq('id', matchId)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .select()
      .single()
    
    if (error) {
      throw error
    }
    
    return match
  } catch (error) {
    console.error('Error updating match status:', error)
    throw error
  }
}

export async function submitMatchFeedback(matchId, userId, feedback) {
  try {
    const { data, error } = await supabaseAdmin
      .from('feedback')
      .insert({
        match_id: matchId,
        user_id: userId,
        helpful: feedback.helpful,
        feedback_text: feedback.text,
        rating: feedback.rating
      })
      .select()
      .single()
    
    if (error) {
      throw error
    }
    
    // Update match with feedback
    const feedbackField = userId === (await supabaseAdmin
      .from('matches')
      .select('user1_id')
      .eq('id', matchId)
      .single()).data?.user1_id ? 'feedback_user1' : 'feedback_user2'
    
    await supabaseAdmin
      .from('matches')
      .update({ [feedbackField]: feedback })
      .eq('id', matchId)
    
    return data
  } catch (error) {
    console.error('Error submitting feedback:', error)
    throw error
  }
}

export async function runMatchingPipeline() {
  try {
    // Get all active users who have completed onboarding
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('is_active', true)
      .eq('onboarding_completed', true)
    
    if (usersError) {
      throw usersError
    }
    
    const results = []
    
    for (const user of users || []) {
      try {
        const matches = await generateMatches(user.id, 3)
        results.push({
          userId: user.id,
          matchesGenerated: matches.length,
          success: true
        })
      } catch (error) {
        console.error(`Error generating matches for user ${user.id}:`, error)
        results.push({
          userId: user.id,
          matchesGenerated: 0,
          success: false,
          error: error.message
        })
      }
    }
    
    return results
  } catch (error) {
    console.error('Error running matching pipeline:', error)
    throw error
  }
}
