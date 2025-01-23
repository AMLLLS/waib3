import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
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

    const decoded = await verifyToken(token);
    return NextResponse.json({ decoded });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Non autorisé - Token invalide' },
      { status: 401 }
    );
  }
} 