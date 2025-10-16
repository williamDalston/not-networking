import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { EvidenceTray } from '@/components/matches/evidence-tray'
import { MatchNarrative } from '@/components/matches/match-narrative'
import { ConfidenceBadge, ConfidenceProgress } from '@/components/matches/confidence-badge'
import { ActionButtons, ActionButtonsMobile } from '@/components/matches/action-buttons'
import { MatchDetailClient } from '@/components/matches/match-detail-client'

interface MatchDetailPageProps {
  params: { id: string }
}

export default async function MatchDetailPage({ params }: MatchDetailPageProps) {
  const user = await requireAuth()
  
  // Redirect to onboarding if not completed
  if (!user.is_onboarded) {
    redirect('/onboarding')
  }

  return (
    <DashboardLayout>
      <MatchDetailClient matchId={params.id} />
    </DashboardLayout>
  )
}
