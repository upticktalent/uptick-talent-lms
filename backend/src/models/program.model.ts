import { Schema, model, Document } from 'mongoose';

export interface IProgram extends Document {
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  // Add any other relevant fields for a program
}

const ProgramSchema = new Schema<IProgram>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
}, { timestamps: true });

const Program = model<IProgram>('Program', ProgramSchema);
export default Program;
