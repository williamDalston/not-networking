import { supabaseAdmin } from './supabase'

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/BAAI/bge-large-en-v1.5'
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY

export async function generateEmbedding(text) {
  if (!HUGGINGFACE_API_KEY) {
    throw new Error('Hugging Face API key not configured')
  }

  try {
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text,
        options: {
          wait_for_model: true
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (Array.isArray(data) && data.length > 0) {
      return data[0] // Return the embedding vector
    }
    
    throw new Error('Invalid response format from Hugging Face API')
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw error
  }
}

export async function generateUserEmbeddings(userId, profile) {
  const embeddings = []
  
  try {
    // Generate embeddings for each field
    const fields = ['strengths', 'needs', 'goals', 'values']
    
    for (const field of fields) {
      if (profile[field] && Array.isArray(profile[field]) && profile[field].length > 0) {
        const text = profile[field].join(' ')
        const embedding = await generateEmbedding(text)
        
        // Store embedding in database
        const { error } = await supabaseAdmin
          .from('embeddings')
          .upsert({
            user_id: userId,
            embedding_type: field,
            embedding: embedding,
            text_content: text
          })
        
        if (error) {
          console.error(`Error storing ${field} embedding:`, error)
          throw error
        }
        
        embeddings.push({
          type: field,
          embedding: embedding,
          text: text
        })
      }
    }
    
    return embeddings
  } catch (error) {
    console.error('Error generating user embeddings:', error)
    throw error
  }
}

export async function findSimilarUsers(userId, embeddingType, limit = 50) {
  try {
    // Get user's embedding
    const { data: userEmbedding, error: embeddingError } = await supabaseAdmin
      .from('embeddings')
      .select('embedding')
      .eq('user_id', userId)
      .eq('embedding_type', embeddingType)
      .single()
    
    if (embeddingError || !userEmbedding) {
      throw new Error('User embedding not found')
    }
    
    // Find similar users using vector similarity
    const { data: similarUsers, error: similarityError } = await supabaseAdmin
      .rpc('match_embeddings', {
        query_embedding: userEmbedding.embedding,
        match_threshold: 0.7,
        match_count: limit,
        embedding_type: embeddingType
      })
    
    if (similarityError) {
      throw similarityError
    }
    
    return similarUsers || []
  } catch (error) {
    console.error('Error finding similar users:', error)
    throw error
  }
}

export async function calculateSimilarityScore(embedding1, embedding2) {
  if (embedding1.length !== embedding2.length) {
    throw new Error('Embeddings must have the same dimension')
  }
  
  // Calculate cosine similarity
  let dotProduct = 0
  let norm1 = 0
  let norm2 = 0
  
  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i]
    norm1 += embedding1[i] * embedding1[i]
    norm2 += embedding2[i] * embedding2[i]
  }
  
  norm1 = Math.sqrt(norm1)
  norm2 = Math.sqrt(norm2)
  
  if (norm1 === 0 || norm2 === 0) {
    return 0
  }
  
  return dotProduct / (norm1 * norm2)
}

export async function batchGenerateEmbeddings(texts) {
  const embeddings = []
  
  for (const text of texts) {
    try {
      const embedding = await generateEmbedding(text)
      embeddings.push(embedding)
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`Error generating embedding for text: ${text}`, error)
      embeddings.push(null)
    }
  }
  
  return embeddings
}
