'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Users, Brain, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { fadeIn, slideUp, staggerContainer, staggerItem } from '@/lib/animations'

interface OnboardingWelcomeProps {
  onStart: () => void
  onSkip: () => void
}

const features = [
  {
    icon: Clock,
    title: '5-10 minutes',
    description: 'Quick and easy to complete',
  },
  {
    icon: Users,
    title: 'Better matches',
    description: 'Help us understand who you are',
  },
  {
    icon: Brain,
    title: 'AI-powered',
    description: 'SAM learns your preferences',
  },
]

const sampleMatch = {
  name: 'Sarah Chen',
  role: 'Product Designer',
  matchReason: 'Shared interest in sustainable design and user research',
  confidence: 'High',
}

export function OnboardingWelcome({ onStart, onSkip }: OnboardingWelcomeProps) {
  const [isStarting, setIsStarting] = useState(false)

  const handleStart = async () => {
    setIsStarting(true)
    // Add a small delay for better UX
    setTimeout(() => {
      onStart()
    }, 500)
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gold-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6"
    >
      <div className="w-full max-w-4xl">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="text-center mb-12"
        >
          <motion.div variants={staggerItem} className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-gold-500 mb-6">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-4">
              Welcome to The Ecosystem
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Let's get to know you better so SAM AI can create meaningful connections that matter.
            </p>
          </motion.div>

          <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <motion.div key={feature.title} variants={staggerItem}>
                <Card className="glass-card border-0 shadow-lg h-full">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto mb-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={staggerItem} className="mb-12">
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
              Here's what you can expect
            </h2>
            <Card className="glass-card border-0 shadow-lg max-w-md mx-auto">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-gold-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold">
                      {sampleMatch.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {sampleMatch.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {sampleMatch.role}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      "{sampleMatch.matchReason}"
                    </p>
                    <div className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium">
                      {sampleMatch.confidence} Match
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              <p>✨ Your progress is automatically saved</p>
              <p>⏸️ You can pause and continue anytime</p>
              <p>🔒 Your information is private and secure</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="ecosystem-button"
                onClick={handleStart}
                loading={isStarting}
                loadingText="Getting started..."
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Start Your Journey
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={onSkip}
                className="rounded-2xl"
              >
                Skip for now
              </Button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              You can always complete this later from your profile
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}