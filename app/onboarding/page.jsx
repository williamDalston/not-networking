'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Brain, Target, Users, Zap, Shield, TrendingUp, CheckCircle } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { useToast } from '@/components/ui/toast'

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { addToast } = useToast()

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push('/auth/signin')
          return
        }
        setUser(currentUser)
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/auth/signin')
      }
    }
    checkAuth()
  }, [router])

  const saveProgress = async (stepData) => {
    if (!user) return
    
    try {
      const response = await fetch('/api/onboarding/save-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          step: currentStep,
          data: stepData
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save progress')
      }
    } catch (error) {
      console.error('Error saving progress:', error)
      addToast('Failed to save progress', 'error')
    }
  }

  const generateEmbeddings = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/profile/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate embeddings')
      }

      const result = await response.json()
      addToast('Profile analysis complete! Generating your matches...', 'success')
    } catch (error) {
      console.error('Error generating embeddings:', error)
      addToast('Failed to complete profile analysis', 'error')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to The Ecosystem',
      subtitle: 'Let\'s discover your professional DNA',
      content: (
        <div className="text-center">
          <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI-Powered Professional Discovery
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Our SAM AI will learn about your strengths, goals, and values to find you the most meaningful professional connections.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Smart Matching</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">AI finds connections based on complementary skills and shared values</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Growth Circles</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Join peer groups of 4-6 people for focused development</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-gold-600 dark:text-gold-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Track Progress</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Monitor your networking growth and professional development</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'goals',
      title: 'What are your professional goals?',
      subtitle: 'Help us understand what you want to achieve',
      content: (
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4">
            {[
              { id: 'career-change', label: 'Career transition or change', description: 'Looking to pivot to a new field or role' },
              { id: 'skill-development', label: 'Skill development', description: 'Want to learn new skills or improve existing ones' },
              { id: 'leadership', label: 'Leadership development', description: 'Building leadership and management capabilities' },
              { id: 'entrepreneurship', label: 'Entrepreneurship', description: 'Starting or growing a business venture' },
              { id: 'networking', label: 'Expand professional network', description: 'Building meaningful professional relationships' },
              { id: 'mentorship', label: 'Find mentors or mentees', description: 'Seeking guidance or looking to help others' }
            ].map((option) => (
              <label key={option.id} className="flex items-start space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  onChange={(e) => {
                    setAnswers(prev => ({
                      ...prev,
                      goals: e.target.checked 
                        ? [...(prev.goals || []), option.id]
                        : (prev.goals || []).filter(g => g !== option.id)
                    }))
                  }}
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'values',
      title: 'What values drive your work?',
      subtitle: 'Select the values that matter most to you',
      content: (
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'innovation', label: 'Innovation', icon: Zap },
              { id: 'collaboration', label: 'Collaboration', icon: Users },
              { id: 'integrity', label: 'Integrity', icon: Shield },
              { id: 'growth', label: 'Growth', icon: TrendingUp },
              { id: 'impact', label: 'Social Impact', icon: Target },
              { id: 'excellence', label: 'Excellence', icon: CheckCircle }
            ].map((value) => (
              <label key={value.id} className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  onChange={(e) => {
                    setAnswers(prev => ({
                      ...prev,
                      values: e.target.checked 
                        ? [...(prev.values || []), value.id]
                        : (prev.values || []).filter(v => v !== value.id)
                    }))
                  }}
                />
                <value.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium text-gray-900 dark:text-white">{value.label}</span>
              </label>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'skills',
      title: 'What are your key strengths?',
      subtitle: 'Tell us about your professional skills',
      content: (
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Skills (select up to 5)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Product Management', 'Software Engineering', 'Data Science', 'Design',
                  'Marketing', 'Sales', 'Operations', 'Finance', 'Strategy', 'Leadership',
                  'Research', 'Writing', 'Public Speaking', 'Project Management'
                ].map((skill) => (
                  <label key={skill} className="flex items-center space-x-2 p-2 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      onChange={(e) => {
                        setAnswers(prev => ({
                          ...prev,
                          skills: e.target.checked 
                            ? [...(prev.skills || []), skill]
                            : (prev.skills || []).filter(s => s !== skill)
                        }))
                      }}
                    />
                    <span className="text-sm text-gray-900 dark:text-white">{skill}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'completion',
      title: 'Welcome to The Ecosystem!',
      subtitle: 'Your profile is ready',
      content: (
        <div className="text-center">
          <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Profile Complete! 🎉
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Our AI is now analyzing your profile to find the most meaningful connections. You'll receive your first matches within 24 hours.
          </p>
          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 max-w-md mx-auto mb-8">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">What's Next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">1</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">AI analyzes your profile</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">2</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Receive personalized matches</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">3</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Start building meaningful connections</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ]

  const handleNext = async () => {
    // Save current step progress
    await saveProgress(answers)
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      await generateEmbeddings()
      router.push('/dashboard')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="min-h-screen gradient-bg-animated">
      {/* Navigation */}
      <nav className="glass border-b border-white/20 dark:border-gray-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <motion.div
                  className="text-2xl mr-2 group-hover:scale-110 transition-transform duration-200"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  🌱
                </motion.div>
                <h1 className="text-2xl font-bold gradient-text-emerald">The Ecosystem</h1>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="glass border-b border-white/20 dark:border-gray-700/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full shadow-lg shadow-emerald-500/25" 
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold gradient-text-emerald mb-2"
            >
              {steps[currentStep].title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-600 dark:text-gray-300"
            >
              {steps[currentStep].subtitle}
            </motion.p>
          </div>

          <div className="mb-8">
            {steps[currentStep].content}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600'
              }`}
            >
              Previous
            </button>

            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentStep
                      ? 'bg-emerald-600'
                      : index < currentStep
                      ? 'bg-emerald-300'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {isLastStep ? (
              <button
                onClick={handleNext}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center disabled:opacity-50"
              >
                {loading ? 'Analyzing Profile...' : 'Complete Setup'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
      
    </div>
  )
}