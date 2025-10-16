'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Users, 
  Map, 
  Calendar, 
  User, 
  Settings,
  LayoutDashboard,
  ArrowRight,
  Command
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { fadeIn, scaleIn, modalBackdrop, modalContent } from '@/lib/animations'

interface CommandItem {
  id: string
  title: string
  description?: string
  icon: React.ReactNode
  href?: string
  action?: () => void
  keywords?: string[]
  category: string
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

// Default command items
const defaultCommands: CommandItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'View your overview and recent activity',
    icon: <LayoutDashboard className="h-4 w-4" />,
    href: '/dashboard',
    keywords: ['home', 'overview', 'main'],
    category: 'Navigation',
  },
  {
    id: 'matches',
    title: 'Matches',
    description: 'View and manage your connections',
    icon: <Users className="h-4 w-4" />,
    href: '/matches',
    keywords: ['connections', 'people', 'network'],
    category: 'Navigation',
  },
  {
    id: 'ecosystem',
    title: 'Ecosystem Map',
    description: 'Explore your network visually',
    icon: <Map className="h-4 w-4" />,
    href: '/ecosystem-map',
    keywords: ['network', 'map', 'visual', 'graph'],
    category: 'Navigation',
  },
  {
    id: 'events',
    title: 'Events',
    description: 'Browse and join professional events',
    icon: <Calendar className="h-4 w-4" />,
    href: '/events',
    keywords: ['calendar', 'meetups', 'conferences'],
    category: 'Navigation',
  },
  {
    id: 'profile',
    title: 'Profile',
    description: 'View and edit your profile',
    icon: <User className="h-4 w-4" />,
    href: '/profile',
    keywords: ['settings', 'edit', 'personal'],
    category: 'Navigation',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Manage your account and preferences',
    icon: <Settings className="h-4 w-4" />,
    href: '/settings',
    keywords: ['preferences', 'account', 'config'],
    category: 'Navigation',
  },
]

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState('')
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const [commands] = React.useState<CommandItem[]>(defaultCommands)

  // Filter commands based on query
  const filteredCommands = React.useMemo(() => {
    if (!query) return commands

    return commands.filter(command => {
      const searchText = `${command.title} ${command.description || ''} ${command.keywords?.join(' ') || ''}`.toLowerCase()
      return searchText.includes(query.toLowerCase())
    })
  }, [commands, query])

  // Group commands by category
  const groupedCommands = React.useMemo(() => {
    const groups: Record<string, CommandItem[]> = {}
    filteredCommands.forEach(command => {
      if (!groups[command.category]) {
        groups[command.category] = []
      }
      groups[command.category].push(command)
    })
    return groups
  }, [filteredCommands])

  // Handle keyboard navigation
  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'Escape':
        onClose()
        break
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex])
        }
        break
    }
  }, [isOpen, onClose, filteredCommands, selectedIndex])

  // Execute command
  const executeCommand = React.useCallback((command: CommandItem) => {
    if (command.href) {
      router.push(command.href)
    } else if (command.action) {
      command.action()
    }
    onClose()
  }, [router, onClose])

  // Reset state when opening/closing
  React.useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      // Focus input after animation
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Global keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) {
          onClose()
        } else {
          // This would be handled by the parent component
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Keyboard navigation effect
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalBackdrop}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={modalContent}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed left-1/2 top-1/4 -translate-x-1/2 w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <Search className="h-4 w-4 text-gray-400 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search or type a command..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
                />
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Command className="h-3 w-3" />
                  <span>K</span>
                </div>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto">
                {Object.keys(groupedCommands).length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No commands found</p>
                    <p className="text-sm">Try a different search term</p>
                  </div>
                ) : (
                  Object.entries(groupedCommands).map(([category, categoryCommands]) => (
                    <div key={category} className="py-2">
                      <div className="px-4 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {category}
                      </div>
                      {categoryCommands.map((command, index) => {
                        const globalIndex = filteredCommands.indexOf(command)
                        const isSelected = globalIndex === selectedIndex
                        
                        return (
                          <motion.button
                            key={command.id}
                            onClick={() => executeCommand(command)}
                            className={cn(
                              'w-full flex items-center px-4 py-3 text-left transition-colors',
                              isSelected
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white'
                            )}
                            whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className={cn(
                              'flex items-center justify-center w-8 h-8 rounded-md mr-3',
                              isSelected
                                ? 'bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-400'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                            )}>
                              {command.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{command.title}</div>
                              {command.description && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {command.description}
                                </div>
                              )}
                            </div>
                            {isSelected && (
                              <ArrowRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border">↑↓</kbd>
                      <span className="ml-1">Navigate</span>
                    </span>
                    <span className="flex items-center">
                      <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border">↵</kbd>
                      <span className="ml-1">Select</span>
                    </span>
                  </div>
                  <span className="flex items-center">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border">Esc</kbd>
                    <span className="ml-1">Close</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for using command palette
export function useCommandPalette() {
  const [isOpen, setIsOpen] = React.useState(false)

  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])
  const toggle = React.useCallback(() => setIsOpen(prev => !prev), [])

  // Global keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggle()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggle])

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}