import { Schema, model, Document } from 'mongoose';
import { AdminPermissions } from '../types/enums';

export interface IAdmin extends Document {
  userId: Schema.Types.ObjectId;
  permissions?: AdminPermissions[];
  lastActionAt?: Date;
}

const AdminSchema = new Schema<IAdmin>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  permissions: [{ type: String, enum: Object.values(AdminPermissions) }],
  lastActionAt: { type: Date },
}, { timestamps: true });

const Admin = model<IAdmin>('Admin', AdminSchema);
export default Admin;
