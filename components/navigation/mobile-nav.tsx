'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  Users, 
  Map, 
  Calendar, 
  User
} from 'lucide-react'
import { touchFriendly } from '@/lib/responsive'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, badge: 0 },
  { name: 'Matches', href: '/matches', icon: Users, badge: 3 },
  { name: 'Map', href: '/ecosystem-map', icon: Map, badge: 0 },
  { name: 'Events', href: '/events', icon: Calendar, badge: 2 },
  { name: 'Profile', href: '/profile', icon: User, badge: 0 },
]

export function MobileNav() {
  const pathname = usePathname()
  const [lastTap, setLastTap] = useState(0)

  // Haptic feedback for mobile devices
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10) // Short vibration
    }
  }

  const handleTap = () => {
    const now = Date.now()
    if (now - lastTap < 300) {
      // Double tap - stronger haptic
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([10, 50, 10])
      }
    } else {
      triggerHaptic()
    }
    setLastTap(now)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-2 py-2 safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          const hasNotification = item.badge > 0

          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.95 }}
                onClick={handleTap}
                className={`
                  relative flex flex-col items-center justify-center ${touchFriendly.buttonPadding} rounded-lg transition-colors duration-200 min-w-[60px]
                  ${isActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }
                `}
              >
                <motion.div
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  className="mb-1 relative"
                >
                  <Icon className="h-5 w-5" />
                  
                  {/* Notification Badge */}
                  {hasNotification && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium"
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </motion.div>
                  )}
                </motion.div>
                
                <span className="text-xs font-medium leading-tight">{item.name}</span>
                
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
