import { Schema, model, models, Document } from "mongoose";

export interface IEntry extends Document {
    title: string;
    description: string;
    tags: string[];
    user?: string;
}

const EntrySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [
        { type: String }
    ],
}, { timestamps: true });

export const Entry = models.Entry || model<IEntry>("Entry", EntrySchema);
