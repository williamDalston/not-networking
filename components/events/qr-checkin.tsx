'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, Camera, CheckCircle, X, AlertCircle, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QRCheckInProps {
  eventId: string
  isOpen: boolean
  onClose: () => void
  onCheckIn: (eventId: string, attendeeId?: string) => Promise<void>
  className?: string
}

export function QRCheckIn({ eventId, isOpen, onClose, onCheckIn, className = '' }: QRCheckInProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<string | null>(null)
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setScannedData(null)
      setError('')
      setSuccess(false)
      setIsScanning(false)
    }
  }, [isOpen])

  const handleStartScanning = () => {
    setIsScanning(true)
    setError('')
    // In a real implementation, this would start the camera and QR scanner
    // For demo purposes, we'll simulate a scan after 2 seconds
    setTimeout(() => {
      const mockQRData = `ecosystem-event:${eventId}:attendee:123`
      setScannedData(mockQRData)
      setIsScanning(false)
    }, 2000)
  }

  const handleCheckIn = async () => {
    if (!scannedData) return

    setIsCheckingIn(true)
    setError('')

    try {
      // Parse QR data (in real implementation)
      const parts = scannedData.split(':')
      if (parts.length >= 4 && parts[0] === 'ecosystem-event' && parts[1] === eventId) {
        const attendeeId = parts[3]
        await onCheckIn(eventId, attendeeId)
        setSuccess(true)
        
        // Close modal after success
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        throw new Error('Invalid QR code format')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Check-in failed')
    } finally {
      setIsCheckingIn(false)
    }
  }

  const handleClose = () => {
    if (isCheckingIn) return
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                  <QrCode className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Event Check-In
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Scan QR code to check in
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                disabled={isCheckingIn}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Check-In Successful!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You've been checked in to the event.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {/* Scanner Area */}
                  <div className="relative">
                    <div className={`
                      aspect-square w-full rounded-lg border-2 border-dashed flex items-center justify-center
                      ${isScanning 
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                        : scannedData 
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                      }
                    `}>
                      {isScanning ? (
                        <div className="text-center">
                          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                            Scanning for QR code...
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Point your camera at the QR code
                          </p>
                        </div>
                      ) : scannedData ? (
                        <div className="text-center">
                          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                          <p className="text-green-600 dark:text-green-400 font-medium">
                            QR Code Scanned!
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Ready to check in
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-400 font-medium">
                            Ready to scan
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                            Click to start scanning
                          </p>
                        </div>
                      )}
                    </div>

                    {/* QR Code Overlay (for demo) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-white dark:bg-gray-800 border-2 border-emerald-500 rounded-lg flex items-center justify-center">
                        <QrCode className="h-8 w-8 text-emerald-500" />
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                      How to check in:
                    </h4>
                    <ol className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                      <li>1. Click "Start Scanning" to open your camera</li>
                      <li>2. Point your camera at the event QR code</li>
                      <li>3. Wait for the scan to complete automatically</li>
                      <li>4. Click "Check In" to confirm your attendance</li>
                    </ol>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4"
                    >
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-700 dark:text-red-300">
                          {error}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {!success && (
              <div className="flex space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isCheckingIn}
                  className="flex-1"
                >
                  Cancel
                </Button>
                
                {!scannedData ? (
                  <Button
                    onClick={handleStartScanning}
                    disabled={isScanning || isCheckingIn}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                  >
                    {isScanning ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 mr-2" />
                        Start Scanning
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleCheckIn}
                    disabled={isCheckingIn}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                  >
                    {isCheckingIn ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Checking In...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Check In
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Simple QR code display for attendees
export function QRCodeDisplay({ 
  attendeeId, 
  eventId, 
  attendeeName,
  className = '' 
}: {
  attendeeId: string
  eventId: string
  attendeeName: string
  className?: string
}) {
  const qrData = `ecosystem-event:${eventId}:attendee:${attendeeId}`

  return (
    <div className={`text-center ${className}`}>
      <div className="bg-white p-4 rounded-lg border border-gray-200 dark:border-gray-700 inline-block">
        {/* QR Code placeholder - in real implementation, use a QR library */}
        <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center mb-4">
          <QrCode className="h-12 w-12 text-gray-400" />
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Show this QR code at check-in
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {attendeeName}
        </p>
      </div>
    </div>
  )
}
