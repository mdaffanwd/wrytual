import { NextRequest, NextResponse } from 'next/server'
import { sendOTPEmail } from '@/lib/email'
import { User } from '@/models/User'
import connectToDatabase from '@/lib/db'
import { Otp } from '@/models/Otp';


interface OTPRequestBody {
    email: string;
    type?: 'signup' | 'reset-password';
}

function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
    try {
        const { email, type = 'signup' }: OTPRequestBody = await request.json()

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
        }

        await connectToDatabase();

        // ✅ Rate-limiting based on createdAt instead of expiresAt
        const recentOtp = await Otp.findOne({ email, type }).sort({ createdAt: -1 })
        if (recentOtp && recentOtp.createdAt > new Date(Date.now() - 30 * 1000)) {
            return NextResponse.json(
                { error: 'Please wait 30 seconds before requesting another OTP' },
                { status: 429 }
            )
        }

        const existingUser = await User.findOne({ email })
        if (type === 'signup' && existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists. Please login.' },
                { status: 400 }
            )
        }
        if (type === 'reset-password') {
            // If this is for password reset, check if user exists
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
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        // Clean up existing OTPs for this email
        await Otp.deleteMany({ email, type })

        // Store OTP in db
        await Otp.create({ email, otp, type, expiresAt })

        // Send email
        try {
            const emailResult = await sendOTPEmail(email, otp, type)
            if (!emailResult.success) throw new Error('Email send failed')
        } catch (err) {
            return NextResponse.json({ error: 'Failed to send OTP email' }, { status: 500 })
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