import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { IPrompt } from '@/models/Prompt';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Vérifier le token utilisateur
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Vous devez être connecté pour liker un prompt' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
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

    // Vérifier si le prompt existe
    const prompt = await db.collection<IPrompt>('prompts').findOne({
      _id: new ObjectId(params.id)
    });

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur a déjà liké ce prompt
    const userLike = await db.collection('promptLikes').findOne({
      promptId: new ObjectId(params.id),
      userId: user.email
    });

    if (userLike) {
      // Si l'utilisateur a déjà liké, on retire son like
      await db.collection('promptLikes').deleteOne({
        promptId: new ObjectId(params.id),
        userId: user.email
      });

      await db.collection<IPrompt>('prompts').updateOne(
        { _id: new ObjectId(params.id) },
        { $inc: { likes: -1 } }
      );

      return NextResponse.json({ success: true, liked: false });
    } else {
      // Si l'utilisateur n'a pas encore liké, on ajoute son like
      await db.collection('promptLikes').insertOne({
        promptId: new ObjectId(params.id),
        userId: user.email,
        createdAt: new Date()
      });

      await db.collection<IPrompt>('prompts').updateOne(
        { _id: new ObjectId(params.id) },
        { $inc: { likes: 1 } }
      );

      return NextResponse.json({ success: true, liked: true });
    }
  } catch (error) {
    console.error('Error liking prompt:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du like du prompt' },
      { status: 500 }
    );
  }
} 