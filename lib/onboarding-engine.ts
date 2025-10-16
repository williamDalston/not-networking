import { createServiceClient } from './supabase'
import { generateEmbedding } from './embeddings'

export interface OnboardingStep {
  id: string
  type: 'text' | 'multiselect' | 'slider' | 'confidence' | 'audio' | 'checkpoint'
  title: string
  description?: string
  required: boolean
  estimatedTime: number // seconds
  category: 'foundation' | 'strengths' | 'goals' | 'readiness' | 'reflection'
}

export interface UserResponse {
  stepId: string
  value: any
  timeSpent: number
  confidence?: number
  engagement: 'low' | 'medium' | 'high'
}

export interface OnboardingState {
  userId: string
  currentStep: number
  totalSteps: number
  responses: UserResponse[]
  flowType: 'reflective' | 'essential' | 'adaptive'
  engagementScore: number
  completionRate: number
  lastActivity: Date
}

export interface EngagementMetrics {
  averageTimePerStep: number
  averageAnswerLength: number
  confidenceVariance: number
  stepCompletionRate: number
  pauseFrequency: number
}

// Define all possible steps
const ALL_STEPS: OnboardingStep[] = [
  // Phase 0: Welcome & Compact
  {
    id: 'welcome',
    type: 'text',
    title: 'Welcome to The Ecosystem 🌱',
    description: 'This isn\'t a social network. It\'s a mirror for your growth.',
    required: true,
    estimatedTime: 30,
    category: 'foundation'
  },
  {
    id: 'ecosystem_compact',
    type: 'multiselect',
    title: 'The Ecosystem Compact',
    description: 'Before we begin — this is a space for genuine curiosity and generosity.',
    required: true,
    estimatedTime: 45,
    category: 'foundation'
  },
  
  // Phase 1: Orientation
  {
    id: 'current_work',
    type: 'text',
    title: 'What are you working on or exploring right now?',
    description: 'Share what\'s capturing your attention these days.',
    required: true,
    estimatedTime: 120,
    category: 'foundation'
  },
  {
    id: 'work_confidence',
    type: 'confidence',
    title: 'How clear are you about this?',
    description: 'No judgment — just helps SAM understand your context.',
    required: true,
    estimatedTime: 30,
    category: 'foundation'
  },
  {
    id: 'progress_vision',
    type: 'text',
    title: 'What would feel like progress over the next 3 months?',
    description: 'What kind of forward motion would energize you?',
    required: true,
    estimatedTime: 150,
    category: 'foundation'
  },
  
  // Phase 2: Strengths & Needs
  {
    id: 'strengths_confidence',
    type: 'confidence',
    title: 'How clear are you on your strengths right now?',
    description: 'This helps SAM know how to support you.',
    required: true,
    estimatedTime: 30,
    category: 'strengths'
  },
  {
    id: 'strengths_text',
    type: 'text',
    title: 'What are you unusually good at?',
    description: 'The things people often ask you about or come to you for.',
    required: true,
    estimatedTime: 180,
    category: 'strengths'
  },
  {
    id: 'strengths_archetypes',
    type: 'multiselect',
    title: 'Which of these resonate with you?',
    description: 'Let\'s explore together — select what feels right.',
    required: false,
    estimatedTime: 120,
    category: 'strengths'
  },
  {
    id: 'needs_text',
    type: 'text',
    title: 'Where could you use help or perspective right now?',
    description: 'What would make your path clearer or easier?',
    required: true,
    estimatedTime: 180,
    category: 'strengths'
  },
  {
    id: 'needs_importance',
    type: 'slider',
    title: 'How important is this to you right now?',
    description: 'Helps SAM prioritize matches.',
    required: true,
    estimatedTime: 30,
    category: 'strengths'
  },
  {
    id: 'value_creation',
    type: 'multiselect',
    title: 'Which best describes how you create value?',
    description: 'Select 1-3 that feel most true.',
    required: true,
    estimatedTime: 90,
    category: 'strengths'
  },
  
  // Phase 3: Goals & Values
  {
    id: 'progress_type',
    type: 'multiselect',
    title: 'What kind of progress feels meaningful to you right now?',
    description: 'Select 2-3 that resonate.',
    required: true,
    estimatedTime: 120,
    category: 'goals'
  },
  {
    id: 'shared_values',
    type: 'multiselect',
    title: 'What values do you want shared by people you meet here?',
    description: 'Select 3-5 that matter most to you.',
    required: true,
    estimatedTime: 90,
    category: 'goals'
  },
  {
    id: 'connection_preferences',
    type: 'multiselect',
    title: 'How do you prefer to connect?',
    description: 'Which ways feel right for you right now?',
    required: true,
    estimatedTime: 60,
    category: 'goals'
  },
  
  // Phase 4: Readiness
  {
    id: 'time_commitment',
    type: 'multiselect',
    title: 'Which feels right for you right now?',
    description: 'How much time can you realistically give to new connections?',
    required: true,
    estimatedTime: 60,
    category: 'readiness'
  },
  {
    id: 'serendipity_openness',
    type: 'slider',
    title: 'How open are you to serendipity?',
    description: '🌊 Calm and predictable ← → 🌪 Exploratory and unexpected',
    required: true,
    estimatedTime: 45,
    category: 'readiness'
  },
  
  // Phase 5: Reflection
  {
    id: 'human_detail',
    type: 'audio',
    title: 'Tell me something that makes you smile',
    description: 'A small story, quirk, or detail that captures who you are.',
    required: false,
    estimatedTime: 120,
    category: 'reflection'
  },
  {
    id: 'completion_checkpoint',
    type: 'checkpoint',
    title: 'How does this feel so far?',
    description: 'Take a moment to reflect on what you\'ve shared.',
    required: true,
    estimatedTime: 60,
    category: 'reflection'
  }
]

