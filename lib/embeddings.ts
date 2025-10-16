import { createServiceClient } from './supabase'
import { errorHandler, validateEmbeddingInput, createRetryWrapper, AIError } from './error-handler'

// BGE-large-en-v1.5 embedding dimensions
const EMBEDDING_DIMENSION = 768

export type EmbeddingField = 'strengths' | 'needs' | 'goals' | 'values'

export interface EmbeddingData {
  user_id: string
  field_type: EmbeddingField
  text_content: string
  embedding: number[]
}

// Core embedding generation function (with retry logic)
async function _generateEmbedding(text: string): Promise<number[]> {
  // Validate input using error handler
  validateEmbeddingInput(text)

  // Clean and truncate text
  const cleanText = text.trim().substring(0, 512) // BGE has 512 token limit

  const apiKey = process.env.HUGGINGFACE_API_KEY
  
  if (!apiKey) {
    throw new AIError(
      'HUGGINGFACE_API_KEY is required',
      'ai_service',
      'critical',
      { operation: 'generateEmbedding' },
      'AI service configuration error. Please contact support.'
    )
  }

  const response = await fetch(
    'https://api-inference.huggingface.co/models/BAAI/bge-large-en-v1.5',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: cleanText,
        options: {
          normalize_embeddings: true, // Unit normalization for cosine similarity
        },
      }),
    }
  )
  
  if (!response.ok) {
    if (response.status === 503) {
      throw new AIError(
        'Model is loading, please wait',
        'ai_service',
        'medium',
        { operation: 'generateEmbedding' },
        'Our AI is warming up. Please try again in a moment.',
        true // retryable
      )
    }
    
    if (response.status === 429) {
      throw new AIError(
        'Rate limit exceeded',
        'rate_limit',
        'medium',
        { operation: 'generateEmbedding' },
        'Too many requests. Please wait a moment and try again.',
        true // retryable
      )
    }
    
    throw new AIError(
      `Embedding generation failed: ${response.status} ${response.statusText}`,
      'ai_service',
      'high',
      { operation: 'generateEmbedding' },
      'AI service temporarily unavailable. Please try again.',
      true // retryable
    )
  }
  
  const data = await response.json()
  
  // Handle different response formats
  let embeddings: number[]
  
  if (Array.isArray(data) && data.length > 0) {
    embeddings = data[0] as number[]
  } else if (data.embeddings && Array.isArray(data.embeddings) && data.embeddings.length > 0) {
    embeddings = data.embeddings[0] as number[]
  } else if (data.embedding && Array.isArray(data.embedding)) {
    embeddings = data.embedding as number[]
  } else {
    throw new AIError(
      'Invalid embedding response format',
      'ai_service',
      'high',
      { operation: 'generateEmbedding' },
      'AI service returned unexpected data. Please try again.'
    )
  }
  
  // Validate embedding dimensions
  if (!Array.isArray(embeddings) || embeddings.length !== EMBEDDING_DIMENSION) {
    throw new AIError(
      `Invalid embedding dimensions: expected ${EMBEDDING_DIMENSION}, got ${embeddings?.length || 0}`,
      'ai_service',
      'high',
      { operation: 'generateEmbedding' },
      'AI service returned invalid data. Please try again.'
    )
  }
  
  // Validate embedding values
  if (embeddings.some(val => typeof val !== 'number' || !isFinite(val))) {
    throw new AIError(
      'Embedding contains invalid numeric values',
      'ai_service',
      'high',
      { operation: 'generateEmbedding' },
      'AI service returned invalid data. Please try again.'
    )
  }
  
  return embeddings
}

// Generate embeddings using Hugging Face API (BGE-large-en-v1.5) with retry wrapper
export const generateEmbedding = createRetryWrapper(_generateEmbedding, 3, 1000)

