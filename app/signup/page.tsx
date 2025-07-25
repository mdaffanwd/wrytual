'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { OTPModal } from '@/components/auth/OTPModal'

const formSchema = z.object({
    name: z.string().min(2, 'Name is too short'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof formSchema>

export default function Page() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showOtpModal, setShowOtpModal] = useState(false)
    const [pendingUserData, setPendingUserData] = useState<FormData | null>(null)
    const [otpLoading, setOtpLoading] = useState(false)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = async (data: FormData) => {
        setLoading(true)
        setError('')

        try {
            // First, send OTP to email
            const otpResponse = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: data.email, type: 'signup' }),
            })

            if (otpResponse.ok) {
                // Store user data and show OTP modal
                setPendingUserData(data)
                setShowOtpModal(true)
            } else {
                const result = await otpResponse.json()
                setError(result.error || 'Failed to send verification email')
            }
        } catch (err) {
            console.error(err)
            setError('Network error. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleOtpVerify = async (otp: string) => {
        if (!pendingUserData) return

        setOtpLoading(true)
        try {
            // Verify OTP
            const verifyResponse = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: pendingUserData.email, otp }),
            })

            if (verifyResponse.ok) {
                // OTP verified, now create the user account
                const signupResponse = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...pendingUserData, emailVerified: true }),
                })

                const result = await signupResponse.json()

                if (signupResponse.ok) {
                    setShowOtpModal(false)
                    router.push('/login?message=Account created successfully. Your email has been verified. Please log in.')
                } else {
                    setError(result.error || 'Failed to create account')
                }
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
        if (!pendingUserData) return

        try {
            const response = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: pendingUserData.email, type: 'signup' }),
            })

            if (!response.ok) {
                const result = await response.json()
                setError(result.error || 'Failed to resend verification code')
            }
        } catch (err) {
            console.error(err)
            setError('Network error. Please try again.')
        }
    }

    return (
        <>
            <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-12">
                <Card className="w-full max-w-md border-none shadow-xl animate-fade-in">
                    <CardContent className="p-8 space-y-6">
                        <div className="text-center space-y-1">
                            <h1 className="text-3xl font-bold">Create your account</h1>
                            <p className="text-sm text-muted-foreground">Start logging what you learn today 🚀</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                                    {error}
                                </div>
                            )}

                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Developer"
                                    {...register('name')}
                                    disabled={loading}
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    {...register('email')}
                                    disabled={loading}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register('password')}
                                    disabled={loading}
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? 'Sending otp...' : 'Sign Up'}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full" type="button"
                                onClick={() => signIn("google", { callbackUrl: '/dashboard' })}
                                disabled={loading} >
                                Sign up with Google
                            </Button>
                        </form>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary underline underline-offset-4 hover:text-primary/80">
                                Log in
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <OTPModal
                isOpen={showOtpModal}
                onClose={() => setShowOtpModal(false)}
                onVerify={handleOtpVerify}
                email={pendingUserData?.email || ''}
                loading={otpLoading}
                onResendOTP={handleResendOTP}
                type="signup"
                error={error}
                setError={setError}
            />
        </>
    )
}
