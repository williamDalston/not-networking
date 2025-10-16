import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase'
import { generateUserEmbeddings, saveEmbeddings } from '@/lib/embeddings'
import { errorHandler } from '@/lib/error-handler'

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient()

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        strengths_text,
        needs_text,
        progress_goal,
        shared_values,
        meaningful_progress_goals,
        value_creation_type
      `)
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found or incomplete' },
        { status: 404 }
      )
    }

    // Prepare data for embedding generation
    const profileData = {
      strengths: profile.strengths_text ? [profile.strengths_text] : [],
      needs: profile.needs_text ? [profile.needs_text] : [],
      goals: profile.progress_goal ? [profile.progress_goal] : [],
      values: profile.shared_values || []
    }

    // Generate embeddings
    const embeddings = await generateUserEmbeddings(user.id, profileData)

    // Save embeddings to database
    const savedEmbeddings = await saveEmbeddings(embeddings)

    // Update profile to mark embeddings as generated
    await supabase
      .from('profiles')
      .update({ 
        embeddings_generated_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)

    return NextResponse.json({
      embeddings: savedEmbeddings,
      message: 'Embeddings generated and saved successfully'
    })

  } catch (error) {
    const aiError = errorHandler.handleError(error as Error, {
      userId: user?.id,
      operation: 'generate_embeddings'
    })

    return NextResponse.json(
      { 
        error: aiError.userFriendlyMessage,
        details: aiError.message 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient()

    // Get user embeddings
    const { data: embeddings, error } = await supabase
      .from('embeddings')
      .select('field_type, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch embeddings: ${error.message}`)
    }

    // Check if all required embeddings exist
    const requiredFields = ['strengths', 'needs', 'goals', 'values']
    const existingFields = embeddings?.map(e => e.field_type) || []
    const missingFields = requiredFields.filter(field => !existingFields.includes(field))

    return NextResponse.json({
      embeddings: embeddings || [],
      complete: missingFields.length === 0,
      missingFields,
      lastUpdated: embeddings?.[0]?.created_at || null
    })

  } catch (error) {
    const aiError = errorHandler.handleError(error as Error, {
      userId: user?.id,
      operation: 'get_embeddings'
    })

    return NextResponse.json(
      { 
        error: aiError.userFriendlyMessage,
        details: aiError.message 
      },
      { status: 500 }
    )
  }
}
