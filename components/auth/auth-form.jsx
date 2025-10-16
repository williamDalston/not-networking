'use client'

import { useState } from 'react'
import { signUp, signIn, resetPassword } from '@/lib/auth'
import { validateEmail, validatePassword } from '@/lib/utils'

export default function AuthForm({ mode = 'signin' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

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
        setSuccess('Check your email for verification link!')
      } else if (mode === 'signin') {
        if (!validateEmail(email)) {
          throw new Error('Please enter a valid email address')
        }
        if (!password) {
          throw new Error('Please enter your password')
        }

        await signIn(email, password)
        setSuccess('Successfully signed in!')
        // Redirect will be handled by the auth context
      } else if (mode === 'reset') {
        if (!validateEmail(email)) {
          throw new Error('Please enter a valid email address')
        }

        await resetPassword(email)
        setSuccess('Password reset email sent!')
      }
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'signup' ? 'Join The Ecosystem' : 
             mode === 'signin' ? 'Welcome Back' : 
             'Reset Password'}
          </h1>
          <p className="text-gray-600">
            {mode === 'signup' ? 'Create your account to get started' :
             mode === 'signin' ? 'Sign in to your account' :
             'Enter your email to reset your password'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          {mode !== 'reset' && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Please wait...' : 
             mode === 'signup' ? 'Create Account' :
             mode === 'signin' ? 'Sign In' :
             'Send Reset Email'}
          </button>
        </form>

        <div className="mt-6 text-center">
          {mode === 'signin' && (
            <>
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/auth/signup" className="text-green-600 hover:text-green-700 font-medium">
                  Sign up
                </a>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <a href="/auth/reset-password" className="text-green-600 hover:text-green-700 font-medium">
                  Forgot your password?
                </a>
              </p>
            </>
          )}
          
          {mode === 'signup' && (
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/auth/signin" className="text-green-600 hover:text-green-700 font-medium">
                Sign in
              </a>
            </p>
          )}
          
          {mode === 'reset' && (
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <a href="/auth/signin" className="text-green-600 hover:text-green-700 font-medium">
                Sign in
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
