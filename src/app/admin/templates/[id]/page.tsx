"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RiArrowLeftLine, RiSaveLine } from 'react-icons/ri';
import { ITemplate } from '@/models/Template';
import { WithClientId } from '@/types/server';
import { TemplateApi } from '@/services/apiService';

interface EditTemplatePageProps {
  params: {
    id: string;
  };
}

export default function EditTemplatePage({ params }: EditTemplatePageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<WithClientId<ITemplate> | null>(null);
  const [newTechnology, setNewTechnology] = useState('');

  useEffect(() => {
    loadTemplate();
  }, [params.id]);

  const loadTemplate = async () => {
    try {
      const data = await TemplateApi.getById(params.id);
      setFormData(data as WithClientId<ITemplate>);
    } catch (error) {
      console.error('Error loading template:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsLoading(true);
    setError(null);

    try {
      await TemplateApi.update(params.id, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        technologies: formData.technologies,
        imageUrl: formData.imageUrl,
        demoUrl: formData.demoUrl,
        githubUrl: formData.githubUrl,
        status: formData.status
      });

      router.push('/admin/templates');
    } catch (error) {
      console.error('Error updating template:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleAddTechnology = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTechnology.trim() && formData) {
      e.preventDefault();
      setFormData({
        ...formData,
        technologies: [...formData.technologies, newTechnology.trim()]
      });
      setNewTechnology('');
    }
  };

  const handleRemoveTechnology = (index: number) => {
    if (!formData) return;
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index)
    });
  };

  if (!formData) {
    return (
      <div className="p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-dark-lighter rounded w-1/4"></div>
          <div className="h-12 bg-dark-lighter rounded"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-20 bg-dark-lighter rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Modifier le template</h1>
          <p className="text-gray-400">
            Modifiez les informations du template
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/admin/templates')}
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
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Catégorie
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-dark-lighter border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
            />
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium mb-2">
              Difficulté
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-dark-lighter border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
            >
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Avancé">Avancé</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Technologies (appuyez sur Entrée pour ajouter)
            </label>
            <input
              type="text"
              value={newTechnology}
              onChange={(e) => setNewTechnology(e.target.value)}
              onKeyDown={handleAddTechnology}
              className="w-full px-4 py-2 bg-dark-lighter border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="text-sm px-3 py-1 bg-dark rounded-lg text-primary flex items-center gap-2"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTechnology(index)}
                    className="text-red-500 hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium mb-2">
              URL de l'image
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-dark-lighter border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
            />
          </div>

          <div>
            <label htmlFor="demoUrl" className="block text-sm font-medium mb-2">
              URL de la démo
            </label>
            <input
              type="url"
              id="demoUrl"
              name="demoUrl"
              value={formData.demoUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-dark-lighter border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
            />
          </div>

          <div>
            <label htmlFor="githubUrl" className="block text-sm font-medium mb-2">
              URL GitHub
            </label>
            <input
              type="url"
              id="githubUrl"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-dark-lighter border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-2">
              Statut
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-dark-lighter border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
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
            <span>{isLoading ? 'Enregistrement...' : 'Enregistrer'}</span>
          </motion.button>
        </div>
      </form>
    </div>
  );
} 