'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TextInput } from '@/components/onboarding/inputs/text-input'
import { MultiSelectInput } from '@/components/onboarding/inputs/multi-select-input'
import { SliderInput } from '@/components/onboarding/inputs/slider-input'

interface ProfileEditClientProps {
  className?: string
}

interface UserProfile {
  user_id: string
  display_name: string
  avatar_url?: string
  bio?: string
  work_on?: string
  progress_goal?: string
  strengths_text?: string
  needs_text?: string
  shared_values?: string[]
  value_creation_type?: string[]
  meaningful_progress_goals?: string[]
  connection_preferences?: string[]
  availability_hours?: number
  serendipity_openness?: number
  human_detail?: string
  external_link?: string
}

const VALUE_CREATION_OPTIONS = [
  'Builder', 'Connector', 'Mentor', 'Investor', 'Researcher', 'Designer', 'Developer', 'Marketer'
]

const PROGRESS_GOALS_OPTIONS = [
  'Career Growth', 'Skill Development', 'Network Building', 'Product Launch', 'Company Scaling', 'Personal Growth'
]

const CONNECTION_PREFERENCES_OPTIONS = [
  'Coffee Chats', 'Virtual Meetings', 'Group Events', 'Workshop Collaboration', 'Mentorship', 'Project Partnership'
]

export function ProfileEditClient({ className = '' }: ProfileEditClientProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/profile')
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }
      
      const data = await response.json()
      setProfile(data.profile)
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError(error instanceof Error ? error.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!profile) return

    setSaving(true)
    setError('')
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/profile')
      }, 2000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleFieldChange = (field: keyof UserProfile, value: any) => {
    if (!profile) return
    setProfile({ ...profile, [field]: value })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Profile Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {error}
        </p>
        <Button onClick={fetchProfile}>
          Try Again
        </Button>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/profile')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              Edit Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Update your profile information
            </p>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
        >
          {saving ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg p-4"
        >
          <p className="text-emerald-800 dark:text-emerald-200">
            Profile updated successfully! Redirecting...
          </p>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4"
        >
          <p className="text-red-800 dark:text-red-200">
            {error}
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h3>
          
          <div className="space-y-4">
            <TextInput
              id="display_name"
              label="Display Name"
              value={profile.display_name || ''}
              onChange={(value) => handleFieldChange('display_name', value)}
              placeholder="Enter your display name"
            />

            <TextInput
              id="work_on"
              label="What do you work on?"
              value={profile.work_on || ''}
              onChange={(value) => handleFieldChange('work_on', value)}
              placeholder="e.g., Product Design, Software Engineering"
            />

            <TextInput
              id="bio"
              label="Bio"
              value={profile.bio || ''}
              onChange={(value) => handleFieldChange('bio', value)}
              placeholder="Tell us about yourself..."
              isTextArea={true}
              maxLength={500}
            />

            <TextInput
              id="external_link"
              label="External Link (optional)"
              value={profile.external_link || ''}
              onChange={(value) => handleFieldChange('external_link', value)}
              placeholder="https://your-website.com"
            />
          </div>
        </motion.div>

        {/* Goals & Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Goals & Values</h3>
          
          <div className="space-y-4">
            <TextInput
              id="progress_goal"
              label="Current Goal"
              value={profile.progress_goal || ''}
              onChange={(value) => handleFieldChange('progress_goal', value)}
              placeholder="What are you working towards right now?"
            />

            <MultiSelectInput
              id="value_creation_type"
              label="How do you create value?"
              value={profile.value_creation_type || []}
              onChange={(value) => handleFieldChange('value_creation_type', value)}
              options={VALUE_CREATION_OPTIONS}
              placeholder="Select how you create value"
            />

            <MultiSelectInput
              id="meaningful_progress_goals"
              label="What progress feels meaningful?"
              value={profile.meaningful_progress_goals || []}
              onChange={(value) => handleFieldChange('meaningful_progress_goals', value)}
              options={PROGRESS_GOALS_OPTIONS}
              placeholder="Select meaningful progress areas"
            />

            <MultiSelectInput
              id="shared_values"
              label="Shared Values"
              value={profile.shared_values || []}
              onChange={(value) => handleFieldChange('shared_values', value)}
              options={['Innovation', 'Collaboration', 'Growth', 'Impact', 'Authenticity', 'Excellence']}
              placeholder="What values do you want shared?"
            />
          </div>
        </motion.div>

        {/* Skills & Needs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Skills & Needs</h3>
          
          <div className="space-y-4">
            <TextInput
              id="strengths_text"
              label="What are you unusually good at?"
              value={profile.strengths_text || ''}
              onChange={(value) => handleFieldChange('strengths_text', value)}
              placeholder="Describe your key strengths and skills"
              isTextArea={true}
            />

            <TextInput
              id="needs_text"
              label="Where could you use help?"
              value={profile.needs_text || ''}
              onChange={(value) => handleFieldChange('needs_text', value)}
              placeholder="What areas could you benefit from support?"
              isTextArea={true}
            />

            <MultiSelectInput
              id="connection_preferences"
              label="How do you prefer to connect?"
              value={profile.connection_preferences || []}
              onChange={(value) => handleFieldChange('connection_preferences', value)}
              options={CONNECTION_PREFERENCES_OPTIONS}
              placeholder="Select your preferred connection methods"
            />
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Preferences</h3>
          
          <div className="space-y-4">
            <SliderInput
              id="availability_hours"
              label="Time for new connections (hours per week)"
              value={profile.availability_hours || 5}
              onChange={(value) => handleFieldChange('availability_hours', value)}
              min={0}
              max={20}
              step={1}
              color="blue"
            />

            <SliderInput
              id="serendipity_openness"
              label="Openness to serendipity"
              value={profile.serendipity_openness || 0.5}
              onChange={(value) => handleFieldChange('serendipity_openness', value)}
              min={0}
              max={1}
              step={0.1}
              color="purple"
            />

            <TextInput
              id="human_detail"
              label="Something Human"
              value={profile.human_detail || ''}
              onChange={(value) => handleFieldChange('human_detail', value)}
              placeholder="Share something personal or interesting about yourself"
              isTextArea={true}
              maxLength={300}
            />
          </div>
        </motion.div>
      </div>

      {/* Save Button (Mobile) */}
      <div className="lg:hidden">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
        >
          {saving ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
