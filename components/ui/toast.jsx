'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast = { id, message, type, duration }
    
    setToasts(prev => [...prev, toast])
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function Toast({ toast, onRemove }) {
  const { id, message, type } = toast

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  }

  const colors = {
    success: 'bg-emerald-500 border-emerald-200 text-white',
    error: 'bg-red-500 border-red-200 text-white',
    warning: 'bg-yellow-500 border-yellow-200 text-white',
    info: 'bg-blue-500 border-blue-200 text-white'
  }

  const Icon = icons[type] || Info

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
      className={cn(
        'flex items-center p-4 rounded-xl shadow-lg border backdrop-blur-sm max-w-sm',
        colors[type]
      )}
    >
      <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={() => onRemove(id)}
        className="ml-3 flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

// Legacy component for backward compatibility
export function ToastContainer({ toasts = [], removeToast = () => {} }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}