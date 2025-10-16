import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow'

export default async function OnboardingPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Check if user is already onboarded
  const supabase = (await import('@/lib/supabase')).createServerClient()
  const { data: userProfile } = await supabase
    .from('users')
    .select('is_onboarded, location, timezone')
    .eq('id', user.id)
    .single()
  
  if (userProfile?.is_onboarded) {
    redirect('/dashboard')
  }

  return (
    <OnboardingFlow
      userId={user.id}
      userLocation={userProfile?.location}
      timezone={userProfile?.timezone}
    />
  )
}
