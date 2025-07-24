import { NextRequest, NextResponse } from 'next/server'

// This should match the store in send-otp route (in production, use Redis or database)
declare global {
    var otpStore: Map<string, { otp: string; expires: number; type: 'signup' | 'reset-password' }> | undefined
}

if (!global.otpStore) {
    global.otpStore = new Map()
}

const otpStore = global.otpStore

export async function POST(request: NextRequest) {
    try {
        const { email, otp } = await request.json()

        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })
        }

        const storedOtpData = otpStore.get(email)

        if (!storedOtpData) {
            return NextResponse.json({ error: 'OTP not found or expired' }, { status: 400 })
        }

        // Check if OTP is expired
        if (Date.now() > storedOtpData.expires) {
            otpStore.delete(email)
            return NextResponse.json({ error: 'OTP has expired' }, { status: 400 })
        }

        // Check if OTP matches
        if (storedOtpData.otp !== otp) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
        }

        // OTP is valid - remove it from store
        otpStore.delete(email)

        return NextResponse.json({ 
            message: 'OTP verified successfully',
            success: true,
            type: storedOtpData.type
        })

    } catch (error) {
        console.error('Verify OTP error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
