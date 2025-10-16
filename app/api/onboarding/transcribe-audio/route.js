import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createErrorResponse, validateRequired } from '@/lib/error-handler'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio')

    if (!audioFile) {
      return createErrorResponse(new Error('Audio file is required'))
    }

    // Convert File to Buffer
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Transcribe audio using OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: new File([buffer], audioFile.name, { type: audioFile.type }),
      model: 'whisper-1',
      response_format: 'text'
    })

    return NextResponse.json({ 
      transcription,
      success: true 
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}
