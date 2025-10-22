import { Schema, model, Document } from 'mongoose';
import { InterviewStatus, InterviewOutcome } from '../types/enums';

export interface IInterview extends Document {
  applicationId: Schema.Types.ObjectId;
  interviewerId: Schema.Types.ObjectId;
  scheduledAt: Date;
  status: InterviewStatus;
  outcome?: InterviewOutcome;
  feedback?: string;
}

const InterviewSchema = new Schema<IInterview>({
  applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
  interviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledAt: { type: Date, required: true },
  status: { type: String, enum: Object.values(InterviewStatus), default: InterviewStatus.PENDING, required: true },
  outcome: { type: String, enum: Object.values(InterviewOutcome) },
  feedback: { type: String },
}, { timestamps: true });

const Interview = model<IInterview>('Interview', InterviewSchema);
export default Interview;
