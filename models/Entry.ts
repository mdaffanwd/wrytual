import { Schema, model, models, Document } from "mongoose";

export interface IEntry extends Document {
    title: string;
    description: string;
    tags: string[];
    userId?: string;
}

const EntrySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [
        { type: String }
    ],
    // date: { type: Date, default: Date.now }
}, { timestamps: true });

export const Entry = models.Entry || model<IEntry>("Entry", EntrySchema);
