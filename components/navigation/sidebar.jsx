'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut, getCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react'

export default function Sidebar({ currentPath }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Matches', href: '/matches', icon: Users },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings }
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="glass"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="backdrop-blur-md"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative flex-1 flex flex-col max-w-xs w-full glass-card"
            >
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <span className="sr-only">Close sidebar</span>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <SidebarContent navigation={navigation} currentPath={currentPath} onSignOut={handleSignOut} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent navigation={navigation} currentPath={currentPath} onSignOut={handleSignOut} />
        </div>
      </div>
    </>
  )
}

function SidebarContent({ navigation, currentPath, onSignOut }) {
  return (
    <div className="flex flex-col h-full glass-card border-r border-white/20 dark:border-gray-700/20">
      {/* Logo */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-white/20 dark:border-gray-700/20">
        <Link href="/dashboard" className="flex items-center group">
          <motion.div
            className="text-2xl mr-2 group-hover:scale-110 transition-transform duration-200"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🌱
          </motion.div>
          <span className="text-xl font-bold gradient-text-emerald">The Ecosystem</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navigation.map((item, index) => {
          const isActive = currentPath === item.href
          const Icon = item.icon
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-emerald-500 group-hover:text-emerald-600'}`} />
                {item.name}
                {isActive && (
                  <motion.div
                    className="ml-auto w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* User section */}
      <div className="flex-shrink-0 border-t border-white/20 dark:border-gray-700/20 p-4">
        <div className="flex items-center mb-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">U</span>
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">User</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">user@example.com</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSignOut}
          className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/10 dark:hover:bg-gray-700/50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  )
}
