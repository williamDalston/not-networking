import { 
  userRepository, 
  matchRepository, 
  embeddingRepository, 
  profileRepository 
} from './repositories'
import { generateEmbedding } from './embeddings'
import { calculateMatchScore, generateMatchExplanation } from './utils'

/**
 * User service for user-related business logic
 */
export class UserService {
  async getUserProfile(userId) {
    try {
      return await profileRepository.findByUserId(userId)
    } catch (error) {
      console.error('Error getting user profile:', error)
      throw error
    }
  }

  async updateUserProfile(userId, profileData) {
    try {
      // Validate profile data
      this.validateProfileData(profileData)
      
      const updatedProfile = await profileRepository.updateProfile(userId, profileData)
      
      // Regenerate embeddings if relevant fields changed
      if (this.shouldRegenerateEmbeddings(profileData)) {
        await this.regenerateEmbeddings(userId, updatedProfile)
      }
      
      return updatedProfile
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }

  validateProfileData(profileData) {
    const requiredFields = ['strengths', 'needs', 'goals', 'values']
    const missingFields = requiredFields.filter(field => 
      !profileData[field] || !Array.isArray(profileData[field]) || profileData[field].length === 0
    )
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }
  }

  shouldRegenerateEmbeddings(profileData) {
    const embeddingFields = ['strengths', 'needs', 'goals', 'values']
    return embeddingFields.some(field => profileData[field] !== undefined)
  }

  async regenerateEmbeddings(userId, profile) {
    try {
      const fields = ['strengths', 'needs', 'goals', 'values']
      
      for (const field of fields) {
        if (profile[field] && Array.isArray(profile[field]) && profile[field].length > 0) {
          const text = profile[field].join(' ')
          const embedding = await generateEmbedding(text)
          
          await embeddingRepository.upsertEmbedding(
            userId, 
            field, 
            embedding, 
            text
          )
        }
      }
    } catch (error) {
      console.error('Error regenerating embeddings:', error)
      throw error
    }
  }
}

/**
 * Matching service for match-related business logic
 */
export class MatchingService {
  constructor() {
    this.userService = new UserService()
  }

  async generateMatches(userId, limit = 3) {
    try {
      // Get user profile
      const userProfile = await profileRepository.findByUserId(userId)
      if (!userProfile) {
        throw new Error('User profile not found')
      }

      // Get existing matches to avoid duplicates
      const existingMatches = await matchRepository.findExistingMatches(userId)
      const existingUserIds = new Set()
      existingMatches?.forEach(match => {
        if (match.user1_id === userId) {
          existingUserIds.add(match.user2_id)
        } else {
          existingUserIds.add(match.user1_id)
        }
      })

      // Find candidate matches using different strategies
      const candidates = await this.findCandidateMatches(userId, userProfile, existingUserIds)

      if (candidates.length === 0) {
        return []
      }

      // Score and rank candidates
      const scoredCandidates = await this.scoreCandidates(userProfile, candidates)

      // Create matches for top candidates
      const matches = []
      for (let i = 0; i < Math.min(limit, scoredCandidates.length); i++) {
        const candidate = scoredCandidates[i]
        
        try {
          const match = await this.createMatch(userId, candidate)
          matches.push(match)
        } catch (error) {
          console.error('Error creating match:', error)
          // Continue with other candidates
        }
      }

      return matches
    } catch (error) {
      console.error('Error generating matches:', error)
      throw error
    }
  }

