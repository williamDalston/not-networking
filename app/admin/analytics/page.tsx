import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { OnboardingAnalytics } from '@/components/admin/onboarding-analytics'
import { AIHealthDashboard } from '@/components/admin/ai-health-dashboard'

export default async function AnalyticsPage() {
  const user = await requireAuth()
  
  // TODO: Add admin role check
  // For now, allow any authenticated user to access analytics
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gold-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold gradient-text mb-2">
            System Analytics & Health
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time insights into AI system performance and user engagement
          </p>
        </div>
        
        {/* AI Health Dashboard */}
        <div className="mb-12">
          <AIHealthDashboard />
        </div>
        
        {/* Onboarding Analytics */}
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
            Onboarding Analytics
          </h2>
          <OnboardingAnalytics />
        </div>
      </div>
    </div>
  )
}
