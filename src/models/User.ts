import mongoose, { Schema, Document, Types } from 'mongoose';

export enum UserRole {
    ADMIN = 'ADMIN',
    CUSTOMER = 'CUSTOMER',
  }

export interface IUser extends Document {
  _id: Types.ObjectId; // Додано обов'язкове поле _id
  email: string;
  name: string;
  passwordHash: string;
  password?: string;
  role: "ADMIN" | "CUSTOMER";
}

export interface IUserData {
    email: string;
    name: string;
    passwordHash: string;
    role: 'ADMIN' | 'CUSTOMER';
  }

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Email is invalid'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  passwordHash: {
    type: String,
    required: [true, 'Password hash is required'],
  },
  role: {
    type: String,
    enum: ['ADMIN', 'CUSTOMER'],
    required: [true, 'Role is required'],
  },
});

export const User = mongoose.model<IUser>('User', userSchema);
