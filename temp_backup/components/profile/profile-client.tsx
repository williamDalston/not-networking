'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Edit, Settings, User, MapPin, Calendar, Award, Target, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ProfileClientProps {
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
  created_at: string
  updated_at: string
}

export function ProfileClient({ className = '' }: ProfileClientProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  if (error || !profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Profile Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {error || 'Unable to load your profile information.'}
        </p>
        <Button onClick={fetchProfile}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your profile and preferences
          </p>
        </div>

        <div className="flex space-x-3">
          <Link href="/profile/edit">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            {/* Avatar */}
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-2xl">
                    {profile.display_name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                {profile.display_name || 'Anonymous User'}
              </h2>
              
              {profile.work_on && (
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {profile.work_on}
                </p>
              )}

              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Connections</span>
                <span className="font-semibold text-gray-900 dark:text-white">12</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Events Attended</span>
                <span className="font-semibold text-gray-900 dark:text-white">8</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Profile Views</span>
                <span className="font-semibold text-gray-900 dark:text-white">24</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          {profile.bio && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-2 mb-4">
                <User className="h-5 w-5 text-emerald-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About Me</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {profile.bio}
              </p>
            </motion.div>
          )}

          {/* Strengths */}
          {profile.strengths_text && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Award className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Strengths</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {profile.strengths_text}
              </p>
            </motion.div>
          )}

          {/* Goals */}
          {profile.progress_goal && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Target className="h-5 w-5 text-amber-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Goal</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {profile.progress_goal}
              </p>
            </motion.div>
          )}

          {/* Values */}
          {profile.shared_values && profile.shared_values.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Shared Values</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.shared_values.map((value, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Needs */}
          {profile.needs_text && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-2 mb-4">
                <User className="h-5 w-5 text-emerald-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Where I Need Help</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {profile.needs_text}
              </p>
            </motion.div>
          )}

          {/* Human Detail */}
          {profile.human_detail && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/10 dark:to-blue-900/10 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-5 w-5 text-emerald-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Something Human</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {profile.human_detail}
              </p>
            </motion.div>
          )}

          {/* External Link */}
          {profile.external_link && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">External Link</h3>
              </div>
              <a
                href={profile.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                {profile.external_link}
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
