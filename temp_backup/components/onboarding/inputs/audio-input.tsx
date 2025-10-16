'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Play, Pause, Square, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AudioInputProps {
  value?: string
  onChange: (transcription: string) => void
  maxDuration?: number // in seconds
  onTranscribe?: (audioBlob: Blob) => Promise<string>
  label?: string
  description?: string
  placeholder?: string
  required?: boolean
  className?: string
}

export function AudioInput({
  value = '',
  onChange,
  maxDuration = 20,
  onTranscribe,
  label,
  description,
  placeholder = "Tap to record or type your answer...",
  required = false,
  className = ""
}: AudioInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [error, setError] = useState('')
  const [textValue, setTextValue] = useState(value)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Update text value when prop changes
  useEffect(() => {
    setTextValue(value)
  }, [value])

  const startRecording = async () => {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setAudioBlob(blob)
        setIsRecording(false)
        setRecordingTime(0)
        
        // Auto-transcribe if function provided
        if (onTranscribe) {
          handleTranscribe(blob)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 0.1
          if (newTime >= maxDuration) {
            stopRecording()
          }
          return newTime
        })
      }, 100)

    } catch (error) {
      setError('Microphone access denied. Please allow microphone access and try again.')
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleTranscribe = async (blob: Blob) => {
    if (!onTranscribe) return

    setIsTranscribing(true)
    setError('')

    try {
      const transcription = await onTranscribe(blob)
      onChange(transcription)
      setTextValue(transcription)
    } catch (error) {
      setError('Transcription failed. Please try again or type your answer.')
      console.error('Transcription error:', error)
    } finally {
      setIsTranscribing(false)
    }
  }

  const playRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob)
      const audio = new Audio(url)
      audioRef.current = audio

      audio.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(url)
      }

      audio.play()
      setIsPlaying(true)
    }
  }

  const stopPlaying = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  const clearRecording = () => {
    setAudioBlob(null)
    setTextValue('')
    onChange('')
    setError('')
    stopPlaying()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isValid = !required || textValue.length > 0

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      )}

      {/* Recording controls */}
      <div className="flex items-center space-x-4">
        <motion.button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isRecording && recordingTime >= maxDuration}
          className={`
            flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200
            ${isRecording 
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </motion.button>

        {isRecording && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formatTime(recordingTime)}
            </span>
            <span className="text-xs text-gray-500">
              / {formatTime(maxDuration)}
            </span>
          </motion.div>
        )}
      </div>

      {/* Audio playback controls */}
      <AnimatePresence>
        {audioBlob && !isRecording && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={isPlaying ? stopPlaying : playRecording}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Audio recording
              </div>
              <div className="text-xs text-gray-500">
                {formatTime(recordingTime)}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={clearRecording}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcription status */}
      <AnimatePresence>
        {isTranscribing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 text-sm text-blue-600"
          >
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
            <span>Transcribing audio...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text input fallback */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Or type your answer:
        </label>
        <textarea
          value={textValue}
          onChange={(e) => {
            setTextValue(e.target.value)
            onChange(e.target.value)
          }}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg"
        >
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </motion.div>
      )}

      {/* Validation message */}
      {!isValid && required && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500"
        >
          Please provide an answer by recording audio or typing text
        </motion.div>
      )}
    </div>
  )
}
