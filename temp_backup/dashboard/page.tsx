import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { GrowthGraph, sampleGrowthData } from '@/components/dashboard/growth-graph'
import { MatchCard, sampleMatchData } from '@/components/dashboard/match-card'
import { InsightFeed } from '@/components/dashboard/insight-feed'
import { CommandPalette, useCommandPalette } from '@/components/navigation/command-palette'
import { SkeletonComponents } from '@/components/ui/skeleton'
import { DashboardClient } from './dashboard-client'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default async function DashboardPage() {
  const user = await requireAuth()
  
  // Redirect to onboarding if not completed
  if (!user.is_onboarded) {
    redirect('/onboarding')
  }

  return (
    <DashboardClient>
      <DashboardLayout>
        <div className="space-y-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                {getGreeting()}, {user.display_name || 'there'}! 🌱
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Here's what's happening in your ecosystem today
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">⌘K</kbd> to search
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">New Matches</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming Events</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">2</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Connections</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-gold-100 dark:bg-gold-900 rounded-lg">
                <svg className="h-5 w-5 text-gold-600 dark:text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Profile Complete</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">85%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Growth Graph - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <GrowthGraph data={sampleGrowthData} />
          </div>

          {/* Insight Feed */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <InsightFeed />
            </div>
          </div>
        </div>

        {/* Today's Matches */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white">
                Today's Matches
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                SAM has found {sampleMatchData.length} potential connections for you
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Updated 2 hours ago
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleMatchData.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onConnect={(id) => console.log('Connect to:', id)}
                onSave={(id) => console.log('Save match:', id)}
                onDismiss={(id) => console.log('Dismiss match:', id)}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-emerald-50 to-gold-50 dark:from-emerald-900/10 dark:to-gold-900/10 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow text-left">
              <div className="text-emerald-600 mb-2">📊</div>
              <div className="font-medium text-gray-900 dark:text-white">View Analytics</div>
              <div className="text-sm text-gray-500">See your growth</div>
            </button>
            <button className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow text-left">
              <div className="text-blue-600 mb-2">🗺️</div>
              <div className="font-medium text-gray-900 dark:text-white">Ecosystem Map</div>
              <div className="text-sm text-gray-500">Explore network</div>
            </button>
            <button className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow text-left">
              <div className="text-gold-600 mb-2">📅</div>
              <div className="font-medium text-gray-900 dark:text-white">Upcoming Events</div>
              <div className="text-sm text-gray-500">Join community</div>
            </button>
            <button className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow text-left">
              <div className="text-purple-600 mb-2">⚙️</div>
              <div className="font-medium text-gray-900 dark:text-white">Settings</div>
              <div className="text-sm text-gray-500">Manage profile</div>
            </button>
          </div>
        </div>
      </DashboardLayout>
    </DashboardClient>
  )
}
