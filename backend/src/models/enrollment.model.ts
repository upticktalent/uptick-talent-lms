import { Schema, model, Document } from 'mongoose';

interface IProgress {
  trackModuleId?: Schema.Types.ObjectId; // Optional: if tracks have modules, reference them here
  percentage: number;
  lastUpdated: Date;
}

export interface IEnrollment extends Document {
  userId: Schema.Types.ObjectId;
  trackId: Schema.Types.ObjectId;
  status: 'enrolled' | 'completed' | 'dropped';
  progress?: IProgress[];
}

const EnrollmentSchema = new Schema<IEnrollment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  trackId: { type: Schema.Types.ObjectId, ref: 'Track', required: true },
  status: { type: String, enum: ['enrolled', 'completed', 'dropped'], default: 'enrolled', required: true },
  progress: [{
    trackModuleId: { type: Schema.Types.ObjectId }, // This would depend on how you structure modules within a track
    percentage: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

const Enrollment = model<IEnrollment>('Enrollment', EnrollmentSchema);
export default Enrollment;
