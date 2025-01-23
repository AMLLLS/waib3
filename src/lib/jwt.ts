import jwt from 'jsonwebtoken';
import { IUser } from '@/models/User';
import { WithMongoId } from '@/types/server';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('WARNING: JWT_SECRET is not defined in environment variables!');
  throw new Error('JWT_SECRET must be defined');
}

// Assertion de type pour indiquer que JWT_SECRET est défini
const SECRET_KEY: string = JWT_SECRET;
console.log('JWT configuration loaded with secret key length:', SECRET_KEY.length);

interface JWTPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function signToken(user: WithMongoId<IUser>): Promise<string> {
  console.log('Signing token for user:', user._id.toString());
  console.log('Using JWT_SECRET of length:', SECRET_KEY.length);
  
  return new Promise((resolve, reject) => {
    jwt.sign(
      { 
        userId: user._id.toString(),
        role: user.role 
      },
      SECRET_KEY,
      {
        expiresIn: '7d',
      },
      (err, token) => {
        if (err) {
          console.error('Error signing token:', err);
          reject(err);
        } else {
          console.log('Token signed successfully');
          resolve(token as string);
        }
      }
    );
  });
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  console.log('Verifying token...');
  console.log('Using JWT_SECRET of length:', SECRET_KEY.length);
  
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        console.error('Token verification error:', err);
        reject(err);
      } else {
        console.log('Token verified successfully:', decoded);
        resolve(decoded as JWTPayload);
      }
    });
  });
} 