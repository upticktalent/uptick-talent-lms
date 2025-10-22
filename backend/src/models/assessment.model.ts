import { Schema, model, Document } from 'mongoose';

export interface IAssessment extends Document {
  applicationId: Schema.Types.ObjectId;
  title: string;
  link: string;
  submissionLink?: string;
  score?: number;
  feedback?: string;
  submittedAt?: Date;
  reviewedBy?: Schema.Types.ObjectId;
  reviewedAt?: Date;
}

const AssessmentSchema = new Schema<IAssessment>({
  applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true, unique: true },
  title: { type: String, required: true },
  link: { type: String, required: true },
  submissionLink: { type: String },
  score: { type: Number },
  feedback: { type: String },
  submittedAt: { type: Date },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
}, { timestamps: true });

const Assessment = model<IAssessment>('Assessment', AssessmentSchema);
export default Assessment;
