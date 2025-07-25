import { Otp } from '@/models/Otp'
import { NextRequest, NextResponse } from 'next/server'


export async function POST(request: NextRequest) {
    try {
        const { email, otp } = await request.json()

        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })
        }

        const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 })

        if (!otpRecord) {
            return NextResponse.json({ error: 'OTP not found or expired' }, { status: 400 })
        }

        // Check if OTP is expired
        if (otpRecord.expiresAt < new Date()) {
            await Otp.deleteOne({ _id: otpRecord._id }) // ✅ Delete expired OTP
            return NextResponse.json({ error: 'OTP has expired' }, { status: 400 })
        }


        // Check if OTP matches
        if (otpRecord.otp !== otp) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
        }

        // ✅ OTP is valid — delete it after use
        await Otp.deleteOne({ _id: otpRecord._id })

        return NextResponse.json({
            message: 'OTP verified successfully',
            success: true,
            type: otpRecord.type
        })

    } catch (error) {
        console.error('Verify OTP error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
