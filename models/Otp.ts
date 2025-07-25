import mongoose from 'mongoose'

export interface IOtp extends Document {
    email: string
    otp: string
    type: 'signup' | 'reset-password'
    createdAt: Date
    expiresAt: Date
}

const OtpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    type: { type: String, enum: ['signup', 'reset-password'], required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }
}, { timestamps: true })

export const Otp = mongoose.models.Otp || mongoose.model<IOtp>('Otp', OtpSchema);

