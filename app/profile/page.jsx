'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Edit, Save, X, User, Mail, MapPin, Briefcase, Award, Target, Users } from 'lucide-react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    location: 'San Francisco, CA',
    role: 'Product Manager',
    company: 'TechCorp',
    bio: 'Passionate about building products that make a difference. I love connecting with like-minded professionals who share my values of innovation and collaboration.',
    skills: ['Product Management', 'User Research', 'Data Analysis', 'Leadership'],
    goals: ['Career Growth', 'Skill Development', 'Networking'],
    values: ['Innovation', 'Collaboration', 'Integrity', 'Impact']
  })

  const [editProfile, setEditProfile] = useState(profile)

  const handleSave = () => {
    setProfile(editProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditProfile(profile)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gold-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <h1 className="text-2xl font-bold gradient-text">🌱 The Ecosystem</h1>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                <ArrowLeft className="h-4 w-4 inline mr-1" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-2xl">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editProfile.name}
                      onChange={(e) => setEditProfile({...editProfile, name: e.target.value})}
                      className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:outline-none"
                    />
                  ) : (
                    profile.name
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
                        profile.role
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
                        profile.location
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
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
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
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:border-emerald-500 focus:outline-none text-gray-900 dark:text-white"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-300">{profile.bio}</p>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  <div className="w-full">
                    <input
                      type="text"
                      value={editProfile.skills.join(', ')}
                      onChange={(e) => setEditProfile({...editProfile, skills: e.target.value.split(', ').filter(s => s.trim())})}
                      placeholder="Enter skills separated by commas"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:border-emerald-500 focus:outline-none text-gray-900 dark:text-white"
                    />
                  </div>
                ) : (
                  profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                    >
                      {skill}
                    </span>
                  ))
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
                      placeholder="Enter goals separated by commas"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:border-emerald-500 focus:outline-none text-gray-900 dark:text-white"
                    />
                  </div>
                ) : (
                  profile.goals.map((goal, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-300">{goal}</span>
                    </div>
                  ))
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
                      placeholder="Enter values separated by commas"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:border-emerald-500 focus:outline-none text-gray-900 dark:text-white"
                    />
                  </div>
                ) : (
                  profile.values.map((value, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {value}
                    </span>
                  ))
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
                    Company
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editProfile.company}
                      onChange={(e) => setEditProfile({...editProfile, company: e.target.value})}
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:border-emerald-500 focus:outline-none text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">{profile.company}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}