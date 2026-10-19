import mongoose, { Schema, Document } from "mongoose";

export interface IDirectMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const directMessageSchema = new Schema<IDirectMessage>({
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  content: { type: String, required: true, trim: true, maxlength: 4000 },
}, { timestamps: true });

directMessageSchema.index({ senderId: 1, recipientId: 1, createdAt: 1 });
directMessageSchema.index({ recipientId: 1, senderId: 1, createdAt: 1 });

export const DirectMessage = mongoose.model<IDirectMessage>("DirectMessage", directMessageSchema);
