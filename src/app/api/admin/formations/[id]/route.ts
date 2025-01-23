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

export async function PUT(req: NextRequest, { params }: RouteParams) {
  return withAdminAuth(req, async () => {
    try {
      const { db } = await connectToDatabase();
      const data = await req.json();
      
      // Remove _id from the update data if present
      const { _id, ...updateData } = data;
      
      const result = await db.collection<WithMongoId<IFormation>>('formations').findOneAndUpdate(
        { _id: new ObjectId(params.id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result) {
        return NextResponse.json(
          { error: 'Formation non trouvée' },
          { status: 404 }
        );
      }

      return NextResponse.json(result);
    } catch (error) {
      console.error('Error updating formation:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de la formation' },
        { status: 500 }
      );
    }
  });
} 