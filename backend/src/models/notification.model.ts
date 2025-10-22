import { Schema, model, Document } from 'mongoose';

export interface INotification extends Document {
  userId: Schema.Types.ObjectId;
  type: string;
  message: string;
  isRead: boolean;
  sentAt: Date;
  // Potentially add more fields like 'context' for dynamic content
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // e.g., 'application_status', 'assessment_reminder', 'interview_scheduled'
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  sentAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Notification = model<INotification>('Notification', NotificationSchema);
export default Notification;
