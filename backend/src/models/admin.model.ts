import { Schema, model, Document } from 'mongoose';

export interface IAdmin extends Document {
  userId: Schema.Types.ObjectId;
  permissions?: string[];
  lastActionAt?: Date;
}

const AdminSchema = new Schema<IAdmin>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  permissions: [{ type: String }],
  lastActionAt: { type: Date },
}, { timestamps: true });

const Admin = model<IAdmin>('Admin', AdminSchema);
export default Admin;
