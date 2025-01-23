import { NextResponse, NextRequest } from 'next/server';
import { withAdminAuth } from '@/middleware/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { IChapter } from '@/models/Chapter';
import { WithMongoId } from '@/types/server';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  return withAdminAuth(req, async () => {
    try {
      const { db } = await connectToDatabase();
      const chapter = await db.collection<WithMongoId<IChapter>>('chapters').findOne({
        _id: new ObjectId(params.id)
      });

      if (!chapter) {
        return NextResponse.json(
          { error: 'Chapitre non trouvé' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        ...chapter,
        _id: chapter._id.toString()
      });
    } catch (error) {
      console.error('Error fetching chapter:', error);
      return NextResponse.json(
        { error: 'Erreur lors du chargement du chapitre' },
        { status: 500 }
      );
    }
  });
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  return withAdminAuth(req, async () => {
    try {
      const { db } = await connectToDatabase();
      const data = await req.json();

      const result = await db.collection<WithMongoId<IChapter>>('chapters').updateOne(
        { _id: new ObjectId(params.id) },
        {
          $set: {
            title: data.title,
            description: data.description,
            order: data.order || 0,
            status: data.status || 'draft',
            formationId: data.formationId,
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'Chapitre non trouvé' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error updating chapter:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du chapitre' },
        { status: 500 }
      );
    }
  });
} 