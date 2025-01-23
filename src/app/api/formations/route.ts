import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { WithMongoId } from '@/types/server';
import { IFormation } from '@/models/Formation';
import { ObjectId } from 'mongodb';
import { withAdminAuth } from '@/middleware/auth';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    
    // Vérifier si l'utilisateur est admin
    const authHeader = req.headers.get('Authorization');
    let isAdmin = false;
    
    if (authHeader) {
      const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
      try {
        const decoded = await verifyToken(token);
        isAdmin = decoded?.role === 'admin';
      } catch (error) {
        console.error('Token verification error:', error);
      }
    }
    
    // Construire la requête en fonction du rôle
    const query = isAdmin ? {} : { status: 'published' as const };
    
    const formations = await db.collection<WithMongoId<IFormation>>('formations')
      .find(query)
      .toArray();
    
    return NextResponse.json(formations.map(formation => ({
      ...formation,
      _id: formation._id.toString()
    })));
  } catch (error) {
    console.error('Error fetching formations:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des formations' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async () => {
    try {
      const { db } = await connectToDatabase();
      const data = await req.json();

      const formation: Omit<IFormation, '_id'> = {
        title: data.title,
        description: data.description,
        content: data.content || '',
        duration: data.duration || 0,
        level: data.level || 'beginner',
        category: data.category || 'general',
        order: data.order || 0,
        status: 'draft',
        modules: data.modules || [],
        chapterId: data.chapterId || null,
        instructor: data.instructor || '',
        resources: data.resources || [],
        tags: data.tags || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection<WithMongoId<IFormation>>('formations').insertOne(formation as WithMongoId<IFormation>);
      
      return NextResponse.json({
        ...formation,
        _id: result.insertedId.toString()
      });
    } catch (error) {
      console.error('Error creating formation:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la création de la formation' },
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
          { error: 'ID de la formation manquant' },
          { status: 400 }
        );
      }

      const result = await db.collection('formations').deleteOne({
        _id: new ObjectId(id)
      });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          { error: 'Formation non trouvée' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error deleting formation:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression de la formation' },
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