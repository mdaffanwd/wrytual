import { NextRequest, NextResponse } from 'next/server'
import { User } from '@/models/User'
import connectToDatabase from '@/lib/db'
import { z } from 'zod'
import crypto from 'node:crypto'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate input
    const validatedData = forgotPasswordSchema.parse(body)
    const { email } = validatedData
    
    await connectToDatabase()
    
    // Check if user exists
    const user = await User.findOne({ email, provider: 'credentials' })
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: 'If an account with that email exists, we have sent a password reset link.' },
        { status: 200 }
      )
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now
    
    // Save reset token to user
    user.resetToken = resetToken
    user.resetTokenExpiry = resetTokenExpiry
    await user.save()
    
    // In a real app, you would send an email here
    // For now, we'll just return the token (remove this in production)
    console.log(`Reset token for ${email}: ${resetToken}`)
    
    return NextResponse.json(
      { 
        message: 'If an account with that email exists, we have sent a password reset link.',
        // Remove this in production - only for development/testing
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
      },
      { status: 200 }
    )
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