// Flow configurations
const FLOW_CONFIGS = {
  reflective: {
    steps: [
      'welcome', 'ecosystem_compact', 'current_work', 'work_confidence',
      'progress_vision', 'strengths_confidence', 'strengths_text', 
      'needs_text', 'needs_importance', 'value_creation',
      'progress_type', 'shared_values', 'connection_preferences',
      'time_commitment', 'serendipity_openness', 'human_detail', 'completion_checkpoint'
    ],
    estimatedTime: 1800, // 30 minutes
    targetUsers: 'contemplative, reflective users'
  },
  
  essential: {
    steps: [
      'welcome', 'current_work', 'work_confidence',
      'strengths_confidence', 'strengths_text', 'needs_text',
      'progress_type', 'shared_values', 'time_commitment', 'completion_checkpoint'
    ],
    estimatedTime: 900, // 15 minutes
    targetUsers: 'busy users, time-constrained'
  },
  
  adaptive: {
    steps: [], // Dynamically determined
    estimatedTime: 0,
    targetUsers: 'all users, adjusted based on engagement'
  }
}

// Engagement analysis
export function analyzeEngagement(responses: UserResponse[]): EngagementMetrics {
  if (responses.length === 0) {
    return {
      averageTimePerStep: 0,
      averageAnswerLength: 0,
      confidenceVariance: 0,
      stepCompletionRate: 0,
      pauseFrequency: 0
    }
  }
  
  const totalTime = responses.reduce((sum, r) => sum + r.timeSpent, 0)
  const totalLength = responses.reduce((sum, r) => {
    const length = typeof r.value === 'string' ? r.value.length : 0
    return sum + length
  }, 0)
  
  const confidences = responses
    .map(r => r.confidence)
    .filter(c => c !== undefined) as number[]
  
  const confidenceVariance = confidences.length > 1 
    ? Math.sqrt(confidences.reduce((sum, c) => sum + Math.pow(c - (confidences.reduce((a, b) => a + b, 0) / confidences.length), 2), 0) / confidences.length)
    : 0
  
  const pauses = responses.filter(r => r.timeSpent > 300).length // Pauses > 5 minutes
  
  return {
    averageTimePerStep: totalTime / responses.length,
    averageAnswerLength: totalLength / responses.length,
    confidenceVariance,
    stepCompletionRate: responses.length / responses.length, // Will be calculated against expected steps
    pauseFrequency: pauses / responses.length
  }
}

