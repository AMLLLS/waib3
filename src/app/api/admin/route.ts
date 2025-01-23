import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { WithMongoId } from '@/types/server';
import { IFormation } from '@/models/Formation';
import { IChapter } from '@/models/Chapter';
import { ObjectId } from 'mongodb';
import { withAdminAuth } from '@/middleware/auth';

export async function GET(request: NextRequest) {
  return withAdminAuth(request, async (req) => {
    try {
      const { db } = await connectToDatabase();
      const formations = await db.collection<WithMongoId<IFormation>>('formations').find().toArray();
      const chapters = await db.collection<WithMongoId<IChapter>>('chapters').find().toArray();

      const headers = {
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      };

      return NextResponse.json({
        totalFormations: formations.length,
        publishedFormations: formations.filter(f => f.status === 'published').length,
        draftFormations: formations.filter(f => f.status === 'draft').length,
        totalChapters: chapters.length,
      }, { headers });
    } catch (error) {
      console.error('Error getting stats:', error);
      return NextResponse.json({ error: 'Erreur lors de la récupération des statistiques' }, { status: 500 });
    }
  });
}

export async function POST(request: NextRequest) {
  return withAdminAuth(request, async (req) => {
    try {
      const { action, formationId } = await request.json();
      const { db } = await connectToDatabase();

      switch (action) {
        case 'publish':
          const publishResult = await db.collection<WithMongoId<IFormation>>('formations').updateOne(
            { _id: new ObjectId(formationId) },
            { $set: { status: 'published', updatedAt: new Date() } }
          );
          return NextResponse.json({ success: publishResult.modifiedCount > 0 });

        case 'unpublish':
          const unpublishResult = await db.collection<WithMongoId<IFormation>>('formations').updateOne(
            { _id: new ObjectId(formationId) },
            { $set: { status: 'draft', updatedAt: new Date() } }
          );
          return NextResponse.json({ success: unpublishResult.modifiedCount > 0 });

        case 'duplicate':
          const formation = await db.collection<WithMongoId<IFormation>>('formations').findOne(
            { _id: new ObjectId(formationId) }
          );

          if (!formation) {
            return NextResponse.json({ error: 'Formation non trouvée' }, { status: 404 });
          }

          const { _id, ...formationData } = formation;
          const now = new Date();
          const duplicatedFormation = {
            ...formationData,
            title: `${formationData.title} (copie)`,
            status: 'draft',
            createdAt: now,
            updatedAt: now
          };

          const duplicateResult = await db.collection<WithMongoId<IFormation>>('formations').insertOne(
            duplicatedFormation as WithMongoId<IFormation>
          );

          return NextResponse.json({ id: duplicateResult.insertedId.toString() });

        default:
          return NextResponse.json({ error: 'Action non supportée' }, { status: 400 });
      }
    } catch (error) {
      console.error('Error processing action:', error);
      return NextResponse.json({ error: 'Erreur lors du traitement de l\'action' }, { status: 500 });
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