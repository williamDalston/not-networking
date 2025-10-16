/**
 * Environment validation utility
 * Ensures all required environment variables are present
 */

const requiredEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: 'Supabase project URL',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'Supabase anonymous key',
  SUPABASE_SERVICE_ROLE_KEY: 'Supabase service role key',
  HUGGINGFACE_API_KEY: 'Hugging Face API key for embeddings',
  OPENAI_API_KEY: 'OpenAI API key for narrative generation',
  NEXT_PUBLIC_POSTHOG_KEY: 'PostHog analytics key'
}

const optionalEnvVars = {
  NODE_ENV: 'Node environment (development, production, test)',
  DATABASE_URL: 'Database connection URL',
  REDIS_URL: 'Redis connection URL for caching'
}

export function validateEnvironment() {
  const missing = []
  const warnings = []

  // Check required variables
  Object.entries(requiredEnvVars).forEach(([key, description]) => {
    if (!process.env[key]) {
      missing.push({ key, description })
    }
  })

  // Check optional variables
  Object.entries(optionalEnvVars).forEach(([key, description]) => {
    if (!process.env[key]) {
      warnings.push({ key, description })
    }
  })

  if (missing.length > 0) {
    const errorMessage = `Missing required environment variables:\n${missing
      .map(({ key, description }) => `  - ${key}: ${description}`)
      .join('\n')}`
    
    throw new Error(errorMessage)
  }

  if (warnings.length > 0) {
    console.warn('Missing optional environment variables:')
    warnings.forEach(({ key, description }) => {
      console.warn(`  - ${key}: ${description}`)
    })
  }

  return true
}

export function getEnvironmentInfo() {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    hasSupabase: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    hasHuggingFace: !!process.env.HUGGINGFACE_API_KEY,
    hasOpenAI: !!process.env.OPENAI_API_KEY,
    hasPostHog: !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
    hasRedis: !!process.env.REDIS_URL
  }
}

// Validate environment on module load
if (typeof window === 'undefined') { // Only run on server side
  try {
    validateEnvironment()
  } catch (error) {
    console.error('Environment validation failed:', error.message)
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    }
  }
}
