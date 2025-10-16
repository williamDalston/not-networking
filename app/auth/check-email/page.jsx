'use client'

import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CheckEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const isReset = searchParams.get('reset') === 'true'

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gold-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="p-8 glass-card text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Mail className="h-8 w-8 text-emerald-600" />
          </motion.div>

          <h1 className="text-2xl font-display font-bold gradient-text mb-4">
            {isReset ? 'Check Your Email' : 'Welcome to The Ecosystem!'}
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {isReset ? (
              <>
                We've sent a password reset link to{' '}
                <span className="font-medium text-gray-900 dark:text-white">
                  {email || 'your email address'}
                </span>
                . Check your inbox and click the link to reset your password.
              </>
            ) : (
              <>
                We've sent a confirmation link to{' '}
                <span className="font-medium text-gray-900 dark:text-white">
                  {email || 'your email address'}
                </span>
                . Click the link to activate your account and start building meaningful connections.
              </>
            )}
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-center space-x-2 text-emerald-700 dark:text-emerald-300">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">
                {isReset ? 'Reset link sent successfully' : 'Confirmation email sent'}
              </span>
            </div>
          </motion.div>

          <div className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Didn't receive the email? Check your spam folder or{' '}
              <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                resend the {isReset ? 'reset link' : 'confirmation email'}
              </button>
            </p>

            <Link href="/auth/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
