'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Edit, Save, X, User, Mail, MapPin, Briefcase, Award, Target, Users } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { useToast } from '@/components/ui/toast'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    location: '',
    role: '',
    company: '',
    bio: '',
    strengths: [],
    needs: [],
    goals: [],
    values: [],
    industry: '',
    experience_level: ''
  })
  const [editProfile, setEditProfile] = useState(profile)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { addToast } = useToast()

  useEffect(() => {
    // Check authentication and load profile data
    const loadProfileData = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push('/auth/signin')
          return
        }
        setUser(currentUser)

        // Load user profile
        const profileResponse = await fetch(`/api/profile?userId=${currentUser.id}`)
        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          if (profileData.profile) {
            const profileInfo = {
              full_name: profileData.profile.users?.full_name || currentUser.user_metadata?.full_name || '',
              email: profileData.profile.users?.email || currentUser.email || '',
              location: profileData.profile.location || '',
              role: profileData.profile.users?.role || '',
              company: profileData.profile.industry || '',
              bio: profileData.profile.bio || '',
              strengths: profileData.profile.strengths || [],
              needs: profileData.profile.needs || [],
              goals: profileData.profile.goals || [],
              values: profileData.profile.values || [],
              industry: profileData.profile.industry || '',
              experience_level: profileData.profile.experience_level || ''
            }
            setProfile(profileInfo)
            setEditProfile(profileInfo)
          } else {
            // Set basic user info if no profile exists
            const basicProfile = {
              full_name: currentUser.user_metadata?.full_name || '',
              email: currentUser.email || '',
              location: '',
              role: '',
              company: '',
              bio: '',
              strengths: [],
              needs: [],
              goals: [],
              values: [],
              industry: '',
              experience_level: ''
            }
            setProfile(basicProfile)
            setEditProfile(basicProfile)
          }
        }

      } catch (error) {
        console.error('Error loading profile data:', error)
        addToast('Failed to load profile data', 'error')
      } finally {
        setLoading(false)
      }
    }

    loadProfileData()
  }, [router, addToast])

  const handleSave = async () => {
    if (!user) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          full_name: editProfile.full_name,
          email: editProfile.email,
          location: editProfile.location,
          role: editProfile.role,
          industry: editProfile.company,
          bio: editProfile.bio,
          strengths: editProfile.strengths,
          needs: editProfile.needs,
          goals: editProfile.goals,
          values: editProfile.values,
          experience_level: editProfile.experience_level
        })
      })

      if (response.ok) {
        setProfile(editProfile)
        setIsEditing(false)
        addToast('Profile updated successfully!', 'success')
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      addToast('Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditProfile(profile)
    setIsEditing(false)
  }

  if (loading) {
    return (
      <DashboardLayout currentPath="/profile">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 p-8">
            <div className="flex items-center space-x-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPath="/profile">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-2xl">
                  {profile.full_name ? profile.full_name.split(' ').map(n => n[0]).join('') : '?'}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editProfile.full_name}
                      onChange={(e) => setEditProfile({...editProfile, full_name: e.target.value})}
                      className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:outline-none"
                    />
                  ) : (
                    profile.full_name || 'Complete your profile'
                  )}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-300">
                  <div className="flex items-center space-x-1">
                    <Briefcase className="h-4 w-4" />
                    <span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editProfile.role}
                          onChange={(e) => setEditProfile({...editProfile, role: e.target.value})}
                          className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:outline-none"
                        />
                      ) : (
                        profile.role || 'Add your role'
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editProfile.location}
                          onChange={(e) => setEditProfile({...editProfile, location: e.target.value})}
                          className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:outline-none"
                        />
                      ) : (
                        profile.location || 'Add your location'
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center disabled:opacity-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Bio */}
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                About Me
              </h3>
              {isEditing ? (
                <textarea
                  value={editProfile.bio}
                  onChange={(e) => setEditProfile({...editProfile, bio: e.target.value})}
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:border-emerald-500 focus:outline-none text-gray-900 dark:text-white"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  {profile.bio || 'Add a bio to help others understand who you are and what you do.'}
                </p>
              )}
            </div>

            {/* Strengths */}
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                Strengths
              </h3>
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  <div className="w-full">
                    <input
                      type="text"
                      value={editProfile.strengths.join(', ')}
                      onChange={(e) => setEditProfile({...editProfile, strengths: e.target.value.split(', ').filter(s => s.trim())})}
                      placeholder="Enter your strengths separated by commas"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:border-emerald-500 focus:outline-none text-gray-900 dark:text-white"
                    />
                  </div>
                ) : (
                  profile.strengths.length > 0 ? (
                    profile.strengths.map((strength, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                      >
                        {strength}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">Add your key strengths</p>
                  )
                )}
              </div>
            </div>

            {/* Needs */}
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                Areas for Growth
              </h3>
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  <div className="w-full">
                    <input
                      type="text"
                      value={editProfile.needs.join(', ')}
                      onChange={(e) => setEditProfile({...editProfile, needs: e.target.value.split(', ').filter(n => n.trim())})}
                      placeholder="Enter areas you'd like to develop separated by commas"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:border-emerald-500 focus:outline-none text-gray-900 dark:text-white"
                    />
                  </div>
                ) : (
                  profile.needs.length > 0 ? (
                    profile.needs.map((need, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {need}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">Add areas you'd like to develop</p>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Goals */}
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                Professional Goals
              </h3>
              <div className="space-y-2">
                {isEditing ? (
                  <div className="w-full">
                    <input
                      type="text"
                      value={editProfile.goals.join(', ')}
                      onChange={(e) => setEditProfile({...editProfile, goals: e.target.value.split(', ').filter(g => g.trim())})}
                      placeholder="Enter your professional goals separated by commas"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:border-emerald-500 focus:outline-none text-gray-900 dark:text-white"
                    />
                  </div>
                ) : (
                  profile.goals.length > 0 ? (
                    profile.goals.map((goal, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-300">{goal}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">Add your professional goals</p>
                  )
                )}
              </div>
            </div>

            {/* Values */}
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                Core Values
              </h3>
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  <div className="w-full">
                    <input
                      type="text"
                      value={editProfile.values.join(', ')}
                      onChange={(e) => setEditProfile({...editProfile, values: e.target.value.split(', ').filter(v => v.trim())})}
                      placeholder="Enter your core values separated by commas"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:border-emerald-500 focus:outline-none text-gray-900 dark:text-white"
                    />
                  </div>
                ) : (
                  profile.values.length > 0 ? (
                    profile.values.map((value, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                      >
                        {value}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">Add your core values</p>
                  )
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editProfile.email}
                      onChange={(e) => setEditProfile({...editProfile, email: e.target.value})}
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:border-emerald-500 focus:outline-none text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">{profile.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Industry
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editProfile.company}
                      onChange={(e) => setEditProfile({...editProfile, company: e.target.value})}
                      placeholder="e.g., Technology, Healthcare, Finance"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:border-emerald-500 focus:outline-none text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">{profile.company || 'Add your industry'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Experience Level
                  </label>
                  {isEditing ? (
                    <select
                      value={editProfile.experience_level}
                      onChange={(e) => setEditProfile({...editProfile, experience_level: e.target.value})}
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:border-emerald-500 focus:outline-none text-gray-900 dark:text-white"
                    >
                      <option value="">Select experience level</option>
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                      <option value="executive">Executive</option>
                    </select>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">
                      {profile.experience_level ? 
                        profile.experience_level.charAt(0).toUpperCase() + profile.experience_level.slice(1) + ' Level' : 
                        'Add your experience level'
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </DashboardLayout>
  )
}