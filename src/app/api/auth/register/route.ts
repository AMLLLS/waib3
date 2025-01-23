import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { IInviteCode } from '@/models/InviteCode';
import { WithMongoId } from '@/types/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, inviteCode } = await request.json();

    if (!email || !password || !inviteCode) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Vérifier le code d'invitation
    const code = await db.collection<WithMongoId<IInviteCode>>('inviteCodes')
      .findOne({ code: inviteCode, isUsed: false });

    if (!code) {
      return NextResponse.json(
        { error: 'Code d\'invitation invalide ou déjà utilisé' },
        { status: 400 }
      );
    }

    // Créer l'utilisateur
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('users').insertOne(user);

    // Marquer le code comme utilisé
    await db.collection('inviteCodes').updateOne(
      { _id: code._id },
      {
        $set: {
          isUsed: true,
          usedBy: result.insertedId.toString(),
          usedAt: new Date()
        }
      }
    );

    return NextResponse.json({ 
      message: 'Inscription réussie',
      userId: result.insertedId.toString()
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
} 