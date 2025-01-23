import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function withAuth(request: NextRequest, handler: (req: NextRequest) => Promise<NextResponse>) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Non autorisé - Token manquant' },
        { status: 401 }
      );
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé - Token manquant' },
        { status: 401 }
      );
    }

    try {
      const decoded = await verifyToken(token);
      if (!decoded) {
        throw new Error('Token invalide');
      }
      return handler(request);
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { error: 'Non autorisé - Token invalide' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    );
  }
}

export async function withRole(request: NextRequest, roles: string[], handler: (req: NextRequest) => Promise<NextResponse>) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Non autorisé - Token manquant' },
        { status: 401 }
      );
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé - Token manquant' },
        { status: 401 }
      );
    }

    try {
      const decoded = await verifyToken(token);
      if (!decoded || !roles.includes(decoded.role)) {
        return NextResponse.json(
          { error: 'Non autorisé - Rôle invalide' },
          { status: 403 }
        );
      }
      return handler(request);
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { error: 'Non autorisé - Token invalide' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    );
  }
}

export async function withAdminAuth(request: NextRequest, handler: (req: NextRequest) => Promise<NextResponse>) {
  return withRole(request, ['admin'], handler);
} 