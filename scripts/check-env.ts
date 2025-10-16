#!/usr/bin/env ts-node

/**
 * Environment variables validation script
 * 
 * This script checks that all required environment variables are set
 * before deployment or running the application.
 */

import 'dotenv/config'

interface EnvVar {
  name: string
  required: boolean
  description: string
  category: 'public' | 'private' | 'optional'
}

const requiredEnvVars: EnvVar[] = [
  // Public environment variables (safe to expose to client)
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    required: true,
    description: 'Supabase project URL',
    category: 'public'
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    required: true,
    description: 'Supabase anonymous key',
    category: 'public'
  },
  {
    name: 'NEXT_PUBLIC_POSTHOG_HOST',
    required: false,
    description: 'PostHog instance host',
    category: 'public'
  },
  {
    name: 'NEXT_PUBLIC_POSTHOG_API_KEY',
    required: false,
    description: 'PostHog project API key',
    category: 'public'
  },

  // Private environment variables (server-side only)
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    required: true,
    description: 'Supabase service role key (keep secret!)',
    category: 'private'
  },
  {
    name: 'HUGGINGFACE_API_KEY',
    required: true,
    description: 'Hugging Face API key for embeddings',
    category: 'private'
  },
  {
    name: 'OPENAI_API_KEY',
    required: true,
    description: 'OpenAI API key for transcription and narratives',
    category: 'private'
  },

  // Optional environment variables
  {
    name: 'NEXTAUTH_SECRET',
    required: false,
    description: 'NextAuth.js secret for session encryption',
    category: 'optional'
  },
  {
    name: 'NODE_ENV',
    required: false,
    description: 'Environment (development, production, test)',
    category: 'optional'
  }
]

function checkEnvironmentVariables() {
  console.log('🔍 Checking environment variables...\n')

  let allGood = true
  const results = {
    public: { found: 0, missing: 0, total: 0 },
    private: { found: 0, missing: 0, total: 0 },
    optional: { found: 0, missing: 0, total: 0 }
  }

  // Check each environment variable
  for (const envVar of requiredEnvVars) {
    const isSet = !!process.env[envVar.name]
    const isRequired = envVar.required
    
    if (isSet) {
      console.log(`✅ ${envVar.name} - ${envVar.description}`)
      results[envVar.category].found++
    } else if (isRequired) {
      console.log(`❌ ${envVar.name} - ${envVar.description} (REQUIRED)`)
      results[envVar.category].missing++
      allGood = false
    } else {
      console.log(`⚠️  ${envVar.name} - ${envVar.description} (optional)`)
      results[envVar.category].missing++
    }
    
    results[envVar.category].total++
  }

  // Summary
  console.log('\n📊 Summary:')
  console.log(`   Public variables: ${results.public.found}/${results.public.total} set`)
  console.log(`   Private variables: ${results.private.found}/${results.private.total} set`)
  console.log(`   Optional variables: ${results.optional.found}/${results.optional.total} set`)

  // Specific checks
  console.log('\n🔧 Additional Checks:')

  // Check Supabase URL format
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (supabaseUrl && !supabaseUrl.includes('supabase.co')) {
    console.log('⚠️  NEXT_PUBLIC_SUPABASE_URL does not appear to be a valid Supabase URL')
  }

  // Check if in production
  const nodeEnv = process.env.NODE_ENV
  if (nodeEnv === 'production') {
    console.log('🚨 Running in production mode - ensure all secrets are properly configured')
  }

  // Check for development mode
  if (nodeEnv === 'development') {
    console.log('🛠️  Running in development mode - some optional features may be disabled')
  }

  // Final result
  if (allGood) {
    console.log('\n🎉 All required environment variables are set!')
    console.log('✅ Ready for deployment')
  } else {
    console.log('\n❌ Missing required environment variables!')
    console.log('🚨 Please set all required variables before proceeding')
    console.log('\n📖 See docs/API_KEYS_SETUP.md for setup instructions')
  }

  return allGood
}

// Generate environment file template
function generateEnvTemplate() {
  console.log('\n📝 Environment file template (.env.local):')
  console.log('```')
  
  console.log('# Supabase (Required)')
  console.log('NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"')
  console.log('SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"')
  console.log('')
  
  console.log('# AI Services (Required)')
  console.log('HUGGINGFACE_API_KEY="your-huggingface-api-key"')
  console.log('OPENAI_API_KEY="your-openai-api-key"')
  console.log('')
  
  console.log('# Analytics (Optional)')
  console.log('NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"')
  console.log('NEXT_PUBLIC_POSTHOG_API_KEY="your-posthog-api-key"')
  console.log('')
  
  console.log('# NextAuth (Optional)')
  console.log('NEXTAUTH_SECRET="your-nextauth-secret"')
  console.log('')
  
  console.log('# Environment')
  console.log('NODE_ENV="development"')
  
  console.log('```')
}

// Main execution
function main() {
  const args = process.argv.slice(2)
  
  if (args.includes('--template')) {
    generateEnvTemplate()
    return
  }
  
  if (args.includes('--help')) {
    console.log('Environment Variables Checker')
    console.log('Usage: npm run check-env [options]')
    console.log('')
    console.log('Options:')
    console.log('  --template    Generate .env.local template')
    console.log('  --help        Show this help message')
    return
  }
  
  const success = checkEnvironmentVariables()
  process.exit(success ? 0 : 1)
}

// Run the script
if (require.main === module) {
  main()
}

export { checkEnvironmentVariables, generateEnvTemplate }