import { Schema, model, Document } from 'mongoose';
import { EnrollmentStatus } from '../types/enums';

interface IProgress {
  trackModuleId?: Schema.Types.ObjectId;
  percentage: number;
  lastUpdated: Date;
}

export interface IEnrollment extends Document {
  userId: Schema.Types.ObjectId;
  trackId: Schema.Types.ObjectId;
  status: EnrollmentStatus;
  progress?: IProgress[];
}

const EnrollmentSchema = new Schema<IEnrollment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  trackId: { type: Schema.Types.ObjectId, ref: 'Track', required: true },
  status: { type: String, enum: Object.values(EnrollmentStatus), default: EnrollmentStatus.ENROLLED, required: true },
  progress: [{
    trackModuleId: { type: Schema.Types.ObjectId },
    percentage: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

const Enrollment = model<IEnrollment>('Enrollment', EnrollmentSchema);
export default Enrollment;
