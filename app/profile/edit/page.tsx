import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ProfileEditClient } from '@/components/profile/profile-edit-client'

export default async function ProfileEditPage() {
  const user = await requireAuth()
  
  // Redirect to onboarding if not completed
  if (!user.is_onboarded) {
    redirect('/onboarding')
  }

  return (
    <DashboardLayout>
      <ProfileEditClient />
    </DashboardLayout>
  )
}
