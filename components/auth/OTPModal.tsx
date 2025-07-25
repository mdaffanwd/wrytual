'use client'

import { useState, useRef, KeyboardEvent, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'

interface OTPModalProps {
    isOpen: boolean
    onClose: () => void
    onVerify: (otp: string) => Promise<void>
    email: string
    loading: boolean
    onResendOTP: () => Promise<void>
    type?: 'signup' | 'reset-password'
    error?: string
    setError?: (value: string) => void
}

export function OTPModal({ isOpen, onClose, onVerify, email, loading, onResendOTP, error, setError }: OTPModalProps) {
    const [otp, setOtp] = useState(['', '', '', ''])
    const [resendLoading, setResendLoading] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const internalError = error || ''
    const updateError = useMemo(() => setError || (() => { }), [setError])
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    // Clear OTP on open
    useEffect(() => {
        if (isOpen) {
            setOtp(['', '', '', ''])
            updateError('')
            setTimeout(() => inputRefs.current[0]?.focus(), 100)
        }
    }, [isOpen, updateError])

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
        updateError('')

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleVerify = async () => {
        const otpString = otp.join('')
        if (otpString.length === 4) {
            try {
                updateError('')
                await onVerify(otpString)
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Verification failed'
                updateError(message)
            }
        }
    }

    const handleResend = async () => {
        setResendLoading(true)
        try {
            await onResendOTP()
            setCountdown(30) // 60 second cooldown
        } catch (error) {
            console.error('Failed to resend OTP:', error)
        } finally {
            setResendLoading(false)
        }
    }

    const isOtpComplete = otp.every(digit => digit !== '')

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">Verify Email</CardTitle>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <p className="text-sm text-red-500 text-center">{internalError}</p>
                    )}
                    <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                            We&#39;ve sent a {otp.length}-digit verification code to
                        </p>
                        <p className="font-medium">{email}</p>
                    </div>

                    <div className="flex justify-center space-x-2">
                        {otp.map((digit, index) => (
                            <Input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-12 text-center text-lg font-semibold"
                                disabled={loading}
                            />
                        ))}
                    </div>

                    <Button
                        onClick={handleVerify}
                        disabled={!isOtpComplete || loading}
                        className="w-full"
                    >
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </Button>

                    <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Didn&#39;t receive the code?
                        </p>
                        <Button
                            variant="link"
                            onClick={handleResend}
                            disabled={countdown > 0 || resendLoading}
                            className="p-0 h-auto"
                        >
                            {resendLoading
                                ? 'Sending...'
                                : countdown > 0
                                    ? `Resend in ${countdown}s`
                                    : 'Resend Code'
                            }
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
