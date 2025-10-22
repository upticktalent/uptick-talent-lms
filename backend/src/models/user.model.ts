import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'applicant' | 'student' | 'admin' | 'mentor';
  status: 'pending' | 'active' | 'inactive' | 'rejected' | 'invited';
  passwordHash?: string;
  magicLinkTokenHash?: string;
  magicLinkExpiry?: Date;
  invitedBy?: Schema.Types.ObjectId;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String },
  role: { type: String, enum: ['applicant', 'student', 'admin', 'mentor'], default: 'applicant', required: true },
  status: { type: String, enum: ['pending', 'active', 'inactive', 'rejected', 'invited'], default: 'pending', required: true },
  passwordHash: { type: String },
  magicLinkTokenHash: { type: String },
  magicLinkExpiry: { type: Date },
  invitedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  lastLoginAt: { type: Date },
}, { timestamps: true });

const User = model<IUser>('User', UserSchema);
export default User;
