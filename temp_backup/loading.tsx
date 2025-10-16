'use client'

import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gold-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton height={32} width={200} />
              <Skeleton height={20} width={300} />
            </div>
            <Skeleton height={40} width={120} />
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  <Skeleton width={20} height={20} />
                  <Skeleton height={16} width={60} />
                </div>
                <Skeleton height={24} width={40} />
              </div>
            ))}
          </div>

          {/* Main Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  <Skeleton height={24} width={150} />
                  <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
                  <div className="text-center">
                    <Skeleton height={16} width={200} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  <Skeleton height={24} width={120} />
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Skeleton width={20} height={20} />
                      <div className="flex-1 space-y-2">
                        <Skeleton height={16} width="80%" />
                        <Skeleton height={14} width="60%" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cards Grid Skeleton */}
          <div className="space-y-4">
            <Skeleton height={24} width={150} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <Skeleton width={48} height={48} />
                        <div className="space-y-2 flex-1">
                          <Skeleton height={20} width="70%" />
                          <Skeleton height={16} width="50%" />
                        </div>
                      </div>
                      <Skeleton height={24} width={60} />
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <Skeleton height={16} />
                      <Skeleton height={16} width="90%" />
                      <Skeleton height={16} width="75%" />
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <Skeleton height={24} width={80} />
                      <Skeleton height={24} width={100} />
                      <Skeleton height={24} width={90} />
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Skeleton height={36} width={100} />
                      <Skeleton height={36} width={80} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Specific loading components for different pages
export function DashboardLoading() {
  return <Loading />
}

export function MatchesLoading() {
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton height={32} width={150} />
          <Skeleton height={20} width={250} />
        </div>
        <Skeleton height={40} width={100} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <Skeleton width={48} height={48} />
                  <div className="space-y-2 flex-1">
                    <Skeleton height={20} width="70%" />
                    <Skeleton height={16} width="50%" />
                  </div>
                </div>
                <Skeleton height={24} width={60} />
              </div>

              <div className="space-y-3">
                <Skeleton height={16} />
                <Skeleton height={16} width="90%" />
              </div>

              <div className="flex flex-wrap gap-2">
                <Skeleton height={24} width={80} />
                <Skeleton height={24} width={100} />
              </div>

              <div className="flex space-x-2">
                <Skeleton height={36} width={100} />
                <Skeleton height={36} width={80} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProfileLoading() {
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton height={32} width={150} />
          <Skeleton height={20} width={200} />
        </div>
        <div className="flex space-x-3">
          <Skeleton height={40} width={120} />
          <Skeleton height={40} width={100} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-center space-y-4">
              <Skeleton width={96} height={96} />
              <div className="space-y-2">
                <Skeleton height={24} width={150} />
                <Skeleton height={20} width={200} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Skeleton height={16} width={80} />
                  <Skeleton height={20} width={40} />
                </div>
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Skeleton height={16} width={100} />
                  <Skeleton height={20} width={40} />
                </div>
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Skeleton height={16} width={90} />
                  <Skeleton height={20} width={40} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <Skeleton height={20} width={120} />
                <div className="space-y-2">
                  <Skeleton height={16} />
                  <Skeleton height={16} width="90%" />
                  <Skeleton height={16} width="75%" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