// Determine engagement level
export function getEngagementLevel(metrics: EngagementMetrics): 'low' | 'medium' | 'high' {
  const score = 
    (metrics.averageTimePerStep / 120) * 0.3 + // Time spent (normalized to 2 min)
    (metrics.averageAnswerLength / 100) * 0.3 + // Answer length (normalized to 100 chars)
    (1 - metrics.confidenceVariance) * 0.2 + // Low variance = consistent confidence
    (1 - metrics.pauseFrequency) * 0.2 // Fewer pauses = better flow
  
  if (score > 0.7) return 'high'
  if (score > 0.4) return 'medium'
  return 'low'
}

// Flow determination logic
export function determineFlowType(
  responses: UserResponse[],
  currentTime: Date,
  userTimezone?: string
): 'reflective' | 'essential' | 'adaptive' {
  
  if (responses.length === 0) {
    // Initial flow determination based on time and user behavior
    const hour = currentTime.getHours()
    const isEvening = hour >= 18 || hour <= 8
    
    // Default to adaptive, let engagement analysis decide
    return 'adaptive'
  }
  
  const metrics = analyzeEngagement(responses)
  const engagement = getEngagementLevel(metrics)
  
  // After first 3 responses, we can make a decision
  if (responses.length >= 3) {
    switch (engagement) {
      case 'high':
        return 'reflective'
      case 'medium':
        return 'adaptive'
      case 'low':
        return 'essential'
    }
  }
  
  return 'adaptive'
}

// Get next step in flow
export function getNextStep(
  state: OnboardingState,
  responses: UserResponse[]
): OnboardingStep | null {
  
  const flowType = state.flowType
  const currentStepIndex = state.currentStep
  
  // Determine which steps to include based on flow type
  let activeSteps: string[] = []
  
  switch (flowType) {
    case 'reflective':
      activeSteps = FLOW_CONFIGS.reflective.steps
      break
      
    case 'essential':
      activeSteps = FLOW_CONFIGS.essential.steps
      break
      
    case 'adaptive':
      // Dynamic flow based on engagement
      const metrics = analyzeEngagement(responses)
      const engagement = getEngagementLevel(metrics)
      
      if (engagement === 'high') {
        activeSteps = FLOW_CONFIGS.reflective.steps
      } else if (engagement === 'low') {
        activeSteps = FLOW_CONFIGS.essential.steps
      } else {
        // Medium engagement - hybrid flow
        activeSteps = [
          'welcome', 'current_work', 'work_confidence',
          'strengths_confidence', 'strengths_text', 'needs_text',
          'progress_type', 'shared_values', 'connection_preferences',
          'time_commitment', 'serendipity_openness', 'completion_checkpoint'
        ]
      }
      break
  }
  
  // Check if we've completed all steps
  if (currentStepIndex >= activeSteps.length) {
    return null // Onboarding complete
  }
  
  const stepId = activeSteps[currentStepIndex]
  return ALL_STEPS.find(step => step.id === stepId) || null
}

// Social proof generation
export async function generateSocialProof(
  stepId: string,
  userLocation?: string
): Promise<string | null> {
  const supabase = createServiceClient()
  
  try {
    // Get recent responses for this step from users in same location
    let query = supabase
      .from('signals')
      .select('signal_data')
      .eq('signal_type', `onboarding_${stepId}`)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
    
    if (userLocation) {
      query = query.eq('signal_data->location', userLocation)
    }
    
    const { data, error } = await query.limit(10)
    
    if (error || !data || data.length < 3) {
      return null // Not enough data for privacy
    }
    
    // Generate contextual social proof
    switch (stepId) {
      case 'needs_text':
        return `${data.length} people in ${userLocation || 'your area'} mentioned needing help with similar challenges — you're not alone`
        
      case 'strengths_text':
        return `${data.length} people recently shared their strengths — this is a space for honest self-reflection`
        
      case 'progress_vision':
        return `${data.length} people are working toward similar goals — there's momentum in the ecosystem`
        
      default:
        return `${data.length} people have completed this step recently — you're part of a growing community`
    }
  } catch (error) {
    console.error('Error generating social proof:', error)
    return null
  }
}

