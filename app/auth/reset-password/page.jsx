'use client'

import AuthForm from '@/components/auth/auth-form'

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm mode="reset" />
    </div>
  )
}