// Generate embeddings for user profile fields
export async function generateUserEmbeddings(
  userId: string,
  profileData: {
    strengths?: string[]
    needs?: string[]
    goals?: string[]
    values?: string[]
  }
): Promise<EmbeddingData[]> {
  const embeddings: EmbeddingData[] = []
  
  for (const [field, items] of Object.entries(profileData)) {
    if (!items || items.length === 0) continue
    
    const fieldType = field as EmbeddingField
    const textContent = items.join(', ')
    
    try {
      const embedding = await generateEmbedding(textContent)
      
      embeddings.push({
        user_id: userId,
        field_type: fieldType,
        text_content: textContent,
        embedding
      })
    } catch (error) {
      console.error(`Failed to generate embedding for ${field}:`, error)
      // Continue with other fields even if one fails
    }
  }
  
  return embeddings
}

// Save embeddings to database
export async function saveEmbeddings(embeddings: EmbeddingData[]): Promise<void> {
  const supabase = createServiceClient()
  
  const embeddingsToInsert = embeddings.map(emb => ({
    user_id: emb.user_id,
    field_type: emb.field_type,
    text_content: emb.text_content,
    embedding: `[${emb.embedding.join(',')}]`, // Convert to PostgreSQL array format
  }))
  
  const { error } = await supabase
    .from('embeddings')
    .upsert(embeddingsToInsert, {
      onConflict: 'user_id,field_type',
      ignoreDuplicates: false
    })
  
  if (error) {
    throw new Error(`Failed to save embeddings: ${error.message}`)
  }
}

// Update user embeddings after profile changes
export async function updateUserEmbeddings(
  userId: string,
  profileData: {
    strengths?: string[]
    needs?: string[]
    goals?: string[]
    values?: string[]
  }
): Promise<void> {
  const embeddings = await generateUserEmbeddings(userId, profileData)
  await saveEmbeddings(embeddings)
  
  // Refresh the materialized view
  const supabase = createServiceClient()
  await supabase.rpc('refresh_user_ann_view')
}

// Cosine similarity calculation
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length')
  }
  
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  
  normA = Math.sqrt(normA)
  normB = Math.sqrt(normB)
  
  if (normA === 0 || normB === 0) {
    return 0
  }
  
  return dotProduct / (normA * normB)
}

// Find similar users using vector similarity
export async function findSimilarUsers(
  userId: string,
  fieldType: EmbeddingField,
  limit: number = 100,
  excludeUserIds: string[] = []
): Promise<Array<{ user_id: string; similarity: number }>> {
  const supabase = createServiceClient()
  
  // Get the user's embedding
  const { data: userEmbedding, error: userError } = await supabase
    .from('embeddings')
    .select('embedding')
    .eq('user_id', userId)
    .eq('field_type', fieldType)
    .single()
  
  if (userError || !userEmbedding) {
    throw new Error(`User embedding not found for field ${fieldType}`)
  }
  
  // Query similar embeddings using pgvector
  let query = supabase
    .from('embeddings')
    .select('user_id, embedding')
    .eq('field_type', fieldType)
    .neq('user_id', userId)
    .order('embedding', { 
      ascending: false,
      referencedTable: 'embeddings',
      foreignTable: 'embeddings'
    })
    .limit(limit)
  
  if (excludeUserIds.length > 0) {
    query = query.not('user_id', 'in', `(${excludeUserIds.join(',')})`)
  }
  
  const { data: similarEmbeddings, error } = await query
  
  if (error) {
    throw new Error(`Failed to find similar users: ${error.message}`)
  }
  
  // Calculate cosine similarities
  const userVector = userEmbedding.embedding as number[]
  const results = similarEmbeddings.map(item => {
    const similarity = cosineSimilarity(userVector, item.embedding as number[])
    return {
      user_id: item.user_id,
      similarity
    }
  })
  
  // Sort by similarity (descending)
  return results.sort((a, b) => b.similarity - a.similarity)
}

// Batch embedding generation for multiple users
export async function batchGenerateEmbeddings(
  userIds: string[],
  profileDataMap: Record<string, {
    strengths?: string[]
    needs?: string[]
    goals?: string[]
    values?: string[]
  }>
): Promise<void> {
  const allEmbeddings: EmbeddingData[] = []
  
  for (const userId of userIds) {
    const profileData = profileDataMap[userId]
    if (!profileData) continue
    
    const embeddings = await generateUserEmbeddings(userId, profileData)
    allEmbeddings.push(...embeddings)
  }
  
  await saveEmbeddings(allEmbeddings)
}
