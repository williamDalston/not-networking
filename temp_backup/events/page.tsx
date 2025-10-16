import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { EventsClient } from '@/components/events/events-client'

export default async function EventsPage() {
  const user = await requireAuth()
  
  // Redirect to onboarding if not completed
  if (!user.is_onboarded) {
    redirect('/onboarding')
  }

  return (
    <DashboardLayout>
      <EventsClient />
    </DashboardLayout>
  )
}
