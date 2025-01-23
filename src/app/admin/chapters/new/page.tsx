"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RiArrowLeftLine, RiSaveLine } from 'react-icons/ri';
import { IChapter } from '@/models/Chapter';
import { ChapterApi } from '@/services/apiService';

export default function NewChapterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0,
    status: 'draft' as 'draft' | 'published',
    formationId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await ChapterApi.create(formData);
      router.push('/admin/chapters');
    } catch (error) {
      console.error('Error creating chapter:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Nouveau chapitre</h1>
          <p className="text-gray-400">
            Créez un nouveau chapitre pour vos formations
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/admin/chapters')}
          className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          <RiArrowLeftLine className="text-xl" />
          <span>Retour</span>
        </motion.button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Titre
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-dark-lighter border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-dark-lighter border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
            />
          </div>

          <div>
            <label htmlFor="order" className="block text-sm font-medium mb-2">
              Ordre
            </label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min={0}
              className="w-full px-4 py-2 bg-dark-lighter border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-dark font-medium rounded-xl disabled:opacity-50"
          >
            <RiSaveLine className="text-xl" />
            <span>{isLoading ? 'Création...' : 'Créer'}</span>
          </motion.button>
        </div>
      </form>
    </div>
  );
} 