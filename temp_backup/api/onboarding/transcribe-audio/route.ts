import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { audioData, duration } = body

    // Validate input
    if (!audioData) {
      return NextResponse.json({ error: 'No audio data provided' }, { status: 400 })
    }

    if (typeof audioData !== 'string' || !audioData.startsWith('data:audio/')) {
      return NextResponse.json({ error: 'Invalid audio data format' }, { status: 400 })
    }

    // Check duration limits
    if (duration && (duration < 2 || duration > 20)) {
      return NextResponse.json({ 
        error: 'Audio must be between 2 and 20 seconds long' 
      }, { status: 400 })
    }

    // Validate file size (rough estimate from base64)
    const base64Size = audioData.length * 0.75 // Approximate
    const maxSize = 25 * 1024 * 1024 // 25MB limit for Whisper
    
    if (base64Size > maxSize) {
      return NextResponse.json({ 
        error: 'Audio file too large. Please keep recordings under 20 seconds.' 
      }, { status: 400 })
    }

    let audioBuffer: Buffer
    let mimeType: string
    
    try {
      // Parse data URL
      const [header, data] = audioData.split(',')
      mimeType = header.match(/data:([^;]+)/)?.[1] || 'audio/webm'
      
      audioBuffer = Buffer.from(data, 'base64')
      
      // Validate buffer
      if (audioBuffer.length === 0) {
        throw new Error('Empty audio buffer')
      }
      
    } catch (error) {
      return NextResponse.json({ 
        error: 'Invalid audio data format. Please try recording again.' 
      }, { status: 400 })
    }

    // Create file for Whisper
    const tempFile = new File([audioBuffer], 'audio.webm', { type: mimeType })

    // Transcribe with Whisper with retry logic
    let transcription: string
    let retryCount = 0
    const maxRetries = 2

    while (retryCount < maxRetries) {
      try {
        const result = await openai.audio.transcriptions.create({
          file: tempFile,
          model: 'whisper-1',
          language: 'en',
          temperature: 0.2,
          response_format: 'text'
        })

        transcription = result as string
        break
        
      } catch (error: any) {
        retryCount++
        
        if (error.status === 429) {
          // Rate limit - wait and retry
          await new Promise(resolve => setTimeout(resolve, 2000))
          continue
        }
        
        if (error.status === 400 && error.message?.includes('audio')) {
          return NextResponse.json({
            error: 'Audio format not supported. Please try recording again.',
            transcription: null
          }, { status: 400 })
        }
        
        if (retryCount >= maxRetries) {
          throw error
        }
      }
    }

    if (!transcription) {
      throw new Error('Transcription failed after retries')
    }

    // Clean transcription
    const cleanTranscription = transcription.trim()
    
    if (cleanTranscription.length === 0) {
      return NextResponse.json({
        error: 'No speech detected. Please try speaking more clearly.',
        transcription: null
      }, { status: 400 })
    }

    // Content moderation
    try {
      const moderation = await openai.moderations.create({
        input: cleanTranscription
      })

      if (moderation.results[0].flagged) {
        return NextResponse.json({
          error: 'Content not appropriate for our community. Please try again.',
          transcription: null
        }, { status: 400 })
      }
    } catch (error) {
      console.warn('Content moderation failed, proceeding with transcription:', error)
    }

    // Quality checks
    if (cleanTranscription.length < 10) {
      return NextResponse.json({
        error: 'Audio too short or unclear. Please try again.',
        transcription: null
      }, { status: 400 })
    }

    // Check for common audio artifacts
    const artifacts = ['[BLANK_AUDIO]', '[UNKNOWN]', 'thank you for watching', 'subscribe']
    if (artifacts.some(artifact => cleanTranscription.toLowerCase().includes(artifact))) {
      return NextResponse.json({
        error: 'Audio quality too poor. Please try recording again.',
        transcription: null
      }, { status: 400 })
    }

    // Calculate confidence based on heuristics
    let confidence = 'medium'
    
    if (cleanTranscription.length > 50 && !cleanTranscription.includes('...')) {
      confidence = 'high'
    } else if (cleanTranscription.length < 20) {
      confidence = 'low'
    }

    return NextResponse.json({ 
      transcription: cleanTranscription,
      confidence,
      duration: duration || null
    })

  } catch (error) {
    console.error('Error transcribing audio:', error)
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('whisper') || error.message.includes('audio')) {
        return NextResponse.json({
          error: 'Audio transcription failed. Please try again or use text input.',
          transcription: null
        }, { status: 400 })
      }
      
      if (error.message.includes('rate limit')) {
        return NextResponse.json({
          error: 'Service temporarily busy. Please try again in a moment.',
          transcription: null
        }, { status: 429 })
      }
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}
