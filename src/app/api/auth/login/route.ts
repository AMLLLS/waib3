import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { AuthService } from '@/services/authService';
import { connectToDatabase } from '@/lib/mongodb';

// Forcer l'utilisation du runtime Node.js
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    
    console.log('Parsing request body...');
    const body = await request.json();
    console.log('Request body:', { email: body.email, hasPassword: !!body.password });

    const { email, password } = body;

    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    console.log('Attempting login with AuthService...');
    const { user, token } = await AuthService.login(email, password);
    console.log('Login successful for user:', user._id);
    
    // Définir les headers CORS
    const headers = {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    };
    
    // Stocker le token dans le bon storage selon le rôle
    const tokenKey = user.role === 'admin' ? 'adminToken' : 'userToken';
    
    return NextResponse.json({ user, token, tokenKey }, { 
      status: 200,
      headers
    });
  } catch (error: any) {
    // Log l'erreur complète pour le débogage
    console.error('Login error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    // Si c'est une erreur d'authentification connue
    if (error.name === 'AuthenticationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    // Pour toute autre erreur
    return NextResponse.json(
      { 
        error: 'Une erreur est survenue lors de la connexion',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Gérer les requêtes OPTIONS pour CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
} 