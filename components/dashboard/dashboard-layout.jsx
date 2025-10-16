'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '@/components/navigation/sidebar'
import { LoadingPage } from '@/components/ui/loading'

export default function DashboardLayout({ children, currentPath }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingPage message="Loading your dashboard..." />
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Sidebar currentPath={currentPath} />
      
      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-6"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
