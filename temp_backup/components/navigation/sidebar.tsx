'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Map, 
  Calendar, 
  User, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { KeyboardTooltip } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface SidebarProps {
  className?: string
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, shortcut: '⌘1' },
  { name: 'Matches', href: '/matches', icon: Users, shortcut: '⌘2' },
  { name: 'Ecosystem Map', href: '/ecosystem-map', icon: Map, shortcut: '⌘3' },
  { name: 'Events', href: '/events', icon: Calendar, shortcut: '⌘4' },
  { name: 'Profile', href: '/profile', icon: User, shortcut: '⌘5' },
  { name: 'Settings', href: '/settings', icon: Settings, shortcut: '⌘6' },
]

export function Sidebar({ className = '' }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const handleSignOut = async () => {
    // TODO: Implement sign out
    console.log('Sign out clicked')
  }

  return (
    <motion.div
      initial={{ width: 256 }}
      animate={{ width: collapsed ? 64 : 256 }}
      className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: collapsed ? 0 : 1 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-display font-bold text-gray-900 dark:text-white">
              Ecosystem
            </span>
          </motion.div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <KeyboardTooltip
              key={item.name}
              shortcut={item.shortcut}
              description={`Navigate to ${item.name}`}
              side="right"
            >
              <Link href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'relative flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 group',
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <motion.span
                        initial={{ opacity: 1 }}
                        animate={{ opacity: collapsed ? 0 : 1 }}
                        className="font-medium flex-1"
                      >
                        {item.name}
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 1 }}
                        animate={{ opacity: collapsed ? 0 : 1 }}
                        className="text-xs text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {item.shortcut}
                      </motion.span>
                    </>
                  )}
                </motion.div>
              </Link>
            </KeyboardTooltip>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: collapsed ? 0 : 1 }}
            className="flex items-center space-x-3 mb-3"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                User Name
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                user@example.com
              </p>
            </div>
          </motion.div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="w-full justify-start text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
        >
          <LogOut className="h-4 w-4 mr-3" />
          {!collapsed && <span>Sign out</span>}
        </Button>
      </div>
    </motion.div>
  )
}
