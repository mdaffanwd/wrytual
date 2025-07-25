import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { User } from '@/models/User'
import connectToDatabase from '@/lib/db'
import { z } from 'zod'

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate input
    const validatedData = resetPasswordSchema.parse(body)
    const { email, password } = validatedData
    
    await connectToDatabase()
    
    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Update user password
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    })
    
    return NextResponse.json(
      { 
        message: 'Password reset successfully',
        success: true
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
    
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
