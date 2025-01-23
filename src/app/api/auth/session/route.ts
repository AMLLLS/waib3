import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { AuthService } from '@/services/authService';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    console.log('Session verification request received');
    
    const authHeader = request.headers.get('Authorization');
    console.log('Authorization header:', authHeader ? `Bearer ${authHeader.substring(7, 27)}...` : 'No header');
    
    if (!authHeader) {
      console.log('No authorization header found');
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    if (!token) {
      console.log('No token found in authorization header');
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    console.log('Verifying token with AuthService...');
    const user = await AuthService.verifyToken(token);
    console.log('Token verified successfully for user:', user._id);

    if (user.role !== 'admin') {
      console.log('User is not an admin:', user.role);
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    console.log('Admin session verified successfully');
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json(
      { error: 'Session invalide', details: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 401 }
    );
  }
} 