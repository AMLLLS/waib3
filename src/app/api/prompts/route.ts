import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { IPrompt } from '@/models/Prompt';
import { verifyToken } from '@/lib/jwt';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const prompts = await db.collection<IPrompt>('prompts')
      .find({ status: 'published' })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des prompts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier le token admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Vous devez être connecté pour créer un prompt' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token);
    
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Vous devez être administrateur pour créer un prompt' },
        { status: 403 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Récupérer l'utilisateur
    const user = await db.collection('users').findOne({ _id: new ObjectId(payload.userId) });
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const data = await request.json();

    // Validation des données
    if (!data.title || !data.description || !data.content) {
      return NextResponse.json(
        { error: 'Le titre, la description et le contenu sont requis' },
        { status: 400 }
      );
    }

    const prompt: Partial<IPrompt> = {
      ...data,
      usageCount: 0,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.email,
      updatedBy: user.email
    };

    const result = await db.collection<IPrompt>('prompts').insertOne(prompt as IPrompt);
    const insertedPrompt = await db.collection<IPrompt>('prompts').findOne({ _id: result.insertedId });

    return NextResponse.json(insertedPrompt);
  } catch (error) {
    console.error('Error creating prompt:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création du prompt' },
      { status: 500 }
    );
  }
} 