import { AuthForm } from '@/components/auth/auth-form'

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gold-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <AuthForm mode="reset" onModeChange={() => {}} />
    </div>
  )
}
