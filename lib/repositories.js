import { supabaseAdmin } from './supabase'

/**
 * Base repository class with common database operations
 */
class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName
  }

  async findById(id) {
    const { data, error } = await supabaseAdmin
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  async findAll(filters = {}, options = {}) {
    let query = supabaseAdmin.from(this.tableName).select('*')
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value)
      }
    })
    
    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit)
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }
    
    // Apply ordering
    if (options.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending !== false })
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  }

  async create(data) {
    const { data: result, error } = await supabaseAdmin
      .from(this.tableName)
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  async update(id, data) {
    const { data: result, error } = await supabaseAdmin
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  async delete(id) {
    const { error } = await supabaseAdmin
      .from(this.tableName)
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

/**
 * User repository with user-specific operations
 */
export class UserRepository extends BaseRepository {
  constructor() {
    super('users')
  }

  async findByEmail(email) {
    const { data, error } = await supabaseAdmin
      .from(this.tableName)
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) throw error
    return data
  }

  async findActiveUsers() {
    const { data, error } = await supabaseAdmin
      .from(this.tableName)
      .select('*')
      .eq('is_active', true)
      .eq('onboarding_completed', true)
    
    if (error) throw error
    return data
  }

  async updateProfile(userId, profileData) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert({
        user_id: userId,
        ...profileData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

/**
 * Match repository with match-specific operations
 */
export class MatchRepository extends BaseRepository {
  constructor() {
    super('matches')
  }

  async findByUser(userId) {
    const { data, error } = await supabaseAdmin
      .from(this.tableName)
      .select(`
        *,
        user1:users!matches_user1_id_fkey(*),
        user2:users!matches_user2_id_fkey(*)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  async findExistingMatches(userId) {
    const { data, error } = await supabaseAdmin
      .from(this.tableName)
      .select('user1_id, user2_id')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    
    if (error) throw error
    return data
  }

  async createMatch(user1Id, user2Id, matchData) {
    const { data, error } = await supabaseAdmin
      .from(this.tableName)
      .insert({
        user1_id: user1Id,
        user2_id: user2Id,
        ...matchData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async updateStatus(matchId, userId, status) {
    const { data, error } = await supabaseAdmin
      .from(this.tableName)
      .update({ status })
      .eq('id', matchId)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

/**
 * Embedding repository with vector operations
 */
export class EmbeddingRepository extends BaseRepository {
  constructor() {
    super('embeddings')
  }

  async findByUserAndType(userId, embeddingType) {
    const { data, error } = await supabaseAdmin
      .from(this.tableName)
      .select('embedding')
      .eq('user_id', userId)
      .eq('embedding_type', embeddingType)
      .single()
    
    if (error) throw error
    return data
  }

  async upsertEmbedding(userId, embeddingType, embedding, textContent) {
    const { data, error } = await supabaseAdmin
      .from(this.tableName)
      .upsert({
        user_id: userId,
        embedding_type: embeddingType,
        embedding: embedding,
        text_content: textContent
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async findSimilarUsers(queryEmbedding, embeddingType, limit = 50) {
    const { data, error } = await supabaseAdmin
      .rpc('match_embeddings', {
        query_embedding: queryEmbedding,
        match_threshold: 0.7,
        match_count: limit,
        embedding_type: embeddingType
      })
    
    if (error) throw error
    return data
  }
}

/**
 * Profile repository with profile-specific operations
 */
export class ProfileRepository extends BaseRepository {
  constructor() {
    super('profiles')
  }

  async findByUserId(userId) {
    const { data, error } = await supabaseAdmin
      .from(this.tableName)
      .select('*, users!inner(*)')
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data
  }

  async findByUserIds(userIds) {
    const { data, error } = await supabaseAdmin
      .from(this.tableName)
      .select('*, users!inner(*)')
      .in('user_id', userIds)
    
    if (error) throw error
    return data
  }
}

// Export singleton instances
export const userRepository = new UserRepository()
export const matchRepository = new MatchRepository()
export const embeddingRepository = new EmbeddingRepository()
export const profileRepository = new ProfileRepository()
