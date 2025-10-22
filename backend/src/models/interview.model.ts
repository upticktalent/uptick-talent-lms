import { Schema, model, Document } from 'mongoose';

export interface IInterview extends Document {
  applicationId: Schema.Types.ObjectId;
  interviewerId: Schema.Types.ObjectId;
  scheduledAt: Date;
  status: 'pending' | 'scheduled' | 'completed' | 'canceled';
  outcome?: 'pass' | 'fail';
  feedback?: string;
}

const InterviewSchema = new Schema<IInterview>({
  applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
  interviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledAt: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'scheduled', 'completed', 'canceled'], default: 'pending', required: true },
  outcome: { type: String, enum: ['pass', 'fail'] },
  feedback: { type: String },
}, { timestamps: true });

const Interview = model<IInterview>('Interview', InterviewSchema);
export default Interview;
