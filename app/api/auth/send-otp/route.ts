import { NextRequest, NextResponse } from 'next/server'
import { sendOTPEmail } from '@/lib/email'
import { User } from '@/models/User'
import connectToDatabase from '@/lib/db'

// Global store for OTPs (in production, use Redis or database)
declare global {
    var otpStore: Map<string, { otp: string; expires: number; type: 'signup' | 'reset-password' }> | undefined
}

if (!global.otpStore) {
    global.otpStore = new Map()
}

const otpStore = global.otpStore

function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
    try {
        const { email, type = 'signup' } = await request.json()

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        await connectToDatabase()

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists. Please Login' },
                { status: 400 }
            )
        }
        // If this is for password reset, check if user exists
        if (type === 'reset-password') {
            const existingUser = await User.findOne({ email })

            if (!existingUser) {
                return NextResponse.json({ error: 'No account found with this email address' }, { status: 404 })
            }

            if (existingUser.provider !== 'credentials') {
                return NextResponse.json({
                    error: 'This account uses social login. Please use the social login option.'
                }, { status: 400 })
            }
        }

        // Generate OTP
        const otp = generateOTP()
        const expires = Date.now() + 10 * 60 * 1000 // 10 minutes

        // Store OTP
        otpStore.set(email, { otp, expires, type })

        // Send email
        const emailResult = await sendOTPEmail(email, otp, type)

        if (!emailResult.success) {
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
        }

        return NextResponse.json({
            message: 'OTP sent successfully',
            success: true
        })

    } catch (error) {
        console.error('Send OTP error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
