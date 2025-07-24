import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
// Create transporter - configured for Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD, // Use the SMTP_PASSWORD from your .env
    },
})

export async function sendOTPEmail(email: string, otp: string, type: 'signup' | 'reset-password' = 'signup') {
    const subject = type === 'signup' ? 'Verify Your Email - Wrytual' : 'Reset Your Password - Wrytual'
    
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${subject}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Wrytual</h1>
                    <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">
                        ${type === 'signup' ? 'Welcome to your learning journey!' : 'Password Reset Request'}
                    </p>
                </div>
                
                <div style="padding: 40px 20px;">
                    <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">
                        ${type === 'signup' ? 'Verify Your Email Address' : 'Reset Your Password'}
                    </h2>
                    
                    <p style="color: #666; line-height: 1.6; margin: 0 0 30px 0;">
                        ${type === 'signup' 
                            ? 'Thank you for signing up! Please use the verification code below to complete your registration:'
                            : 'You requested to reset your password. Please use the verification code below:'
                        }
                    </p>
                    
                    <div style="background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #495057; font-family: 'Courier New', monospace;">
                            ${otp}
                        </div>
                        <p style="color: #6c757d; margin: 15px 0 0 0; font-size: 14px;">
                            This code will expire in 10 minutes
                        </p>
                    </div>
                    
                    <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 30px 0;">
                        <p style="color: #1565c0; margin: 0; font-size: 14px;">
                            <strong>Security Notice:</strong> If you didn't request this ${type === 'signup' ? 'verification' : 'password reset'}, please ignore this email.
                        </p>
                    </div>
                    
                    <p style="color: #666; line-height: 1.6; margin: 30px 0 0 0; font-size: 14px;">
                        Best regards,<br>
                        The Wrytual Team
                    </p>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
                    <p style="color: #6c757d; margin: 0; font-size: 12px;">
                        This email was sent to ${email}. If you have any questions, please contact our support team.
                    </p>
                </div>
            </div>
        </body>
        </html>
    `

    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.SMTP_EMAIL,
        to: email,
        subject,
        html,
    }

    try {
        await transporter.sendMail(mailOptions)
        return { success: true }
    } catch (error) {
        console.error('Email sending failed:', error)
        return { success: false, error }
    }
}
