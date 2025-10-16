import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { SettingsClient } from '@/components/settings/settings-client'

export default async function SettingsPage() {
  const user = await requireAuth()
  
  // Redirect to onboarding if not completed
  if (!user.is_onboarded) {
    redirect('/onboarding')
  }

  return (
    <DashboardLayout>
      <SettingsClient />
    </DashboardLayout>
  )
}
