import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { IPrompt } from '@/models/Prompt';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase();
    const prompt = await db.collection<IPrompt>('prompts').findOne({
      _id: new ObjectId(params.id)
    });

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(prompt);
  } catch (error) {
    console.error('Error fetching prompt:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération du prompt' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Vérifier le token admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Vous devez être connecté pour modifier un prompt' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token);
    
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Vous devez être administrateur pour modifier un prompt' },
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

    const result = await db.collection<IPrompt>('prompts').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: {
          ...data,
          updatedAt: new Date(),
          updatedBy: user.email
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Prompt non trouvé' },
        { status: 404 }
      );
    }

    const updatedPrompt = await db.collection<IPrompt>('prompts').findOne({
      _id: new ObjectId(params.id)
    });

    return NextResponse.json(updatedPrompt);
  } catch (error) {
    console.error('Error updating prompt:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour du prompt' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Vérifier le token admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Vous devez être connecté pour supprimer un prompt' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token);
    
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Vous devez être administrateur pour supprimer un prompt' },
        { status: 403 }
      );
    }

    const { db } = await connectToDatabase();
    const result = await db.collection<IPrompt>('prompts').deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Prompt non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting prompt:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la suppression du prompt' },
      { status: 500 }
    );
  }
} 