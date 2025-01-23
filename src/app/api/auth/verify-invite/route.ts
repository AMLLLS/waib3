import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { IInviteCode } from '@/models/InviteCode';
import { WithMongoId } from '@/types/server';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Code d\'invitation requis' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Vérifier si le code existe et n'a pas été utilisé
    const inviteCode = await db.collection<WithMongoId<IInviteCode>>('inviteCodes')
      .findOne({ code, isUsed: false });

    if (!inviteCode) {
      return NextResponse.json(
        { error: 'Code d\'invitation invalide ou déjà utilisé' },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Error verifying invite code:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du code d\'invitation' },
      { status: 500 }
    );
  }
} 