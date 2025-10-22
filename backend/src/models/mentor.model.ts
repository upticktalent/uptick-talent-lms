import { Schema, model, Document } from 'mongoose';

export interface IMentor extends Document {
  userId: Schema.Types.ObjectId;
  expertiseAreas?: string[];
  availabilitySlots?: Date[];
  bio?: string;
  assignedStudents?: Schema.Types.ObjectId[];
}

const MentorSchema = new Schema<IMentor>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  expertiseAreas: [{ type: String }],
  availabilitySlots: [{ type: Date }],
  bio: { type: String },
  assignedStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Mentor = model<IMentor>('Mentor', MentorSchema);
export default Mentor;
