'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Bookmark, X, Check, ArrowLeft, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ActionButtonsProps {
  matchId: string
  onConnect: (id: string) => Promise<void>
  onSave: (id: string) => Promise<void>
  onDismiss: (id: string) => Promise<void>
  isConnecting?: boolean
  isSaving?: boolean
  isDismissing?: boolean
  className?: string
}

export function ActionButtons({
  matchId,
  onConnect,
  onSave,
  onDismiss,
  isConnecting = false,
  isSaving = false,
  isDismissing = false,
  className = ''
}: ActionButtonsProps) {
  const [showConfirmDismiss, setShowConfirmDismiss] = useState(false)

  const handleConnect = async () => {
    try {
      await onConnect(matchId)
    } catch (error) {
      console.error('Failed to connect:', error)
    }
  }

  const handleSave = async () => {
    try {
      await onSave(matchId)
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }

  const handleDismiss = async () => {
    if (!showConfirmDismiss) {
      setShowConfirmDismiss(true)
      return
    }

    try {
      await onDismiss(matchId)
    } catch (error) {
      console.error('Failed to dismiss:', error)
    }
  }

  const handleCancelDismiss = () => {
    setShowConfirmDismiss(false)
  }

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      {/* Primary Action - Connect */}
      <Button
        onClick={handleConnect}
        disabled={isConnecting || isSaving || isDismissing}
        className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium"
      >
        {isConnecting ? (
          <>
            <Loader className="h-4 w-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <MessageCircle className="h-4 w-4 mr-2" />
            Connect
          </>
        )}
      </Button>

      {/* Secondary Actions */}
      <div className="flex gap-2">
        {/* Save Button */}
        <Button
          variant="outline"
          onClick={handleSave}
          disabled={isConnecting || isSaving || isDismissing}
          className="flex items-center justify-center px-4"
        >
          {isSaving ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </Button>

        {/* Dismiss Button */}
        {showConfirmDismiss ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-2"
          >
            <Button
              variant="destructive"
              onClick={handleDismiss}
              disabled={isConnecting || isSaving || isDismissing}
              size="sm"
              className="flex items-center justify-center px-3"
            >
              {isDismissing ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelDismiss}
              disabled={isConnecting || isSaving || isDismissing}
              size="sm"
              className="flex items-center justify-center px-3"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
          <Button
            variant="outline"
            onClick={handleDismiss}
            disabled={isConnecting || isSaving || isDismissing}
            className="flex items-center justify-center px-4 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

// Alternative layout for mobile
export function ActionButtonsMobile({
  matchId,
  onConnect,
  onSave,
  onDismiss,
  isConnecting = false,
  isSaving = false,
  isDismissing = false,
  className = ''
}: ActionButtonsProps) {
  const [showConfirmDismiss, setShowConfirmDismiss] = useState(false)

  const handleConnect = async () => {
    try {
      await onConnect(matchId)
    } catch (error) {
      console.error('Failed to connect:', error)
    }
  }

  const handleSave = async () => {
    try {
      await onSave(matchId)
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }

  const handleDismiss = async () => {
    if (!showConfirmDismiss) {
      setShowConfirmDismiss(true)
      return
    }

    try {
      await onDismiss(matchId)
    } catch (error) {
      console.error('Failed to dismiss:', error)
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Primary Action */}
      <Button
        onClick={handleConnect}
        disabled={isConnecting || isSaving || isDismissing}
        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium py-3"
      >
        {isConnecting ? (
          <>
            <Loader className="h-5 w-5 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <MessageCircle className="h-5 w-5 mr-2" />
            Connect with this person
          </>
        )}
      </Button>

      {/* Secondary Actions Row */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleSave}
          disabled={isConnecting || isSaving || isDismissing}
          className="flex-1 flex items-center justify-center py-3"
        >
          {isSaving ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Bookmark className="h-4 w-4 mr-2" />
              Save
            </>
          )}
        </Button>

        {showConfirmDismiss ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-2 flex-1"
          >
            <Button
              variant="destructive"
              onClick={handleDismiss}
              disabled={isConnecting || isSaving || isDismissing}
              className="flex-1 flex items-center justify-center py-3"
            >
              {isDismissing ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Confirm
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDismiss(false)}
              disabled={isConnecting || isSaving || isDismissing}
              className="flex-1 flex items-center justify-center py-3"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </motion.div>
        ) : (
          <Button
            variant="outline"
            onClick={handleDismiss}
            disabled={isConnecting || isSaving || isDismissing}
            className="flex-1 flex items-center justify-center py-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <X className="h-4 w-4 mr-2" />
            Dismiss
          </Button>
        )}
      </div>
    </div>
  )
}
