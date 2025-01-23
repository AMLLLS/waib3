import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { FormationService } from '@/services/dbService';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const formations = await FormationService.getFormationsByChapterId(params.id);
    if (!formations || formations.length === 0) {
      return NextResponse.json(
        { error: 'Aucune formation trouvée pour ce chapitre' },
        { status: 404 }
      );
    }
    return NextResponse.json(formations);
  } catch (error: any) {
    console.error('Error fetching formations by chapter:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue lors de la récupération des formations' },
      { status: 500 }
    );
  }
} 