  async findCandidateMatches(userId, userProfile, existingUserIds) {
    const candidates = new Map()

    // Strategy 1: Complementary strengths/needs (40% of candidates)
    if (userProfile.strengths && userProfile.needs) {
      const strengthMatches = await embeddingRepository.findSimilarUsers(
        userProfile.strengths.join(' '), 'strengths', 20
      )
      const needMatches = await embeddingRepository.findSimilarUsers(
        userProfile.needs.join(' '), 'needs', 20
      )

      // Process strength matches
      for (const match of strengthMatches) {
        if (!existingUserIds.has(match.user_id) && match.user_id !== userId) {
          candidates.set(match.user_id, {
            userId: match.user_id,
            score: match.similarity * 0.4,
            reason: 'complementary_strengths'
          })
        }
      }

      // Process need matches
      for (const match of needMatches) {
        if (!existingUserIds.has(match.user_id) && match.user_id !== userId) {
          candidates.set(match.user_id, {
            userId: match.user_id,
            score: match.similarity * 0.4,
            reason: 'complementary_needs'
          })
        }
      }
    }

    // Strategy 2: Shared goals (40% of candidates)
    if (userProfile.goals) {
      const goalMatches = await embeddingRepository.findSimilarUsers(
        userProfile.goals.join(' '), 'goals', 20
      )

      for (const match of goalMatches) {
        if (!existingUserIds.has(match.user_id) && match.user_id !== userId) {
          candidates.set(match.user_id, {
            userId: match.user_id,
            score: match.similarity * 0.4,
            reason: 'shared_goals'
          })
        }
      }
    }

    // Strategy 3: Aligned values (20% of candidates)
    if (userProfile.values) {
      const valueMatches = await embeddingRepository.findSimilarUsers(
        userProfile.values.join(' '), 'values', 10
      )

      for (const match of valueMatches) {
        if (!existingUserIds.has(match.user_id) && match.user_id !== userId) {
          candidates.set(match.user_id, {
            userId: match.user_id,
            score: match.similarity * 0.2,
            reason: 'aligned_values'
          })
        }
      }
    }

    return Array.from(candidates.values())
  }

  async scoreCandidates(userProfile, candidates) {
    const candidateIds = candidates.map(c => c.userId)
    const candidateProfiles = await profileRepository.findByUserIds(candidateIds)

    return candidateProfiles.map(candidate => {
      const baseScore = candidates.find(c => c.userId === candidate.user_id)?.score || 0
      const detailedScore = calculateMatchScore(userProfile, candidate)
      const finalScore = (baseScore + detailedScore) / 2

      return {
        ...candidate,
        matchScore: finalScore,
        matchReason: candidates.find(c => c.userId === candidate.user_id)?.reason || 'general_compatibility'
      }
    }).sort((a, b) => b.matchScore - a.matchScore)
  }

  async createMatch(userId, candidate) {
    const explanation = generateMatchExplanation({
      evidence: {
        complementary_matches: candidate.matchReason.includes('complementary'),
        shared_goals: candidate.matchReason.includes('goals'),
        aligned_values: candidate.matchReason.includes('values'),
        industry_overlap: candidate.industry === candidate.industry
      }
    }, {}, candidate)

    return await matchRepository.createMatch(userId, candidate.user_id, {
      match_score: candidate.matchScore,
      explanation: explanation,
      evidence: {
        reason: candidate.matchReason,
        score_breakdown: {
          final_score: candidate.matchScore
        }
      }
    })
  }

  async getMatchesForUser(userId) {
    try {
      return await matchRepository.findByUser(userId)
    } catch (error) {
      console.error('Error getting matches:', error)
      throw error
    }
  }

  async updateMatchStatus(matchId, userId, status) {
    try {
      return await matchRepository.updateStatus(matchId, userId, status)
    } catch (error) {
      console.error('Error updating match status:', error)
      throw error
    }
  }

  async runMatchingPipeline() {
    try {
      const users = await userRepository.findActiveUsers()
      const results = []

      // Process users in parallel batches to improve performance
      const batchSize = 10
      for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize)
        
        const batchPromises = batch.map(async (user) => {
          try {
            const matches = await this.generateMatches(user.id, 3)
            return {
              userId: user.id,
              matchesGenerated: matches.length,
              success: true
            }
          } catch (error) {
            console.error(`Error generating matches for user ${user.id}:`, error)
            return {
              userId: user.id,
              matchesGenerated: 0,
              success: false,
              error: error.message
            }
          }
        })

        const batchResults = await Promise.all(batchPromises)
        results.push(...batchResults)
      }

      return results
    } catch (error) {
      console.error('Error running matching pipeline:', error)
      throw error
    }
  }
}

// Export singleton instances
export const userService = new UserService()
export const matchingService = new MatchingService()
