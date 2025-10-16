/**
 * Performance optimization utilities
 */

/**
 * Simple in-memory cache implementation
 * In production, replace with Redis
 */
class MemoryCache {
  constructor(defaultTtl = 300000) { // 5 minutes default
    this.cache = new Map()
    this.defaultTtl = defaultTtl
  }

  set(key, value, ttl = this.defaultTtl) {
    const expiresAt = Date.now() + ttl
    this.cache.set(key, { value, expiresAt })
  }

  get(key) {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  delete(key) {
    this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }

  size() {
    return this.cache.size
  }
}

// Global cache instance
export const cache = new MemoryCache()

/**
 * Cache decorator for functions
 */
export function cached(ttl = 300000) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function(...args) {
      const cacheKey = `${propertyKey}:${JSON.stringify(args)}`
      
      // Try to get from cache first
      const cached = cache.get(cacheKey)
      if (cached !== null) {
        return cached
      }

      // Execute original method
      const result = await originalMethod.apply(this, args)
      
      // Cache the result
      cache.set(cacheKey, result, ttl)
      
      return result
    }

    return descriptor
  }
}

/**
 * Batch processing utility
 */
export async function processBatch(items, processor, batchSize = 10) {
  const results = []
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(item => processor(item))
    )
    results.push(...batchResults)
  }
  
  return results
}

/**
 * Debounced function execution
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttled function execution
 */
export function throttle(func, limit) {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Retry mechanism with exponential backoff
 */
export async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries) {
        throw error
      }
      
      // Exponential backoff: delay = baseDelay * 2^attempt
      const delay = baseDelay * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError
}

/**
 * Performance monitoring decorator
 */
export function monitorPerformance(target, propertyKey, descriptor) {
  const originalMethod = descriptor.value

  descriptor.value = async function(...args) {
    const start = performance.now()
    
    try {
      const result = await originalMethod.apply(this, args)
      const duration = performance.now() - start
      
      console.log(`${propertyKey} executed in ${duration.toFixed(2)}ms`)
      
      return result
    } catch (error) {
      const duration = performance.now() - start
      console.error(`${propertyKey} failed after ${duration.toFixed(2)}ms:`, error)
      throw error
    }
  }

  return descriptor
}

/**
 * Memory usage monitoring
 */
export function getMemoryUsage() {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const usage = process.memoryUsage()
    return {
      rss: Math.round(usage.rss / 1024 / 1024), // MB
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
      external: Math.round(usage.external / 1024 / 1024), // MB
    }
  }
  return null
}

/**
 * Database query optimization helpers
 */
export class QueryOptimizer {
  static buildSelectQuery(table, fields = ['*'], filters = {}, options = {}) {
    let query = supabaseAdmin.from(table).select(fields.join(', '))
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          query = query.in(key, value)
        } else {
          query = query.eq(key, value)
        }
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
    
    return query
  }

  static async executeWithRetry(query, maxRetries = 3) {
    return retryWithBackoff(async () => {
      const { data, error } = await query
      if (error) throw error
      return data
    }, maxRetries)
  }
}
