'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ChapterApi, FormationApi } from '@/services/apiService';
import { IChapter } from '@/models/Chapter';
import { IFormation } from '@/models/Formation';
import { WithClientId, toClientDocument, toClientDocuments } from '@/types/mongodb';
import ClientOnly from '@/components/animations/ClientOnly';

interface ChapterWithFormations extends WithClientId<IChapter> {
  formations: WithClientId<IFormation>[];
}

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const [chapter, setChapter] = useState<ChapterWithFormations | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [chapterData, formationsData] = await Promise.all([
          ChapterApi.getById(params.chapterId as string),
          FormationApi.getAll()
        ]);

        if (chapterData) {
          const clientChapter = toClientDocument<IChapter>(chapterData);
          const clientFormations = toClientDocuments<IFormation>(formationsData);

          const chapterFormations = clientFormations.filter(
            f => f.chapterId === clientChapter._id
          );

          setChapter({
            ...clientChapter,
            formations: chapterFormations
          });
        } else {
          router.push('/dashboard/formations');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        router.push('/dashboard/formations');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [params.chapterId, router]);

  if (isLoading) {
    return (
      <ClientOnly>
        <div className="p-4 sm:p-6 md:p-8">
          <div className="space-y-6">
            {/* Skeleton pour le titre */}
            <div className="space-y-2">
              <div className="h-8 w-64 bg-dark/50 rounded-lg animate-pulse" />
              <div className="h-4 w-96 bg-dark/50 rounded-lg animate-pulse" />
            </div>

            {/* Skeleton pour la grille */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-dark/50 rounded-xl p-4 space-y-4 animate-pulse">
                  <div className="h-6 w-3/4 bg-dark/50 rounded-lg" />
                  <div className="h-16 bg-dark/50 rounded-lg" />
                  <div className="flex justify-between">
                    <div className="h-4 w-16 bg-dark/50 rounded-lg" />
                    <div className="h-4 w-16 bg-dark/50 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ClientOnly>
    );
  }

  if (!chapter) {
    return (
      <ClientOnly>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-lg text-gray-400">Chapitre non trouvé</p>
        </div>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <div className="p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">
          Chapitre {chapter.order} : {chapter.title}
        </h1>
        <p className="text-gray-400 mb-6">{chapter.description}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapter.formations.map((formation) => (
            <div 
              key={formation._id}
              className="bg-dark/50 backdrop-blur rounded-xl p-4 border border-white/5 cursor-pointer hover:bg-dark/70 transition-colors"
              onClick={() => router.push(`/dashboard/formations/${chapter._id}/${formation._id}`)}
            >
              <h2 className="text-lg font-bold mb-2">{formation.title}</h2>
              <p className="text-sm text-gray-400 mb-4">{formation.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary">{formation.duration}</span>
                <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded-lg">
                  {formation.level}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ClientOnly>
  );
}
