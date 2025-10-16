import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { EcosystemMapClient } from '@/components/ecosystem/ecosystem-map-client'

export default async function EcosystemMapPage() {
  const user = await requireAuth()
  
  // Redirect to onboarding if not completed
  if (!user.is_onboarded) {
    redirect('/onboarding')
  }

  return (
    <DashboardLayout>
      <EcosystemMapClient />
    </DashboardLayout>
  )
}
