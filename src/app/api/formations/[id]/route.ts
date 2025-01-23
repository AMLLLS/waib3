import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { FormationService, ChapterService } from '@/services/dbService';
import { withRole } from '@/middleware/auth';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const formation = await FormationService.getFormationById(params.id);
    if (!formation) {
      return NextResponse.json(
        { error: 'Formation non trouvée' },
        { status: 404 }
      );
    }
    return NextResponse.json(formation);
  } catch (error: any) {
    console.error('Error fetching formation:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue lors de la récupération de la formation' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withRole(request, ['admin'], async (req) => {
    try {
      await connectToDatabase();
      const body = await req.json();

      if (body.chapterId) {
        const chapter = await ChapterService.getChapterById(body.chapterId);
        if (!chapter) {
          return NextResponse.json(
            { error: 'Chapitre non trouvé' },
            { status: 404 }
          );
        }
      }

      const updated = await FormationService.updateFormation(params.id, {
        ...body,
        updatedAt: new Date()
      });

      if (!updated) {
        return NextResponse.json(
          { error: 'Formation non trouvée' },
          { status: 404 }
        );
      }

      const formation = await FormationService.getFormationById(params.id);
      return NextResponse.json(formation);
    } catch (error: any) {
      console.error('Error updating formation:', error);
      return NextResponse.json(
        { error: error.message || 'Une erreur est survenue lors de la mise à jour de la formation' },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withRole(request, ['admin'], async () => {
    try {
      await connectToDatabase();
      const deleted = await FormationService.deleteFormation(params.id);
      if (!deleted) {
        return NextResponse.json(
          { error: 'Formation non trouvée' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting formation:', error);
      return NextResponse.json(
        { error: error.message || 'Une erreur est survenue lors de la suppression de la formation' },
        { status: 500 }
      );
    }
  });
} 