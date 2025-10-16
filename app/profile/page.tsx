import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ProfileClient } from '@/components/profile/profile-client'

export default async function ProfilePage() {
  const user = await requireAuth()
  
  // Redirect to onboarding if not completed
  if (!user.is_onboarded) {
    redirect('/onboarding')
  }

  return (
    <DashboardLayout>
      <ProfileClient />
    </DashboardLayout>
  )
}
