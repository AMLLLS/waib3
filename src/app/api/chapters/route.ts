import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { WithMongoId } from '@/types/server';
import { IChapter } from '@/models/Chapter';
import { ObjectId } from 'mongodb';
import { withAdminAuth } from '@/middleware/auth';

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const chapters = await db.collection<WithMongoId<IChapter>>('chapters').find().toArray();
    
    return NextResponse.json(chapters.map(chapter => ({
      ...chapter,
      _id: chapter._id.toString()
    })));
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des chapitres' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async () => {
    try {
      const { db } = await connectToDatabase();
      const data = await req.json();

      const chapter: Omit<IChapter, '_id'> = {
        title: data.title,
        description: data.description,
        order: data.order || 0,
        status: 'draft',
        formationId: data.formationId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection<WithMongoId<IChapter>>('chapters').insertOne(chapter as WithMongoId<IChapter>);
      
      return NextResponse.json({
        ...chapter,
        _id: result.insertedId.toString()
      });
    } catch (error) {
      console.error('Error creating chapter:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la création du chapitre' },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(req: NextRequest) {
  return withAdminAuth(req, async () => {
    try {
      const { db } = await connectToDatabase();
      const { id } = await req.json();

      if (!id) {
        return NextResponse.json(
          { error: 'ID du chapitre manquant' },
          { status: 400 }
        );
      }

      const result = await db.collection('chapters').deleteOne({
        _id: new ObjectId(id)
      });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          { error: 'Chapitre non trouvé' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error deleting chapter:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du chapitre' },
        { status: 500 }
      );
    }
  });
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
} 