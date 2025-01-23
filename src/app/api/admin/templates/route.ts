import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { WithMongoId } from '@/types/server';
import { ITemplate } from '@/models/Template';
import { withRole } from '@/middleware/auth';

export async function POST(request: NextRequest) {
  return withRole(request, ['admin'], async (req) => {
    try {
      const { db } = await connectToDatabase();
      const data = await req.json();

      const template: Omit<ITemplate, '_id'> = {
        ...data,
        status: data.status || 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection<WithMongoId<ITemplate>>('templates').insertOne(template as WithMongoId<ITemplate>);
      
      return NextResponse.json({
        ...template,
        _id: result.insertedId.toString()
      });
    } catch (error) {
      console.error('Error creating template:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la création du template' },
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