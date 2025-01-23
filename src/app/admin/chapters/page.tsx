"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  RiAddLine, RiEditLine, RiDeleteBinLine, 
  RiSearchLine, RiFilter3Line 
} from 'react-icons/ri';
import { IChapter } from '@/models/Chapter';
import { WithClientId } from '@/types/server';
import { ChapterApi } from '@/services/apiService';

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<WithClientId<IChapter>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadChapters();
  }, []);

  const loadChapters = async () => {
    try {
      const data = await ChapterApi.getAll();
      setChapters(data as WithClientId<IChapter>[]);
    } catch (error) {
      console.error('Error loading chapters:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce chapitre ?')) {
      return;
    }

    try {
      await ChapterApi.delete(id);
      await loadChapters();
    } catch (error) {
      console.error('Error deleting chapter:', error);
      alert(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const filteredChapters = chapters.filter(chapter =>
    chapter.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-dark-lighter rounded w-1/4"></div>
          <div className="h-12 bg-dark-lighter rounded"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-20 bg-dark-lighter rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Chapitres</h1>
          <p className="text-gray-400">
            Gérez les chapitres de vos formations
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/admin/chapters/new')}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-dark font-medium rounded-xl"
        >
          <RiAddLine className="text-xl" />
          <span>Nouveau chapitre</span>
        </motion.button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un chapitre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-lighter border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
          />
        </div>
      </div>

      {/* Liste des chapitres */}
      <div className="space-y-4">
        {filteredChapters.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            Aucun chapitre trouvé
          </div>
        ) : (
          filteredChapters.map((chapter) => (
            <motion.div
              key={chapter._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-dark-lighter border border-white/5 rounded-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{chapter.title}</h3>
                  <p className="text-sm text-gray-400">{chapter.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(`/admin/chapters/${chapter._id}`)}
                    className="p-2 hover:bg-dark rounded-lg text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    <RiEditLine className="text-xl" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(chapter._id)}
                    className="p-2 hover:bg-dark rounded-lg text-red-500 hover:text-red-400 transition-colors"
                  >
                    <RiDeleteBinLine className="text-xl" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
} 