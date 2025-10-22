import { Schema, model, Document } from 'mongoose';

interface IProgress {
  trackId: Schema.Types.ObjectId;
  percentage: number;
  lastUpdated: Date;
}

interface IFeedback {
  trackId: Schema.Types.ObjectId;
  rating: number;
  comments: string;
}

export interface IStudent extends Document {
  userId: Schema.Types.ObjectId;
  cohortId?: Schema.Types.ObjectId;
  enrolledTracks?: Schema.Types.ObjectId[];
  progress?: IProgress[];
  feedback?: IFeedback[];
}

const StudentSchema = new Schema<IStudent>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  cohortId: { type: Schema.Types.ObjectId, ref: 'Cohort' }, // Assuming a Cohort model will be created
  enrolledTracks: [{ type: Schema.Types.ObjectId, ref: 'Track' }], // Changed ref to Track
  progress: [{
    trackId: { type: Schema.Types.ObjectId, ref: 'Track' }, // Changed ref to Track
    percentage: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  }],
  feedback: [{
    trackId: { type: Schema.Types.ObjectId, ref: 'Track' }, // Changed ref to Track
    rating: { type: Number, min: 1, max: 5 },
    comments: { type: String },
  }],
}, { timestamps: true });

const Student = model<IStudent>('Student', StudentSchema);
export default Student;
