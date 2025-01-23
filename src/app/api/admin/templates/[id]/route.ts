import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { WithMongoId } from '@/types/server';
import { ITemplate } from '@/models/Template';
import { ObjectId } from 'mongodb';
import { withRole } from '@/middleware/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  return withRole(request, ['admin'], async (req) => {
    try {
      const { db } = await connectToDatabase();
      const data = await req.json();

      const result = await db.collection<WithMongoId<ITemplate>>('templates').updateOne(
        { _id: new ObjectId(params.id) },
        {
          $set: {
            ...data,
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'Template non trouvé' },
          { status: 404 }
        );
      }

      const updatedTemplate = await db.collection<WithMongoId<ITemplate>>('templates').findOne({
        _id: new ObjectId(params.id)
      });

      if (!updatedTemplate) {
        return NextResponse.json(
          { error: 'Template non trouvé après mise à jour' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        ...updatedTemplate,
        _id: updatedTemplate._id.toString()
      });
    } catch (error) {
      console.error('Error updating template:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du template' },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  return withRole(request, ['admin'], async () => {
    try {
      const { db } = await connectToDatabase();
      const result = await db.collection('templates').deleteOne({
        _id: new ObjectId(params.id)
      });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          { error: 'Template non trouvé' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error deleting template:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du template' },
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