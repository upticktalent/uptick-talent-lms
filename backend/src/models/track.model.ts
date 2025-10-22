import { Schema, model, Document } from 'mongoose';
import { TrackType } from '../types/enums';

export interface ITrack extends Document {
  name: string;
  description?: string;
  type: TrackType;
  startDate?: Date;
  endDate?: Date;
  mentorId?: Schema.Types.ObjectId;
  expertId?: Schema.Types.ObjectId;
  liveSessionLinks?: string[];
  prerequisites?: string[];
  duration?: string;
}

const TrackSchema = new Schema<ITrack>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  type: { type: String, enum: Object.values(TrackType), required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  mentorId: { type: Schema.Types.ObjectId, ref: 'User' },
  expertId: { type: Schema.Types.ObjectId, ref: 'User' },
  liveSessionLinks: [{ type: String }],
  prerequisites: [{ type: String }],
  duration: { type: String },
}, { timestamps: true });

const Track = model<ITrack>('Track', TrackSchema);
export default Track;
