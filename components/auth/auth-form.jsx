'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { signUp, signIn, resetPassword } from '@/lib/auth'
import { validateEmail, validatePassword } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'

export default function AuthForm({ mode = 'signin' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'signup') {
        if (!validateEmail(email)) {
          throw new Error('Please enter a valid email address')
        }
        if (!validatePassword(password)) {
          throw new Error('Password must be at least 8 characters long')
        }
        if (!fullName.trim()) {
          throw new Error('Please enter your full name')
        }

        await signUp(email, password, fullName)
        addToast('Check your email for verification link!', 'success')
      } else if (mode === 'signin') {
        if (!validateEmail(email)) {
          throw new Error('Please enter a valid email address')
        }
        if (!password) {
          throw new Error('Please enter your password')
        }

        await signIn(email, password)
        addToast('Successfully signed in!', 'success')
        // Redirect will be handled by the auth context
      } else if (mode === 'reset') {
        if (!validateEmail(email)) {
          throw new Error('Please enter a valid email address')
        }

        await resetPassword(email)
        addToast('Password reset email sent!', 'success')
      }
    } catch (err) {
      addToast(err.message || 'An error occurred', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card variant="glass" className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-gold-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🌱</span>
          </div>
          <CardTitle className="text-3xl font-bold gradient-text-emerald mb-2">
            {mode === 'signup' ? 'Join The Ecosystem' : 
             mode === 'signin' ? 'Welcome Back' : 
             'Reset Password'}
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300">
            {mode === 'signup' ? 'Create your account to get started' :
             mode === 'signin' ? 'Sign in to your account' :
             'Enter your email to reset your password'}
          </p>
        </motion.div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: mode === 'signup' ? 0.2 : 0.1 }}
          >
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>
          </motion.div>

          {mode !== 'reset' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: mode === 'signup' ? 0.3 : 0.2 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              type="submit"
              disabled={loading}
              variant="gradient"
              size="lg"
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Please wait...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {mode === 'signup' ? 'Create Account' :
                   mode === 'signin' ? 'Sign In' :
                   'Send Reset Email'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              )}
            </Button>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 text-center space-y-2"
        >
          {mode === 'signin' && (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                  Sign up
                </Link>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <Link href="/auth/reset-password" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                  Forgot your password?
                </Link>
              </p>
            </>
          )}
          
          {mode === 'signup' && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          )}
          
          {mode === 'reset' && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{' '}
              <Link href="/auth/signin" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          )}
        </motion.div>
      </CardContent>
    </Card>
  )
}
