import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'
import LandingPage from '@/components/landing-page'

export default async function HomePage() {
  const user = await getUser()
  
  if (user) {
    // Check if user is onboarded
    const supabase = (await import('@/lib/supabase')).createServerClient()
    const { data: userProfile } = await supabase
      .from('users')
      .select('is_onboarded')
      .eq('id', user.id)
      .single()
    
    if (userProfile?.is_onboarded) {
      redirect('/dashboard')
    } else {
      redirect('/onboarding')
    }
  }
  
  return <LandingPage />
}
