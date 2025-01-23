import { ObjectId } from 'mongodb';

export interface IUser {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  isVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProgress {
  _id?: ObjectId;
  userId: ObjectId;
  formationId: ObjectId;
  moduleId: number;
  completed: boolean;
  lastAccessed: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserSettings {
  _id?: ObjectId;
  userId: ObjectId;
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
  createdAt: Date;
  updatedAt: Date;
} 