'use client';

import { useParams } from 'next/navigation';
import { chapitres } from '@/data/formations';

export default function ChapterPage() {
  const params = useParams();
  const chapterId = parseInt(params.chapterId as string);
  const chapter = chapitres.find(c => c.id === chapterId);

  if (!chapter) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-lg text-gray-400">Chapitre non trouvé</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">
        Chapitre {chapter.id} : {chapter.title}
      </h1>
      <p className="text-gray-400 mb-6">{chapter.description}</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapter.formations.map((formation) => (
          <div 
            key={formation.id}
            className="bg-dark/50 backdrop-blur rounded-xl p-4 border border-white/5"
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
  );
}