// Confidence-first input with scaffolding
export function getConfidenceScaffolding(
  stepId: string,
  userConfidence: number
): {
  showArchetypes: boolean
  suggestedPrompts: string[]
  aiAssistance: boolean
} {
  
  if (stepId === 'strengths_text' && userConfidence < 0.7) {
    return {
      showArchetypes: true,
      suggestedPrompts: [
        'I facilitate group discussions',
        'I solve technical problems',
        'I connect people with resources',
        'I create visual designs',
        'I write clear explanations',
        'I organize complex information',
        'I build relationships',
        'I develop strategies'
      ],
      aiAssistance: true
    }
  }
  
  if (stepId === 'needs_text' && userConfidence < 0.7) {
    return {
      showArchetypes: false,
      suggestedPrompts: [
        'Help with technical implementation',
        'Guidance on business strategy',
        'Support with creative direction',
        'Mentorship in leadership',
        'Feedback on product development',
        'Connections in my industry',
        'Clarity on next steps',
        'Accountability for goals'
      ],
      aiAssistance: true
    }
  }
  
  return {
    showArchetypes: false,
    suggestedPrompts: [],
    aiAssistance: false
  }
}

// Save onboarding progress
export async function saveOnboardingProgress(
  userId: string,
  responses: UserResponse[],
  currentStep: number
): Promise<void> {
  const supabase = createServiceClient()
  
  try {
    // Save individual responses as signals
    for (const response of responses) {
      await supabase
        .from('signals')
        .upsert({
          user_id: userId,
          signal_type: `onboarding_${response.stepId}`,
          signal_data: {
            value: response.value,
            timeSpent: response.timeSpent,
            confidence: response.confidence,
            engagement: response.engagement,
            timestamp: new Date().toISOString()
          },
          strength: response.engagement === 'high' ? 1.0 : response.engagement === 'medium' ? 0.7 : 0.4
        })
    }
    
    // Update onboarding state
    const state: OnboardingState = {
      userId,
      currentStep,
      totalSteps: responses.length,
      responses,
      flowType: determineFlowType(responses, new Date()),
      engagementScore: analyzeEngagement(responses).averageTimePerStep,
      completionRate: responses.length / 14, // Assuming 14 max steps
      lastActivity: new Date()
    }
    
    await supabase
      .from('signals')
      .upsert({
        user_id: userId,
        signal_type: 'onboarding_state',
        signal_data: state,
        strength: 1.0
      })
    
  } catch (error) {
    console.error('Error saving onboarding progress:', error)
    throw new Error('Failed to save onboarding progress')
  }
}

// Complete onboarding and generate embeddings
export async function completeOnboarding(
  userId: string,
  responses: UserResponse[]
): Promise<void> {
  const supabase = createServiceClient()
  
  try {
    // Extract structured data from responses
    const profileData = extractProfileData(responses)
    
    // Generate embeddings for each field
    const embeddings = await generateUserEmbeddings(userId, profileData)
    
    // Save embeddings
    await saveEmbeddings(embeddings)
    
    // Mark user as onboarded
    await supabase
      .from('users')
      .update({
        is_onboarded: true,
        onboarding_completed_at: new Date().toISOString()
      })
      .eq('id', userId)
    
    // Refresh materialized view
    await supabase.rpc('refresh_user_ann_view')
    
  } catch (error) {
    console.error('Error completing onboarding:', error)
    throw new Error('Failed to complete onboarding')
  }
}

// Extract structured data from onboarding responses
function extractProfileData(responses: UserResponse[]): {
  strengths?: string[]
  needs?: string[]
  goals?: string[]
  values?: string[]
} {
  const data: any = {}
  
  for (const response of responses) {
    switch (response.stepId) {
      case 'strengths_text':
        data.strengths = [response.value]
        break
      case 'needs_text':
        data.needs = [response.value]
        break
      case 'progress_type':
        data.goals = Array.isArray(response.value) ? response.value : [response.value]
        break
      case 'shared_values':
        data.values = Array.isArray(response.value) ? response.value : [response.value]
        break
    }
  }
  
  return data
}

// Generate user embeddings (imported from embeddings.ts)
async function generateUserEmbeddings(userId: string, profileData: any) {
  const { generateUserEmbeddings } = await import('./embeddings')
  return generateUserEmbeddings(userId, profileData)
}

// Save embeddings (imported from embeddings.ts)
async function saveEmbeddings(embeddings: any[]) {
  const { saveEmbeddings } = await import('./embeddings')
  return saveEmbeddings(embeddings)
}
