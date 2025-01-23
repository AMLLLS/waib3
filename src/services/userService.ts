import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { IUser, IUserProgress, IUserSettings } from '@/models/User';
import bcrypt from 'bcryptjs';

export const UserService = {
  async getAllUsers() {
    const { db } = await connectToDatabase();
    const users = await db.collection<IUser>('users')
      .find({}, { projection: { password: 0 } })
      .toArray();
    return users.map(user => ({
      ...user,
      _id: user._id!.toString()
    }));
  },

  async getUserById(id: string) {
    const { db } = await connectToDatabase();
    const user = await db.collection<IUser>('users').findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    );
    if (user) {
      return {
        ...user,
        _id: user._id!.toString()
      };
    }
    return null;
  },

  async getUserByEmail(email: string, includePassword: boolean = false) {
    const { db } = await connectToDatabase();
    const user = await db.collection<IUser>('users').findOne(
      { email },
      includePassword ? undefined : { projection: { password: 0 } }
    );
    if (user) {
      return {
        ...user,
        _id: user._id!.toString()
      };
    }
    return null;
  },

  async createUser(userData: Partial<IUser>) {
    const { db } = await connectToDatabase();
    const now = new Date();
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password!, salt);

    const userToInsert: Partial<IUser> = {
      ...userData,
      password: hashedPassword,
      isVerified: false,
      createdAt: now,
      updatedAt: now
    };

    const result = await db.collection<IUser>('users').insertOne(userToInsert as IUser);
    return result.insertedId.toString();
  },

  async updateUser(id: string, userData: Partial<IUser>) {
    const { db } = await connectToDatabase();
    const updateData: Partial<IUser> = {
      ...userData,
      updatedAt: new Date()
    };

    // Si le mot de passe est fourni, le hasher
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(userData.password, salt);
    }

    const result = await db.collection<IUser>('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return result.modifiedCount > 0;
  },

  async deleteUser(id: string) {
    const { db } = await connectToDatabase();
    const result = await db.collection<IUser>('users').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },

  async getUserProgress(userId: string) {
    const { db } = await connectToDatabase();
    const progress = await db.collection<IUserProgress>('userProgress')
      .find({ userId: new ObjectId(userId) })
      .toArray();
    return progress.map(p => ({
      ...p,
      _id: p._id!.toString(),
      userId: p.userId.toString(),
      formationId: p.formationId.toString()
    }));
  },

  async updateUserProgress(userId: string, formationId: string, moduleId: number, completed: boolean) {
    const { db } = await connectToDatabase();
    const now = new Date();
    const progressData: Partial<IUserProgress> = {
      userId: new ObjectId(userId),
      formationId: new ObjectId(formationId),
      moduleId,
      completed,
      lastAccessed: now,
      updatedAt: now
    };

    const result = await db.collection<IUserProgress>('userProgress').updateOne(
      {
        userId: new ObjectId(userId),
        formationId: new ObjectId(formationId),
        moduleId
      },
      { $set: progressData },
      { upsert: true }
    );
    return result.modifiedCount > 0 || result.upsertedCount > 0;
  },

  async getUserSettings(userId: string) {
    const { db } = await connectToDatabase();
    const settings = await db.collection<IUserSettings>('userSettings').findOne({
      userId: new ObjectId(userId)
    });
    if (settings) {
      return {
        ...settings,
        _id: settings._id!.toString(),
        userId: settings.userId.toString()
      };
    }
    return null;
  },

  async updateUserSettings(userId: string, settings: Partial<IUserSettings>) {
    const { db } = await connectToDatabase();
    const now = new Date();
    const settingsData: Partial<IUserSettings> = {
      ...settings,
      userId: new ObjectId(userId),
      updatedAt: now
    };

    const result = await db.collection<IUserSettings>('userSettings').updateOne(
      { userId: new ObjectId(userId) },
      { $set: settingsData },
      { upsert: true }
    );
    return result.modifiedCount > 0 || result.upsertedCount > 0;
  }
}; 