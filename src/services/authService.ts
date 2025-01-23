import bcrypt from 'bcryptjs';
import { UserService } from './userService';
import { IUser } from '@/models/User';
import { WithMongoId, WithClientId, toClientDocument } from '@/types/server';
import { ObjectId } from 'mongodb';
import { signToken, verifyToken } from '@/lib/jwt';

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
}

export class AuthService {
  static async verifyToken(token: string): Promise<Omit<WithClientId<IUser>, 'password'>> {
    try {
      const decoded = await verifyToken(token);
      const user = await UserService.getUserById(decoded.userId);
      
      if (!user) {
        throw new AuthenticationError('Utilisateur non trouvé');
      }

      const { password: _, ...userWithoutPassword } = user;
      const userWithMongoId = { ...user, _id: new ObjectId(user._id) } as WithMongoId<IUser>;
      return toClientDocument(userWithMongoId) as Omit<WithClientId<IUser>, 'password'>;
    } catch (error) {
      throw new AuthenticationError('Token invalide ou expiré');
    }
  }

  static async register(input: RegisterInput): Promise<{ user: Omit<WithClientId<IUser>, 'password'>, token: string }> {
    if (!input.email || !input.password || !input.name) {
      throw new AuthenticationError('Tous les champs sont requis');
    }

    try {
      const existingUser = await UserService.getUserByEmail(input.email);
      if (existingUser) {
        throw new AuthenticationError('Cet email est déjà utilisé');
      }

      const userId = await UserService.createUser({
        ...input,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const user = await UserService.getUserById(userId);
      if (!user) {
        throw new AuthenticationError('Erreur lors de la création de l\'utilisateur');
      }

      const { password: _, ...userWithoutPassword } = user;
      const userWithMongoId = { ...user, _id: new ObjectId(user._id) } as WithMongoId<IUser>;
      const token = await signToken(userWithMongoId);

      return { 
        user: toClientDocument(userWithMongoId) as Omit<WithClientId<IUser>, 'password'>,
        token 
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      console.error('Registration error:', error);
      throw new Error('Erreur lors de l\'inscription: ' + (error as Error).message);
    }
  }

  static async login(email: string, password: string): Promise<{ user: Omit<WithClientId<IUser>, 'password'>, token: string }> {
    if (!email || !password) {
      throw new AuthenticationError('Email et mot de passe requis');
    }

    try {
      console.log('Fetching user by email:', email);
      const user = await UserService.getUserByEmail(email, true);
      if (!user) {
        console.log('User not found for email:', email);
        throw new AuthenticationError('Identifiants invalides');
      }
      console.log('User found:', user._id);

      console.log('Comparing passwords...');
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password mismatch for user:', user._id);
        throw new AuthenticationError('Identifiants invalides');
      }
      console.log('Password match successful');

      console.log('Updating user last login...');
      await UserService.updateUser(user._id, {
        lastLogin: new Date(),
        updatedAt: new Date()
      });

      console.log('Generating token...');
      const { password: _, ...userWithoutPassword } = user;
      const userWithMongoId = { ...user, _id: new ObjectId(user._id) } as WithMongoId<IUser>;
      const token = await signToken(userWithMongoId);
      console.log('Token generated successfully');

      return { 
        user: toClientDocument(userWithMongoId) as Omit<WithClientId<IUser>, 'password'>,
        token 
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Login error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      } else {
        console.error('Unknown login error:', error);
      }
      
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new Error('Erreur lors de la connexion: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  }
} 