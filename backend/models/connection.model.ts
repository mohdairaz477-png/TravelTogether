import mongoose, { Schema, Document } from 'mongoose';

export type ConnectionStatus = 'pending' | 'accepted' | 'rejected';
export interface IConnection extends Document {
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
  message: string;
  matchScore: number;
  status: ConnectionStatus;
  responseMessage: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
const connectionSchema = new Schema<IConnection>({
  fromUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  toUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  message: { type: String, trim: true, maxlength: 1000, default: '' },
  matchScore: { type: Number, min: 0, max: 100, default: 0 },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending', index: true },
  responseMessage: { type: String, trim: true, maxlength: 1000, default: '' },
  respondedAt: { type: Date },
}, { timestamps: true });
connectionSchema.index({ fromUserId: 1, toUserId: 1, status: 1 });
export const Connection = mongoose.model<IConnection>('Connection', connectionSchema);
