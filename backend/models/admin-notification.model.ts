import mongoose, { Schema, Document } from 'mongoose';
export interface IAdminNotification extends Document {
  type: 'login' | 'signup'; userId: string; userName: string; userEmail: string;
  message: string; read: boolean; createdAt: Date;
}
const schema = new Schema<IAdminNotification>({
  type: { type: String, enum: ['login', 'signup'], required: true },
  userId: { type: String, required: true }, userName: { type: String, required: true },
  userEmail: { type: String, required: true }, message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });
export const AdminNotificationModel = mongoose.model<IAdminNotification>('AdminNotification', schema);
