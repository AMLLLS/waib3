export interface JWTPayload {
  email: string;
  isAdmin: boolean;
  iat?: number;
  exp?: number;
} 