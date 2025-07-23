import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    provider: { type: String }, // google, credentials, etc.
    password: { type: String }, // for credentials provider
    emailVerified: { type: Date },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
}, { timestamps: true });

export const User = models.User || model("User", UserSchema);
