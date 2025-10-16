/**
 * @jest-environment node
 */

import { calculateMatchScore, generateMatchExplanation } from '../lib/utils'
import { generateEmbedding } from '../lib/embeddings'

// Mock Supabase
jest.mock('../lib/supabase', () => ({
  supabaseAdmin: {
    auth: {
      getUser: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: {}, error: null }))
        }))
      })),
      upsert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: {}, error: null }))
        }))
      }))
    }))
  }
}))

// Mock Hugging Face API
global.fetch = jest.fn()

describe('Utils', () => {
  describe('calculateMatchScore', () => {
    it('should calculate match score correctly for complementary strengths/needs', () => {
      const user1 = {
        strengths: ['JavaScript', 'React'],
        needs: ['Python', 'Machine Learning'],
        goals: ['Build web apps'],
        values: ['Innovation'],
        industry: 'Technology'
      }

      const user2 = {
        strengths: ['Python', 'Machine Learning'],
        needs: ['JavaScript', 'React'],
        goals: ['Build web apps'],
        values: ['Innovation'],
        industry: 'Technology'
      }

      const score = calculateMatchScore(user1, user2)
      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThanOrEqual(1)
    })

    it('should return 0 for users with no overlapping data', () => {
      const user1 = {
        strengths: ['JavaScript'],
        needs: ['Python'],
        goals: ['Build web apps'],
        values: ['Innovation'],
        industry: 'Technology'
      }

      const user2 = {
        strengths: ['Design'],
        needs: ['Marketing'],
        goals: ['Create art'],
        values: ['Creativity'],
        industry: 'Design'
      }

      const score = calculateMatchScore(user1, user2)
      expect(score).toBe(0)
    })

    it('should handle missing data gracefully', () => {
      const user1 = {
        strengths: ['JavaScript'],
        needs: ['Python']
      }

      const user2 = {
        strengths: ['Python'],
        needs: ['JavaScript']
      }

      const score = calculateMatchScore(user1, user2)
      expect(score).toBeGreaterThan(0)
    })
  })

  describe('generateMatchExplanation', () => {
    it('should generate explanation for complementary matches', () => {
      const match = {
        evidence: {
          complementary_matches: true,
          shared_goals: false,
          aligned_values: false,
          industry_overlap: false
        }
      }

      const explanation = generateMatchExplanation(match, {}, {})
      expect(explanation).toContain('complementary skills')
    })

    it('should generate explanation for shared goals', () => {
      const match = {
        evidence: {
          complementary_matches: false,
          shared_goals: true,
          aligned_values: false,
          industry_overlap: false
        }
      }

      const explanation = generateMatchExplanation(match, {}, {})
      expect(explanation).toContain('professional goals')
    })

    it('should generate default explanation when no evidence', () => {
      const match = {
        evidence: {}
      }

      const explanation = generateMatchExplanation(match, {}, {})
      expect(explanation).toContain('meaningful professional connection')
    })
  })
})

describe('Embeddings', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  describe('generateEmbedding', () => {
    it('should generate embedding for valid text', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve([[0.1, 0.2, 0.3]])
      }
      fetch.mockResolvedValueOnce(mockResponse)

      const embedding = await generateEmbedding('test text')
      expect(embedding).toEqual([0.1, 0.2, 0.3])
      expect(fetch).toHaveBeenCalledWith(
        'https://api-inference.huggingface.co/models/BAAI/bge-large-en-v1.5',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer'),
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            inputs: 'test text',
            options: {
              wait_for_model: true
            }
          })
        })
      )
    })

    it('should throw error for missing API key', async () => {
      const originalKey = process.env.HUGGINGFACE_API_KEY
      delete process.env.HUGGINGFACE_API_KEY

      await expect(generateEmbedding('test text')).rejects.toThrow('Hugging Face API key not configured')

      process.env.HUGGINGFACE_API_KEY = originalKey
    })

    it('should throw error for API failure', async () => {
      const mockResponse = {
        ok: false,
        statusText: 'Internal Server Error'
      }
      fetch.mockResolvedValueOnce(mockResponse)

      await expect(generateEmbedding('test text')).rejects.toThrow('Hugging Face API error: Internal Server Error')
    })

    it('should throw error for invalid response format', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ error: 'Invalid format' })
      }
      fetch.mockResolvedValueOnce(mockResponse)

      await expect(generateEmbedding('test text')).rejects.toThrow('Invalid response format from Hugging Face API')
    })
  })
})

describe('Error Handling', () => {
  it('should handle network errors gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))

    await expect(generateEmbedding('test text')).rejects.toThrow('Network error')
  })
})
