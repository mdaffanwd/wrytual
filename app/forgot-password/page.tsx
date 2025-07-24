'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { OTPModal } from '@/components/auth/OTPModal'

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const resetSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type EmailFormData = z.infer<typeof emailSchema>
type ResetFormData = z.infer<typeof resetSchema>

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'reset'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const router = useRouter()

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  })

  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  })

  const handleEmailSubmit = async (data: EmailFormData) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email, type: 'reset-password' }),
      })

      if (response.ok) {
        setEmail(data.email)
        setShowOtpModal(true)
      } else {
        const result = await response.json()
        setError(result.error || 'Failed to send reset code')
      }
    } catch (err) {
      console.error(err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerify = async (otp: string) => {
    setOtpLoading(true)
    try {
      const verifyResponse = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      })

      if (verifyResponse.ok) {
        setShowOtpModal(false)
        setStep('reset')
      } else {
        const result = await verifyResponse.json()
        setError(result.error || 'Invalid verification code')
      }
    } catch (err) {
      console.error(err)
      setError('Network error. Please try again.')
    } finally {
      setOtpLoading(false)
    }
  }

  const handleResendOTP = async () => {
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, type: 'reset-password' }),
      })

      if (!response.ok) {
        const result = await response.json()
        setError(result.error || 'Failed to resend code')
      }
    } catch (err) {
      console.error(err)
      setError('Network error. Please try again.')
    }
  }

  const handlePasswordReset = async (data: ResetFormData) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password: data.password,
        }),
      })

      if (response.ok) {
        router.push('/login?message=Password reset successfully. Please log in with your new password.')
      } else {
        const result = await response.json()
        setError(result.error || 'Failed to reset password')
      }
    } catch (err) {
      console.error(err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {step === 'email' && 'Forgot Password?'}
              {step === 'reset' && 'Reset Password'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            {step === 'email' && (
              <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...emailForm.register('email')}
                    disabled={loading}
                  />
                  {emailForm.formState.errors.email && (
                    <p className="text-xs text-red-500">{emailForm.formState.errors.email.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Remember your password?{' '}
                  <Link href="/login" className="text-primary underline underline-offset-4 hover:text-primary/80">
                    Back to login
                  </Link>
                </div>
              </form>
            )}

            {step === 'reset' && (
              <form onSubmit={resetForm.handleSubmit(handlePasswordReset)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...resetForm.register('password')}
                    disabled={loading}
                  />
                  {resetForm.formState.errors.password && (
                    <p className="text-xs text-red-500">{resetForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...resetForm.register('confirmPassword')}
                    disabled={loading}
                  />
                  {resetForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-red-500">{resetForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      <OTPModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleOtpVerify}
        email={email}
        loading={otpLoading}
        onResendOTP={handleResendOTP}
        type="reset-password"
      />
    </>
  )
}
