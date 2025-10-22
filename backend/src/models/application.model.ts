import { Schema, model, Document } from 'mongoose';

export interface IApplication extends Document {
  userId: Schema.Types.ObjectId;
  programId?: Schema.Types.ObjectId;
  city?: string;
  stack?: string;
  frontendTools?: string[];
  frontendToolsOther?: string;
  backendTools?: string[];
  backendToolsOther?: string;
  mobileTools?: string[];
  mobileToolsOther?: string;
  referralSource?: string;
  referralSourceOther?: string;
  status: 'pending' | 'shortlisted' | 'qualified' | 'rejected';
  takeHomeLink?: string;
  assessmentSubmittedAt?: Date;
  interviewScheduledAt?: Date;
  reviewedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  programId: { type: Schema.Types.ObjectId, ref: 'Program' },
  city: { type: String },
  stack: { type: String },
  frontendTools: [{ type: String }],
  frontendToolsOther: { type: String },
  backendTools: [{ type: String }],
  backendToolsOther: { type: String },
  mobileTools: [{ type: String }],
  mobileToolsOther: { type: String },
  referralSource: { type: String },
  referralSourceOther: { type: String },
  status: { type: String, enum: ['pending', 'shortlisted', 'qualified', 'rejected'], default: 'pending', required: true },
  takeHomeLink: { type: String },
  assessmentSubmittedAt: { type: Date },
  interviewScheduledAt: { type: Date },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Application = model<IApplication>('Application', ApplicationSchema);
export default Application;
