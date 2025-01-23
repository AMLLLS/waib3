import { NextResponse, NextRequest } from 'next/server';
import { withAdminAuth } from '@/middleware/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { IFormation } from '@/models/Formation';
import { WithMongoId } from '@/types/server';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  return withAdminAuth(req, async () => {
    try {
      const { db } = await connectToDatabase();
      const result = await db.collection<WithMongoId<IFormation>>('formations').updateOne(
        { _id: new ObjectId(params.id) },
        {
          $set: {
            status: 'published',
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'Formation non trouvée' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error publishing formation:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la publication de la formation' },
        { status: 500 }
      );
    }
  });
} 