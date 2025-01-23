import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    const { db } = await connectToDatabase();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.collection('users').findOne({ email: 'test@waib.fr' });
    if (existingUser) {
      return NextResponse.json({ message: 'L\'utilisateur de test existe déjà' });
    }

    // Créer l'utilisateur de test
    const hashedPassword = await bcrypt.hash('waib2024', 10);
    const user = {
      email: 'test@waib.fr',
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('users').insertOne(user);

    return NextResponse.json({ 
      message: 'Utilisateur de test créé avec succès',
      credentials: {
        email: 'test@waib.fr',
        password: 'waib2024'
      }
    });
  } catch (error) {
    console.error('Error creating test user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'utilisateur de test' },
      { status: 500 }
    );
  }
} 